// services
import * as tokenService from './tokenService'

// types
import { Pokemon } from '../types/models'
import { Move } from '../types/models'
import { Ball } from '../types/models'
import { Profile } from '../types/models'

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

async function useBall(ballId: Ball['_id'], pokemonId: Pokemon['_id']): Promise<[Profile, Pokemon] | string > {
  try {
    const res = await fetch(`${BASE_URL}/ball/${ballId}/${pokemonId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as [Profile, Pokemon] | string
  } catch (error) {
    throw error
  }
}

export {
  useMove,
  findMove,
  useBall,
}