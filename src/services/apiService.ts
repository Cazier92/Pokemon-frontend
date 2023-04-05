// services
import * as tokenService from './tokenService'

// types
import { Pokemon } from '../types/models'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/api`

async function generatePokemon(
  num: Pokemon['pokedexNum'], level: Pokemon['level']): Promise<Pokemon> {
  try {
    const res = await fetch(`${BASE_URL}/gen/${num}/${level}`, {
      // headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
      method: 'POST',
    })
    return await res.json() as Pokemon
  } catch (error) {
    throw error
  }
}



export {
  generatePokemon,
}