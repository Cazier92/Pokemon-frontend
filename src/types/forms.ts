/* ---------==== custom forms ====--------- */

import { Pokemon } from "./models";
import { Offset } from "./models";

export interface ProfileData {
  party?: Pokemon[];
  pokemonPC?: Pokemon[];
  wallet?: number;
  currentMap?: string;
  coordinates?: Offset;
}

export interface BallData {
  name: string;
  bonus: number;
  description: string;
  cost: number;
}

export interface MedicineData {
  name: string;
  affects: string[];
  value: number;
  condition?: 'paralyze' | 'sleep' | 'freeze' | 'confuse' | 'burn' | 'poison' | 'all';
  revive: boolean;
  reviveHP?: number;
  description: string;
  cost: number;
}

export interface MachineData {
  name: string;
  move: string;
  value: 'HM' | 'TM';
  description: string;
  cost: number;
}

export interface KeyItemData {
  name: string;
  description: string;
}

/* ---------===== auth forms =====--------- */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  passwordConf: string;
}

export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  newPasswordConf: string;
}

export interface PhotoFormData {
  photo: File | null;
}
