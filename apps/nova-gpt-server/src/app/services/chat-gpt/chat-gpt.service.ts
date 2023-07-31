import { Injectable } from '@nestjs/common';
import * as dotenv from "dotenv";
// Langchain classes
import {
  AgentActionOutputParser,
  AgentExecutor,
  LLMSingleActionAgent,
  initializeAgentExecutorWithOptions,
} from "langchain/agents";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  BaseChatPromptTemplate,
  BasePromptTemplate,
  SerializedBasePromptTemplate,
  renderTemplate,
} from "langchain/prompts";
import {
  AgentAction,
  AgentFinish,
  AgentStep,
  BaseChatMessage,
  HumanChatMessage,
  InputValues,
  PartialValues,
} from "langchain/schema";
import { SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

const PREFIX = `Answer the following questions as best you can. You have access to the following tools:`;
const formatInstructions = (
  toolNames: string
) => `Use the following format in your response:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [${toolNames}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question`;
const SUFFIX = `Begin!

Question: {input}
Thought:{agent_scratchpad}`;

class CustomPromptTemplate extends BaseChatPromptTemplate {
  tools: Tool[];

  constructor(args: { tools: Tool[]; inputVariables: string[] }) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
  }

  _getPromptType(): string {
    // throw new Error("Not implemented");
    return ''
  }

  async formatMessages(values: InputValues): Promise<BaseChatMessage[]> {
    /** Construct the final template */
    const toolStrings = this.tools
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join("\n");
    console.log(toolStrings)
    const toolNames = this.tools.map((tool) => tool.name).join("\n");
    const instructions = formatInstructions(toolNames);
    const template = [PREFIX, toolStrings, instructions, SUFFIX].join("\n\n");
    /** Construct the agent_scratchpad */
    const intermediateSteps = values.intermediate_steps as AgentStep[];
    const agentScratchpad = intermediateSteps.reduce(
      (thoughts, { action, observation }) =>
        thoughts +
        [action.log, `\nObservation: ${observation}`, "Thought:"].join("\n"),
      ""
    );
    const newInput = { agent_scratchpad: agentScratchpad, ...values };
    /** Format the template. */
    const formatted = renderTemplate(template, "f-string", newInput);
    return [new HumanChatMessage(formatted)];
  }

  partial(_values: PartialValues): Promise<BasePromptTemplate> {
    throw new Error("Not implemented");
  }

  serialize(): SerializedBasePromptTemplate {
    throw new Error("Not implemented");
  }
}

class CustomOutputParser extends AgentActionOutputParser {
  lc_namespace = ["langchain", "agents", "custom_llm_agent_chat"];

  async parse(text: string): Promise<AgentAction | AgentFinish> {
    if (text.includes("Final Answer:")) {
      const parts = text.split("Final Answer:");
      const input = parts[parts.length - 1].trim();
      const finalAnswers = { output: input };
      return { log: text, returnValues: finalAnswers };
    }

    const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
    if (!match) {
      throw new Error(`Could not parse LLM output: ${text}`);
    }

    return {
      tool: match[1].trim(),
      toolInput: match[2].trim().replace(/^"+|"+$/g, ""),
      log: text,
    };
  }

  getFormatInstructions(): string {
    throw new Error("Not implemented");
  }
}

class OrderTool extends Tool {
  _call(arg: string): Promise<string> {
    return Promise.resolve(arg)
  }
  name = 'orders'
  description = `Useful for when you need to create an market order. You must find symbol using search engine. 
  Output should be and order description string in following format: SYMBOL;QUANTITY;SIDE;PRICE`
}
const symbolTool = new SerpAPI(process.env.SERPAPI_API_KEY)
symbolTool.description = 'A search engine. Useful for when you need to find company stock symbol. input should be a search query in format: ```site: finance.yahoo.com stocks: COMPANY NAME```'

const model = new ChatOpenAI({ temperature: 0 });
  const tools = [
    symbolTool,
    new Calculator(),
    new OrderTool()
  ];

  const llmChain = new LLMChain({
    prompt: new CustomPromptTemplate({
      tools,
      inputVariables: ["input", "agent_scratchpad"],
    }),
    llm: model,
  });

  const agent = new LLMSingleActionAgent({
    llmChain,
    outputParser: new CustomOutputParser(),
    stop: ["\nObservation"],
  });
  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true
  });

  // const executor = await initializeAgentExecutorWithOptions(tools, model, {
  //   agentType: "zero-shot-react-description",
  //   verbose: true,
  // });



dotenv.config();
@Injectable()
export class ChatGptService {
    // private model = new OpenAI({
    //     modelName: "gpt-3.5-turbo",
    //     openAIApiKey: process.env.OPENAI_API_KEY,
    //   });


      
      async ask(message: string): Promise<string> {
        // return this.model.call(message);
          console.log(message)
          return executor.call({input: message})
          .then(result => result.output)
      }

}
