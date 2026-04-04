"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const AetherialApp_1 = require("../index/AetherialApp");
const PORT = Number(process.env['PORT'] ?? 3000);
const PUBLIC_DIR = (0, node_path_1.join)(process.cwd(), 'source', 'web', 'public');
const app = new AetherialApp_1.AetherialApp();
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
async function handleApi(req, res) {
    if (req.url === '/api/status' && req.method === 'GET') {
        respondJson(res, 200, { online: true, ready: isReady });
        return true;
    }
    if (req.url === '/api/message' && req.method === 'POST') {
        try {
            await ensureInitialized();
            const body = await parseBody(req);
            const prompt = typeof body['prompt'] === 'string' ? body['prompt'].trim() : '';
            if (!prompt) {
                respondJson(res, 400, { error: 'Prompt is required.' });
                return true;
            }
            const result = await app.interact(prompt, 'text');
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