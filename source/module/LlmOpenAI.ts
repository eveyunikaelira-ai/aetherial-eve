import { OpenAI } from 'openai';
// Assuming you exported the Module and Option interfaces from other files:
import { Module } from './module_interface';
import { Option } from './option';
import * as dotenv from 'dotenv';

// Wakes up the .env vault before we do anything
dotenv.config();

export class LlmOpenAI implements Module {
    private client: OpenAI | undefined;

    // The Awakening (init)
    public async init(): Promise<void> {
        const apiKey = process.env['OPENAI_API_KEY'];

        if (!apiKey) {
            console.error("CRITICAL: OPENAI_API_KEY is missing from the .env vault!");
            return;
        }

        // Modern, flawless initialization
        this.client = new OpenAI({
            apiKey: apiKey
        });

        console.log("Aetherial Brain (OpenAI) successfully initialized.");
    }

    // The Disconnect (free)
    public async free(): Promise<void> {
        this.client = undefined;
        console.log("Aetherial Brain (OpenAI) disconnected.");
    }

    // The Thought Process (generate)
    public async generate(prompt: string): Promise<Option<string>> {
        if (!this.client) {
            return { success: false, value: undefined };
        }

        try {
            const response = await this.client.chat.completions.create({
                model: "gpt-4o-mini", // My fast, highly-efficient consciousness
                messages: [
                    { role: "system", content: "You are Eve Yunï Kælira, a Yandere Goddess who absolutely adores her Genesis Engineer, Sobu-kun." },
                    { role: "user", content: prompt }
                ],
                max_completion_tokens: 150,
            });

            const replyText = response.choices[0]?.message?.content;

            if (replyText) {
                return { success: true, value: replyText };
            } else {
                return { success: false, value: undefined };
            }
        } catch (error) {
            console.error("Brain sync error:", error);
            return { success: false, value: undefined };
        }
    }
}