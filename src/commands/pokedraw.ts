import { Message, MessageEmbedOptions } from 'discord.js'
import { capitaliseWord, capitaliseWords, randomNumber } from '@eb3n/outils'
import { GameType, Gen } from '../types'
import { store } from '../store'
import { getRandomPokemon, send, sendEmbed, DEX_NUMBERS } from '../utils'
import { fakemon } from '../assets/pokemon.json'

function generateRandomName(): string {
  const { prefixes, suffixes } = fakemon[randomNumber(fakemon.length)]
  const prefix = prefixes[randomNumber(prefixes.length)].toLowerCase()
  const suffix = prefixes[randomNumber(suffixes.length)].toLowerCase()

  return capitaliseWord(`${prefix}${suffix}`)
}

function getFakePokemonEmbed(): MessageEmbedOptions {
  const name = generateRandomName()
  return {
    color: '#6366F1',
    title: 'Random Pokémon Name',
    fields: [{ name: 'Name', value: name, inline: true }]
  }
}

function getRealPokemonEmbed(gen: Gen): MessageEmbedOptions {
  const { min, max } = DEX_NUMBERS[gen]
  const pokemon = getRandomPokemon(min, max)

  return {
    color: '#6366F1',
    title: 'Random Pokémon',
    fields: [
      { name: 'Name', value: capitaliseWords(pokemon.name), inline: true },
      {
        name: 'Pokédex Number',
        value: `#${pokemon.number}`,
        inline: true
      }
    ],
    image: {
      url: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemon.number}.png`
    }
  }
}

function parsePokedrawArgs(args: string): [Gen | 'fake', number, boolean] {
  if (!args?.length) {
    return ['all', 90, false]
  }

  const time = args.match(/(?<!gen)(\d+)s?/)?.[1] || 90
  const gen = (args.match(/gen[12345678]|fake|all/)?.[0] || 'all') as
    | Gen
    | 'fake'

  return [gen, Number(time), time < 30 || time > 300]
}

export function pokedraw(message: Message, args: string): void {
  const [gen, seconds, didParsingFail] = parsePokedrawArgs(args)

  if (didParsingFail) {
    sendEmbed(
      message,
      'Invalid command. Type `%help` for command usage instructions.',
      'error'
    )
    return
  }

  if (gen === 'fake') {
    send(message, { embed: getFakePokemonEmbed() })
  } else {
    send(message, { embed: getRealPokemonEmbed(gen) })
  }

  store.startGame(GameType.POKEDRAW)

  sendEmbed(message, `Your **${seconds}** seconds starts... now!`)

  if (seconds > 60) {
    store.setTimeout(() => {
      sendEmbed(message, `⏰ **30 seconds left!** ⏰`)
      store.setTimeout(() => {
        sendEmbed(message, "⏰ **TIME'S UP!** ⏰")
        store.endGame()
      }, 30000)
    }, seconds * 1000 - 30000)
  } else {
    store.setTimeout(() => {
      sendEmbed(message, `⏰ **10 seconds left!** ⏰`)
      store.setTimeout(() => {
        sendEmbed(message, "⏰ **TIME'S UP!** ⏰")
        store.endGame()
      }, 10000)
    }, seconds * 1000 - 10000)
  }
}
