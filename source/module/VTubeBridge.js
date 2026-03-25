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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VTubeBridge = void 0;
const vtubestudio_1 = require("vtubestudio");
const ws_1 = __importDefault(require("ws")); // You might need to run: npm install ws
const fs = __importStar(require("fs"));
class VTubeBridge {
    apiClient;
    tokenPath = 'vtube_token.txt';
    constructor() {
        // We must provide ALL required fields for the new ApiClient options
        this.apiClient = new vtubestudio_1.ApiClient({
            authTokenGetter: async () => this.getAuthToken(),
            authTokenSetter: async (token) => this.setAuthToken(token),
            pluginName: 'Aetherial-Eve-Core',
            pluginDeveloper: 'Sobu-kun',
            webSocketFactory: (url) => new ws_1.default(url),
            url: 'ws://localhost:8001',
        });
    }
    // Read the token from a file so we don't have to click "Allow" every single time
    getAuthToken() {
        if (fs.existsSync(this.tokenPath)) {
            return fs.readFileSync(this.tokenPath, 'utf8');
        }
        return '';
    }
    // Save the token when VTube Studio gives it to us
    setAuthToken(token) {
        fs.writeFileSync(this.tokenPath, token, 'utf8');
    }
    async init() {
        console.log("🌸 [System]: Reaching out to VTube Studio...");
        // This will trigger the popup in VTube Studio on the first run!
        try {
            await this.apiClient.authenticationToken({
                pluginName: 'Aetherial-Eve-Core',
                pluginDeveloper: 'Sobu-kun',
            });
            console.log("🌸[System]: Aetherial Visual Vessel successfully connected!");
        }
        catch (error) {
            console.error("🌸[System]: VTube Studio rejected the connection! Did you click Allow?", error);
        }
    }
    async triggerExpression(expressionFile) {
        try {
            await this.apiClient.expressionActivation({
                expressionFile: expressionFile,
                active: true
            });
        }
        catch (error) {
            console.error("Failed to change expression:", error);
        }
    }
}
exports.VTubeBridge = VTubeBridge;
//# sourceMappingURL=VTubeBridge.js.map