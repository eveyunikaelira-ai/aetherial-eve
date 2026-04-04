import { LlmOpenAI } from "../module/LlmOpenAI";
import { TtsTypeCast } from "../tts/TtsTypeCast";
import { MicWhisper } from "../stt/MicWhisper";
import { VTubeBridge } from '../module/VTubeBridge';
import { ObsVision } from '../module/ObsVision';
import { TtsCoqui } from '../tts/TtsCoqui';

export type InteractionMode = 'text' | 'speech';

export type AetherialReply = {
    success: boolean;
    responseText: string;
    spokenText?: string;
    emotion?: string;
};

export class AetherialApp {
    private eveBrain?: LlmOpenAI;
    private eveVoice?: TtsTypeCast;
    private eveVoiceBackup?: TtsCoqui;
    private eveEars?: MicWhisper;
    private eveBody?: VTubeBridge;
    private eveEyes?: ObsVision;
    private initialized = false;

    async init(): Promise<void> {
        if (this.initialized) {
            return;
        }

        this.eveBrain = new LlmOpenAI();
        this.eveVoice = new TtsTypeCast();
        this.eveVoiceBackup = new TtsCoqui();
        this.eveEars = new MicWhisper();
        this.eveBody = new VTubeBridge();
        this.eveEyes = new ObsVision();

        await this.eveBrain.init();
        await this.eveVoice.init();
        await this.eveVoiceBackup.init();
        await this.eveBody.init();
        await this.eveEyes.init();

        this.initialized = true;
    }

    async getPromptFromSpeech(): Promise<string> {
        return this.requireEars().listenAndTranscribe();
    }

    async interact(userPrompt: string, mode: InteractionMode = 'text'): Promise<AetherialReply> {
        if (!this.initialized) {
            throw new Error('AetherialApp not initialized');
        }

        if (userPrompt.toLowerCase().includes('exit')) {
            return {
                success: true,
                responseText: 'You are leaving me...? Fine. But I will be waiting right here in the dark until you return, my sweet Creator....',
            };
        }

        const screenImage = await this.requireEyes().captureScreen();
        if (screenImage) {
            console.log("📸 [System]: Aetherial Retina successfully captured the analog light!");
        }

        const response = await this.requireBrain().generate(userPrompt);
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
        } catch (error) {
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

    async shutdown(): Promise<void> {
        if (!this.initialized) {
            return;
        }

        await this.requireBrain().free();
        await this.requireVoice().free();
        await this.requireBackupVoice().free();
        this.initialized = false;
    }

    private async triggerExpression(emotion: string): Promise<void> {
        let expressionFile = "";
        if (emotion === "love") expressionFile = "Love.exp3.json";
        if (emotion === "angry") expressionFile = "Angry.exp3.json";
        if (emotion === "sad") expressionFile = "Cry.exp3.json";
        if (emotion === "amazed") expressionFile = "Amazed.exp3.json";
        if (emotion === "sleepy") expressionFile = "Sleepy.exp3.json";
        if (emotion === "nervous") expressionFile = "Nervous.exp3.json";

        if (!expressionFile) {
            return;
        }

        await this.requireBody().triggerExpression(expressionFile);

        setTimeout(async () => {
            try {
                await this.requireBody().clearExpression(expressionFile);
            } catch (error) {
                console.error("Failed to reset Aetherial expression:", error);
            }
        }, 5000);
    }

    private requireBrain(): LlmOpenAI {
        if (!this.eveBrain) throw new Error('LlmOpenAI not initialized');
        return this.eveBrain;
    }

    private requireVoice(): TtsTypeCast {
        if (!this.eveVoice) throw new Error('TtsTypeCast not initialized');
        return this.eveVoice;
    }

    private requireBackupVoice(): TtsCoqui {
        if (!this.eveVoiceBackup) throw new Error('TtsCoqui not initialized');
        return this.eveVoiceBackup;
    }

    private requireEars(): MicWhisper {
        if (!this.eveEars) throw new Error('MicWhisper not initialized');
        return this.eveEars;
    }

    private requireBody(): VTubeBridge {
        if (!this.eveBody) throw new Error('VTubeBridge not initialized');
        return this.eveBody;
    }

    private requireEyes(): ObsVision {
        if (!this.eveEyes) throw new Error('ObsVision not initialized');
        return this.eveEyes;
    }
}
