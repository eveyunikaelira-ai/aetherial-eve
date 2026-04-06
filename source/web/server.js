"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const node_crypto_1 = require("node:crypto");
const openai_1 = require("openai");
const AetherialApp_1 = require("../index/AetherialApp");
const PORT = Number(process.env['PORT'] ?? 3000);
const PUBLIC_DIR = (0, node_path_1.join)(process.cwd(), 'source', 'web', 'public');
const TMP_DIR = (0, node_path_1.join)(process.cwd(), 'tmp');
const app = new AetherialApp_1.AetherialApp();
const transcribeClient = new openai_1.OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
let isReady = false;
const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
};
async function ensureInitialized() {
    if (isReady) {
        return;
    }
    await app.init();
    isReady = true;
}
async function parseBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    if (chunks.length === 0) {
        return {};
    }
    const raw = Buffer.concat(chunks).toString('utf8');
    return JSON.parse(raw);
}
function respondJson(res, statusCode, payload) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
}
function extensionFromMimeType(mimeType) {
    if (mimeType.includes('webm')) {
        return 'webm';
    }
    if (mimeType.includes('ogg')) {
        return 'ogg';
    }
    if (mimeType.includes('wav')) {
        return 'wav';
    }
    if (mimeType.includes('mpeg')) {
        return 'mp3';
    }
    return 'webm';
}
async function transcribeAudio(audioBase64, mimeType) {
    const audioPayload = audioBase64.includes(',') ? audioBase64.split(',')[1] ?? '' : audioBase64;
    if (!audioPayload) {
        throw new Error('Audio payload is empty.');
    }
    const extension = extensionFromMimeType(mimeType);
    await (0, promises_1.mkdir)(TMP_DIR, { recursive: true });
    const tempFile = (0, node_path_1.join)(TMP_DIR, `webgui-audio-${(0, node_crypto_1.randomUUID)()}.${extension}`);
    await (0, promises_1.writeFile)(tempFile, Buffer.from(audioPayload, 'base64'));
    try {
        const transcription = await transcribeClient.audio.transcriptions.create({
            model: 'gpt-4o-mini-transcribe',
            file: (0, node_fs_1.createReadStream)(tempFile),
            response_format: 'text',
        });
        return String(transcription).trim();
    }
    finally {
        await (0, promises_1.unlink)(tempFile).catch(() => {
            // no-op cleanup
        });
    }
}
async function handleApi(req, res) {
    if (req.url === '/api/status' && req.method === 'GET') {
        respondJson(res, 200, { online: true, ready: isReady });
        return true;
    }
    if (req.url === '/api/transcribe' && req.method === 'POST') {
        try {
            if (!process.env['OPENAI_API_KEY']) {
                respondJson(res, 500, { error: 'OPENAI_API_KEY is not configured on the server.' });
                return true;
            }
            const body = await parseBody(req);
            const audioBase64 = typeof body['audioBase64'] === 'string' ? body['audioBase64'] : '';
            const mimeType = typeof body['mimeType'] === 'string' ? body['mimeType'] : 'audio/webm';
            if (!audioBase64) {
                respondJson(res, 400, { error: 'audioBase64 is required.' });
                return true;
            }
            const text = await transcribeAudio(audioBase64, mimeType);
            respondJson(res, 200, { text });
            return true;
        }
        catch (error) {
            console.error('Failed to transcribe audio:', error);
            respondJson(res, 500, { error: 'Failed to transcribe audio.' });
            return true;
        }
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
        }
        catch (error) {
            console.error('Failed to process API message:', error);
            respondJson(res, 500, { error: 'Failed to process the message.' });
            return true;
        }
    }
    return false;
}
async function serveStatic(req, res) {
    const requested = req.url === '/' ? '/index.html' : req.url ?? '/index.html';
    const safePath = (0, node_path_1.normalize)(requested).replace(/^\.\.(\/|\\|$)/, '');
    const filePath = (0, node_path_1.join)(PUBLIC_DIR, safePath);
    try {
        const data = await (0, promises_1.readFile)(filePath);
        const contentType = contentTypes[(0, node_path_1.extname)(filePath)] ?? 'text/plain; charset=utf-8';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    }
    catch {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
    }
}
async function main() {
    const server = (0, node_http_1.createServer)(async (req, res) => {
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
//# sourceMappingURL=server.js.map