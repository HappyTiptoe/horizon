import { Client, Message } from 'discord.js'
import { k } from '../assets/phrases.json'

export function handle(message: Message, client: Client): void {
  if (message.content.replaceAll(/[\s*_]+/g, '').toLowerCase() === 'k') {
    message.reply(k)
  }
}
