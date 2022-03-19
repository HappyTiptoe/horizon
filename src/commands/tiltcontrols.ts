import { Client, Message } from 'discord.js'

export function run(message: Message, args: string[], client: Client): void {
  message.channel.send("I'm using tilt controls!")
}

export const opts = {
  description: 'How does Horizon play Mario Kart 8 Deluxe?',
  usage: '%tiltcontrols',
  aliases: []
}
