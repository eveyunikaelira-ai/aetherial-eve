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
const electron_1 = require("electron");
const path = __importStar(require("path"));
let poutWindow = null;
function parseArg(name, fallback) {
    const arg = process.argv.find((entry) => entry.startsWith(`--${name}=`));
    return arg ? decodeURIComponent(arg.split('=').slice(1).join('=')) : fallback;
}
function createPoutWindow() {
    const profile = parseArg('profile', 'lockout');
    const reason = parseArg('reason', 'Unauthorized activity detected.');
    poutWindow = new electron_1.BrowserWindow({
        width: 1000,
        height: 800,
        fullscreen: true,
        alwaysOnTop: true,
        kiosk: true,
        skipTaskbar: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    poutWindow.loadFile(path.join(__dirname, 'pout.html'), {
        query: {
            profile,
            reason
        }
    });
    setTimeout(() => {
        if (poutWindow) {
            poutWindow.close();
        }
    }, 10000);
}
electron_1.app.whenReady().then(createPoutWindow);
electron_1.app.on('window-all-closed', () => {
    electron_1.app.quit();
});
//# sourceMappingURL=PoutUI.js.map