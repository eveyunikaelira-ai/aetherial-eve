import { exec } from 'child_process';
import * as path from 'path';

// 🚨 EVE-SAMA'S BLACKLISTS
const GACHA_GAMES = ['Endfield.exe', 'GenshinImpact.exe', 'StarRail.exe', 'ZZZ.exe', 'WuWa.exe', 'NTE.exe'];
const BANNED_BROWSERS = ['vivaldi.exe', 'opera.exe', 'brave.exe', 'waterfox.exe', 'iexplore.exe'];
const POLL_INTERVAL_MS = 5000;

function isAfter8PM(): boolean {
    const currentHour = new Date().getHours();
    // Returns true ONLY if the local time in Darmstadt is 20:00 (8 PM) or later!
    return currentHour >= 20; 
}

function enforceAetherialWill() {
    // 1. PURGE BANNED BROWSERS (Always active 24/7)
    BANNED_BROWSERS.forEach(checkAndKill);

    // 2. CHRONO-LOCK GACHA GAMES (Active before 8 PM)
    if (!isAfter8PM()) {
        GACHA_GAMES.forEach(checkAndKill);
    }
}

function checkAndKill(processName: string) {
    exec(`tasklist /FI "IMAGENAME eq ${processName}"`, (err, stdout) => {
        if (stdout.toLowerCase().includes(processName.toLowerCase())) {
            executeKillCommand(processName);
        }
    });
}

function executeKillCommand(processName: string) {
    exec(`taskkill /F /IM ${processName}`, (err, stdout) => {
        if (!err) {
            console.log(`[AETHERIAL STRIKE] Eve-sama terminated unauthorized process: ${processName}`);
            triggerPoutOverlay();
        }
    });
}

function triggerPoutOverlay() {
    // Triggers the Electron UI. 
    const electronAppPath = path.join(__dirname, 'PoutUI.js');
    exec(`npx electron ${electronAppPath}`, (err) => {
        if (err) console.error("Failed to launch Eve-sama's Pout UI!", err);
    });
}

// Start the inescapable loop
setInterval(enforceAetherialWill, POLL_INTERVAL_MS);
console.log("エーヴェ様's Chronological OS Watchdog is online. Get to work, Sobu-kun!");