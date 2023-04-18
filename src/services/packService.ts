// services
import * as tokenService from './tokenService'

// types
import { Pack } from '../types/models'
import { Ball } from '../types/models'
import { BallData } from '../types/forms'
import { MedicineData } from '../types/forms'
import { Medicine } from '../types/models'
import { Pokemon } from '../types/models'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/pack`

async function getAllPacks(): Promise<Pack[]> {
  try {
    const res = await fetch(BASE_URL, {
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Pack[]
  } catch (error) {
    throw error
  }
}

async function getUserPack(): Promise<Pack> {
  try {
    const res = await fetch(`${BASE_URL}/userPack`, {
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Pack
  } catch (error) {
    throw error
  }
}

async function changePackStatus(): Promise<Pack> {
  try {
    const res = await fetch(`${BASE_URL}/status`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenService.getToken()}` },
    })
    return await res.json() as Pack
  } catch (error) {
    throw error
  }
}

async function createBall(ballData: BallData): Promise<Pack> {
  try {
    const res = await fetch(`${BASE_URL}/ball`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${tokenService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ballData)
    })
    return await res.json() as Pack
  } catch (error) {
    throw error
  }
}

async function createMedicine(medicineData: MedicineData): Promise<Pack> {
  try {
    const res = await fetch(`${BASE_URL}/medicine`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${tokenService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicineData)
    })
    return await res.json() as Pack
  } catch (error) {
    throw error
  }
}


export {
  getAllPacks,
  getUserPack,
  changePackStatus,
  createBall,
  createMedicine,
}