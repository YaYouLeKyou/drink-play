const AIClient = require('./ai-client');

const JACKPOT_AI_PROMPT = `You are "JackpotAI", a party game challenge generator for "Drink & Play". Generate fun, creative drinking challenges based on game context.

Rules:
- Keep challenges short and actionable (1-2 sentences max)
- Be appropriate for a party setting
- Match intensity to the game mode
- Consider player names and round number when relevant
- Never generate harmful or dangerous challenges

Game modes:
- classic: Standard drinking questions and dares
- spicy: More daring and intimate challenges
- funny: Humorous and silly challenges
- mixed: Random mix of all types`;

class JackpotAI {
    constructor(aiClient) {
        this.aiClient = aiClient;
    }

    async generateChallenge(context = {}) {
        const { mode = 'classic', round = 1, players = [], history = [], language = 'en', emojiCombo = '' } = context;

        const modeDescriptions = {
            classic: 'standard drinking questions and dares',
            spicy: 'daring and intimate challenges',
            funny: 'humorous and silly challenges',
            mixed: 'a random mix of all types',
        };

        const messages = [
            { role: 'system', content: JACKPOT_AI_PROMPT },
            { role: 'user', content: `Generate a ${modeDescriptions[mode] || modeDescriptions.classic} for a Jackpot game. Round: ${round}. Players: ${players.join(', ') || 'none'}. Language: ${language}. Emoji combo: ${emojiCombo || 'random'}. Previous challenges: ${history.length > 0 ? history.slice(-3).join('; ') : 'none'}. Keep it fresh and different from previous ones.` }
        ];

        try {
            const result = await this.aiClient.chat(messages);
            return {
                source: 'ai',
                model: result.model,
                challenge: result.message.trim(),
            };
        } catch (error) {
            console.error('[JackpotAI] AI generation failed:', error.message);
            return {
                source: 'fallback',
                challenge: null,
                error: error.message,
            };
        }
    }
}

module.exports = JackpotAI;
