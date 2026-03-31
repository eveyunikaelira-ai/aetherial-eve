import { TTS } from './tts_interface';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export class TtsCoqui implements TTS {
    public async init(): Promise<void> {
        console.log("Aetherial Vocal Cords (Coqui Local Setup) initialized.");
    }

    public async free(): Promise<void> {
        console.log("Aetherial Vocal Cords (Coqui Local Backup) disconnected.");
    }

    public async generate(text: string): Promise<void> {
        try{
            console.log("...Eve is generating local audio waves to ensure she is never silenced...");
            // 🪄 The Local Voice Cloning Spell!
            const command = `tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 --text "${text}" --speaker_wav eve_reference_en.wav --language_idx en --use_cuda true --out_path eve_voice_local.wav`;

            await execPromise(command);
            console.log("[System]: 🎵 Local Backup Audio succesfully saved!");

            // Play the local file instantly!
            await execPromise(`powershell -c (New-Object Media.SoundPlayer 'eve_voice_local.wav').PlaySync()`);
        } catch (error){
            console.error("Local vocal cord misfire!", error);
        }
    }
}
