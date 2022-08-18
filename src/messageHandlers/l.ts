import { Client, Message } from 'discord.js'
import { randomChance } from 'tsu'
import { l } from '../assets/phrases.json'

export function handle(message: Message, client: Client): void {
  if (message.content.replaceAll(/[\s*_]+/g, '').toLowerCase() === 'l') {
    if (randomChance(10)) {
      message.reply(l)
    }
  }
}
