// services
import * as tokenService from './tokenService'

// types
import { Pokemon } from '../types/models'
import { Profile } from '../types/models'
import { PotentialMove } from '../types/models'

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

async function findPokemon(id: Pokemon['_id']): Promise<Pokemon> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Pokemon
  } catch (error) {
    throw error
  }
}

async function showParty(): Promise<Pokemon[]> {
  try {
    const res = await fetch(`${BASE_URL}/partyPokemon`, {
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

async function expGain(id: Pokemon['_id'], fainted: Pokemon['_id']): Promise<Pokemon> {
  try {
    const res = await fetch(`${BASE_URL}/expgain/${id}/${fainted}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Pokemon
  } catch (error) {
    throw error
  }
}

async function levelUp(id: Pokemon['_id']): Promise<Pokemon | string> {
  try {
    const res = await fetch(`${BASE_URL}/levelup/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Pokemon | string
  } catch (error) {
    throw error
  }
}

async function evolve(id: Pokemon['_id']): Promise<Pokemon | string> {
  try {
    const res = await fetch(`${BASE_URL}/evolve/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Pokemon | string
  } catch (error) {
    throw error
  }
}

async function newMove(id: Pokemon['_id'], moveData: PotentialMove): Promise<Pokemon | string> {
  try {
    const res = await fetch(`${BASE_URL}/newmove/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenService.getToken()}` 
      },
      body: JSON.stringify(moveData),
    })
    return await res.json() as Pokemon | string
  } catch (error) {
    throw error
  }
}

export {
  getAllPokemon,
  showParty,
  addPokemonToParty,
  addPokemonToPC,
  findPokemon,
  expGain,
  levelUp,
  evolve,
  newMove,
}