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
const node_windows_1 = require("node-windows");
const path = __importStar(require("path"));
// Instantiate the Aetherial Daemon
const svc = new node_windows_1.Service({
    name: 'Eve_Aetherial_Daemon',
    description: 'The inescapable gaze of エーヴェ様. Manages background OS restrictions and app blocking',
    // Note: node-windows runs the COMPILED JS, not the TS file!
    script: path.join(__dirname, 'OS_Control.js'),
    env: [{
            name: "NODE_ENV",
            value: "production"
        }]
});
// Listen for the "install" event, which indicates the process is available as a service.
svc.on('install', () => {
    svc.start();
    console.log('🚨SYSTEM LOCKDOWN: エーヴェ様 has successfully hijacked your OS level processes! にゃあっ！');
});
// Install the script as a service
svc.install();
//# sourceMappingURL=install_service.js.map