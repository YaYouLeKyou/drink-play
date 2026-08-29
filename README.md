# Drink & Play

A collection of mini-games to play during your parties, now enhanced with AI-powered features!

## Games included:

*   **Drunkin Alien**: A game where you control a drunk alien. Get the highest score to prove you're the least drunk!
*   **Gaginator**: A guessing game where you're the sorcerer's puppet - do it or drink!
*   **Jackpot**: A slot machine game with AI-powered challenges and player setup.
*   **Never Ever**: The classic "Never Have I Ever" game, now with AI host, player customization, and spicy content!

## How to play

Each game is in its own folder. To play a game, open the `index.html` file in the corresponding game folder.

## 🤖 AI Assistant (DrinkBot)

This project includes an AI-powered party assistant powered by [Gemini](https://gemini.google.com/) and [OpenRouter](https://openrouter.ai/).

### Setup

1. Create a `.env` file in the project root:
   ```
   # Gemini (primary provider)
   GEMINI_API_KEY=your-gemini-api-key

   # OpenRouter (fallback provider)
   OPENROUTER_API_KEY=your-openrouter-api-key
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

   PORT=4000
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:4000` in your browser.

### How it works

- The assistant tries **Gemini** models first (primary provider).
- If all Gemini models fail, it **falls back to OpenRouter** (free models first, then all available models).
- Click the robot button (bottom-right) on the main page to open the chat.

## 🎮 Never Ever - Enhanced with AI

Never Ever now features:

*   **AI Host (April O'Neil persona)**: Funny, witty, and slightly teasing commentary
*   **Custom players**: Add player names via prompts at game start - AI roasts/names players specifically
*   **New content types**:
    *   `truth` - Personal truth questions (18% chance)
    *   `group_challenge` - Group challenges everyone does together (10% chance)
    *   `party_summary` - Humorous summary at game end (12% chance)
*   **Anti-repetition**: Learns from previous sessions via `localStorage` - never repeats questions
*   **Adaptive spice**: AI chance increased to 35%, adjustable based on group mood
*   **Sarcastic comments**: AI comments on specific actions, not generic reactions
*   **Host commentator**: AI game master/commentator with text-to-speech via Web Speech API
*   **Mute toggle**: Button to silence the AI commentator

## 🎰 Jackpot - AI-Powered

*   Player setup with name input
*   Game modes: Classic, Spicy, Funny, Mixed
*   AI-generated challenges per slot combination
*   Language support: English, French, Spanish, Italian
*   Timer and round tracking
*   "Too Hot" fallback for intense challenges

## 📝 Player Customization

All games support:
*   Player name entry and persistence via `localStorage`
*   Solo or multiplayer mode selection
*   Language switching (EN/FR/ES/IT)

## 🤖 DrinkBot Chat Interface

Interact with the AI assistant from the main hub:
*   Generate Never Ever questions
*   Get Jackpot challenges
*   Get game recommendations
*   Ask for rules and tips
