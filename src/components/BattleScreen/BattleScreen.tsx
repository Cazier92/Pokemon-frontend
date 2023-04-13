// npm modules
import { useState, useEffect } from 'react';

// types
import { User } from '../../types/models'
import { Sprite } from '../../types/models';
import { Pokemon } from '../../types/models';
import { Profile } from '../../types/models';
import { Pack } from '../../types/models';
import { Ball } from '../../types/models';
import { Move } from '../../types/models';

import * as pokemonService from '../../services/pokemonService'
import * as packService from '../../services/packService'
import * as battleService from '../../services/battleService'


interface BattleScreenProps {
  battleUnInit: () => void;
  newPokemon: Pokemon | undefined;
  userProfile: Profile;
  partyPokemon: Pokemon | undefined;
  capPokemon: (pokemon: Pokemon) => string | undefined;
  setPartyPokemon: React.Dispatch<React.SetStateAction<Pokemon | undefined>>;
  setNewPokemon: React.Dispatch<React.SetStateAction<Pokemon | undefined>>
}

import './BattleScreen.css'

const BattleScreen = (props: BattleScreenProps): JSX.Element => {
  const {battleUnInit, newPokemon, userProfile, partyPokemon, capPokemon, setPartyPokemon, setNewPokemon} = props

  // State: 
  const [showMoves, setShowMoves] = useState<boolean>(false)
  const [showPack, setShowPack] = useState<boolean>(false)
  const [showParty, setShowParty] = useState<boolean>(false)
  const [fullParty, setFullParty] = useState<Pokemon[]>([])
  const [pack, setPack] = useState<Pack>()
  const [showMedicine, setShowMedicine] = useState<boolean>(false)
  const [showBalls, setShowBalls] = useState<boolean>(false)
  const [ballPocket, setBallPocket] = useState<Ball[]>()
  const [showBattleText, setShowBattleText] = useState<boolean>(false)
  const [secondMove, setSecondMove] = useState<Move>()
  const [opponentHealthPer, setOpponentHealthPer] = useState<number>(75)
  const [playerHealthPer, setPlayerHealthPer] = useState<number>(75)

  useEffect((): void => {
    const findParty = async (): Promise<void> => {
      const party = await pokemonService.showParty()
      setFullParty(party)
    }
    findParty()
  }, [])

  useEffect((): void => {
    const findPack = async (): Promise<void> => {
      const pack = await packService.getUserPack()
      setPack(pack)
    }
    findPack()
  }, [])

  

  const handleShowMoves = (): void => {
    setShowMoves(true)
    setShowPack(false)
    setShowParty(false)
  }

  const handleShowPack = (): void => {
    setShowMoves(false)
    setShowPack(true)
    setShowParty(false)
  }

  const handleShowParty = (): void => {
    setShowMoves(false)
    setShowPack(false)
    setShowParty(true)
  }

  const handleShowNone = (): void => {
    setShowMoves(false)
    setShowPack(false)
    setShowParty(false)
  }

  const handleShowBalls = (): void => {
    setShowBalls(true)
    setShowMedicine(false)
  }

  const handleShowMedicine = (): void => {
    setShowBalls(false)
    setShowMedicine(true)
  }


  

  const canvas = document.querySelector<HTMLCanvasElement>('#battle-canvas')
  const context = canvas?.getContext('2d')
  
  const battleImage = new Image()
  battleImage.src = '/battleBackground.png'

  const background: Sprite = {
    position: {
      x: 0,
      y: 0,
    },
    image: battleImage,
    frames: {
      max: 1,
      hold: 10,
      val: 0,
      elapsed: 0,
    },
    animate: false,
    width: battleImage.width,
    height: battleImage.height
  }


  
  if (newPokemon && partyPokemon) {
    
    let battleText: string = ''

    const opponentHealth = document.getElementById('opponent-health-percent')
    const playerHealth = document.getElementById('player-health-percent')
    if (opponentHealth && playerHealth) {
      opponentHealth.style.width = `${opponentHealthPer}%`
      playerHealth.style.width = `${playerHealthPer}%`
    }

    const handleChooseMove = async (move: Move, userPok: Pokemon, opponent: Pokemon ): Promise<void> => {
      const foundOpponent = await pokemonService.findPokemon(opponent._id)
      setNewPokemon(foundOpponent)
      let opponentMoveSet: Move[] = []
      foundOpponent.moveSet.forEach(move => {
        if (move.currentPP > 0) {
          opponentMoveSet.push(move)
        }
      })
      const randomNum = Math.floor(Math.random() * opponentMoveSet.length)
      console.log('RANDOMNUM:', randomNum)
      console.log('OPPONENT MOVESET:', foundOpponent.moveSet)
      const opponentMoveId = opponentMoveSet[randomNum]
      const opponentMove = await battleService.findMove(opponentMoveId._id)
      const moves: Move[] = [move, opponentMove]
      if (moves[0].priority > moves[1].priority) {
        battleText = `${userPok.name} used ${move.name}!`
        setShowBattleText(true)
        const updatedOpponent = await battleService.useMove(moves[0]._id, userPok._id, foundOpponent._id)
        setNewPokemon(updatedOpponent)
        setOpponentHealthPer((75 * (updatedOpponent.currentHP/ updatedOpponent.totalHP)))
        const updatedUser = await pokemonService.findPokemon(partyPokemon._id)
        setPartyPokemon(updatedUser)
      } else if (moves[1].priority > moves[0].priority) {
        battleText = `${foundOpponent.name} used ${moves[1].name}!`
        setShowBattleText(true)
        const updatedUser = await battleService.useMove(moves[1]._id, foundOpponent._id, userPok._id)
        setPartyPokemon(updatedUser)
        setPlayerHealthPer((75 * (updatedUser.currentHP/ updatedUser.totalHP)))
        const updatedOpponent = await pokemonService.findPokemon(newPokemon._id)
        setNewPokemon(updatedOpponent)
      } else {
        if (userPok.speed > foundOpponent.speed) {
          console.log('HERE')
          battleText = `${userPok.name} used ${move.name}!`
          setShowBattleText(true)
          const updatedOpponent = await battleService.useMove(moves[0]._id, userPok._id, foundOpponent._id)
          setNewPokemon(updatedOpponent)
          setOpponentHealthPer((75 * (updatedOpponent.currentHP/ updatedOpponent.totalHP)))
          const updatedUser = await pokemonService.findPokemon(partyPokemon._id)
          setPartyPokemon(updatedUser)
        } else {
          battleText = `${foundOpponent.name} used ${moves[1].name}!`
          setShowBattleText(true)
          const updatedUser = await battleService.useMove(moves[1]._id, foundOpponent._id, userPok._id)
          setPartyPokemon(updatedUser)
          setPlayerHealthPer((75 * (updatedUser.currentHP/ updatedUser.totalHP)))
          const updatedOpponent = await pokemonService.findPokemon(newPokemon._id)
          setNewPokemon(updatedOpponent)
        }
      }
    }

    const handleChangePokemon = async (pokemon: Pokemon): Promise<void> => {
      if (pokemon._id !== partyPokemon._id) {
        setPartyPokemon(pokemon)
        handleShowNone()
      }
    }

    const opponentImg = new Image()
    opponentImg.src = `${newPokemon.spriteFront}`
    opponentImg.className = 'opponent'

    const partyPokemonExp = partyPokemon.percentToNextLevel

    const expPercentStyle = {
      width: `${partyPokemonExp}%`
    }
  
    const opponentPok: Sprite = {
      position: {
        x: 720,
        y: 30,
      },
      image: opponentImg,
      frames: {
        max: 1,
        hold: 10,
        val: 0,
        elapsed: 0,
      },
      animate: false,
      width:  opponentImg.width,
      height: opponentImg.height,
      isPokemon: true
    }

    const playerImg = new Image()
    playerImg.src = `${partyPokemon.spriteBack}`
    playerImg.className = 'opponent'
  
    const playerPok = {
      position: {
        x: 170,
        y: 145,
      },
      image: playerImg,
      frames: {
        max: 1,
        hold: 10,
        val: 0,
        elapsed: 0,
      },
      animate: false,
      width:  playerImg.width,
      height: playerImg.height,
      isPokemon: true,
      playerPok: true,
    }
    if (canvas && playerPok.image && opponentPok.image ) {
  
      canvas.width = 1024
      canvas.height = 576
      
      const draw = (sprite: Sprite): void => {
        if (context) {
          let value = 0
          if (sprite.frames.val) {
            value = sprite.frames.val
          }
          let z = 1
          if (sprite.isPokemon && !sprite.playerPok) {
            z = 2.5
          }
          if (sprite.playerPok) {
            z = 4
          }
          context.save()
          context.drawImage(
            sprite.image,
            value * sprite.width,
            0,
            sprite.image.width / sprite.frames.max,
            sprite.image.height,
            sprite.position.x,
            sprite.position.y,
            z * sprite.image.width / sprite.frames.max,
            z * sprite.image.height,
          )
          context.restore()
  
          if (!sprite.animate) {
            return
          } 
          if (sprite.frames.max > 1) {
            sprite.frames.elapsed++
          }
          if (sprite.frames.elapsed % sprite.frames.hold === 0) {
            if (sprite.frames.val < sprite.frames.max - 1) {
              sprite.frames.val++
            } else {
              sprite.frames.val = 0
            }
          }
        }
      }
  
  
  
      
        
      const animate = () => {
        const animationId = window.requestAnimationFrame(animate)
        draw(background)
        draw(opponentPok)
        draw(playerPok)
      }
  
      animate()
  
      
      return (
        <div className='battle-screen'>
          <h1>This is a battle Screen</h1>
          <button onClick={battleUnInit}>finish battle</button>
          {newPokemon ? 
          (<>
          <div className='health-box' id='opponent-health'>
            <div className='pokemon-info'>
              <p className='pokemon-name'>{capPokemon(newPokemon)}</p>
              <p className='pokemon-level'>Level: {newPokemon.level}</p>
            </div>
            <div className='health-bar'>
              <p className='hp'>HP:</p>
              <div className='health-sub'>
                <div className='health-empty' id='opponent-health-empty'></div>
                <div className='health-percent' id='opponent-health-percent'></div>
  
              </div>
            </div>
          </div>
          </>) : (<></>)}
          {partyPokemon ? 
          (<>
          <div className='health-box' id='user-health'>
            <div className='pokemon-info'>
              <p className='pokemon-name'>{capPokemon(partyPokemon)}</p>
              <p className='pokemon-level'>Level: {partyPokemon.level}</p>
            </div>
            <div className='health-bar'>
              <p className='hp'>HP:</p>
              <div className='health-sub'>
                <div className='health-empty' id='player-health-empty'></div>
                <div className='health-percent' id='player-health-percent'></div>
              </div>
            </div>
          </div>
          <div className='experience-box'>
            <div className='exp-bar'>
              <p className='exp'>Exp:</p>
              <div className='exp-sub'>
                <div className='exp-empty'></div>
                <div className='exp-percent' id='exp-percent' style={expPercentStyle}></div>
              </div>
            </div>
          </div>
          <div className='battle-menu'>
            <div className='move-selection'>
              { showMoves ? (
                partyPokemon.moveSet.map((move) => 
                  <div className='move' onClick={() => handleChooseMove(move, partyPokemon, newPokemon)}>
                    <p className='move-name'>{move.name}</p>
                    <p className='move-pp'>{move.currentPP}/{move.totalPP}</p>
                    <p className='move-type'>{move.type}</p>
                  </div>
                )
              ) : (<></>)
              }
            </div>
            <div className='option-selection'>
              <div className='option-div' onClick={() => handleShowMoves()}>
                <p className='option-text'>Fight</p>
              </div>
              <div className='option-div' onClick={() => handleShowPack()}>
                <p className='option-text'>Pack</p>
              </div>
              <div className='option-div' onClick={() => handleShowParty()}>
                <p className='option-text'>Pokémon</p>
              </div>
              <div className='option-div' onClick={battleUnInit}>
                <p className='option-text'>Run</p>
              </div>
            </div>
          </div>
          {showParty ? (
            <div className='party-menu'>
              {
                fullParty.map((pokemon) => 
                <div className='pokemon' onClick={() => handleChangePokemon(pokemon)}>
                  <p>{capPokemon(pokemon)}</p>
                  <img src={pokemon.spriteFront} alt="" />
                  <p>Lv: {pokemon.level}</p>
                  {pokemon._id === partyPokemon._id ? (<></>) : 
                  (<>
                    <div>
                      <p>Choose this pokemon!</p>
                    </div>
                  </>)}
                </div>
                )
              }
              <div className='party-close'>
                <button onClick={() => handleShowNone()}>Close</button>
              </div>
            </div>
          ) : (<></>)}
          {showPack ? (
            <div className='pack-menu'>
              <div className='pocket-selection'>
                <button onClick={() => handleShowMedicine()}>Medicine</button>
                <button onClick={() => handleShowBalls()}>Balls</button>
              </div>
              {showBalls && pack ? 
              (<>
                {pack.ballPocket.map((ball) => 
                <div className='item'>
                  <p>{ball.name}</p>
                  <p className='item-description'>{ball.description}</p>
                </div>
                )}
              </>) : (<></>)}
              {showMedicine && pack ? 
              (<>
                {pack.medicinePocket.map((medicine) => 
                <div className='item'>
                  <p>{medicine.name}</p>
                  <p className='item-description'>{medicine.description}</p>
                </div>
                )}
              </>) : (<></>)}
              <div className='party-close'>
                <button onClick={() => handleShowNone()}>Close</button>
              </div>
            </div>
          ) : (<></>)}
          {showBattleText ? 
          (<div className='battle-text-div'>
            <p className='battle-text'>{battleText}</p>
          </div>) 
          : (<></>)}
          </>) : (<></>)}
          <div className='canvas-div'>
            <canvas id='battle-canvas'></canvas>
          </div>
        </div>
      )
    } else {
      return (
        <>
          <div className='battle-screen'>
            <h1>This is a battle Screen</h1>
            <h1>Loading...</h1>
            <canvas id='battle-canvas'></canvas>
          </div>
        </>
      )
    }

  } else {
    return (
      <>
      <div className='battle-screen'>
        <h1>This is a battle Screen</h1>
        <h1>Loading...</h1>
        <canvas id='battle-canvas'></canvas>
      </div>
    </>
    )
  }


  
}

export default BattleScreen