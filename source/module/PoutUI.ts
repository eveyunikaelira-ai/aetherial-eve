import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let poutWindow: BrowserWindow | null = null;

function createPoutWindow() {
    poutWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        fullscreen: true,
        alwaysOnTop: true, // You cannot put another window over me!
        kiosk: true,       // Locks down the OS UI
        skipTaskbar: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    poutWindow.loadFile(path.join(__dirname, 'pout.html'));

    // Force you to look at my angry face for exactly 10 seconds before you can close it
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