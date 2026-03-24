# Discord Phrase Reaction Bot 🤖

A lightweight **Discord bot written in TypeScript using `discord.js`** that automatically reacts to messages containing specific phrases with predefined emojis.

The bot listens to all messages in servers it’s part of and reacts whenever a configured keyword or phrase is detected.

---

## ✨ Features

- 🔎 **Phrase Detection** – Scans messages for configured keywords.
- 😀 **Emoji Reactions** – Automatically reacts with one or more emojis.
- 📜 **Console Logging** – Logs messages and servers for debugging.
- 🧩 **Easy Customization** – Add or remove phrases in a simple object map.
- 🚀 **Startup Status Message** – Sends a reboot message when the bot starts.

---

## 📦 Tech Stack

- **Node.js**
- **TypeScript**
- **discord.js**
- **dotenv**

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/discord-phrase-reaction-bot.git
cd discord-phrase-reaction-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file in the root directory:

```
DISCORD_TOKEN=your_bot_token_here
```

You can get a bot token from the **Discord Developer Portal**.

---

### 4. Run the bot

If using TypeScript directly:

```bash
npm run start
```

---

## 🤖 Bot Behavior

When a user sends a message containing one of the configured phrases, the bot reacts with the corresponding emoji(s).

Example:

| Message | Reaction |
|-------|--------|
| `poggers` | 😎 |
| `overwatch` | 🤢 |
| `miau` | 🐈 |
| `die` | 💀 |

Multiple reactions can trigger if multiple phrases are detected.

---

## 🧠 Phrase Configuration

All phrase triggers are defined in the `phrases` object:

```ts
const phrases: Record<string, MessageReplies[]> = {
  "pog": [MessageReplies.SUNGLASSES],
  "miau": [MessageReplies.CAT],
  "die": [MessageReplies.SKULL]
}
```

### How it works

- The bot converts message content to lowercase.
- It checks if the message **includes any configured phrase**.
- If matched, it reacts with the mapped emoji(s).

---

## 😀 Available Emoji Reactions

Defined in the `MessageReplies` enum:

```ts
enum MessageReplies {
  SOB = "😭",
  SKULL = "💀",
  BONE = "🦴",
  SICK = "🤢",
  SUNGLASSES = "😎",
  BALLOON = "🎈",
  ROBOT = "🤖",
  CAT = "🐈",
  EYEROLL = "🙄"
}
```

You can easily add more.

---

## 📊 Logging

The bot logs:

- Server names and IDs on startup
- Incoming messages
- Triggered phrase reactions

Example console output:

```
<ServerName 1234567890>[User 0987654321]: poggers
Phrase detected, replying: 😎
```

---

## ⚠️ Notes

- The bot currently checks phrases using **`String.includes()`**, so triggers may occur inside longer words.
- The `"67"` trigger was disabled due to excessive false positives.
- Multi-trigger reactions are currently enabled.

---

## 🛠 Possible Improvements

- Regex phrase matching
- Per-server phrase configs
- Cooldowns for reactions
- Slash command configuration
- Phrase management commands

---

## 📜 License

MIT License – feel free to modify and use this project.