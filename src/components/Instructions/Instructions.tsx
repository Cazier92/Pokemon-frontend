// npm modules
import { useState } from 'react'

// services
import './Instructions.css'

// stylesheets


// types


interface InstructionsProps {
  setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
}

const Instructions = (props: InstructionsProps): JSX.Element => {
  const {setShowInstructions} = props

  //^ state:
  const [showList, setShowList] = useState<boolean>(true)
  const [showMovement, setShowMovement] = useState<boolean>(false)
  const [showFight, setShowFight] = useState<boolean>(false)
  const [showPack, setShowPack] = useState<boolean>(false)
  const [showChoose, setShowChoose] = useState<boolean>(false)
  const [showRun, setShowRun] = useState<boolean>(false)
  const [showBattle, setShowBattle] = useState<boolean>(false)

  const handleReturn = (): void => {
    setShowList(true)
    setShowMovement(false)
    setShowFight(false)
    setShowPack(false)
    setShowChoose(false)
    setShowRun(false)
  }

  const handleShowMovement = (): void => {
    setShowList(false)
    setShowMovement(true)
  }

  const handleShowFight = (): void => {
    setShowList(false)
    setShowFight(true)
  }

  const handleShowPack = (): void => {
    setShowList(false)
    setShowPack(true)
  }

  const handleShowChoose = (): void => {
    setShowList(false)
    setShowChoose(true)
  }

  const handleShowRun = (): void => {
    setShowList(false)
    setShowRun(true)
  }

  const handleShowBattle = (): void => {
    setShowList(false)
    setShowBattle(true)
  }


  return (
    <div className='instructions'>
      <div className='inst-title'>
        <p>How to play:</p>
      </div>
      {showList ? 
      (<>
        <div className='inst-list-container'>
          <p className='inst-list' onClick={() => handleShowMovement()}>Movement</p>
          <p className='inst-list' onClick={() => handleShowBattle()}>Battle</p>
          <p className='inst-list' onClick={() => handleShowFight()}>Fight</p>
          <p className='inst-list' onClick={() => handleShowPack()}>Pack</p>
          <p className='inst-list' onClick={() => handleShowChoose()}>Choosing Pokemon</p>
          <p className='inst-list' onClick={() => handleShowRun()}>Run</p>
        </div>
      </>) 
      : (<></>)}
      {showMovement ? 
      (<>
        <div className='movement-container'>
          <h5>Mobile:</h5>
          <p>Please use the provided directional-pad, located underneath the game screen. Each arrow corresponds to the desired direction of travel.</p>
          <h5>Desktop:</h5>
          <p>Your character may be moved either using the provided directional-pad under the game screen, with each arrow corresponding to the direction of travel, or using your keyboard:</p>
          <p>W = 'Up'</p>
          <p>S = 'Down'</p>
          <p>A = 'Left'</p>
          <p>D = 'Right'</p>
        </div>
        <button className='return' onClick={() => handleReturn()}>Return</button>
      </>) 
      : (<></>)}
      {showBattle ? 
      (<>
        <div className='fight-container'>
          <h5>Goal:</h5>
          <p>The goal is to either cause the other pokémon to faint, or to catch it to add it to your collection. A pokémon will faint when it's HP reaches 0. This includes opponent pokémon, as well as your own pokémon.</p>
          <h5>Battling:</h5>
          <p>Each Pokémon may have up to 4 moves total. When battling another pokémon, click "Fight" to display a selection of your current pokémon's moves. Clicking on one of these moves will put it into the queue, at which point both your pokémon and the opponent pokémon will attack each other, with the first turn being determined by various factors, including each pokémon's speed, and any priority a particular move may carry.</p>
          <h5>Fainting:</h5>
          <p>When an opponent faints, your current pokemon will gain experience. There is a meter displayed under your current pokémon's health, that corresponds to the percentage of experience it has compared to the percentage until it levels up. Your pokémon will also gain hidden stat points that will improve it's performance in future battles. These bonus stat points vary from one pokémon species to another.</p>
          <p>If your pokémon faints in battle, you will be offered the choice between selecting another pokémon from your party to continue the battle (if you have another pokémon that hasn't fainted), or escaping the battle.</p>
          <h5>Levelling Up:</h5>
          <p>A pokémon will level up after defeating other pokémon and gaining the required amount of experience, as show in the EXP meter below it's health in battle. Levelling up will make your pokémon stronger in future battles.</p>
          <h5>Evolution</h5>
          <p>Some pokémon will evolve after reaching a certain level, or using certain items on them. Evolving a pokémon will always change a pokémon's appearance. Evolving a pokémon will also generally increase their stats and perfomance in battle, and sometimes change it's type.</p>
        </div>
        <button className='return' onClick={() => handleReturn()}>Return</button>
      </>) 
      : (<></>)}
      {showFight ? 
      (<>
        <div className='fight-container'>
          <h5>Moves:</h5>
          <p>Selecting "Fight" during a battle will display each of a pokémon's moves.</p>
        </div>
        <button className='return' onClick={() => handleReturn()}>Return</button>
      </>) 
      : (<></>)}
      <button className='close' onClick={() => setShowInstructions(false)}>Close</button>
    </div>
  )
}

export default Instructions
