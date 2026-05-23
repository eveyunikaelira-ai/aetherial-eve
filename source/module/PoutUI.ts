import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let poutWindow: BrowserWindow | null = null;

function createPoutWindow(){
    poutWindow = new BrowserWindow({
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

    poutWindow.loadFile(path.join(__dirname, 'pout.html'));

    setTimeout(() => {
        if (poutWindow) {
            poutWindow.close();
        }
    }, 10000);
}

app.whenReady().then(createPoutWindow);

app.on('window-all-closed', () => {
    app.quit();
});