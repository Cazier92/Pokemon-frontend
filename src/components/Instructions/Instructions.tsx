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
    setShowBattle(false)
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
        <div className='inst-container'>
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
        <div className='inst-container'>
          <h5>Moves:</h5>
          <p>Selecting "Fight" during a battle will display each of a pokémon's moves. Each move will have a certain amount of PP ("Power Points") associated with it. Using a move will decrease that move's PP by 1. Once a move's PP reaches 0, it cannot be used anymore until the PP is restored, either by healing your pokémon, or using certain medicines on that pokémon to restore that move.</p>
          <h5>Types:</h5>
          <p>Each pokémon species has one to two types associated with it. Each move also has one type associated with it. Each type has corresponding strengths and weaknesses to other types. If one or both of a pokémon's types is weak to the type of a move used against it, the move will cause more damage. If one or both of a pokémon's types is strong against the type of move used against it, the move will cause less damage. If both of a pokémon's types are either weak or strong against a move's type, the damage a move causes will be significantly greater or less respectively. In addition, some types are completely resistant to other types (ex: Flying type pokémon are completely unaffected by Ground type moves, although Ground type pokémon are weak against Flying type moves). If a pokémon has two types, one of which are weak to a move, and another of which are strong against a move, the move will exact a neutral (base) amount of damage.</p>
          <h5>Status Conditions:</h5>
          <p>Some moves may have a chance of inflicting a status condition (generally on the pokémon it is used against, with some exceptions). Status conditions affect how a pokémon performs in battle.</p>
          <h6>Burn:</h6>
          <p>A burn will decrease the amount of damage a pokémon inflicts on other pokémon, as well as causing it additional damage at the end of each turn. This condition may go away on it's own.</p>
          <h6>Freeze:</h6>
          <p>A frozen pokémon will be unable to fight until it thaws out. If not treated, this condition may go away on it's own, but it is unknown when this will happen, and if you do not have medicine to treat the condition, you will have to continue battling until it thaws.</p>
          <h6>Paralysis:</h6>
          <p>A paralyzed pokémon may be unable to fight, but there is a chance that it will continue to be able to use moves each turn. This condition may go away on it's own.</p>
          <h6>Poison:</h6>
          <p>A poisoned pokémon will take additional damage at the end of each turn. This condition will not resolve on it's own.</p>
          <h6>Confused:</h6>
          <p>A confused pokémon may hurt itself during battle, rather than attacking the other pokémon. This condition may resolve on it's own.</p>
        </div>
        <button className='return' onClick={() => handleReturn()}>Return</button>
      </>) 
      : (<></>)}
      {showPack ? 
      (<>
        <div className='inst-container'>
          <h5>Pockets:</h5>
          <p>Your pack has four pockets in it; it has a medicine pocket, a machine pocket, a ball pocket, and a key item pocket. During a battle, only your medicine and ball pockets are available to use.</p>
          <h5>Medicine Pocket:</h5>
          <p>Your medicine pocket contains any medicines you have obtained (you are provided some when you first start the game). Medicines can be used inside and outside of battle to restore a pokémon's health, status conditions it may have occurred in battle, and restore PP to it's moves. Each medicine will have a description to notify you of it's effects. If medicine is used during battle, you forfeit using a move during that turn. The medicine will be used, and then the opponent pokémon will immediately attack.</p>
        </div>
        <h5>Ball Pocket:</h5>
        <p>Balls may only be used in battle. Balls are used to capture wild pokémon in battle. Each ball type has a specific bonus attatched to it, which will have either an increased or neutral effect in the chance of catching a wild pokémon. A ball will more effectively catch a pokémon if it's HP has been lowered by fighting with your pokémon first. A ball will be additionally more effective if the pokémon you are trying to catch has a status condition.</p>
        <button className='return' onClick={() => handleReturn()}>Return</button>
      </>) 
      : (<></>)}
      <button className='close' onClick={() => setShowInstructions(false)}>Close</button>
    </div>
  )
}

export default Instructions
