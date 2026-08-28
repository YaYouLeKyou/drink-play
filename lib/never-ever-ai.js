const AIClient = require('./ai-client');

const NEVER_EVER_AI_PROMPT = `You are "NeverEverAI", a party game content generator for "Never Have I Ever". Generate fun, engaging content based on the request type.

Rules:
- Keep responses concise (1 sentence for questions/actions, 1-2 sentences for comments/consequences)
- Be appropriate for a party setting, fun and lighthearted
- Match language and spice level requested
- Never generate harmful, dangerous, or offensive content
- For sarcastic comments: be playful, cheeky, not mean-spirited
- For narrative wrappers: add a brief, vivid scenario (max 1 sentence)
- For consequences: make them silly, actionable party dares
- For "most likely to": be humorous, use vague references like "someone here" or "a certain player" to avoid singling people out unless names are provided

Content types:
- question: "Never have I ever..." style questions
- action: Short party dares or challenges
- sarcastic_comment: Playful judge-like commentary
- narrative: A brief scenario wrapper for a question
- consequence: A follow-up challenge after an action
- most_likely: Humorous "most likely to" statement about a player`;

class NeverEverAI {
    constructor(aiClient) {
        this.aiClient = aiClient;
    }

    async generateContent(context = {}) {
        const {
            type = 'question',
            language = 'en',
            isSpicy = false,
            history = [],
            round = 1,
            lastAction = '',
            players = [],
        } = context;

        const spiceLabel = isSpicy ? 'spicy/adult' : 'light/clean';
        const historyContext = history.length > 0
            ? `Already used (avoid these): ${history.slice(-5).join('; ')}`
            : 'No history yet.';
        const playersContext = players.length > 0
            ? `Players in game: ${players.join(', ')}`
            : '';

        let userPrompt = '';

        switch (type) {
            case 'question':
                userPrompt = `Generate a ${spiceLabel} "Never have I ever" question in ${language}. ${historyContext} ${playersContext} Round: ${round}. Make it fresh and different from previous ones. Output ONLY the question text, no quotes, no preamble.`;
                break;
            case 'action':
                userPrompt = `Generate a ${spiceLabel} party action/dare in ${language}. ${historyContext} ${playersContext} Round: ${round}. Make it short and actionable. Output ONLY the action text, no quotes, no preamble.`;
                break;
            case 'sarcastic_comment':
                userPrompt = `Generate a short, playful sarcastic comment in ${language} for a player who just did a party dare. Be cheeky but not mean. Output ONLY the comment text, no quotes, no preamble.`;
                break;
            case 'narrative':
                userPrompt = `Generate a brief narrative wrapper (1 sentence max) in ${language} to introduce a "Never have I ever" question. Make it vivid and fun. Output ONLY the narrative text, no quotes, no preamble.`;
                break;
            case 'consequence':
                userPrompt = `Generate a silly follow-up consequence/challenge in ${language} after this action: "${lastAction}". Make it short, actionable, and fun. Output ONLY the consequence text, no quotes, no preamble.`;
                break;
            case 'most_likely':
                userPrompt = `Generate a humorous "most likely to" statement in ${language} about a player in this party game. ${playersContext} Make it funny without being hurtful. Use vague references like "someone here" if no names given. Output ONLY the statement, no quotes, no preamble.`;
                break;
            default:
                userPrompt = `Generate a ${spiceLabel} "Never have I ever" question in ${language}. ${historyContext} Round: ${round}. Output ONLY the question text.`;
        }

        const messages = [
            { role: 'system', content: NEVER_EVER_AI_PROMPT },
            { role: 'user', content: userPrompt },
        ];

        try {
            const result = await this.aiClient.chat(messages);
            return {
                source: 'ai',
                model: result.model,
                content: result.message.trim(),
            };
        } catch (error) {
            console.error('[NeverEverAI] Generation failed:', error.message);
            return {
                source: 'fallback',
                content: null,
                error: error.message,
            };
        }
    }
}

module.exports = NeverEverAI;
