// services
import * as tokenService from './tokenService'

// types
import { Map } from '../types/models'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/map`

async function getMap(id: string): Promise<Map> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Map
  } catch (error) {
    throw error
  }
}



export {
  getMap,
}