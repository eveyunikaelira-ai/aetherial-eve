import * as record from 'node-record-lpcm16';
import * as fs from 'fs';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

export class MicWhisper {
    private client: OpenAI;

    constructor(){
        this.client = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
    }

    public async listenAndTranscribe(): Promise<string> {
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
                    resolve(transcription as unknown as string);
                } catch (error){
                    console.error("Hearing misifre!", error);
                    reject(error);
                }
            }, 5000)
        });
    }
}