"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  sources?: Array<{
    filename: string;
    text: string;
    relevanceScore?: number;
  }>;
  isStreaming?: boolean;
}

interface AIPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIPartnerModal({
  isOpen,
  onClose,
}: AIPartnerModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI Partner. I can help you explore your knowledge graph, generate insights, and answer questions about your content. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Create initial AI message for streaming
    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage: Message = {
      id: aiMessageId,
      text: "",
      sender: "ai",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, initialAiMessage]);

    try {
      // Call the chat API with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body reader available");
      }

      let accumulatedText = "";
      let sources:
        | Array<{
            filename: string;
            text: string;
            relevanceScore?: number;
          }>
        | undefined;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "sources") {
                sources = data.sources;
              } else if (data.type === "content") {
                accumulatedText += data.content;

                // Update the streaming message
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, text: accumulatedText, sources }
                      : msg
                  )
                );
              } else if (data.type === "end") {
                // Mark streaming as complete
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, isStreaming: false, sources }
                      : msg
                  )
                );
              } else if (data.type === "error") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? {
                          ...msg,
                          text: data.message,
                          isStreaming: false,
                        }
                      : msg
                  )
                );
              }
            } catch (parseError) {
              console.error("Error parsing streaming data:", parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error calling chat API:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: "I'm having trouble connecting right now. Please check your internet connection and try again.",
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {/* <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      /> */}

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-1/3 bg-slate-900 border-l border-slate-700 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">AI Partner</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user" ? "bg-blue-600" : "bg-purple-600"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-[80%] ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-slate-100"
                    }`}
                  >
                    <p className="text-md whitespace-pre-wrap">
                      {message.text}
                    </p>
                    {message.isStreaming && (
                      <div className="flex items-center mt-2">
                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse mr-1"></div>
                        <span className="text-xs text-slate-400">
                          AI is typing...
                        </span>
                      </div>
                    )}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-600">
                        <p className="text-xs text-slate-400 mb-1">Sources:</p>
                        <div className="space-y-1">
                          {message.sources.map((source, index) => (
                            <div
                              key={index}
                              className="text-xs text-slate-300 bg-slate-800 rounded px-2 py-1"
                            >
                              📄 {source.filename}
                              {source.relevanceScore && (
                                <span className="text-slate-500 ml-1">
                                  ({Math.round(source.relevanceScore * 100)}%
                                  match)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 rounded-lg bg-slate-700 text-slate-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your knowledge graph..."
              className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
