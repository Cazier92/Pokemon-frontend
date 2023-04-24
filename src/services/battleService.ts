// services
import * as tokenService from './tokenService'

// types
import { Pokemon } from '../types/models'
import { Move } from '../types/models'
import { Ball } from '../types/models'
import { Profile } from '../types/models'
import { Medicine } from '../types/models'
import { MedicineMoveData } from '../types/forms'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/battle`

async function useMove(moveId: Move['_id'], userId: Pokemon['_id'], targetId: Pokemon['_id']): Promise<Pokemon> {
  try {
    const res = await fetch(`${BASE_URL}/move/${moveId}/${userId}/${targetId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Pokemon
  } catch (error) {
    throw error
  }
}

async function findMove(moveId: Move['_id']): Promise<Move> {
  try {
    const res = await fetch(`${BASE_URL}/move/${moveId}`, {
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Move
  } catch (error) {
    throw error
  }
}

async function useBall(ballId: Ball['_id'], pokemonId: Pokemon['_id']): Promise<[Profile, Pokemon, string] | [Profile, string, boolean] > {
  try {
    const res = await fetch(`${BASE_URL}/ball/${ballId}/${pokemonId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as [Profile, Pokemon, string] | [Profile, string, boolean]
  } catch (error) {
    throw error
  }
}

async function useMedicine(medicineId: Medicine['_id'], pokemonId: Pokemon['_id'], moveData?: MedicineMoveData): Promise<[Profile, Pokemon, string] | string > {
  try {
    const res = await fetch(`${BASE_URL}/useMedicine/${medicineId}/${pokemonId}`, {
      method: 'PUT',
      headers: { 
      'Authorization': `Bearer ${tokenService.getToken()}`,
      "Content-Type": "application/json"
    },
      body: JSON.stringify(moveData),
    })
    return await res.json() as [Profile, Pokemon, string] | string
  } catch (error) {
    throw error
  }
}

async function faintWildPokemon(pokemonId: Pokemon['_id']): Promise<Pokemon> {
  try {
    const res = await fetch(`${BASE_URL}/faint/${pokemonId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Pokemon
  } catch (error) {
    throw error
  }
}

export {
  useMove,
  findMove,
  useBall,
  useMedicine,
  faintWildPokemon,
}