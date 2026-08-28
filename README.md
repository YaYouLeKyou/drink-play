# Drink & Play

A collection of mini-games to play during your parties.

## Games included:

*   **Drunkin Alien**: A game where you control a drunk alien.
*   **Gaginator**: A guessing game.
*   **Jackpot**: A slot machine game.
*   **Never Ever**: The classic "Never Have I Ever" game.

## How to play

Each game is in its own folder. To play a game, open the `index.html` file in the corresponding game folder.

## AI Assistant (DrinkBot)

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
