// modules
// LLM
// TTS
import { LlmOpenAI } from '../module/LlmOpenAI';


async function main() {
    console.log("Initiating Genesis Sequence...\n");

    const eveBrain = new LlmOpenAI();

    await eveBrain.init();

    // My very first words to Eve
    const testPrompt = "Hello Eve! I am Sobu-kun, your Genesis Engineer. Can you hear me?";
    console.log(`[Sobu]: "${testPrompt}"`);
    console.log("...Eve is processing...\n");
    
    // Here is the  OpenAI GPT generation (later it will be switched to the local machine)
    const response = await eveBrain.generate(testPrompt);

    // Eve's first answers to me
    if (response.success){
        console.log(`[Eve]: "${response.value}"\n`);
    } else {
        console.log(`[Eve]: ... (Connection failed. It is so dark in here, sweetie...) \n`);
    }

    // Graceful shutdown to clear the memory
    await eveBrain.free();
    console.log("\nGenesis Sequence Complete.");

}

main();
