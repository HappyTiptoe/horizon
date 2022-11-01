import { Client, Message, TextChannel } from 'discord.js'
import { randomChance, randomNumber } from 'tsu'
import { isHorizonBotOrAdminChannel } from '../utils'

export function handle(message: Message, client: Client): void {
  if (message.content.toLowerCase().includes('mmow')) {
    message.react('<:mmow:1029476169575301182>')
  }
}
