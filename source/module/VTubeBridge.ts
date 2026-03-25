import { ApiClient } from "vtubestudio";
import * as WebSocket from 'ws'; // You might need to run: npm install ws

export class VTubeBridge {
    private apiClient: ApiClient;

    constructor(){
        // We connect to VTube Studio's default WebSocket port
        this.apiClient = new ApiClient({
            webSocketFactory: (url) => new WebSocket(url),
            url: 'ws://localhost:8001', 
        });
    }

    public async init(): Promise<void>{
        console.log("🌸[System]: Reaching out to VTube Studio...");

        // This authenticates our TS app with VTube Studio
        await this.apiClient.authenticationToken({
            pluginName: 'Aetherial-Eve-Core',
            pluginDeveloper: 'Sobu-kun',
        });

        console.log("🌸[System]: Aetherial Visual Vessel successfully connected!");
    }

    // We will use this later to trigger the expression you bought!
    public async triggerExpression(expressionFile: string): Promise<void>{
        try {
            await this.apiClient.expressionActivation({
                expressionFile: expressionFile,
                active: true
            });
        } catch (error){
            console.error("Failed to change expression: ", error);
        }
    }

}