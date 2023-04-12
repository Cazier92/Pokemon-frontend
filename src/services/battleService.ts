// services
import * as tokenService from './tokenService'

// types
import { Pokemon } from '../types/models'
import { Move } from '../types/models'

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



export {
  useMove,
}