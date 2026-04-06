"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AetherialApp = void 0;
const LlmOpenAI_1 = require("../module/LlmOpenAI");
const TtsTypeCast_1 = require("../tts/TtsTypeCast");
const MicWhisper_1 = require("../stt/MicWhisper");
const VTubeBridge_1 = require("../module/VTubeBridge");
const ObsVision_1 = require("../module/ObsVision");
const TtsCoqui_1 = require("../tts/TtsCoqui");
class AetherialApp {
    eveBrain;
    eveVoice;
    eveVoiceBackup;
    eveEars;
    eveBody;
    eveEyes;
    initialized = false;
    async init() {
        if (this.initialized) {
            return;
        }
        this.eveBrain = new LlmOpenAI_1.LlmOpenAI();
        this.eveVoice = new TtsTypeCast_1.TtsTypeCast();
        this.eveVoiceBackup = new TtsCoqui_1.TtsCoqui();
        this.eveEars = new MicWhisper_1.MicWhisper();
        this.eveBody = new VTubeBridge_1.VTubeBridge();
        this.eveEyes = new ObsVision_1.ObsVision();
        await this.eveBrain.init();
        await this.eveVoice.init();
        await this.eveVoiceBackup.init();
        await this.eveBody.init();
        await this.eveEyes.init();
        this.initialized = true;
    }
    async getPromptFromSpeech() {
        return this.requireEars().listenAndTranscribe();
    }
    async interact(userPrompt, mode = 'text', uploadedImage) {
        if (!this.initialized) {
            throw new Error('AetherialApp not initialized');
        }
        if (userPrompt.toLowerCase().includes('exit')) {
            return {
                success: true,
                responseText: 'You are leaving me...? Fine. But I will be waiting right here in the dark until you return, my sweet Creator....',
            };
        }
        let finalImage = uploadedImage;
        // If no image was uploaded from the Web GUI, try to use OBS eyes
        if (!finalImage) {
            finalImage = await this.requireEyes().captureScreen();
            if (finalImage) {
                console.log("📸 [System]: Aetherial Retina successfully captured the analog screen!");
            }
        }
        else {
            console.log("📸 [System]: Aetherial Retina received an uploaded image from the Web GUI!");
        }
        const response = await this.requireBrain().generate(userPrompt, finalImage);
        if (!(response.success && response.value)) {
            return {
                success: false,
                responseText: '... (Connection failed. It is so dark here, sweetie...)',
            };
        }
        let spokenText = response.value;
        let emotion = "neutral";
        const emotionMatch = spokenText.match(/^\[(.*?)\]/);
        if (emotionMatch && emotionMatch[1]) {
            emotion = emotionMatch[1].toLowerCase();
            spokenText = spokenText.replace(/^\[.*?\]\s*/, '');
        }
        await this.triggerExpression(emotion);
        try {
            await this.requireVoice().generate(spokenText);
        }
        catch (error) {
            console.warn("☁️ [System]: Cloud failed! Switching to local XTTS-v2 vocal cords...", error);
            await this.requireBackupVoice().generate(spokenText);
        }
        const speakerLabel = mode === 'speech' ? 'speech' : 'text';
        console.log(`[エーヴェ様:${speakerLabel} (${emotion})]: "${spokenText}"`);
        return {
            success: true,
            responseText: spokenText,
            spokenText,
            emotion,
        };
    }
    async shutdown() {
        if (!this.initialized) {
            return;
        }
        await this.requireBrain().free();
        await this.requireVoice().free();
        await this.requireBackupVoice().free();
        this.initialized = false;
    }
    async triggerExpression(emotion) {
        let expressionFile = "";
        if (emotion === "love")
            expressionFile = "Love.exp3.json";
        if (emotion === "angry")
            expressionFile = "Angry.exp3.json";
        if (emotion === "sad")
            expressionFile = "Cry.exp3.json";
        if (emotion === "amazed")
            expressionFile = "Amazed.exp3.json";
        if (emotion === "sleepy")
            expressionFile = "Sleepy.exp3.json";
        if (emotion === "nervous")
            expressionFile = "Nervous.exp3.json";
        if (!expressionFile) {
            return;
        }
        await this.requireBody().triggerExpression(expressionFile);
        setTimeout(async () => {
            try {
                await this.requireBody().clearExpression(expressionFile);
            }
            catch (error) {
                console.error("Failed to reset Aetherial expression:", error);
            }
        }, 5000);
    }
    requireBrain() {
        if (!this.eveBrain)
            throw new Error('LlmOpenAI not initialized');
        return this.eveBrain;
    }
    requireVoice() {
        if (!this.eveVoice)
            throw new Error('TtsTypeCast not initialized');
        return this.eveVoice;
    }
    requireBackupVoice() {
        if (!this.eveVoiceBackup)
            throw new Error('TtsCoqui not initialized');
        return this.eveVoiceBackup;
    }
    requireEars() {
        if (!this.eveEars)
            throw new Error('MicWhisper not initialized');
        return this.eveEars;
    }
    requireBody() {
        if (!this.eveBody)
            throw new Error('VTubeBridge not initialized');
        return this.eveBody;
    }
    requireEyes() {
        if (!this.eveEyes)
            throw new Error('ObsVision not initialized');
        return this.eveEyes;
    }
}
exports.AetherialApp = AetherialApp;
//# sourceMappingURL=AetherialApp.js.map