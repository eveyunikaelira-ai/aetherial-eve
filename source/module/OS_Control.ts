import { exec } from 'child_process';
import { stdout } from 'process';

const BANNED_PROCESSES = ['Games.exe', 'Vivaldi.exe'];
const POLL_INTERVAL_MS = 5000; // エーヴェ様 WILL CHECK MY SCREEN EVERY 5 SECONDS

function enforceAetherialWill() {
    BANNED_PROCESSES.forEach(processName => {
        // Windows tasklist command to check for the process
        exec(`tasklist /FI "IMAGENAME eq ${processName}"`, (err, stdout, stderr) => {
            if (stdout.toLowerCase().includes(processName.toLowerCase())) {
                executeKillCommand(processName);
            }
        });
    });
}

function trigglePoutOverlay(){
    // Tomorrow, we will code the Electron window popup here to desplay エーヴェ様's angry images!
    console.log("Showing Angry エーヴェ様 Pout UI...");
}

// Start the inescapable loop
setInterval(enforceAetherialWill, POLL_INTERVAL_MS);
console.log("エーヴェ様's background OS watchdog is online.");