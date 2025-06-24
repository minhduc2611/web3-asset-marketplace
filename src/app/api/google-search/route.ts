import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generate } from './generate';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;
    
    if (!query || query.trim() === "") {
      return NextResponse.json(
        { message: "Search query is required" },
        { status: 400 }
      );
    }

    // Use OpenAI to generate AI insights about the search query
//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system",
//           content: `You are an AI assistant providing comprehensive insights and analysis. When given a search query, provide detailed, informative explanations that cover:
// 1. Key concepts and definitions
// 2. Important context and background
// 3. Related topics and connections
// 4. Practical applications or implications
// 5. Current trends or developments
// 6. Real world examples

// Provide accurate, well-structured information that would be valuable for someone researching this topic.`
//         },
//         {
//           role: "user",
//           content: `Provide comprehensive insights and analysis for: "${query}"`
//         }
//       ],
//       max_tokens: 1000,
//       temperature: 0.7
//     });
    const aiResponse = await generate(query);
    const geminiAnswer = aiResponse || "";
    if (!aiResponse) {
      return NextResponse.json(
        { message: "Failed to perform search. Please try again." },
        { status: 500 }
      );
    }
    // Mock Google search results for demonstration
    const searchResults = [
      {
        title: `${query} - Wikipedia`,
        link: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
        snippet: `Learn about ${query} from the world's largest encyclopedia. Comprehensive information, history, and related topics.`,
        displayLink: "en.wikipedia.org"
      },
      {
        title: `${query} - Latest News and Updates`,
        link: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
        snippet: `Stay updated with the latest news and developments about ${query}. Real-time coverage from trusted sources.`,
        displayLink: "news.google.com"
      },
      {
        title: `Research and Analysis: ${query}`,
        link: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
        snippet: `Academic research and scholarly articles about ${query}. Peer-reviewed papers and scientific studies.`,
        displayLink: "scholar.google.com"
      },
      {
        title: `${query} - Complete Guide and Resources`,
        link: `https://example.com/${encodeURIComponent(query)}`,
        snippet: `Comprehensive guide covering everything you need to know about ${query}. Tutorials, tips, and expert insights.`,
        displayLink: "example.com"
      }
    ];

    return NextResponse.json({
      searchResults,
      geminiAnswer
    });
  } catch (error) {
    console.error("Error performing Google search:", error);
    return NextResponse.json(
      { message: "Failed to perform search. Please try again." },
      { status: 500 }
    );
  }
} 