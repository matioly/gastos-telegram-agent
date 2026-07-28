import OpenAI from "openai";
import dotenv from "dotenv";

import { QUERY_PROMPT } from "./prompt";
import { QueryIntent } from "./types";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function queryAgent(
    message: string
): Promise<QueryIntent> {

    const response = await client.chat.completions.create({

        model: "gpt-5-nano",

        messages: [

            {
                role: "system",
                content: QUERY_PROMPT
            },

            {
                role: "user",
                content: message
            }

        ]

    });

    const content = response.choices[0].message.content;

    if (!content) {
        throw new Error("Resposta vazia da OpenAI.");
    }

    return JSON.parse(content);

}