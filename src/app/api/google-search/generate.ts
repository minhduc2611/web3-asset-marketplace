import "dotenv/config";
import OpenAI from "openai";

export const generate = async (question: string) => {
    try {
        // 1. Setup LLM
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // 2. Perform Tavily search
        const tavilyResponse = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.TAVILY_API_KEY}`,
            },
            body: JSON.stringify({
                query: question,
                max_results: 5,
                search_depth: "basic",
                include_answer: false,
                include_raw_content: false,
                include_images: false,
            }),
        });

        const tavilyResults = await tavilyResponse.json();
        const searchResults = tavilyResults.results || [];

        // 3. Create context from search results
        const searchContext = searchResults.length > 0 
            ? `\n\nRecent search results for context:\n${searchResults.map((result: { title: string; url: string; content?: string }, index: number) => 
                `${index + 1}. ${result.title}\n   URL: ${result.url}\n   Content: ${result.content?.substring(0, 200)}...`
              ).join('\n\n')}`
            : '';

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { 
                    role: "system", 
                    content: `
You are an AI assistant providing comprehensive insights, analysis, and real world examples. When given a search query, provide detailed, informative explanations.

Provide accurate, up to date, well-structured information that would be valuable for someone researching this topic.

Please provide comprehensive analysis, be insightful and detailed in your response, using Markdown format when appropriate.

Use the search results provided to give current and accurate information. If search results are available, reference them in your response.
                    `
                },
                { 
                    role: "user", 
                    content: `Question: ${question}${searchContext}` 
                },
            ],
            temperature: 0.7,
        });
        
        // 7. Handle the result with fallback
        if (response.choices[0]?.message?.content) {
            console.log("💡 Final Answer:\n", response.choices[0].message.content);
            return response.choices[0].message.content;
        }

        return null;

    } catch (error) {
        console.error("🚨 Main error:", error);
        return null;
    }
};

// ask(" how to add Competitive advantage for new SaaS founder");


