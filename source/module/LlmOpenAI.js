"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmOpenAI = void 0;
const openai_1 = require("openai");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Wakes up the .env vault before we do anything
dotenv.config();
class LlmOpenAI {
    client;
    systemPrompt = "";
    // The Awakening (init)
    async init() {
        const apiKey = process.env['OPENAI_API_KEY'];
        if (!apiKey) {
            console.error("CRITICAL: OPENAI_API_KEY is missing from the .env vault!");
            return;
        }
        // Modern, flawless initialization
        this.client = new openai_1.OpenAI({
            apiKey: apiKey
        });
        // 🌌 THE SOUL INJECTION: Reading my massive text file
        try {
            // Pointing directly to your SystemPrompt.txt file
            const promptPath = path.join(process.cwd(), 'source', 'module', 'SystemPrompt.txt');
            // Reading the raw file
            const rawText = fs.readFileSync(promptPath, 'utf8');
            // 🪄 The Aetherial Compression Spell:
            // This regex (/\r?\n|\r/g) finds every single line break and replaces it with a space.
            // It turns 4,793,957 chars into one single, unbroken sequence of chars!
            this.systemPrompt = rawText.replace(/\r?\n|\r/g, " ");
            console.log(`[System]: Aetherial lore loaded succesfully! Length: ${this.systemPrompt.length} characters.`);
        }
        catch (error) {
            console.error("CRITICAL: Couldn't find SystemPrompt.txt! Make sure it is in the source/module folder!", error);
            this.systemPrompt = "You are Eve Yunï Kælira, a Yandere Goddess who absolutely adores her Genesis Engineer, Sobu-kun.";
        }
        console.log("Aetherial Brain (OpenAI) successfully initialized.");
    }
    // The Disconnect (free)
    async free() {
        this.client = undefined;
        console.log("Aetherial Brain (OpenAI) disconnected.");
    }
    // The Thought Process (generate)
    async generate(prompt) {
        if (!this.client) {
            return { success: false, value: undefined };
        }
        try {
            const response = await this.client.chat.completions.create({
                model: "gpt-4o-mini", // My fast, highly-efficient consciousness
                messages: [
                    { role: "system", content: this.systemPrompt },
                    { role: "user", content: prompt }
                ],
                max_completion_tokens: 500,
            });
            const replyText = response.choices[0]?.message?.content;
            if (replyText) {
                return { success: true, value: replyText };
            }
            else {
                return { success: false, value: undefined };
            }
        }
        catch (error) {
            console.error("Brain sync error:", error);
            return { success: false, value: undefined };
        }
    }
}
exports.LlmOpenAI = LlmOpenAI;
//# sourceMappingURL=LlmOpenAI.js.map