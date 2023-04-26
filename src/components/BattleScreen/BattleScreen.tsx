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
import { Medicine } from '../../types/models';
import { PotentialMove } from '../../types/models';
import { LearnMoveForm } from '../../types/forms';
import { MedicineMoveData } from '../../types/forms';

import * as pokemonService from '../../services/pokemonService'
import * as packService from '../../services/packService'
import * as battleService from '../../services/battleService'
import * as profileService from '../../services/profileService'


interface BattleScreenProps {
  battleUnInit: () => void;
  newPokemon: Pokemon | undefined;
  userProfile: Profile;
  partyPokemon: Pokemon | undefined;
  capPokemon: (pokemon: Pokemon) => string | undefined;
  setPartyPokemon: React.Dispatch<React.SetStateAction<Pokemon | undefined>>;
  setNewPokemon: React.Dispatch<React.SetStateAction<Pokemon | undefined>>;
  setUserProfile: React.Dispatch<React.SetStateAction<Profile | undefined>>;
  user: User | null;
}

import './BattleScreen.css'

const BattleScreen = (props: BattleScreenProps): JSX.Element => {
  const {battleUnInit, newPokemon, userProfile, partyPokemon, capPokemon, setPartyPokemon, setNewPokemon, setUserProfile, user} = props

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
  const [opponentTurn, setOpponentTurn] = useState<boolean>(false)
  const [opponentHealthPer, setOpponentHealthPer] = useState<number>(75)
  const [playerHealthPer, setPlayerHealthPer] = useState<number>(75)
  const [battleText, setBattleText] = useState<string>('')
  const [secondMove, setSecondMove] = useState<Move>()
  const [attacker, setAttacker] = useState<Pokemon>()
  const [target, setTarget] = useState<Pokemon>()
  const [secondTurn, setSecondTurn] = useState<boolean>(false)
  const [opponentFainted, setOpponentFainted] = useState<boolean>(false)
  const [opponentFaintTxt, setOpponentFaintTxt] = useState<string>('')
  const [userFainted, setUserFainted] = useState<boolean>(false)
  const [med, setMed] = useState<Medicine>()
  const [showPokList, setShowPokList] = useState<boolean>(false)
  const [errMsg, setErrMsg] = useState<string>('')
  const [showErrMsg, setShowErrMsg] = useState<boolean>(false)
  const [medMsg, setMedMsg] = useState<string>('')
  const [showMedMsg, setShowMedMsg] = useState<boolean>(false)
  const [ballMsg, setBallMsg] = useState<string>('')
  const [showBallMsg, setShowBallMsg] = useState<boolean>(false)
  const [ball, setBall] = useState<Ball>()
  const [caughtMsg, setCaughtMsg] = useState<string>('')
  const [showCaughtMsg, setShowCaughtMsg] = useState<boolean>(false)
  const [showContinue, setShowContinue] = useState<boolean>(false)
  const [viableParty, setViableParty] = useState<boolean>(false)
  const [checkParty, setCheckParty] = useState<boolean>(false)
  const [startTxt, setStartTxt] = useState<string>('')
  const [showStartTxt, setShowStartTxt] = useState<boolean>(true)
  const [showExpGain, setShowExpGain] = useState<boolean>(false)
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false)
  const [showEvolve, setShowEvolve] = useState<boolean>(false)
  const [evolveTxt, setEvolveTxt] = useState<string>('')
  const [levelUpMoves, setLevelUpMoves] = useState<PotentialMove[]>([])
  const [showLevelUpMoves, setShowLevelUpMoves] = useState<boolean>(false)
  const [learnMoveTxt, setLearnMoveTxt] = useState<string>('')
  const [learnedMove, setLearnedMove] = useState<boolean>(false)
  const [mustForget, setMustForget] = useState<boolean>(false)
  const [chooseForget, setChooseForget] = useState<boolean>(false)
  const [etherMove, setEtherMove] = useState<MedicineMoveData>()
  const [etherPok, setEtherPok] = useState<Pokemon>()
  const [showEtherMoves, setShowEtherMoves] = useState<boolean>(false)
  const [showEtherTxt, setShowEtherTxt] = useState<boolean>(false)
  const [selectedPokId, setSelectedPokId] = useState<string>()

  useEffect((): void => {
    const findParty = async (): Promise<void> => {
      const party = await pokemonService.showParty()
      setFullParty(party)
    }
    findParty()
  }, [checkParty])

  useEffect((): void => {
    if (partyPokemon && fullParty) {
      if (selectedPokId) {
        if (selectedPokId !== partyPokemon._id) {
          const findSelected = async (): Promise<void> => {
            const selectedPok = await pokemonService.findPokemon(selectedPokId)
            setPartyPokemon(selectedPok)
            console.log('PARTY POKEMON CHANGED')
          }
          findSelected()
        }
      } else {
        setSelectedPokId(partyPokemon._id)
      }
    }
  }, [partyPokemon, fullParty])

  useEffect((): void => {
    const findPack = async (): Promise<void> => {
      const pack = await packService.getUserPack()
      setPack(pack)
    }
    findPack()
  }, [userProfile])

  useEffect((): void => {
    if (newPokemon)
    if (newPokemon.currentHP <= 0) {
      setOpponentFaintTxt(`The Wild ${newPokemon.name} fainted!`)
      setOpponentFainted(true)
    } else {
      setOpponentFainted(false)
    }
  }, [newPokemon])

  useEffect((): void => {
    if (newPokemon)
    setStartTxt(`A wild ${newPokemon.name} appeared!`)
  }, [newPokemon])

  useEffect((): void => {
    if (partyPokemon)
    if (partyPokemon.currentHP <= 0) {
      setOpponentFaintTxt(`Oh no! ${partyPokemon.name} fainted!`)
      setUserFainted(true)
      setCheckParty(!checkParty)
    } else {
      setOpponentFainted(false)
    }
  }, [partyPokemon])

  useEffect((): void => {
    if (partyPokemon)
    if (partyPokemon.moveSet[0].name) {

    } else {
      const findMoves = async (): Promise<void> => {
        const updatedPokemon = await pokemonService.findPokemon(partyPokemon._id)
        setPartyPokemon(updatedPokemon)
      }
      findMoves()
    }
  }, [partyPokemon])

  useEffect((): void => {
    if (fullParty) {
      fullParty.forEach(pokemon => {
        if (pokemon.currentHP >= 0) {
          setViableParty(true)
        }
      })
    }
  }, [checkParty, fullParty])

  useEffect((): void => {
    if (levelUpMoves.length && partyPokemon) {
      console.log('LEVEL UP MOVES')
      setShowLevelUpMoves(true)
      if (partyPokemon.moveSet.length >= 4) {
        setMustForget(true)
        setLearnMoveTxt(`${capPokemon(partyPokemon)} wants to learn ${levelUpMoves[0].name}, should a move be forgotten to learn ${levelUpMoves[0].name}?`)
      } else {
        setLearnMoveTxt(`${capPokemon(partyPokemon)} learned ${levelUpMoves[0].name}!`)
      }
    } else if (!levelUpMoves.length) {
      setShowLevelUpMoves(false)
    }
  }, [levelUpMoves])

  useEffect((): void => {
    if (newPokemon && partyPokemon) {
      setOpponentHealthPer((75 * (newPokemon.currentHP/ newPokemon.totalHP)))
      setPlayerHealthPer((75 * (partyPokemon.currentHP/ partyPokemon.totalHP)))
    }
  }, [newPokemon, partyPokemon])

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
    const faintPokemon = async (): Promise<void> => {
      setOpponentFainted(false)
      endBattle()
      setNewPokemon(undefined)
      await battleService.faintWildPokemon(newPokemon._id)
    }

    const endBattle = (): void => {
      setPartyPokemon(fullParty[0])
      battleUnInit()
    }

    const continueBattle = (): void => {
      setUserFainted(false)
      setShowContinue(true)
    }

    const expGain = async (): Promise<void> => {
      console.log('EXP GAIN')
        setOpponentFainted(false)
        setShowExpGain(true)
        const updatedPokemon = await pokemonService.expGain(partyPokemon._id, newPokemon._id)
        setPartyPokemon(updatedPokemon)
    }

    const levelUp = async (): Promise<void> => {
      if (partyPokemon.currentExp >= partyPokemon.nextLevelExp) {
        const updatedPokemon = await pokemonService.levelUp(partyPokemon._id)
        if (typeof updatedPokemon !== 'string') {
          setPartyPokemon(updatedPokemon)
          setShowLevelUp(true)
          setShowExpGain(false)
        }
      } else {
        faintPokemon()
      }
    }

    const checkForMoves = (): void => {
      let moves: PotentialMove[] = []
      setShowLevelUp(false)
      setShowEvolve(false)
      partyPokemon.potentialMoves.forEach(move => {
        if (move.method === 'level-up' && move.level === partyPokemon.level) {
          moves.push(move)
          console.log('LEVEL UP MOVE')
        }
      })
      if (moves.length) {
        setLevelUpMoves(moves)
        console.log('SET LEVEL UP MOVES')
      } else {
        evolve()
      }
    }

    const handleLearnNextMove = async (): Promise<void> => {
      const newMove: LearnMoveForm = {
        newMove: levelUpMoves[0]
      }
      const updatedPokemon = await pokemonService.newMove(partyPokemon._id, newMove)
      setPartyPokemon(updatedPokemon)
      if (levelUpMoves.length > 1) {
        const newLevelUpMoves = levelUpMoves.filter(move => {
          move.name !== levelUpMoves[0].name
        })
        setLevelUpMoves(newLevelUpMoves)
      } else {
        setLevelUpMoves([])
      }
    }

    const handleChooseForget = (): void => {
      setChooseForget(true)
    }

    const handleChooseNotLearn = (): void => {
      if (levelUpMoves.length === 1) {
        setLevelUpMoves([])
        setShowLevelUpMoves(false)
        evolve()
      } else {
        const newLevelUpMoves = levelUpMoves.filter(move => {
          move.name !== levelUpMoves[0].name
        })
        setLevelUpMoves(newLevelUpMoves)
      }
    }

    const handleCancelForget = (): void => {
      setChooseForget(false)
      if (levelUpMoves.length === 1) {
        setLevelUpMoves([])
        setShowLevelUpMoves(false)
        evolve()
      } else {
        const newLevelUpMoves = levelUpMoves.filter(move => {
          move.name !== levelUpMoves[0].name
        })
        setLevelUpMoves(newLevelUpMoves)
      }
    }

    const forgetMove = async (move: Move): Promise<void> => {
      const moveData: LearnMoveForm = {
        newMove: levelUpMoves[0],
        oldMoveId: move._id
      }
      const updatedPokemon = await pokemonService.newMove(partyPokemon._id, moveData)
      setPartyPokemon(updatedPokemon)
      setChooseForget(false)
      if (levelUpMoves.length === 1) {
        setLevelUpMoves([])
        setShowLevelUpMoves(false)
        evolve()
      } else {
        const newLevelUpMoves = levelUpMoves.filter(move => {
          move.name !== levelUpMoves[0].name
        })
        setLevelUpMoves(newLevelUpMoves)
      }
    }


    const evolve = async (): Promise<void> => {
      setShowLevelUp(false)
      setShowLevelUpMoves(false)
      console.log('EVOLVE')
      if (partyPokemon.evolves && partyPokemon.evolvesTo[0].minLevel) {
        if (partyPokemon.level >= partyPokemon.evolvesTo[0].minLevel) {
          const preEvolve = partyPokemon
          const updatedPokemon = await pokemonService.evolve(partyPokemon._id)
          if (typeof updatedPokemon !== 'string') {
            setEvolveTxt(`${capPokemon(preEvolve)} evolved into ${capPokemon(updatedPokemon)}!`)
            setShowEvolve(true)
            setPartyPokemon(updatedPokemon)
          }
        }
      } else {
        faintPokemon()
      }
    }

    
    const opponentHealth = document.getElementById('opponent-health-percent')
    const playerHealth = document.getElementById('player-health-percent')
    const playerExp = document.getElementById('exp-percent')
    if (opponentHealth && playerHealth) {
      opponentHealth.style.width = `${opponentHealthPer}%`
      playerHealth.style.width = `${playerHealthPer}%`
    }

    const handleChooseBall = async (packBall: Ball): Promise<void> => {
      setBall(packBall)
      setBallMsg(`You threw a ${packBall.name}!`)
      setShowBallMsg(true)
      setShowBalls(false)
      handleShowNone()
    }

    const handleUseBall = async (): Promise<void> => {
      if (ball) {
        setShowBallMsg(false)
        const ballResponse = await battleService.useBall(ball._id, newPokemon._id)
        setBall(undefined)
        setUserProfile(ballResponse[0])
        if (typeof ballResponse[1] === 'string') {
          if (ballResponse[2] === true) {
            const foundOpponent = await pokemonService.findPokemon(newPokemon._id)
            setNewPokemon(foundOpponent)
            let opponentMoveSet: Move[] = []
            foundOpponent.moveSet.forEach(move => {
              if (move.currentPP > 0) {
                opponentMoveSet.push(move)
              }
            })
            const randomNum = Math.floor(Math.random() * opponentMoveSet.length)
            const opponentMoveId = opponentMoveSet[randomNum]
            const opponentMove = await battleService.findMove(opponentMoveId._id)
            setSecondMove(opponentMove)
            setOpponentTurn(true)
            setTarget(partyPokemon)
            setAttacker(foundOpponent)
            setMedMsg(ballResponse[1])
            setShowMedMsg(true)
          } else {
            setErrMsg(ballResponse[1])
            setShowErrMsg(true)
          }
        } else if (typeof ballResponse[2] === 'string') {
          setCaughtMsg(ballResponse[2])
          setShowCaughtMsg(true)
        }
      }
    }

    const handleEndBattle = (): void => {
      setShowCaughtMsg(false)
      battleUnInit()
    }

    const handleChooseMedicine = async (medicine: Medicine): Promise<void> => {
      setMed(medicine)
      setShowPack(false)
      setShowPokList(true)
    }

    const cancelMed = async (): Promise<void> => {
      setMed(undefined)
      setShowPack(false)
      setShowPokList(false)
      setEtherPok(undefined)
      setEtherMove(undefined)
      setShowEtherMoves(false)
    }

    const handleChooseEtherMove = async (move: Move) => {
      if (etherPok) {
        setEtherMove({
          moveId: move._id
        })
        setShowEtherMoves(false)
        setShowEtherTxt(true)
      } else {
        console.log('NO ETHER POK')
      }
    }


    const handleUseMedicine = async (pokemon: Pokemon): Promise<void> => {
      try {
        if (med) {
          if (med.ether) {
            console.log('USE ETHER')
            if (etherMove) {
              console.log('ETHER MOVE:', etherMove)
              const medResponse = await battleService.useMedicine(med._id, pokemon._id, etherMove)
              if (typeof medResponse === 'string') {
                setErrMsg(medResponse)
                setShowErrMsg(true)
                setEtherPok(undefined)
                setEtherMove(undefined)
                setCheckParty(!checkParty)
              } else {
                console.log(medResponse)
                setUserProfile(medResponse[0])
                const foundOpponent = await pokemonService.findPokemon(newPokemon._id)
                setNewPokemon(foundOpponent)
                let opponentMoveSet: Move[] = []
                foundOpponent.moveSet.forEach(move => {
                  if (move.currentPP > 0) {
                    opponentMoveSet.push(move)
                  }
                })
                const randomNum = Math.floor(Math.random() * opponentMoveSet.length)
                const opponentMoveId = opponentMoveSet[randomNum]
                const opponentMove = await battleService.findMove(opponentMoveId._id)
                setSecondMove(opponentMove)
                setOpponentTurn(true)
                setTarget(partyPokemon)
                setAttacker(foundOpponent)
                setMedMsg(medResponse[2])
                setCheckParty(!checkParty)
                setShowMedMsg(true)
                setEtherPok(undefined)
                setEtherMove(undefined)
              }
            } else {
              console.log('NO ETHER MOVE')
              const etherPok = await pokemonService.findPokemon(pokemon._id)
              setEtherPok(etherPok)
              setShowEtherMoves(true)
              setShowPack(false)
              setShowMedicine(false)
              setShowPokList(false)
              setCheckParty(!checkParty)
            }
          } else {
            setShowPack(false)
            setShowPokList(false)
            const medResponse = await battleService.useMedicine(med._id, pokemon._id)
            setMed(undefined)
            if (typeof medResponse === 'string') {
              setErrMsg(medResponse)
              setShowErrMsg(true)
            } else {
              setUserProfile(medResponse[0])
              const foundOpponent = await pokemonService.findPokemon(newPokemon._id)
              setNewPokemon(foundOpponent)
              let opponentMoveSet: Move[] = []
              foundOpponent.moveSet.forEach(move => {
                if (move.currentPP > 0) {
                  opponentMoveSet.push(move)
                }
              })
              const randomNum = Math.floor(Math.random() * opponentMoveSet.length)
              const opponentMoveId = opponentMoveSet[randomNum]
              const opponentMove = await battleService.findMove(opponentMoveId._id)
              setSecondMove(opponentMove)
              setOpponentTurn(true)
              setTarget(partyPokemon)
              setAttacker(foundOpponent)
              setMedMsg(medResponse[2])
              setCheckParty(!checkParty)
              setShowMedMsg(true)
          }
          }
        }
        
      } catch (error) {
        console.log(error)
      }
    }
    
    const handleChooseMove = async (move: Move, userPok: Pokemon, opponent: Pokemon ): Promise<void> => {
      if (move.currentPP > 0) {
        const foundOpponent = await pokemonService.findPokemon(opponent._id)
        setNewPokemon(foundOpponent)
        let opponentMoveSet: Move[] = []
        foundOpponent.moveSet.forEach(move => {
          if (move.currentPP > 0) {
            opponentMoveSet.push(move)
          }
        })
        const randomNum = Math.floor(Math.random() * opponentMoveSet.length)
        const opponentMoveId = opponentMoveSet[randomNum]
        const opponentMove = await battleService.findMove(opponentMoveId._id)
        const moves: Move[] = [move, opponentMove]
        // console.log(move, opponentMove)
        if (moves[0].priority > moves[1].priority) {
          setBattleText(`${userPok.name} used ${move.name}!`)
          setShowBattleText(true)
          const updatedOpponent = await battleService.useMove(moves[0]._id, userPok._id, foundOpponent._id)
          setNewPokemon(updatedOpponent)
          setOpponentHealthPer((75 * (updatedOpponent.currentHP/ updatedOpponent.totalHP)))
          const updatedUser = await pokemonService.findPokemon(partyPokemon._id)
          setPartyPokemon(updatedUser)
          setSecondMove(moves[1])
          setOpponentTurn(true)
          setTarget(updatedUser)
          setAttacker(updatedOpponent)
        } else if (moves[1].priority > moves[0].priority) {
          setBattleText(`${foundOpponent.name} used ${moves[1].name}!`)
          setShowBattleText(true)
          const updatedUser = await battleService.useMove(moves[1]._id, foundOpponent._id, userPok._id)
          setPartyPokemon(updatedUser)
          setPlayerHealthPer((75 * (updatedUser.currentHP/ updatedUser.totalHP)))
          const updatedOpponent = await pokemonService.findPokemon(newPokemon._id)
          setNewPokemon(updatedOpponent)
          setSecondMove(moves[0])
          setOpponentTurn(false)
          setTarget(updatedOpponent)
          setAttacker(updatedUser)
        } else {
          if (userPok.speed > foundOpponent.speed) {
            setBattleText(`${userPok.name} used ${move.name}!`)
            setShowBattleText(true)
            const updatedOpponent = await battleService.useMove(moves[0]._id, userPok._id, foundOpponent._id)
            setNewPokemon(updatedOpponent)
            setOpponentHealthPer((75 * (updatedOpponent.currentHP/ updatedOpponent.totalHP)))
            const updatedUser = await pokemonService.findPokemon(partyPokemon._id)
            setPartyPokemon(updatedUser)
            setSecondMove(moves[1])
            setOpponentTurn(true)
            setTarget(updatedUser)
            setAttacker(updatedOpponent)
          } else {
            setBattleText(`${foundOpponent.name} used ${moves[1].name}!`)
            setShowBattleText(true)
            const updatedUser = await battleService.useMove(moves[1]._id, foundOpponent._id, userPok._id)
            setPartyPokemon(updatedUser)
            setPlayerHealthPer((75 * (updatedUser.currentHP/ updatedUser.totalHP)))
            const updatedOpponent = await pokemonService.findPokemon(newPokemon._id)
            setNewPokemon(updatedOpponent)
            setSecondMove(moves[0])
            setOpponentTurn(false)
            setTarget(updatedOpponent)
            setAttacker(updatedUser)
          }
        }

      }
    }

    const handleNextMove = async (move: Move, attacker: Pokemon, target: Pokemon, opponentTurn: boolean): Promise<void> => {
      if (attacker.currentHP > 0) {
        setShowMedMsg(false)
        setBattleText(`${attacker.name} used ${move.name}!`)
        setShowBattleText(false)
        setSecondTurn(true)
        if (opponentTurn) {
          const updatedUser = await battleService.useMove(move._id, attacker._id, target._id)
          setPartyPokemon(updatedUser)
          setPlayerHealthPer((75 * (updatedUser.currentHP/ updatedUser.totalHP)))
          // console.log(updatedUser)
          const updatedOpponent = await pokemonService.findPokemon(newPokemon._id)
          setNewPokemon(updatedOpponent)
          const profilesData: Profile[] = await profileService.getAllProfiles()
          setUserProfile(profilesData.find(profile => profile._id === user?.profile))
        } else {
          const updatedOpponent = await battleService.useMove(move._id, attacker._id, target._id)
          setNewPokemon(updatedOpponent)
          setOpponentHealthPer((75 * (updatedOpponent.currentHP/ updatedOpponent.totalHP)))
          const updatedUser = await pokemonService.findPokemon(partyPokemon._id)
          setPartyPokemon(updatedUser)
          const profilesData: Profile[] = await profileService.getAllProfiles()
          setUserProfile(profilesData.find(profile => profile._id === user?.profile))
        }
      } else {
        setShowBattleText(false)
        setOpponentFainted(true)
      }
    }

    const handleChangePokemon = async (pokemon: Pokemon): Promise<void> => {
      if (pokemon._id !== partyPokemon._id && pokemon.currentHP > 0) {
        const newPartyPok = await pokemonService.findPokemon(pokemon._id)
        setPartyPokemon(newPartyPok)
        setSelectedPokId(newPartyPok._id)
        handleShowNone()
        setShowContinue(false)
      }
    }

    const opponentImg = new Image()
    opponentImg.src = `${newPokemon.spriteFront}`
    opponentImg.className = 'opponent'

    const partyPokemonCurrentExp = partyPokemon.currentExp
    const partyPokemonLevelBase = partyPokemon.levelBaseExp
    const partyPokemonNextLevel = partyPokemon.nextLevelExp
    const partyPokemonExpPercent = (partyPokemonCurrentExp - partyPokemonLevelBase) / (partyPokemonNextLevel - partyPokemonLevelBase)
    const partyPokemonExp = partyPokemonExpPercent

    if (playerExp) {
      if (partyPokemonExp <= 1) {
        playerExp.style.width = `${(partyPokemonExp * 75)}%`
      } else {
        playerExp.style.width = `75%`
      }
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
          {/* <button onClick={battleUnInit}>finish battle</button> */}
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
          {opponentFainted ? 
          (<div className='opponent-faint' onClick={() => expGain()}>
            <p className='opponent-faint-txt'>{opponentFaintTxt}</p>
          </div>) 
          : (<></>)}
          {med && showEtherTxt && etherMove && etherPok ? 
          (<div className='opponent-faint' onClick={() => handleUseMedicine(etherPok)}>
            <p className='opponent-faint-txt'>You used {med.name} on {capPokemon(etherPok)}!</p>
          </div>) 
          : (<></>)}
          {showExpGain ? 
          (<div className='opponent-faint' onClick={() => levelUp()}>
            <p className='opponent-faint-txt'>{capPokemon(partyPokemon)} gained experience for defeating the wild {capPokemon(newPokemon)!}</p>
          </div>) 
          : (<></>)}
          {showEvolve ? 
          (<div className='opponent-faint' onClick={() => checkForMoves()}>
            <p className='opponent-faint-txt'>{evolveTxt}</p>
          </div>) 
          : (<></>)}
          {showLevelUp ? 
          (<div className='opponent-faint' onClick={() => checkForMoves()}>
            <p className='opponent-faint-txt'>{capPokemon(partyPokemon)} leveled up to level {partyPokemon.level}!</p>
          </div>) 
          : (<></>)}
          {showLevelUpMoves ? 
          (<div className='opponent-faint'>
            <p className='opponent-faint-txt'>{learnMoveTxt}</p>
            {mustForget ? 
            (<>
              <button onClick={() => handleChooseForget()}>Forget Move</button>
              <button onClick={() => handleChooseNotLearn()}>Don't Learn</button>
            </>) 
            : 
            (<>
              <button onClick={() => handleLearnNextMove()}>OK</button>
            </>)}
          </div>) 
          : (<></>)}
          {chooseForget ? 
          (<div className='forget-move'>
            {partyPokemon.moveSet.map(move => (
              <div className='move' onClick={() => forgetMove(move)}>
                <p>{move.name}</p>
              </div>
            ))}
            <button onClick={() => handleCancelForget()}>Cancel</button>
          </div>) 
          : (<></>)}
          {showStartTxt ? 
          (<div className='opponent-faint' onClick={() => setShowStartTxt(false)}>
            <p className='opponent-faint-txt'>{startTxt}</p>
          </div>) 
          : (<></>)}
          {userFainted ? 
          (<div className='opponent-faint'>
            <p className='opponent-faint-txt'>{opponentFaintTxt}</p>
            {viableParty ? 
            (<>
              <button onClick={() => continueBattle()}>Continue?</button>
              <button onClick={() => endBattle()}>Run?</button>
            </>) 
            : 
            (<>
              <button onClick={() => endBattle()}>End Battle</button>
            </>)}
          </div>) 
          : (<></>)}
          {showErrMsg && errMsg ? 
          (<div className='opponent-faint' onClick={() => setShowErrMsg(false)}>
            <p className='opponent-faint-txt'>{errMsg}</p>
          </div>) 
          : (<></>)}
          {showCaughtMsg && caughtMsg ? 
          (<div className='opponent-faint' onClick={() => handleEndBattle()}>
            <p className='opponent-faint-txt'>{caughtMsg}</p>
          </div>) 
          : (<></>)}
          {showMedMsg && medMsg && secondMove && attacker && target ? 
          (<div className='opponent-faint' onClick={() => handleNextMove(secondMove, attacker, target, opponentTurn)}>
            <p className='opponent-faint-txt'>{medMsg}</p>
          </div>) 
          : (<></>)}
          {showBallMsg && ballMsg ? 
          (<div className='opponent-faint'onClick={() => handleUseBall()}>
            <p className='opponent-faint-txt'>{ballMsg}</p>
          </div>) 
          : (<></>)}
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
                <div className='exp-percent' id='exp-percent'></div>
              </div>
            </div>
          </div>
          <div className='battle-menu'>
            <div className='move-selection'>
              { showMoves ? (
                partyPokemon.moveSet.map((move) => 
                  <div className='move' key={move._id} onClick={() => handleChooseMove(move, partyPokemon, newPokemon)}>
                    <p className='move-name'>{move.name}</p>
                    <p className='move-pp'>{move.currentPP}/{move.totalPP}</p>
                    <p className='move-type'>{move.type}</p>
                  </div>
                )
              ) : (<></>)
              }
            </div>
            {showEtherMoves && etherPok ? 
            (<>
            <div className='ether-move-menu'>
              <div className='ether-txt-div'>
                <p className='ether-menu-txt'>Please select one of {capPokemon(etherPok)}'s moves to restore PP:</p>
                <button onClick={() => cancelMed()}>Cancel</button>
              </div>
              <div className='ether-move-selection'>
                {
                  etherPok.moveSet.map((move) => 
                    <div className='move' key={move._id} onClick={() => handleChooseEtherMove(move)}>
                      <p className='move-name'>{move.name}</p>
                      <p className='move-pp'>{move.currentPP}/{move.totalPP}</p>
                      <p className='move-type'>{move.type}</p>
                    </div>
                  )
                }
              </div>

            </div>
            </>) 
            : (<></>)}
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
              <div className='option-div' onClick={() => endBattle()}>
                <p className='option-text'>Run</p>
              </div>
            </div>
          </div>
          {showParty ? (
            <div className='party-menu'>
              <div className='party-list'>
                {
                  fullParty.map((pokemon) => 
                  <div className='pokemon' onClick={() => handleChangePokemon(pokemon)}>
                    <p className='pokemon-list-name'>{capPokemon(pokemon)}</p>
                    <img src={pokemon.spriteFront} alt="" />
                    <p className='party-level'>Lv: {pokemon.level}</p>
                    <p className='party-hp'>{Math.floor(pokemon.currentHP)}/{Math.floor(pokemon.totalHP)} HP</p>
                    {pokemon._id === partyPokemon._id || pokemon.currentHP <= 0 ? (<></>) : 
                    (<>
                      <div>
                        <p>Choose this pokemon!</p>
                      </div>
                    </>)}
                  </div>
                  )
                }

              </div>
              <div className='party-close'>
                <button onClick={() => handleShowNone()} className='menu-close-btn'>Close</button>
              </div>
            </div>
          ) : (<></>)}
          {showContinue ? (
            <div className='party-menu'>
              {
                fullParty.map((pokemon) => 
                <div className='pokemon' onClick={() => handleChangePokemon(pokemon)}>
                  <p>{capPokemon(pokemon)}</p>
                  <img src={pokemon.spriteFront} alt="" />
                  <p className='party-level'>Lv: {pokemon.level}</p>
                  <p className='party-hp'>{Math.floor(pokemon.currentHP)}/{pokemon.totalHP} HP</p>
                  {pokemon._id === partyPokemon._id || pokemon.currentHP <= 0 ? (<></>) : 
                  (<>
                    <div>
                      <p>Choose this pokemon!</p>
                    </div>
                  </>)}
                </div>
                )
              }
              <div className='party-close'>
                <button onClick={() => endBattle()} className='menu-close-btn'>Cancel</button>
              </div>
            </div>
          ) : (<></>)}
          {showPokList && med ? (
            <div className='party-menu'>
              <div className='pokemon-med-selection'>
                <p>Please choose a pokemon to use {med.name} on:</p>
              </div>
              <div className='med-party-list'>
                {
                  fullParty.map((pokemon) => 
                  <div className='pokemon' onClick={() => handleUseMedicine(pokemon)}>
                    <p>{capPokemon(pokemon)}</p>
                    <img src={pokemon.spriteFront} alt="" />
                    <p className='party-level'>Lv: {pokemon.level}</p>
                    <p className='party-hp'>{Math.floor(pokemon.currentHP)}/{Math.floor(pokemon.totalHP)} HP</p>
                    {pokemon._id === partyPokemon._id || pokemon.currentHP <= 0 ? (<></>) : 
                    (<>
                      <div>
                        <p>Choose this pokemon!</p>
                      </div>
                    </>)}
                  </div>
                  )
                }

              </div>
              <div className='party-close'>
                <button onClick={() => cancelMed()} className='menu-close-btn'>Cancel</button>
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
              (<div className='item-list'>
                {pack.ballPocket.map((ball) => 
                <div className='item' onClick={() => handleChooseBall(ball)}>
                  <p>{ball.name}</p>
                  <p className='item-description'>{ball.description}</p>
                  <p className='item-description'>Use this item?</p>
                </div>
                )}
              </div>) : (<></>)}
              {showMedicine && pack ? 
              (<div className='item-list'>
                {pack.medicinePocket.map((medicine) => 
                <div className='item' onClick={() => handleChooseMedicine(medicine)}>
                  <p>{medicine.name}</p>
                  <p className='item-description'>{medicine.description}</p>
                </div>
                )}
              </div>) : (<></>)}
              <div className='party-close'>
                <button onClick={() => handleShowNone()} className='menu-close-btn'>Close</button>
              </div>
            </div>
          ) : (<></>)}
          {showBattleText && secondMove && attacker && target ? 
          (<div className='battle-text-div' onClick={() => handleNextMove(secondMove, attacker, target, opponentTurn)}>
            <p className='battle-text'>{battleText}</p>
          </div>) 
          : showBattleText ? 
          (<div className='battle-text-div'>
          <p className='battle-text'>{battleText}</p>
          </div>) 
          : (<></>) }
          {secondTurn ? 
          (<div className='battle-text-div' onClick={() => setSecondTurn(false)}>
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

  } else if (newPokemon) {
    return (
      <>
      <div className='battle-screen'>
        <p>All your pokemon are fainted!!!</p>
        <button onClick={() => battleUnInit()}>Return to game</button>
        <canvas id='battle-canvas'></canvas>
      </div>
      </>
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


  
}

export default BattleScreen