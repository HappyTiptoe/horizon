import { Client, Message } from 'discord.js'
import { readdirSync } from 'fs'
import { MessageHandler } from './types'

export async function handleMessage(client: Client, message: Message): Promise<void> {
  // file-based message handlers
  const messageHandlers = readdirSync('./src/messageHandlers')

  messageHandlers.forEach(async (file) => {
    let path

    if (process.env.NODE_ENV === 'production') {
      path = `./messageHandlers/${file.replace('.ts', '.js')}`
    } else {
      path = `./messageHandlers/${file}`
    }

    const messageHandler: MessageHandler = await import(path)
    messageHandler.handle(message, client)
  })
}
