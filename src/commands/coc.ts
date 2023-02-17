import { Client, Message } from 'discord.js'
import { isBlank, max, min, randomNumber } from 'tsu'
import { Color } from '../types'
import { send } from '../utils'

const rollResolvers = {
  default: () => {
    return randomNumber(1, 101)
  },
  '+': () => {
    const tens = min([randomNumber(0, 10), randomNumber(0, 10)])
    const units = randomNumber(0, 10)
    let roll: number

    if (tens === 0 && units === 0) {
      roll = 100
    } else {
      roll = parseInt(`${tens}${units}`)
    }

    return roll
  },
  '-': () => {
    const tens = max([randomNumber(0, 10), randomNumber(0, 10)])
    const units = randomNumber(0, 10)
    let roll: number

    if (tens === 0 && units === 0) {
      roll = 100
    } else {
      roll = parseInt(`${tens}${units}`)
    }

    return roll
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

  const resolver = trimmedArgs[1] || 'default'
  const validResolver = ['+', '-', 'default'].includes(resolver)

  if (!validResolver) {
    throw new Error("The second argument must be blank, or a '+'/'-' symbol")
  }

  const roll = rollResolvers[resolver as keyof typeof rollResolvers]()

  const extremeSuccess = Math.floor(skill / 5)
  const hardSuccess = Math.floor(skill / 2)
  const regularSuccess = skill

  const description = `Roll: **${roll}**`
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
    'Rolls a d100 against the chosen number and returns the success level or failure.',
  usage: "%coc <skill level> ['+', '-']",
  aliases: []
}
