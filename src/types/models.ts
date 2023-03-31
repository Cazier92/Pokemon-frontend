/* ---------===== custom props ====--------- */



/* ---------===== auth models =====--------- */

export interface Profile {
  name: string;
  photo?: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  name: string;
  email: string;
  profile: { id: number };
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pokemon {

}

export interface Type {

}

export interface PotentialMove {

}

export interface Move {
  name: string;
  type: string;
  accuracy?: number;
  effect: string;
  effectChance?: number;
  damageClass: string;
  totalPP: number;
  currentPP: number;
  power?: number,
  priority: number,
}

export interface Stat {
  name: string;
  baseStat: number;
  effort: number;
  iV: number;
  effortPoints: number;
}

export interface Evolution {
  name: string;
  trigger: string;
  minLevel?: number;
  item?: string;
  heldItem?: string;
}
