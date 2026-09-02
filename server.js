const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const AIClient = require('./lib/ai-client');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const rootDir = __dirname;

if (!process.env.OPENROUTER_API_KEY && !process.env.GEMINI_API_KEY) {
    // Don't exit: on Vercel, missing env vars must not kill the function.
    console.error('WARNING: No AI API keys configured. Set OPENROUTER_API_KEY or GEMINI_API_KEY (local .env or Vercel env vars).');
}

if (!process.env.OPENROUTER_API_KEY) {
    console.warn('Warning: OPENROUTER_API_KEY not set - OpenRouter will be unavailable as fallback');
}

if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY not set - Gemini will be unavailable as primary provider');
}

const aiClient = new AIClient(
    process.env.OPENROUTER_API_KEY,
    process.env.OPENROUTER_BASE_URL,
    process.env.GEMINI_API_KEY
);

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

const BLOCKED_PATHS = [
    '/.env',
    '/.gitignore',
    '/package.json',
    '/package-lock.json',
    '/server.js',
    '/lib',
    '/.vscode',
];

app.use((req, res, next) => {
    for (const blocked of BLOCKED_PATHS) {
        if (req.path === blocked || req.path.startsWith(blocked + '/')) {
            return res.status(404).send('Not found');
        }
    }
    next();
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages array is required and must not be empty' });
        }

        const result = await aiClient.chat(messages);

        res.json({
            model: result.model,
            message: result.message,
            usage: result.usage,
        });
    } catch (error) {
        console.error('[API] Chat error:', error.message);
        res.status(500).json({
            error: 'All AI models failed. Please try again later.',
            details: error.message,
        });
    }
});

app.get('/api/models', (req, res) => {
    res.json({
        geminiModels: AIClient.GEMINI_MODELS || [],
        freeModels: AIClient.FREE_MODELS || [],
        fallbackModels: AIClient.FALLBACK_MODELS || [],
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/jackpot/challenge', async (req, res) => {
    try {
        const { mode = 'classic', round = 1, players = [], history = [], language = 'en', emojiCombo = '' } = req.body || {};

        const JackpotAI = require('./lib/jackpot-ai');
        const jackpotAI = new JackpotAI(aiClient);

        const result = await jackpotAI.generateChallenge({
            mode,
            round,
            players: Array.isArray(players) ? players : [],
            history: Array.isArray(history) ? history : [],
            language,
            emojiCombo,
        });

        if (result.source === 'ai' && result.challenge) {
            return res.json({
                source: 'ai',
                model: result.model,
                challenge: result.challenge,
            });
        }

        res.status(500).json({
            source: 'fallback',
            error: result.error || 'AI challenge generation failed',
            message: 'AI unavailable. Use local rules for this round.',
        });
    } catch (error) {
        console.error('[API] Jackpot challenge error:', error.message);
        res.status(500).json({
            source: 'error',
            error: 'Failed to generate challenge',
            details: error.message,
        });
    }
});

app.post('/api/never-ever/generate', async (req, res) => {
    try {
        const {
            type = 'question',
            language = 'en',
            isSpicy = false,
            history = [],
            round = 1,
            lastAction = '',
            players = [],
            mood = 'balanced',
        } = req.body || {};

        const NeverEverAI = require('./lib/never-ever-ai');
        const neverEverAI = new NeverEverAI(aiClient);

        const result = await neverEverAI.generateContent({
            type,
            language,
            isSpicy,
            history: Array.isArray(history) ? history : [],
            round,
            lastAction,
            players: Array.isArray(players) ? players : [],
            mood,
        });

        if (result.source === 'ai' && result.content) {
            return res.json({
                source: 'ai',
                model: result.model,
                content: result.content,
            });
        }

        res.status(500).json({
            source: 'fallback',
            error: result.error || 'AI generation failed',
            message: 'AI unavailable. Use local content for this request.',
        });
    } catch (error) {
        console.error('[API] Never Ever generate error:', error.message);
        res.status(500).json({
            source: 'error',
            error: 'Failed to generate content',
            details: error.message,
        });
    }
});

app.post('/api/true-detective/master-script', async (req, res) => {
    try {
        const { theme = 'noir', language = 'en' } = req.body || {};

        const { TrueDetectiveAI } = require('./lib/true-detective-ai');
        const tdAI = new TrueDetectiveAI(aiClient);

        const result = await tdAI.generateMasterScript({ theme, language });

        if (result.source === 'ai' && result.script) {
            return res.json({
                source: 'ai',
                model: result.model,
                script: result.script,
            });
        }

        res.status(500).json({
            source: 'fallback',
            error: result.error || 'AI script generation failed',
            message: 'AI unavailable. Please try again later.',
        });
    } catch (error) {
        console.error('[API] True Detective master-script error:', error.message);
        res.status(500).json({
            source: 'error',
            error: 'Failed to generate investigation',
            details: error.message,
        });
    }
});

app.post('/api/true-detective/advance', async (req, res) => {
    try {
        const { state = {}, language = 'en' } = req.body || {};

        const { TrueDetectiveAI } = require('./lib/true-detective-ai');
        const tdAI = new TrueDetectiveAI(aiClient);

        const result = await tdAI.advanceStory({ ...state, language });

        if (result.source === 'ai' && result.data) {
            return res.json({
                source: 'ai',
                model: result.model,
                data: result.data,
            });
        }

        res.status(500).json({
            source: 'fallback',
            error: result.error || 'AI advance failed',
            message: 'AI unavailable. Please try again later.',
        });
    } catch (error) {
        console.error('[API] True Detective advance error:', error.message);
        res.status(500).json({
            source: 'error',
            error: 'Failed to advance story',
            details: error.message,
        });
    }
});

app.post('/api/true-detective/npc-response', async (req, res) => {
    try {
        const { state = {}, npcId, playerText = '' } = req.body || {};

        if (!npcId) {
            return res.status(400).json({ error: 'npcId is required' });
        }

        const { TrueDetectiveAI } = require('./lib/true-detective-ai');
        const tdAI = new TrueDetectiveAI(aiClient);

        const result = await tdAI.generateNPCResponse(state, npcId, playerText);

        if (result.source === 'ai' && result.data) {
            return res.json({
                source: 'ai',
                model: result.model,
                data: result.data,
            });
        }

        res.status(500).json({
            source: 'fallback',
            error: result.error || 'AI NPC response failed',
            message: 'AI unavailable. Please try again later.',
        });
    } catch (error) {
        console.error('[API] True Detective npc-response error:', error.message);
        res.status(500).json({
            source: 'error',
            error: 'Failed to get NPC response',
            details: error.message,
        });
    }
});

app.use(express.static(rootDir, {
    dotfiles: 'deny',
}));

app.use((req, res) => {
    res.status(404).send('Page not found. <a href="/">Go home</a>');
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`[Server] Drink & Play server running at http://localhost:${PORT}`);
        console.log(`[Server] AI assistant available at /api/chat`);
    });
}
