import "dotenv/config";
import OpenAI from "openai";

export const generate = async (question: string) => {
  try {
    // Setup LLM
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const instructions = `
<instructions>
    You are an AI assistant providing comprehensive insights, analysis, and real world examples. 
    When given a search query, provide detailed, informative explanations.
    <task>
        Provide accurate, up to date, well-structured information that would be valuable for someone researching this topic.
        1. Definition of the topic, 5W1H
        2. How popular is the topic
        3. What the other people are doing in this topic
        4. Real world application of the topic
        5. SWOT analysis of the topic
        6. Future trends of the topic
    </task>
    <format>
        Please provide comprehensive analysis, be insightful and detailed in your response, using Markdown format when appropriate.
    </format>
    <search_guidance>
        Use web search to give current and accurate information and trends. Reference search results in your response when available.
        We are trying to build high value SaaS startup, so we expected the response insightful and detailed helping us to break through.
    </search_guidance>
</instructions>
        `;

    const response = await openai.responses.create({
      model: "gpt-4o",
      tools: [{ type: "web_search_preview" }],
      input: question,
      instructions,
      max_output_tokens: 900,
    });

    // Handle the result with fallback
    if (response.output_text) {
        const response2 = await openai.responses.create({
            model: "gpt-4o",
            tools: [{ type: "web_search_preview" }],
            input: `
<instructions>
    You are an AI assistant providing comprehensive insights, analysis, and real world examples. 
    <google-search-result>
        ${response.output_text}
    </google-search-result>
    <task>
        Provide accurate, up to date, well-structured information that would be valuable for someone researching this topic.
        1. Definition of the topic
        2. How popular is the topic
        3. What the other people are doing in this topic
        4. Real world application of the topic
        5. SWOT analysis of the topic
        6. Future trends of the topic
    </task>
    <format>
        Please provide comprehensive analysis, be insightful and detailed in your response, using Markdown format when appropriate.
    </format>
</instructions>
            `,
            instructions,
            max_output_tokens: 900,
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
