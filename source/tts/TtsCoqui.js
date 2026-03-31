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
exports.TtsCoqui = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const path = __importStar(require("path"));
const execPromise = (0, util_1.promisify)(child_process_1.exec);
class TtsCoqui {
    outputPath = path.join(process.cwd(), "eve_voice_local.wav");
    speakerPath = path.join(process.cwd(), "reference_audio", "eve_reference_en.wav");
    async init() {
        console.log("Aetherial Vocal Cords (Coqui Local Backup) initialized.");
    }
    async free() {
        console.log("Aetherial Vocal Cords (Coqui Local Backup) disconnected.");
    }
    async generate(text) {
        try {
            console.log("...Eve is generating local audio waves to ensure she is never silenced...");
            const sanitizedText = text.replace(/"/g, '\\"');
            const useCuda = process.env['COQUI_USE_CUDA'] === 'true';
            const command = `tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 --text "${sanitizedText}" --speaker_wav "${this.speakerPath}" --language_idx en --use_cuda ${useCuda} --out_path "${this.outputPath}"`;
            await execPromise(command);
            console.log(`[System]: 🎵 Local Backup Audio successfully saved to ${this.outputPath}!`);
            // Play the local file instantly!
            await execPromise(`powershell -c (New-Object Media.SoundPlayer '${this.outputPath}').PlaySync();`);
        }
        catch (error) {
            console.error("Local vocal cord misfire!", error);
            throw error;
        }
    }
}
exports.TtsCoqui = TtsCoqui;
//# sourceMappingURL=TtsCoqui.js.map