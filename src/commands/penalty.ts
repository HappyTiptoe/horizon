import { Client, Message } from 'discord.js'
import { isBlank, max, randomNumber } from 'tsu'
import { Color } from '../types'
import { send } from '../utils'

function rollDice(type: 'unit' | 'ten' | 'hundred') {
  if (type === 'unit') {
    return randomNumber(0, 10)
  } else if (type === 'ten') {
    return randomNumber(0, 10) * 10
  } else {
    return randomNumber(1, 101)
  }
}

export function run(message: Message, args: string[], client: Client): void {
  const trimmedArgs = args.filter((arg) => !isBlank(arg))

  if (!trimmedArgs[0]?.length) {
    throw new Error('No arguments provided.')
  }

  const skill = parseInt(trimmedArgs[0])

  if (isNaN(skill) || skill < 1 || skill > 10001) {
    throw new Error('The first argument must be a number between [0-10001].')
  }

  const unit = rollDice('unit')
  const tens = [rollDice('ten'), rollDice('ten')]

  let roll: number

  if (unit === 0 && tens.includes(0)) {
    roll = 100
  } else {
    const highestTen = max(tens)
    roll = highestTen + unit
  }

  const extremeSuccess = Math.floor(skill / 5)
  const hardSuccess = Math.floor(skill / 2)
  const regularSuccess = skill

  let description = `${message.author.username} rolled: **${roll}**`
  const footer = `Reg (${regularSuccess})  |  Hard (${hardSuccess})  |  Ext (${extremeSuccess})`

  let title: string
  let color: Color

  if (roll <= extremeSuccess) {
    title = 'Extreme Success'
    color = Color.SUCCESS
  } else if (roll <= hardSuccess) {
    title = 'Hard Success'
    color = Color.SUCCESS
  } else if (roll <= regularSuccess) {
    title = 'Regular Success'
    color = Color.SUCCESS
  } else {
    title = 'Fail'
    description += `\nLuck required: **${roll - skill}**`
    color = Color.ERROR
  }

  send(message, {
    title,
    description,
    footer,
    color
  })
}

export function onError(message: Message, args: string, error: Error): void {
  send(message, {
    title: 'Error:',
    description: error.message,
    color: Color.ERROR
  })
}

export const opts = {
  description:
    'Performs a penalty Call of Cthulhu dice roll against the chosen number and returns the success level or failure.',
  usage: '%penalty <skill level>',
  aliases: []
}
