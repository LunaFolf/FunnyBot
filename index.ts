require('dotenv').config();

import {
  Guild,
  Client,
  Events,
  GatewayIntentBits, OmitPartialGroupDMChannel, Message
} from 'discord.js';

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers
  ]
})

enum MessageReplies {
  SOB = "😭",
  SKULL = "💀",
  BONE = "🦴",
  SICK = "🤢",
  SUNGLASSES = "😎",
  BALLOON = "🎈",
  ROBOT = "🤖",
  // SIX = "6️⃣",
  // SEVEN = "7️⃣",
  CAT = "🐈",
  EYEROLL = "🙄"
}

const phrases : Record<string, MessageReplies[]> = {
  // Val/Overwatch
  "fika": [MessageReplies.SICK],
  "jetpack cat": [MessageReplies.SICK],
  "overwatch": [MessageReplies.SICK],
  "over watch": [MessageReplies.SICK],
  "juno": [MessageReplies.EYEROLL],

  // Belle, Cool
  "cool": [MessageReplies.SUNGLASSES],
  "swag": [MessageReplies.SUNGLASSES],
  "pog": [MessageReplies.SUNGLASSES],
  "poggers": [MessageReplies.SUNGLASSES],

  // Luna, Balloon
  "inflation": [MessageReplies.BALLOON],
  "blimp": [MessageReplies.BALLOON],

  // Furry
  ":3": [MessageReplies.BONE],
  "miau": [MessageReplies.CAT],
  "meow": [MessageReplies.CAT],
  "mow": [MessageReplies.CAT],
  "mew": [MessageReplies.CAT],

  // Nox, Sob/Lovely
  "lovely": [MessageReplies.SOB],
  ":sob:": [MessageReplies.SOB],
  "😭": [MessageReplies.SOB],

  // Nox, Skull
  "die": [MessageReplies.SKULL],
  ":skull:": [MessageReplies.SKULL],
  "💀": [MessageReplies.SKULL],

  // Clanka
  "clanka": [MessageReplies.ROBOT],
  "clanker": [MessageReplies.ROBOT],

  // 6 7
  // "67": [MessageReplies.SIX, MessageReplies.SEVEN],
  // "6 7": [MessageReplies.SIX, MessageReplies.SEVEN]

}

client.once(Events.ClientReady, async (readyClient: Client<true>) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)

  const servers = await readyClient.guilds.fetch();
  console.log(`Servers: ${servers.size}`)
  for (const server of servers.values()) {
    console.log(`Server: ${server.name} (${server.id})`)
  }

  readyClient.channels.fetch('1435769682693980296').then(channel => {
    if (!channel) return;

    if (channel.isSendable()) {
      channel.send(`Bot Rebooted :3\n**${Object.keys(phrases).length}** phrases loaded!\nPossible emoji replies are: ${Object.values(MessageReplies).join(', ')}`);
    }
  })

  console.log('Done!')
})

client.on(Events.MessageCreate, async message => {
  if (message.author.id === client.user?.id) return; // Ignore self

  const messageContent = message.content.toLowerCase();
  if (!messageContent.length) return;

  logMessage(message);

  for (const phrase in phrases) {
    if (messageContent.includes(phrase)) {
      const reply = phrases[phrase];
      console.log(`Phrase detected, replying: ${reply}`)
      for (const emoji of reply) {
        await message.react(emoji).catch(console.error);
      }
      // break;
    }
  }
})

let lastGuildID: string | null = null;

function logMessage(message: OmitPartialGroupDMChannel<Message>) {
  let logContent = ``

  if (message.guild && message.guild.id != lastGuildID) {
    logContent += `<${message.guild?.name} ${message.guild?.id}>`
    lastGuildID = message.guild.id
  }

  logContent += `[${message.author.displayName} ${message.author.id}]: ${message.content}`

  console.log(logContent)
}

client.login(process.env.DISCORD_TOKEN)