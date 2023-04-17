import { BallData } from "../types/forms"

const pokeball: BallData = {
  name: 'Poké Ball',
  bonus: 1,
  description: 'The standard device used to catch a Pokémon.',
  cost: 100,
}

const greatBall: BallData = {
  name: 'Great Ball',
  bonus: 1.5,
  description: 'This ball has an increased chance of catching a pokemon compared to a Poké Ball.',
  cost: 200,
}

export {
  pokeball,
  greatBall
}