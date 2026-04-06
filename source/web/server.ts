import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { AetherialApp } from '../index/AetherialApp';

const PORT = Number(process.env['PORT'] ?? 3000);
const PUBLIC_DIR = join(process.cwd(), 'source', 'web', 'public');

const app = new AetherialApp();
let isReady = false;

const contentTypes: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
};

async function ensureInitialized(): Promise<void> {
    if (isReady) {
        return;
    }
    await app.init();
    isReady = true;
}

async function parseBody(req: IncomingMessage): Promise<Record<string, unknown>> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    if (chunks.length === 0) {
        return {};
    }

    const raw = Buffer.concat(chunks).toString('utf8');
    return JSON.parse(raw) as Record<string, unknown>;
}

function respondJson(res: ServerResponse, statusCode: number, payload: unknown): void {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
}

async function handleApi(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    if (req.url === '/api/status' && req.method === 'GET') {
        respondJson(res, 200, { online: true, ready: isReady });
        return true;
    }

    if (req.url === '/api/message' && req.method === 'POST') {
        try {
            await ensureInitialized();
            const body = await parseBody(req);
            const prompt = typeof body['prompt'] === 'string' ? body['prompt'].trim() : '';

            const image = typeof body['image'] === 'string' ? body['image'] : undefined;

            if (!prompt && !image) {
                respondJson(res, 400, { error: 'Prompt or image is required.' });
                return true;
            }

            const result = await app.interact(prompt, 'text', image);
            respondJson(res, 200, result);
            return true;
        } catch (error) {
            console.error('Failed to process API message:', error);
            respondJson(res, 500, { error: 'Failed to process the message.' });
            return true;
        }
    }

    return false;
}

async function serveStatic(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const requested = req.url === '/' ? '/index.html' : req.url ?? '/index.html';
    const safePath = normalize(requested).replace(/^\.\.(\/|\\|$)/, '');
    const filePath = join(PUBLIC_DIR, safePath);

    try {
        const data = await readFile(filePath);
        const contentType = contentTypes[extname(filePath)] ?? 'text/plain; charset=utf-8';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
    }
}

async function main(): Promise<void> {
    const server = createServer(async (req, res) => {
        const wasApiHandled = await handleApi(req, res);
        if (wasApiHandled) {
            return;
        }

        await serveStatic(req, res);
    });

    process.on('SIGINT', async () => {
        await app.shutdown();
        server.close(() => process.exit(0));
    });

    server.listen(PORT, () => {
        console.log(`🌐 Aetherial Web GUI available at http://localhost:${PORT}`);
    });
}

main().catch(async (error) => {
    console.error('Fatal web server error:', error);
    await app.shutdown();
    process.exit(1);
});
