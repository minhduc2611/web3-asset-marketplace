/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MemoryViewer from '@/components/memory-viewer';

interface GoogleSearchModalProps {
  open: boolean;
  searchTerm: string;
  searchResults: any[];
  geminiAnswer: string;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

function GoogleSearchModal({
  open,
  searchTerm,
  searchResults,
  geminiAnswer,
  isLoading,
  onOpenChange,
  onClose
}: GoogleSearchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 mx-3 sm:mx-auto max-h-[80vh] sm:max-w-4xl overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-slate-50">Google Search: &quot;{searchTerm}&quot;</DialogTitle>
              <DialogDescription className="text-slate-400">
                Search results and AI-generated insights
              </DialogDescription>
            </div>
            <MemoryViewer />
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-300">Searching Google and generating AI insights...</p>
              </div>
            ) : (
              <>
                {/* Gemini AI Answer */}
                {geminiAnswer && (
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <h3 className="text-lg font-semibold text-slate-50 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    AI Insights
                  </h3>
                  <div className="text-slate-300 leading-relaxed prose prose-invert prose-slate max-w-none markdown-content">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Custom styling for markdown elements
                        h1: ({children}) => <h1 className="text-xl font-bold text-slate-50 mb-3 cursor-text select-text">{children}</h1>,
                        h2: ({children}) => <h2 className="text-lg font-semibold text-slate-100 mb-2 cursor-text select-text">{children}</h2>,
                        h3: ({children}) => <h3 className="text-base font-medium text-slate-200 mb-2 cursor-text select-text">{children}</h3>,
                        p: ({children}) => <p className="text-slate-300 mb-3 leading-relaxed cursor-text select-text">{children}</p>,
                        strong: ({children}) => <strong className="font-semibold text-slate-100 cursor-text select-text">{children}</strong>,
                        em: ({children}) => <em className="italic text-slate-200 cursor-text select-text">{children}</em>,
                        code: ({children}) => <code className="bg-slate-700 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono cursor-text select-text">{children}</code>,
                        pre: ({children}) => <pre className="bg-slate-700 text-slate-200 p-3 rounded-lg overflow-x-auto text-sm font-mono mb-3 cursor-text select-text">{children}</pre>,
                        ul: ({children}) => <ul className="list-disc list-inside text-slate-300 mb-3 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside text-slate-300 mb-3 space-y-1">{children}</ol>,
                        li: ({children}) => <li className="text-slate-300 cursor-text select-text">{children}</li>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-purple-400 pl-4 italic text-slate-200 mb-3 cursor-text select-text">{children}</blockquote>,
                        a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline cursor-pointer">{children}</a>,
                      }}
                    >
                      {geminiAnswer}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-50 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Search Results
                  </h3>
                  <div className="space-y-3">
                    {searchResults.map((result: any, index: number) => (
                      <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
                        <a 
                          href={result.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <h4 className="text-blue-400 font-medium mb-2 group-hover:text-blue-300 transition-colors">
                            {result.title}
                          </h4>
                          <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                            {result.snippet}
                          </p>
                          <span className="text-green-400 text-xs">
                            {result.displayLink}
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!geminiAnswer && searchResults.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-slate-400">No results found. Try a different search term.</p>
                </div>
              )}
            </>
          )}
          </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 touch-manipulation"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Memoize component with custom comparison function
// Only re-render when data props change, not function props
export default React.memo(GoogleSearchModal, (prevProps, nextProps) => {
  return (
    prevProps.open === nextProps.open &&
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.geminiAnswer === nextProps.geminiAnswer &&
    prevProps.isLoading === nextProps.isLoading &&
    JSON.stringify(prevProps.searchResults) === JSON.stringify(nextProps.searchResults)
  );
}); 