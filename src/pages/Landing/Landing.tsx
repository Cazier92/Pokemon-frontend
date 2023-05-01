// stylesheets
import styles from './Landing.module.css'

// types
import { User } from '../../types/models'

interface LandingProps {
  user: User | null;
}

const Landing = (props: LandingProps): JSX.Element => {
  const { user } = props

  return (
    <main className={styles.container}>
      <h1>Pokémon!</h1>
      <div>
        <h5>Where to Start:</h5>
        <p>To begin playing, please log in or sign up above. For recruiters and hiring managers who desire a quick preview and do not desire an account, you may log in utilizing the email: test@test.com and password: test. After logging in or signing up, navigate to "Play Game" in the navbar.</p>
        <p>If you have just created an account, you will first be presented with a choice of three starter pokémon. You cannot go back and change this choice, so choose carefully which pokémon you would like to begin with! That being said, there is no wrong starter pokémon to choose!</p>
        <p>After choosing your starter, the game will start to load. If you are using the test account above, or there is a delay in game buffering, click on the "Start Game" button to begin game play.</p>
        <p>Above the game screen, there is an instructions button which will display a menu of different game mechanics you may read through to gain an understanding of how to play further!</p>
        <p>Thank you for your support and taking the time to view my work!</p>
      </div>
      <div>
        <h5>Disclaimer:</h5>
        <p>This game has been created utilizing PokéAPI to retrieve game data, including but not limited to the stats, types, moves, abilities, and artwork for each pokémon found in the game. This game is intended as a proof-of-concept to show how an external API may be utilized, as well as my own capabilities in designing a game using TypeScript, React.js, JavaScript (ES6), Mongoose.js, MongoDB, CSS, & HTML. I do not own any of the artwork or characters contained within the game, and this game is not intended for production, sale, or consumer use.</p>
      </div>
    </main>
  )
}

export default Landing
