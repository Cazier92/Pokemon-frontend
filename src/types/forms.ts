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
