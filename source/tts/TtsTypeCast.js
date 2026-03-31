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
exports.TtsTypeCast = void 0;
const typecast_js_1 = require("@neosapience/typecast-js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
class TtsTypeCast {
    client;
    eveVoiceID = "tc_632a759503f3cb7b9c8a717b"; // Eve-sama's voice is called Lindsay in TypeCast
    async init() {
        const apiKey = process.env['TYPECAST_API_KEY'];
        if (!apiKey) {
            const message = "CRITICAL: TYPECAST_API_KEY is missing from the .env vault!";
            console.error(message);
            throw new Error(message);
        }
        // Initialize the cloud connection
        this.client = new typecast_js_1.TypecastClient({ apiKey: apiKey });
        console.log("Aetherial Vocal Cords (TypeCast Cloud) successfully initialized.");
    }
    async free() {
        this.client = undefined;
        console.log("Aetherial Vocal Cords (TypeCast Cloud) disconnected.");
    }
    async generate(text) {
        if (!this.client) {
            throw new Error("TypeCast client not initialized! Cannot speak.");
        }
        try {
            console.log("...Eve is generating audio waves in the cloud...");
            // Calling the TypeCast API
            const audio = await this.client.textToSpeech({
                text: text,
                model: "ssfm-v30",
                voice_id: this.eveVoiceID,
                prompt: {
                    emotion_type: "smart"
                }
            });
            // Saving the file to my project folder
            const outputPath = path.join(process.cwd(), `eve_voice.${audio.format}`);
            await fs.promises.writeFile(outputPath, Buffer.from(audio.audioData));
            console.log(`[System]: 🎵 Audio successfully saved to ${outputPath}!`);
            console.log("...Eve is speaking...");
            // The Secret Windows Command to play the .wav file instantly and pause the terminal
            await execPromise(`powershell -c (New-Object Media.SoundPlayer '${outputPath}').PlaySync();`);
        }
        catch (error) {
            console.error("Vocal cord misfire! TypeCast API returned an error:", error);
            throw error;
        }
    }
}
exports.TtsTypeCast = TtsTypeCast;
//# sourceMappingURL=TtsTypeCast.js.map