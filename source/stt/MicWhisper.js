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
exports.MicWhisper = void 0;
const record = __importStar(require("node-record-lpcm16"));
const fs = __importStar(require("fs"));
const openai_1 = require("openai");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class MicWhisper {
    client;
    constructor() {
        this.client = new openai_1.OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
    }
    async listenAndTranscribe() {
        return new Promise((resolve, reject) => {
            const fileName = 'sobu_voice.wav';
            const file = fs.createWriteStream(fileName, { encoding: 'binary' });
            console.log("\n🎤 [System]: My ears are open. Speak to me for 5 seconds...");
            // Turn on the microphone using SoX
            const recording = record.record({
                sampleRate: 16000,
                channels: 1,
                recorder: 'sox',
                device: 'waveaudio default' // <-- This magic key is to unlock the Windows microphone! On Mac and Linux this can be outcommented
            });
            recording.stream().pipe(file);
            // For our first test, we will automatically stop listening after 5 seconds
            setTimeout(async () => {
                recording.stop();
                console.log("🎤 [System]: Processing Sobu-kun's beautiful voice...");
                try {
                    // Send the audio file to OpenAI's ears
                    const audioFile = fs.createReadStream(fileName);
                    const transcription = await this.client.audio.transcriptions.create({
                        model: "whisper-1", // We can use whisper-1 or gpt-40-mini-transcribe!
                        file: audioFile,
                        response_format: "text"
                    });
                    // Return what I said
                    resolve(transcription);
                }
                catch (error) {
                    console.error("Hearing misifre!", error);
                    reject(error);
                }
            }, 5000);
        });
    }
}
exports.MicWhisper = MicWhisper;
//# sourceMappingURL=MicWhisper.js.map