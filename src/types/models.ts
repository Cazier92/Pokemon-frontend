/* ---------===== custom models ====--------- */

//^ Pokemon models:
export interface Pokemon {
  _id: string;
  name: string;
  nickname?: string;
  owner?: { id: number };
  originalOwner?: { id: number };
  level: number;
  types: [Type];
  pokedexNum: number;
  potentialMoves: [PotentialMove];
  moveSet: [Move];
  spriteFront: string;
  spriteBack: string;
  evolves: boolean;
  evolvesTo: [Evolution];
  totalHP: number;
  currentHP: number;
  attack: number;
  spAttack: number;
  defense: number;
  spDefense: number;
  speed: number;
  effortPointTotal: number;
  statusCondition?: 'paralyze' | 'sleep' | 'freeze' | 'confuse' | 'burn' | 'poison';
  captureRate: number;
  growthRate: string;
  levelBaseExp: number;
  currentExp: number;
  percentToNextLevel: number;
  nextLevelExp: number;
  baseExpYield: number;
  holdItem?: object;
}

export interface Type {
  slot: 1 | 2;
  name: string;
}

export interface PotentialMove {
  name: string;
  url: string;
  level: number;
  method: 'level-up' | 'egg' | 'machine' | 'tutor';
}

export interface Move {
  _id: string;
  name: string;
  type: string;
  accuracy: number | null;
  effect: string;
  effectChance: number | null;
  damageClass: string;
  totalPP: number;
  currentPP: number;
  power: number | null;
  priority: number;
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
  minLevel?: number | null;
  item?: string | null;
  heldItem?: string | null;
}

//^ Game Models:


export interface Position {
    x: number;
    y: number;
  }
  
export interface Frames {
      max: number;
      hold: number;
      val: number;
      elapsed: number;
    }
    
export interface Sprites {
        up: HTMLImageElement;
        down: HTMLImageElement;
        left: HTMLImageElement;
        right: HTMLImageElement;
      }

      
export interface Sprite {
    position: Position;
    // velocity,
    image: HTMLImageElement;
    frames: Frames;
    sprites?: Sprites;
    animate: boolean;
    width: number;
    height: number;
    isPokemon?: boolean;
    playerPok?: boolean;
  }

export interface Boundary {
  position: Position;
  width: 48;
  height: 48;
}

//^ Map Models:

export interface Map {
  name: string;
  backgroundUrl: string;
  foregroundUrl: string;
  grassPokemon: PokemonFound;
  hardBoundaries: number[];
  battleZones: number[];
  waterBoundaries: number[];
  waterFallBoundaries: number[];
  whirlPoolBoundaries: number[];
  doorBoundaries: number[];
  offset: Offset;
  newMapBoundaries: NewMapBoundary[];
}

export interface PokemonFound {
  pokedexNums: [Pokemon['pokedexNum']];
  minLevel: Pokemon['level'];
  maxLevel: Pokemon['level'];
}

export interface Offset {
  x: number;
  y: number;
  land: boolean;
}

export interface NewMapBoundary {
  name: string;
  linksTo: string;
  boundaries: number[];
}

//^ Pack Models:

export interface Pack {
  _id: string;
  owner: Profile['_id'];
  newPack: boolean;
  medicinePocket: Medicine[];
  machinePocket: Machine[];
  ballPocket: Ball[];
  keyItemPocket: KeyItem[];
}

export interface Medicine {
  _id: string;
  name: string;
  affects: string[];
  value: number;
  condition?: 'paralyze' | 'sleep' | 'freeze' | 'confuse' | 'burn' | 'poison' | 'all';
  revive: boolean;
  reviveHP?: number;
  ether: boolean;
  description: string;
  cost: number;
}


export interface Machine {
  _id: string;
  name: string;
  move: string;
  value: 'HM' | 'TM';
  description: string;
  cost: number;
}


export interface Ball {
  _id: string;
  name: string;
  bonus: number;
  description: string;
  cost: number;
}

export interface KeyItem {
  _id: string;
  name: string;
  description: string;
}


/* ---------===== auth models =====--------- */

export interface Profile {
  name: string;
  photo?: string;
  _id: string;
  wallet: number;
  party: Pokemon['_id'][];
  pokemonPC: Pokemon[];
  currentMap: string;
  coordinates: Offset;
  pack: Pack;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  name: string;
  email: string;
  profile: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

