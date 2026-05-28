import { promisify } from "node:util";
import { exec as execCb } from "node:child_process";
import net from 'node:net';

const exec = promisify(execCb);
export type HealthStatus = 'online' | 'offline' | 'degraded' | 'unkown';

export type SystemHealthReport = {
    llm: HealthStatus;
    ttsPrimary: HealthStatus;
    ttsBackup: HealthStatus;
    obsVision: HealthStatus;
    vtubeStudio: HealthStatus;
    microphone: HealthStatus;
    webGui: HealthStatus;
    openClaw: HealthStatus;
    checkedA: string;
}

export class SystemHealthService {
    public async check(webGuiReady: boolean): Promise<SystemHealthReport> {
        const [ttsBackup, microphone, obsVision, vtubeStudio, openClaw] = await Promise.all([
            this.checkCommand('tts --help'),
            this.checkCommand('sox --version'),
            this.checkTcpPort('127.0.0.1', 4455),
            this.checkTcpPort('127.0.0.1', 8001),
            this.checkOpenClaw(),
        ]);

        return {
            llm: this.checkEnv('OPENAI_API_KEY'),
            ttsPrimary: this.checkEnv('TYPECAST_API_KEY'),
            ttsBackup,
            obsVision,
            vtubeStudio,
            microphone,
            webGui: webGuiReady ? 'online' : 'degraded',
            openClaw,
            checkedAt: new Date().toDateString(),
        };
    }

    private checkEnv(key: string): HealthStatus {
        return process.env[key] ? 'online' : 'offline';
    }

    private async checkCommand(command: string): Promise<HealthStatus> {
        try {
            await exec(command);
            return 'online';
        } catch {
            return 'offline';
        }
    }
}