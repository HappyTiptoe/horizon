import { Client, Collection, Intents, VoiceBasedChannel } from 'discord.js'
import { readdirSync } from 'fs'
import dotenv from 'dotenv'
import { joinVoiceChannel, DiscordGatewayAdapterCreator } from '@discordjs/voice'
import { Command } from './types'
import { handleCommand } from './handleCommand'
import { handleMessage } from './handleMessage'

// load env vars to process.env
dotenv.config()

async function init() {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MESSAGE_TYPING
    ]
  })

  client.commands = new Collection()

  // file-based command registration
  const commandFiles = readdirSync('./src/commands')

  commandFiles.forEach(async (file) => {
    let path

    if (process.env.NODE_ENV === 'production') {
      path = `./commands/${file.replace('.ts', '.js')}`
    } else {
      path = `./commands/${file}`
    }

    const command: Command = await import(path)
    const commandName = file.split('.')[0]

    client.commands.set(commandName, command)

    command.opts.aliases?.forEach((alias) => {
      client.commands.set(alias, command)
    })
  })

  client.on('messageCreate', async (message) => {
    // ignore messages from bots
    if (message.author.bot) return

    if (message.content.startsWith(<string>process.env.COMMAND_PREFIX)) {
      await handleCommand(client, message)
    } else {
      await handleMessage(client, message)
    }
  })

  client.on('ready', async () => {
    client.user?.setActivity('the sunrise.', { type: 'WATCHING' })
    const timestamp = new Date().toLocaleString('en-GB')
    console.log(`[${timestamp}]: Bot online.`)

    const channel = (await client.channels.fetch(
      '839220539636711455'
    )) as VoiceBasedChannel

    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
    })
  })

  client.login(process.env.DISCORD_API_KEY)

  // joinVoiceChannel({
  //   channelId:
  //   guildId: channel.guild.id
  // })
}

init()
