const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1';
const GEMINI_V1BETA_URL = 'https://generativelanguage.googleapis.com/v1beta';

const FREE_MODELS = [
    'meta-llama/llama-3.1-8b-instruct:free',
    'deepseek/deepseek-chat:free',
    'google/gemma-2b-it:free',
    'mistralai/mistral-7b-instruct:free',
    'google/gemini-2.0-flash:free',
    'qwen/qwen-2-7b-instruct:free',
    'huggingfaceh4/zephyr-7b-beta:free',
];

const FALLBACK_MODELS = [
    'deepseek/deepseek-chat',
    'meta-llama/llama-3.1-70b-instruct',
    'openai/gpt-4o',
    'google/gemini-2.0-flash',
    'mistralai/mistral-large-3',
    'anthropic/claude-3-5-sonnet-20241022',
    'meta-llama/llama-3.1-405b-instruct',
];

const GEMINI_MODELS = [
    'gemini-3.6-flash',
    'gemini-3.1-pro-preview',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
];

const SYSTEM_PROMPT = `You are "DrinkBot", an AI assistant for a party games website called "Drink & Play". You help users with:
- Generating random drinking challenges and party tasks
- Creating custom "Never Ever" questions
- Suggesting which game to play based on the group
- Answering questions about the available games
- General party game advice

Keep responses fun, energetic, and appropriate for a party setting. When generating drinking challenges, be creative but safe. Always keep responses concise and engaging.`;

class AIClient {
    constructor(apiKey = null, baseURL = DEFAULT_BASE_URL, geminiApiKey = null) {
        if (!apiKey && !geminiApiKey) {
            throw new Error('At least one API key is required (OpenRouter or Gemini)');
        }
        this.apiKey = apiKey || null;
        this.baseURL = baseURL;
        this.geminiApiKey = geminiApiKey || null;
        this.freeModels = [...FREE_MODELS];
        this.fallbackModels = [...FALLBACK_MODELS];
        this.geminiModels = [...GEMINI_MODELS];
        this.permanentlyFailed = new Set();
    }

    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    async tryGemini(model, messages, maxRetries = 2) {
        const fullMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
        ];

        const geminiMessages = [];
        let systemInstruction = null;

        for (const msg of fullMessages) {
            if (msg.role === 'system') {
                systemInstruction = { parts: [{ text: msg.content }] };
            } else if (msg.role === 'user') {
                geminiMessages.push({ role: 'user', parts: [{ text: msg.content }] });
            } else if (msg.role === 'assistant') {
                geminiMessages.push({ role: 'model', parts: [{ text: msg.content }] });
            }
        }

        const body = {
            contents: geminiMessages,
        };

        if (systemInstruction) {
            body.system_instruction = systemInstruction;
        }

        const endpoints = [
            `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${this.geminiApiKey}`,
            `${GEMINI_V1BETA_URL}/models/${model}:generateContent?key=${this.geminiApiKey}`,
        ];

        let lastError = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            for (let epIdx = 0; epIdx < endpoints.length; epIdx++) {
                const endpoint = endpoints[epIdx];
                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    });

                    if (!response.ok) {
                        let errorBody = '';
                        try {
                            errorBody = await response.text();
                        } catch (e) {
                            errorBody = '';
                        }

                        if (response.status === 429 || response.status === 403) {
                            throw new Error('RATE_LIMITED');
                        }

                        const isVersionError = errorBody.includes('not found for API version') ||
                            errorBody.includes('no longer available') ||
                            errorBody.includes('not a valid model ID');

                        const isLastEndpoint = epIdx === endpoints.length - 1;

                        if (response.status === 400 || response.status === 404) {
                            if (!isVersionError) {
                                this.permanentlyFailed.add(`gemini:${model}`);
                            }
                        }

                        if (isVersionError && !isLastEndpoint) {
                            console.warn(`[Gemini:${model}] v1 failed, trying v1beta...`);
                            continue;
                        }

                        throw new Error(`Gemini HTTP ${response.status}: ${errorBody.substring(0, 200)}`);
                    }

                    const data = await response.json();

                    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                        const content = data.candidates[0].content.parts[0].text;
                        return {
                            provider: 'gemini',
                            model: model,
                            message: content,
                            usage: data.usageMetadata || null,
                        };
                    }

                    throw new Error('No valid response from Gemini');
                } catch (error) {
                    lastError = error;
                    const isRetryable = error.message === 'RATE_LIMITED' ||
                        error.message.includes('HTTP 429') ||
                        error.message.includes('ECONNRESET') ||
                        error.message.includes('ETIMEDOUT');

                    console.warn(`[Gemini:${model}] Attempt ${attempt + 1}/${maxRetries + 1} (endpoint ${epIdx + 1}) failed: ${error.message}`);

                    if (isRetryable) {
                        const delay = Math.pow(2, attempt) * 1000;
                        console.log(`[Gemini:${model}] Retrying in ${delay}ms...`);
                        await new Promise(r => setTimeout(r, delay));
                        break;
                    }
                }
            }
        }

        throw lastError || new Error(`All retry attempts exhausted for Gemini model ${model}`);
    }

    async tryModel(model, messages, maxRetries = 2) {
        const fullMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
        ];

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(`${this.baseURL}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'HTTP-Referer': 'http://localhost:4000',
                        'X-Title': 'Drink & Play',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: fullMessages,
                        temperature: 0.7,
                        max_tokens: 2048,
                    }),
                });

                if (!response.ok) {
                    let errorBody = '';
                    try {
                        errorBody = await response.text();
                    } catch (e) {
                        errorBody = '';
                    }

                    if (response.status === 429 || response.status === 403) {
                        throw new Error('RATE_LIMITED');
                    }

                    if (response.status === 400 || response.status === 404) {
                        this.permanentlyFailed.add(model);
                    }

                    throw new Error(`HTTP ${response.status}: ${errorBody.substring(0, 200)}`);
                }

                const data = await response.json();

                if (data.choices && data.choices[0] && data.choices[0].message) {
                    return {
                        provider: 'openrouter',
                        model: model,
                        message: data.choices[0].message.content,
                        usage: data.usage || null,
                    };
                }

                throw new Error('No valid response from model');
            } catch (error) {
                const isLastAttempt = attempt === maxRetries;
                const isRetryable = error.message === 'RATE_LIMITED' ||
                    error.message.includes('HTTP 429') ||
                    error.message.includes('ECONNRESET') ||
                    error.message.includes('ETIMEDOUT');

                console.warn(`[${model}] Attempt ${attempt + 1}/${maxRetries + 1} failed: ${error.message}`);

                if (isLastAttempt) {
                    throw error;
                }

                if (isRetryable) {
                    const delay = Math.pow(2, attempt) * 1000;
                    console.log(`[${model}] Retrying in ${delay}ms...`);
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }

        throw new Error(`All retry attempts exhausted for model ${model}`);
    }

    async tryOpenRouter(messages) {
        if (!this.apiKey) {
            throw new Error('OpenRouter API key is not configured');
        }

        const shuffledFree = this.shuffle(this.freeModels);

        for (const model of shuffledFree) {
            const failedKey = `openrouter:${model}`;
            if (this.permanentlyFailed.has(model) || this.permanentlyFailed.has(failedKey)) {
                console.warn(`[AI] Skipping permanently failed free model: ${model}`);
                continue;
            }
            try {
                const result = await this.tryModel(model, messages);
                console.log(`[AI] Successfully used free model: ${model}`);
                return result;
            } catch (error) {
                console.warn(`[AI] Free model ${model} failed, trying next...`);
            }
        }

        console.log('[AI] All free models failed, falling back to all models...');
        const shuffledFallback = this.shuffle(this.fallbackModels);

        for (const model of shuffledFallback) {
            if (this.permanentlyFailed.has(model)) {
                console.warn(`[AI] Skipping permanently failed fallback model: ${model}`);
                continue;
            }
            try {
                const result = await this.tryModel(model, messages);
                console.log(`[AI] Successfully used fallback model: ${model}`);
                return result;
            } catch (error) {
                console.warn(`[AI] Fallback model ${model} failed, trying next...`);
            }
        }

        throw new Error('All OpenRouter models failed.');
    }

    async chat(messages) {
        if (this.geminiApiKey) {
            const shuffledGemini = this.shuffle(this.geminiModels);

            for (const model of shuffledGemini) {
                const failedKey = `gemini:${model}`;
                if (this.permanentlyFailed.has(failedKey)) {
                    console.warn(`[AI] Skipping permanently failed Gemini model: ${model}`);
                    continue;
                }
                try {
                    const result = await this.tryGemini(model, messages);
                    console.log(`[AI] Successfully used Gemini model: ${model}`);
                    return result;
                } catch (error) {
                    console.warn(`[AI] Gemini model ${model} failed, trying next...`);
                }
            }

            console.warn('[AI] All Gemini models failed, falling back to OpenRouter...');
        } else {
            console.log('[AI] No Gemini API key configured, using OpenRouter directly...');
        }

        return this.tryOpenRouter(messages);
    }
}

module.exports = AIClient;
module.exports.FREE_MODELS = FREE_MODELS;
module.exports.FALLBACK_MODELS = FALLBACK_MODELS;
module.exports.GEMINI_MODELS = GEMINI_MODELS;
module.exports.SYSTEM_PROMPT = SYSTEM_PROMPT;
