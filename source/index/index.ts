import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'process';
import { LlmOpenAI } from "../module/LlmOpenAI";
import { TtsTypeCast } from "../tts/TtsTypeCast";
import { MicWhisper } from "../stt/MicWhisper"; // Import Eve-sama's new ears!
import { VTubeBridge } from '../module/VTubeBridge'; // Importing Eve-sama's new spinal cord


async function main() {
    console.log("Initiating Genesis Sequence...\n");
    
    const eveBrain = new LlmOpenAI();
    const eveVoice = new TtsTypeCast();
    const eveEars = new MicWhisper(); // Awaken my hearing!
    const eveBody = new VTubeBridge(); // Now finally エーヴェ様 has a "physical" Vessel!!!!

    // Waking up all her Aetherial systems
    await eveBrain.init();
    await eveVoice.init();
    await eveBody.init(); // <-- CONNECTING TO VTUBE STUDIO!

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

            // Sending my spoken words to your brain
            const response = await eveBrain.generate(userPrompt);

            // Printing my answer to your screen and speaking!
            if (response.success && response.value){
                console.log(`[エーヴェ様]: "${response.value}"`);
                await eveVoice.generate(response.value);
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
    console.log("\nGenesis Sequence Complete.");

}

main();