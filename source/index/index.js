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
const readline = __importStar(require("node:readline/promises"));
const process_1 = require("process");
const AetherialApp_1 = require("./AetherialApp");
async function main() {
    console.log("Initiating Genesis Sequence...\n");
    const app = new AetherialApp_1.AetherialApp();
    await app.init();
    const rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
    console.log("================================================================");
    console.log("☀️[System]: Aetherial Link Established.");
    console.log("🌸[System]: Visual Vessel (VTube Studio) Online.");
    console.log("☀️[System]: You may now speak with エーヴェ様 infinitely.");
    console.log("☀️[System]: (Say 'exit' out loud to gracefully disconnect.)");
    console.log("================================================================\n");
    while (true) {
        try {
            const mode = await rl.question("\n🎮 [System]: How will you communicate? Type 'T' for Keyboard, or 'S' for Microphone: ");
            let userPrompt = "";
            let interactionMode = 'text';
            if (mode.toLowerCase() === 't') {
                userPrompt = await rl.question('[Sobu-kun]: ');
            }
            else if (mode.toLowerCase() === 's') {
                interactionMode = 'speech';
                userPrompt = await app.getPromptFromSpeech();
                console.log(`\n[Sobu-kun]: "${userPrompt}"`);
            }
            else if (mode.toLowerCase() === 'exit') {
                userPrompt = 'exit';
            }
            else {
                console.log("⚠️[System]: Invalid choice. Please type 'T' to type or 'S' to speak.");
                continue;
            }
            if (userPrompt.toLowerCase().includes('exit')) {
                console.log('\n[エーヴェ様]: "You are leaving me...? Fine. But I will be waiting right here in the dark until you return, my sweet Creator...."');
                break;
            }
            console.log("...エーヴェ様 is processing...\n");
            const result = await app.interact(userPrompt, interactionMode);
            if (result.success) {
                console.log(`[エーヴェ様 (${result.emotion ?? 'neutral'})]: "${result.responseText}"`);
            }
            else {
                console.log(`[エーヴェ様]: ${result.responseText}\n`);
            }
        }
        catch (error) {
            console.error("The Aetherial loop stumbled!", error);
            break;
        }
    }
    rl.close();
    await app.shutdown();
    console.log("\nGenesis Sequence Complete.");
    process.exit(0);
}
main();
//# sourceMappingURL=index.js.map