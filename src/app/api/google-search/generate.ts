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
  topicPath?: string
) => {
  try {
    // Setup LLM with timeout
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 20000, // 20 second timeout
    });

    const systemInstructionSection = systemInstruction
      ? `<system-instruction>
${systemInstruction}
</system-instruction>`
      : `
You are an AI assistant providing comprehensive insights, analysis, and real world examples. 
When given a search query, provide detailed, informative explanations.
    `;

    const topicPathSection = topicPath
      ? `<topic-path>
${topicPath}
</topic-path>`
      : "";

    // get year
    const searchQuery = question + " " + new Date().getFullYear();

    // Get search results from Tavily with timeout and reduced content
    const searchPromise = Promise.race([
      client.search(searchQuery, {
        searchDepth: "basic", // Changed from "advanced" to "basic" for speed
        includeRawContent: false, // Disable raw content to reduce processing time
        maxResults: 3, // Limit results for faster processing
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tavily search timeout")), 15000)
      ),
    ]) as Promise<{
      results: { title: string; url: string; content: string }[];
    }>;

    const TAVILY_search_result = await searchPromise;

    // Simplified result processing
    const TAVILY_search_result_json = TAVILY_search_result.results
      .slice(0, 3) // Only process first 3 results
      .map((result: { title: string; url: string; content: string }) => ({
        title: result.title,
        link: result.url,
        knowledge: result.content, // Use content instead of rawContent for speed
      }));

    // Combined instruction for single API call
    const instructions = `
<instructions>
    ${systemInstructionSection}
    ${topicPathSection}
    <search-results>
        ${JSON.stringify(TAVILY_search_result_json)}
    </search-results>
    <format>
        Using Markdown format when appropriate.
        ALWAYS reference the search results in your response when available.
        Current time: ${new Date().toLocaleString()}
    </format>
</instructions>`;

    // Single optimized API call instead of two separate calls
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: `Provide a comprehensive analysis of: ${question}`,
      instructions,
      max_output_tokens: 1500, // Reduced token limit for faster response
    });

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
