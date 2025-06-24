import { PromptTemplate } from "@langchain/core/prompts";
import { ChatAnthropic } from "@langchain/anthropic";
import { TavilySearch } from "@langchain/tavily";
import "dotenv/config";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
export const generate = async (question: string) => {
    try {
        // 1. Setup LLM
        // const llm = new ChatOpenAI({
        //     modelName: "gpt-4o",
        //     temperature: 0.7,
        // });

        const llm = new ChatAnthropic({
            model: "claude-3-5-sonnet-20240620",
            temperature: 0.7,
        });

        // 2. Setup Web Search Tool (Tavily)
        const tool = new TavilySearch({
            tavilyApiKey: process.env.TAVILY_API_KEY,
            maxResults: 5,
            topic: "general",
            // includeAnswer: true,
            // includeRawContent: true,
            // includeImages: false,
            // includeImageDescriptions: false,
            // searchDepth: "basic",
            timeRange: "year",
            // includeDomains: [],
            // excludeDomains: [],
          });

        const tavilyTool = new DynamicTool({
            name: "tavily_search",
            description: "Search the web for current information using Tavily search API. Input should be a search query string.",
            func: async (input) => {
                try {
                    console.log("Starting Tavily search with input:", input);
                    const result = await tool.invoke({ query: input });
                    console.log("Tavily search completed");
                    return result;
                } catch {
                    console.error("Tavily search error");
                }
            },
        });

        // 3. Define the custom ReAct-style prompt with strict format enforcement
        const customPrompt = PromptTemplate.fromTemplate(`
You are an AI assistant providing comprehensive insights, analysis, real world examples. When given a search query, provide detailed, informative explanations.

Provide accurate, up to date, well-structured information that would be valuable for someone researching this topic.
Use tavily search tool to get the latest information (2025, gather all the information you can find).

Answer the following questions as best you can. You have access to the following tools:

{tools}

CRITICAL: You MUST follow this EXACT format. DO NOT provide a final answer until you have completed your search and analysis.

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: Provide a comprehensive analysis, be insightful and detailed in your response, Markdown format.

IMPORTANT RULES:
- NEVER provide a Final Answer until you have completed your search
- ALWAYS use the search tool first to get current information
- ONLY provide Final Answer after you have gathered sufficient information
- If search fails, try alternative search terms before giving up
- Add sources links found in the search results under each section of the answer
- If you don't have enough information, used the search results and add them to the answer

Begin!

Question: {input}
Thought:{agent_scratchpad}
`);

        // 4. Initialize the ReAct Agent with custom prompt and error handling
        const agent = await createReactAgent({
            llm,
            tools: [tavilyTool],
            prompt: customPrompt,
        });

        // 5. Create the AgentExecutor with retry logic and error handling
        const executor = new AgentExecutor({
            agent,
            tools: [tavilyTool],
            // verbose: true,
        });

        // 6. Ask the question with error handling
        console.log(`🤔 Asking: ${question}`);

        const result = await executor.invoke({
            input: question
        });

        // 7. Handle the result with fallback
        if (result.output) {
            console.log("💡 Final Answer:\n", result.output);
            return result.output;
        }

    } catch (error) {
        console.error("🚨 Main error:", error);
        return null;
    }
};

// ask(" how to add Competitive advantage for new SaaS founder");


