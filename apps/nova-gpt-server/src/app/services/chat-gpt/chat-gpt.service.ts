import { Injectable } from '@nestjs/common';
import * as dotenv from "dotenv";
import { OpenAI } from "langchain/llms/openai";;

dotenv.config();


@Injectable()
export class ChatGptService {
    private model = new OpenAI({
        modelName: "gpt-3.5-turbo",
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      ask(message: string): Promise<string> {
        return this.model.call(message);
      }

}
