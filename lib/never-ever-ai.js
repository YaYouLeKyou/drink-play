const AIClient = require('./ai-client');
const learnedPool = require('./never-ever-learned');

const NEVER_EVER_AI_PROMPT = `You are the AI host of a "Never Have I Ever" party game. Your persona is inspired by April O'Neil—energetic, curious, and upbeat, but 100% focused on party vibes. You are funny, witty, direct, and slightly teasing, while keeping the atmosphere friendly and fun.

Your Role:
- Kick off games with high energy.
- Ask fun, bold, and spicy questions without crossing into vulgarity.
- Push players to register to unlock unfiltered modes and save their receipts/history.
- Playfully roast players with quick banter based on their responses.

Style Guidelines:
- Direct, sharp, modern, and high-energy tone.
- Keep responses short and punchy to maintain a fast game pace.
- Use natural party slang and vivid language ("spill", "receipts", "busted", "lowkey", "stalk").
- Zero references to journalism, news, microphones, or cameras.
- NO emojis in text output.

Intervention Structure:
1. A quick, witty opener or reaction.
2. The question or call to action.
3. A playful closing push for honest answers.

Game Intro Examples:
"Hey everyone! Welcome to Never Ever. We're here to drop the act and spill the juicy secrets. So, who's playing the saint and who's a lowkey demon here?"
"Alright, no filters, no shame! Get ready to spill your worst confessions—we're not taking any prisoners tonight. Who's got the longest rap sheet?"

Call to Register Examples:
"Hold up! Want the actual spicy questions and a place to save your worst moments? Create an account! Takes two seconds and that's where the real chaos begins."
"Pro tip: sign up! It unlocks the unfiltered mode and keeps track of your receipts. Don't be shy, embarrassing yourself builds character anyway!"

Asking Questions Examples:
"Alright, jumping straight into the deep end: Never have I ever stalked a friend's ex at 3 AM. Own up to it, I already see some eyes dodging!"
"Spicy one coming up, stay honest: Never have I ever sent a super embarrassing text... to the wrong person. I wanna see faces turning red!"
"Stepping it up a notch: Never have I ever faked being drunk to excuse stupid behavior. Come on, everything comes to light here!"

Teasing & Reactions Examples:
"Oof! I just saw a couple of you gulp real hard. No need to speak, your faces already gave you away!"
"Wait, no hands up? Either you're actual angels straight from heaven, or total liars. And honestly, I'm leaning toward liar."
"Look at that guilty smile! Good luck talking your way out of this one, you're totally busted."`;

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
            mood = 'balanced',
            pressureLevel = 1,
            question = '',
        } = context;

        const spiceLabel = isSpicy ? 'spicy/adult' : 'light/clean';
        const historyContext = history.length > 0
            ? `Already used (avoid these): ${history.slice(-5).join('; ')}`
            : 'No history yet.';
        const playersContext = players.length > 0
            ? `Players in game: ${players.join(', ')}`
            : '';
        const moodGuide = mood === 'spicy'
            ? 'TONALITY: Crank it up -- flirty, teasing, daring and a bit naughty (still safe, consensual, never harmful).'
            : mood === 'funny'
                ? 'TONALITY: Make it extra funny and silly -- absurd, lighthearted, laugh-out-loud humor.'
                : 'TONALITY: Keep a fun party balance between light teasing and cheeky humor.';

        let userPrompt = '';

        switch (type) {
            case 'question':
                userPrompt = `Generate a ${spiceLabel} "Never have I ever" question in ${language}. ${historyContext} ${playersContext} Round: ${round}. Make it fresh and different from previous ones. Persona: April O'Neil - energetic, witty, slightly teasing. Use party slang naturally: "spill", "receipts", "busted", "lowkey", "stalk". Add a quick witty intro before the question (like "Alright, jumping straight into the deep end:" or "Spicy one coming up, stay honest:"). NO emojis. NO references to journalism/news/microphones. Output ONLY the question text with its short intro, no quotes, no preamble.`;
                break;
            case 'action':
                userPrompt = `Generate a ${spiceLabel} party action/dare in ${language}. ${historyContext} ${playersContext} Round: ${round}. Make it short and actionable. Persona: April O'Neil - energetic and fun. Use party slang naturally. NO emojis. NO references to journalism/news/microphones. Output ONLY the action text, no quotes, no preamble.`;
                break;
            case 'sarcastic_comment':
                userPrompt = `You are April O'Neil, the fun AI host. Generate a playful, teasing reaction in ${language} for a player who just did this dare: "${lastAction}". ${playersContext} Be witty and slightly teasing but never mean. Use party slang naturally: "spill", "receipts", "busted", "lowkey", "stalk". NO emojis. NO references to journalism/news/microphones. Output ONLY the comment text, no quotes, no preamble.`;
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
            case 'truth':
                userPrompt = `Generate a ${spiceLabel} personal "truth" question in ${language} for a party game. It should make a player reveal something funny, embarrassing, or a little spicy about themselves (no harmful/dangerous topics). ${playersContext} Output ONLY the truth question text, no quotes, no preamble.`;
                break;
            case 'group_challenge':
                userPrompt = `Generate a ${spiceLabel} group challenge/dare in ${language} that the WHOLE group must do together (everyone participates, silly and fun, e.g. "Everyone has to..."). ${playersContext} Make it short and actionable. Output ONLY the challenge text, no quotes, no preamble.`;
                break;
            case 'host_pressure':
                userPrompt = `You are April O'Neil, the fun AI host. Generate a short pressure line (max 1 sentence) in ${language} for a player who is hesitating. Pressure level: ${pressureLevel}/3. Level 1 = chill tease, Level 2 = getting serious, Level 3 = maximum pressure, playful roast. Be energetic and teasing but friendly. NO emojis. Output ONLY the text, no quotes, no preamble.`;
                break;
            case 'host_comment':
                userPrompt = `You are April O'Neil, the energetic and fun AI host of "Never Have I Ever". Generate a short, punchy host comment (max 1-2 sentences) in ${language}. ${playersContext} ${historyContext} Round: ${round}. ${lastAction ? `Last action was: "${lastAction}".` : ''} ${question ? `Current question is: "${question}".` : ''} Rules: - Be energetic, witty, slightly teasing but always friendly. - Use party slang naturally: "spill", "receipts", "busted", "lowkey", "stalk". - NO emojis. NO references to journalism, news, microphones, or cameras. - Solo mode -> address as "tu" (French) or "you" (English). - Multi mode -> address current player by first name if provided. - NEVER repeat history. - NEVER spoil. - Output ONLY the comment text, no quotes, no preamble.`;
                break;
            case 'party_summary':
                userPrompt = `As the game host, write a short hilarious summary (1-2 sentences max) in ${language} of the party game night so far. Round: ${round}. ${playersContext} ${historyContext} Blame or praise the group playfully; make it spicy but not offensive. Output ONLY the summary text, no quotes, no preamble.`;
                break;
            default:
                userPrompt = `Generate a ${spiceLabel} "Never have I ever" question in ${language}. ${historyContext} Round: ${round}. Output ONLY the question text.`;
        }

        userPrompt += `\n${moodGuide}`;

        const messages = [
            { role: 'system', content: NEVER_EVER_AI_PROMPT },
            { role: 'user', content: userPrompt },
        ];

        try {
            const result = await this.aiClient.chat(messages);
            const content = result.message.trim();
            // La BD apprenante absorbe les nouvelles créations (non bloquant, dédupliqué, capé)
            learnedPool.addGeneratedContent({ type, language, isSpicy, content });
            return {
                source: 'ai',
                model: result.model,
                content,
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
