import OpenAI from "openai";
import { ChatMessage } from "../src/types/types-for-prompts/index";

export const openaiInstance = async ({ messages }: { messages: ChatMessage[] }) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: messages,
        temperature: 0.2,
        response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result;

}