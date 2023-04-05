// npm modules

// types
import { User } from '../../types/models'


interface BattleScreenProps {
  battleUnInit: () => void;
}


const BattleScreen = (props: BattleScreenProps): JSX.Element => {
  const {battleUnInit} = props
  
  return (
    <div>
      <h1>This is a battle Screen</h1>
      <button onClick={battleUnInit}>finish battle</button>
    </div>
  )
}

export default BattleScreen