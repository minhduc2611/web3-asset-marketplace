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
    // Setup LLM
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
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

    const instructions = `
<instructions>
    ${systemInstructionSection}
    ${topicPathSection}
    <format>
        Please provide comprehensive analysis, be insightful and detailed in your response, using Markdown format when appropriate.
    </format>
    <search_guidance>
        Use web search to give current and accurate information and trends. Reference search results in your response when available.
    </search_guidance>
</instructions>
        `;

    const gen_search_query_instructions = `
    <user_instructions>
      <user_wants>
        ${systemInstructionSection}
      <user_wants>
        ${topicPathSection}
        <search_guidance>
            Use web search to give current and accurate information and trends. Reference search results in your response when available.
            The current time is ${new Date().toLocaleString()}.
        </search_guidance>
        <format>
            Short string for tavily search query.
        </format>
    </user_instructions>
            `;
    const search_query = await openai.responses.create({
      model: "gpt-4o",
      input: `Generate a search query for the following topic: ${question}`,
      instructions: gen_search_query_instructions,
      max_output_tokens: 900,
    });
    // Get search results from Tavily
    const TAVILY_search_result = await client.search(search_query.output_text, {
      searchDepth: "advanced",
      includeRawContent: "text",
    });
    const TAVILY_search_result_json = TAVILY_search_result.results.map(
      (result, index) => {
        if (index === 0) {
          //  do this to safe tokens
          return {
            title: result.title,
            link: result.url,
            knowledge: result.rawContent,
          };
        }
        return {
          title: result.title,
          link: result.url,
          knowledge: result.content,
        };
      }
    );

    // Handle the result with fallback
    if (TAVILY_search_result_json) {
      const response2 = await openai.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: `
<instructions>
    <google-search-result>
        ${JSON.stringify(TAVILY_search_result_json)}
    </google-search-result>
    <format>
        Please provide comprehensive analysis, be insightful and detailed in your response, using Markdown format when appropriate.
        ALWAYS reference the search results in your response when available.
    </format>
</instructions>`,
        instructions,
      });
      return response2.output_text;
    }

    return null;
  } catch (error) {
    console.error("🚨 Main error:", error);
    return null;
  }
};

// ask(" how to add Competitive advantage for new SaaS founder");
