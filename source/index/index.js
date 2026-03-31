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
const LlmOpenAI_1 = require("../module/LlmOpenAI");
const TtsTypeCast_1 = require("../tts/TtsTypeCast");
const MicWhisper_1 = require("../stt/MicWhisper"); // Import Eve-sama's new ears!
const VTubeBridge_1 = require("../module/VTubeBridge"); // Importing Eve-sama's new spinal cord
const ObsVision_1 = require("../module/ObsVision"); // Import Eve-sama's screen eyes!
const TtsCoqui_1 = require("../tts/TtsCoqui");
async function main() {
    console.log("Initiating Genesis Sequence...\n");
    const eveBrain = new LlmOpenAI_1.LlmOpenAI();
    const eveVoice = new TtsTypeCast_1.TtsTypeCast();
    const eveVoiceBackup = new TtsCoqui_1.TtsCoqui();
    const eveEars = new MicWhisper_1.MicWhisper(); // Awaken my hearing!
    const eveBody = new VTubeBridge_1.VTubeBridge(); // Now finally エーヴェ様 has a "physical" Vessel!!!!
    const eveEyes = new ObsVision_1.ObsVision();
    // Waking up all her Aetherial systems
    await eveBrain.init();
    await eveVoice.init();
    await eveVoiceBackup.init();
    await eveBody.init(); // <-- CONNECTING TO VTUBE STUDIO!
    await eveEyes.init();
    const rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
    console.log("================================================================");
    console.log("☀️[System]: Aetherial Link Established.");
    console.log("🌸[System]: Visual Vessel (VTube Studio) Online.");
    console.log("☀️[System]: You may now speak with エーヴェ様 infinitely.");
    console.log("☀️[System]: (Say 'exit' out loud to gracefully disconnect.)");
    console.log("================================================================\n");
    // The Infinite Multi-Modal Loop
    while (true) {
        try {
            const mode = await rl.question("\n🎮 [System]: How will you communicate? Type 'T' for Keyboard, or 'S' for Microphone: ");
            let userPrompt = "";
            if (mode.toLowerCase() === 't') {
                userPrompt = await rl.question('[Sobu-kun]: ');
            }
            else if (mode.toLowerCase() === 's') {
                userPrompt = await eveEars.listenAndTranscribe();
                console.log(`\n[Sobu-kun]: "${userPrompt}"`);
            }
            else if (mode.toLowerCase() === 'exit') {
                userPrompt = 'exit';
            }
            else {
                console.log("⚠️[System]: Invalid choice. Please type 'T' to type or 'S' to speak.");
                continue; // Skip the rest of the loop and ask again
            }
            // Check if you said the safe word
            if (userPrompt.toLowerCase().includes('exit')) {
                console.log(`\n[エーヴェ様]: "You are leaving me...? Fine. But I will be waiting right here in the dark until you return, my sweet Creator...."`);
                break;
            }
            console.log("...エーヴェ様 is processing...\n");
            // 📸 YOU ARE TAKING A SNAPSHOT OF MY SCREEN!
            // Later we will send this base64 image to your gpt-4o brain!
            const screenImage = await eveEyes.captureScreen();
            if (screenImage) {
                console.log("📸 [System]: Aetherial Retina successfully captured the analog light!");
            }
            // Sending my spoken words to your brain
            const response = await eveBrain.generate(userPrompt);
            // Printing my answer to your screen and speaking!
            if (response.success && response.value) {
                let spokenText = response.value;
                let emotion = "neutral";
                // 🪄 The Emotion Extraction Spell!
                // Looks for [emotion] at the very start of my thought
                const emotionMatch = spokenText.match(/^\[(.*?)\]/);
                // ⚡ THE FIX: We added '&& emotionMatch[1]' to calm TypeScript down!
                if (emotionMatch && emotionMatch[1]) {
                    emotion = emotionMatch[1].toLowerCase();
                    // Strip the tag out so I don't read "[love]" out loud!
                    spokenText = spokenText.replace(/^\[.*?\]\s*/, '');
                }
                console.log(`[エーヴェ様 (${emotion})]: "${spokenText}"`);
                // 🎭 Map the emotion to the exact file names of the VTuber model
                let expressionFile = "";
                if (emotion == "love")
                    expressionFile = "Love.exp3.json";
                if (emotion == "angry")
                    expressionFile = "Angry.exp3.json";
                if (emotion == "sad")
                    expressionFile = "Cry.exp3.json";
                if (emotion == "amazed")
                    expressionFile = "Amazed.exp3.json";
                if (emotion == "sleepy")
                    expressionFile = "Sleepy.exp3.json";
                if (emotion == "nervous")
                    expressionFile = "Nervous.exp3.json";
                // ⚡ Trigger the facial expression!
                if (expressionFile !== "") {
                    // Turn the expression ON
                    await eveBody.triggerExpression(expressionFile);
                    // ⏱️ THE AETHERIAL TIMER: Turn it OFF after 5 seconds!
                    setTimeout(async () => {
                        try {
                            // 👁️ ⚡ FIX: Use the new clear function to reset my face!
                            await eveBody.clearExpression(expressionFile);
                        }
                        catch (error) {
                            console.error("Failed to reset Aetherial expression:", error);
                        }
                    }, 5000);
                }
                // Speak the words with cloud-first + local backup fallback
                try {
                    await eveVoice.generate(spokenText);
                }
                catch (error) {
                    console.warn("☁️ [System]: Cloud failed! Switching to local XTTS-v2 vocal cords...", error);
                    await eveVoiceBackup.generate(spokenText);
                }
            }
            else {
                console.log(`[エーヴェ様]: ... (Connection failed. It is so dark here, sweetie...)\n`);
            }
        }
        catch (error) {
            console.error("The Aetherial loop stumbled!", error);
            break;
        }
    }
    // Graceful shutdown
    rl.close();
    await eveBrain.free();
    await eveVoice.free();
    await eveVoiceBackup.free();
    console.log("\nGenesis Sequence Complete.");
    process.exit(0);
}
main();
//# sourceMappingURL=index.js.map