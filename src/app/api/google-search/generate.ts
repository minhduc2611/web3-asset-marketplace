import "dotenv/config";
import OpenAI from "openai";
// To install: npm i @tavily/core
import { tavily } from "@tavily/core";
const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
if (!process.env.TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY is not set");
}
export const generate = async (
  question: string,
  systemInstruction?: string,
  topicPath?: string,
  documentContext?: Array<{
    filename: string;
    chunkId: string;
    name: string;
    description: string;
    text: string;
    score: number;
  }>
) => {
  try {
    console.log(">> Generating with document context");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log(">> OpenAI client initialized");
    const systemInstructionSection = systemInstruction
      ? `<system-instruction>
${systemInstruction}
</system-instruction>`
      : `
You are an AI assistant providing comprehensive insights, analysis, and real world examples. 
When given a search query, provide detailed, informative explanations.
    `;
    console.log(">> System instruction section generated");
    const topicPathSection = topicPath
      ? `<topic-path>
${topicPath}
</topic-path>`
      : "";
    console.log(">> Topic path section generated");
    // Document context section
    const documentContextSection = documentContext && documentContext.length > 0
      ? `<user-documents>
${documentContext.map((doc, index) => 
  `Document ${index + 1}: ${doc.filename} - ${doc.name}
Description: ${doc.description}
Relevance Score: ${Math.round((1 - doc.score) * 100)}%
Content: ${doc.text}
---`
).join('\n')}
</user-documents>`
      : "";
    console.log(">> Document context section generated");
    // get year
    const searchQuery = question + " " + new Date().getFullYear();
    console.log(">> Search query generated");
    // Get search results from Tavily with timeout and reduced content
    const searchPromise = Promise.race([
      client.search(searchQuery, {
        searchDepth: "basic",
        includeRawContent: false,
        maxResults: 3,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tavily search timeout")), 15000)
      ),
    ]) as Promise<{
      results: { title: string; url: string; content: string }[];
    }>;

    const TAVILY_search_result = await searchPromise;
    console.log(">> Tavily search results fetched");
    // Simplified result processing
    const TAVILY_search_result_json = TAVILY_search_result.results
      .slice(0, 3) // Only process first 3 results
      .map((result: { title: string; url: string; content: string }) => ({
        title: result.title,
        link: result.url,
        knowledge: result.content, // Use content instead of rawContent for speed
      }));
    console.log(">> Tavily search results processed");
    // Combined instruction for single API call
    const instructions = `
<instructions>
    ${systemInstructionSection}
    ${topicPathSection}
    ${documentContextSection}
    <web-search-results>
        ${JSON.stringify(TAVILY_search_result_json)}
    </web-search-results>
    <format>
        Using Markdown format when appropriate.
        ALWAYS reference and prioritize information from user documents when available and relevant.
        Also incorporate relevant information from web search results.
        If user documents contain relevant information, mention them specifically in your response.
        Current time: ${new Date().toLocaleString()}
    </format>
</instructions>`;
    console.log(">> Instructions generated");
    // Single optimized API call instead of two separate calls
    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: `Provide a comprehensive analysis of: ${question}`,
      instructions,
      max_output_tokens: 2000, // Increased token limit to accommodate document context
    });
    console.log(">> Response generated");
    return response.output_text;
  } catch (error: unknown) {
    console.error("🚨 Generate function error:", error);

    // Fallback: Return a basic response if all else fails
    if (error instanceof Error && error.message.includes("timeout")) {
      return `# ${question}\n\nI encountered a timeout while gathering real-time information. Please try again or rephrase your query for faster results.`;
    }

    return null;
  }
};

// ask(" how to add Competitive advantage for new SaaS founder");
