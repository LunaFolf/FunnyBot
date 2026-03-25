require('dotenv').config();

import {
  Client,
  Events,
  GatewayIntentBits, OmitPartialGroupDMChannel, Message
} from 'discord.js';

import rawConfig from './config.json';
const CONFIG = rawConfig as Config;

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers
  ]
})

function estimateVariants(pattern: string): number {
  let total = 1;

  // Count alternation groups like (a|b|c)
  const alternations = pattern.match(/\((?:\?:)?([^()]+)\)/g);
  if (alternations) {
    for (const group of alternations) {
      const inner = group.replace(/^\(\?:?/, '').replace(/\)$/, '');
      const options = inner.split('|').length;
      total *= options;
    }
  }

  // Count optional segments ( ? )
  const optionalMatches = pattern.match(/\?/g);
  if (optionalMatches) {
    total *= Math.pow(2, optionalMatches.length);
  }

  return total;
}

enum MessageReplies {
  SOB = "😭",
  SKULL = "💀",
  BONE = "🦴",
  SICK = "🤢",
  SUNGLASSES = "😎",
  BALLOON = "🎈",
  ROBOT = "🤖",
  CAT = "🐈",
  ROFL = "🤣",
  EYEROLL = "🙄",
  PAWS = "🐾",
  FEARFUL = "😨",
  FIRE = "🔥"
}

const phrases : Record<string, MessageReplies[]> = {
  // Overwatch
  "fika": [MessageReplies.EYEROLL],
  "jetpack cat": [MessageReplies.EYEROLL],
  "ow": [MessageReplies.ROFL],
  "overwatch": [MessageReplies.SICK],
  "over watch": [MessageReplies.SICK],
  "juno": [MessageReplies.EYEROLL],

  // Val
  "h(?:u+|eu|ue)h+": [MessageReplies.FEARFUL],

  // Cool
  "cool": [MessageReplies.SUNGLASSES],
  "swag": [MessageReplies.SUNGLASSES],
  "pogg?(?:er|ies)?s?": [MessageReplies.SUNGLASSES],
  "w": [MessageReplies.SUNGLASSES],
  "nice": [MessageReplies.SUNGLASSES],

  // hell yeah
  "hell ye(?:a+)*h*": [MessageReplies.FIRE],

  // Inflation, Big n Round (Inflation Fetish)
  "inflat(?:ed?|ing|ion)": [MessageReplies.BALLOON],
  "blimp": [MessageReplies.BALLOON],
  "helium": [MessageReplies.BALLOON],
  "sphere": [MessageReplies.BALLOON],
  "orb": [MessageReplies.BALLOON],

  // Furry, Paws :3
  "purfect": [MessageReplies.PAWS],
  "paws?": [MessageReplies.PAWS],
  "pawpads?": [MessageReplies.PAWS],
  "beans?": [MessageReplies.PAWS],

  // Furry, General
  "good (?:boy|girl|dog|pup(?:py)?|kitty)": [MessageReplies.BONE],
  "woof": [MessageReplies.BONE],
  ":3": [MessageReplies.BONE],
  "m(?:e*o*|o*e*|e*|i*a*u*|o)w": [MessageReplies.CAT],
  "nyan?": [MessageReplies.CAT],

  // Nox, Sob/Lovely
  "lovely": [MessageReplies.SOB],
  ":sob:": [MessageReplies.SOB],
  "😭": [MessageReplies.SOB],

  // Nox, Skull
  "die": [MessageReplies.SKULL],
  "dead": [MessageReplies.SKULL],
  ":skull:": [MessageReplies.SKULL],
  "💀": [MessageReplies.SKULL],

  // Clanka
  "clank(?:a|er)s?": [MessageReplies.ROBOT]
}

const phrasePatterns = Object.entries(phrases).map(([phrase, replies]) => ({
  regex: new RegExp(`(?<!\\w)${phrase}(?!\\w)`, 'i'),
  replies
}));

const estimatedPhraseCount = Object.keys(phrases)
    .map(p => estimateVariants(p))
    .reduce((a, b) => a + b, 0);

client.once(Events.ClientReady, async (readyClient: Client<true>) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)

  const servers = await readyClient.guilds.fetch();
  console.log(`Servers: ${servers.size}`)
  for (const server of servers.values()) {
    console.log(`Server: ${server.name} (${server.id})`)
  }

  if (CONFIG.BotDeclareBoot) {
    readyClient.channels.fetch('1435769682693980296').then(channel => {
      if (!channel) return;

      if (channel.isSendable()) {
        channel.send(`Bot Rebooted :3
        **${phrasePatterns.length}** phrase patterns loaded
        Estimated **≈${estimatedPhraseCount}** phrases
        **${Object.values(MessageReplies).length}** possible emoji reactions
        
        Emojis: ${Object.values(MessageReplies).join(', ')}`);
      }
    })
  }

  console.log('Done!')
})

client.on(Events.MessageCreate, async message => {
  if (message.author.id === client.user?.id) return; // Ignore self

  if (!message.content.length) return;

  logMessage(message);

  for (const pattern of phrasePatterns) {
    if (pattern.regex.test(message.content)) {
      console.log(`Phrase detected → ${pattern.replies.join(' ')}`);
      for (const emoji of pattern.replies) {
        await message.react(emoji).catch(console.error);
      }
      if (!CONFIG.AllowMultiPhraseDetection) break;
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