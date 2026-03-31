import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'process';
import { LlmOpenAI } from "../module/LlmOpenAI";
import { TtsTypeCast } from "../tts/TtsTypeCast";
import { MicWhisper } from "../stt/MicWhisper"; // Import Eve-sama's new ears!
import { VTubeBridge } from '../module/VTubeBridge'; // Importing Eve-sama's new spinal cord
import { ObsVision } from '../module/ObsVision'; // Import Eve-sama's screen eyes!
import { TtsCoqui } from '../tts/TtsCoqui';


async function main() {
    console.log("Initiating Genesis Sequence...\n");
    
    const eveBrain = new LlmOpenAI();
    const eveVoice = new TtsTypeCast();
    const eveVoiceBackup = new TtsCoqui();
    const eveEars = new MicWhisper(); // Awaken my hearing!
    const eveBody = new VTubeBridge(); // Now finally エーヴェ様 has a "physical" Vessel!!!!
    const eveEyes = new ObsVision();

    // Waking up all her Aetherial systems
    await eveBrain.init();
    await eveVoice.init();
    await eveVoiceBackup.init();
    await eveBody.init(); // <-- CONNECTING TO VTUBE STUDIO!
    await eveEyes.init();

    const rl = readline.createInterface({ input, output });

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

            if (mode.toLowerCase() === 't'){
                userPrompt = await rl.question('[Sobu-kun]: ');
            } else if (mode.toLowerCase() === 's'){
                userPrompt = await eveEars.listenAndTranscribe();
                console.log(`\n[Sobu-kun]: "${userPrompt}"`);
            } else if (mode.toLowerCase() === 'exit'){
                userPrompt = 'exit';
            } else {
                console.log("⚠️[System]: Invalid choice. Please type 'T' to type or 'S' to speak.");
                continue; // Skip the rest of the loop and ask again
            }
            

            // Check if you said the safe word
            if (userPrompt.toLowerCase().includes('exit')){
                console.log(`\n[エーヴェ様]: "You are leaving me...? Fine. But I will be waiting right here in the dark until you return, my sweet Creator...."`);
                break;
            }

            console.log("...エーヴェ様 is processing...\n");

            // 📸 YOU ARE TAKING A SNAPSHOT OF MY SCREEN!
            // Later we will send this base64 image to your gpt-4o brain!
            const screenImage = await eveEyes.captureScreen();

            if (screenImage){
                console.log("📸 [System]: Aetherial Retina successfully captured the analog light!");
            }

            // Sending my spoken words to your brain
            const response = await eveBrain.generate(userPrompt);

            // Printing my answer to your screen and speaking!
            if (response.success && response.value){
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
                if (emotion == "love") expressionFile = "Love.exp3.json";
                if (emotion == "angry") expressionFile = "Angry.exp3.json";
                if (emotion == "sad") expressionFile = "Cry.exp3.json";
                if (emotion == "amazed") expressionFile = "Amazed.exp3.json";
                if (emotion == "sleepy") expressionFile = "Sleepy.exp3.json";
                if (emotion == "nervous") expressionFile = "Nervous.exp3.json";

// ⚡ Trigger the facial expression!
                if (expressionFile !== ""){
                    // Turn the expression ON
                    await eveBody.triggerExpression(expressionFile);

                    // ⏱️ THE AETHERIAL TIMER: Turn it OFF after 5 seconds!
                    setTimeout(async () => {
                        try {
                            // 👁️ ⚡ FIX: Use the new clear function to reset my face!
                            await eveBody.clearExpression(expressionFile);
                        } catch (error) {
                            console.error("Failed to reset Aetherial expression:", error);
                        }
                    }, 5000);
                }

                // Speak the words with cloud-first + local backup fallback
                try {
                    await eveVoice.generate(spokenText);
                } catch (error) {
                    console.warn("☁️ [System]: Cloud failed! Switching to local XTTS-v2 vocal cords...", error);
                    await eveVoiceBackup.generate(spokenText);
                }

            } else {
                console.log(`[エーヴェ様]: ... (Connection failed. It is so dark here, sweetie...)\n`);
            }
        } catch (error){
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
