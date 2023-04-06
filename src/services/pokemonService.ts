// services
import * as tokenService from './tokenService'

// types
import { Pokemon } from '../types/models'
import { Profile } from '../types/models'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/pokemon`

async function getAllPokemon(): Promise<Pokemon[]> {
  try {
    const res = await fetch(BASE_URL, {
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Pokemon[]
  } catch (error) {
    throw error
  }
}

async function addPokemonToParty(userId: Profile['_id'], pokemonId: Pokemon['_id']): Promise<Profile> {
  try {
    const res = await fetch(`${BASE_URL}/party/${userId}/${pokemonId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Profile
  } catch (error) {
    throw error
  }
}

async function addPokemonToPC(userId: Profile['_id'], pokemonId: Pokemon['_id']): Promise<Profile> {
  try {
    const res = await fetch(`${BASE_URL}/pc/${userId}/${pokemonId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Profile
  } catch (error) {
    throw error
  }
}



export {
  getAllPokemon,
  addPokemonToParty,
  addPokemonToPC,
}