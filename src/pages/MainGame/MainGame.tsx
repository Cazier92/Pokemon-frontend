// npm packages
import { useState, useEffect } from 'react'

// services
import * as profileService from '../../services/profileService'
import * as pokemonService from '../../services/pokemonService'

// types
import { Profile } from '../../types/models'
import { Pokemon } from '../../types/models'
import { Sprite } from '../../types/models'
import { Frames } from '../../types/models'
import { Position } from '../../types/models'
import { Boundary } from '../../types/models'
import { Map } from '../../types/models'
import { ProfileData } from '../../types/forms'

// data imports



// components

import BattleScreen from '../../components/BattleScreen/BattleScreen'

interface MainGameProps {
  allPokemon: Pokemon[];
  userProfile: Profile | undefined;
  currentMap: Map | undefined;
  handleUpdateProfile: (profileData: ProfileData, _id: Profile['_id']) => Promise<void>;
  onLand: boolean;
  setOnLand: React.Dispatch<React.SetStateAction<boolean>>;
  newPokemon: Pokemon | undefined;
  handleGeneratePokemon: (num: Pokemon['pokedexNum'], level: Pokemon['level']) => Promise<void>;
  starterPokemon: Pokemon[] | undefined;
  handleGenerateStarters: (nums: number[]) => Promise<void>;
  handleAddToParty: (userId: Profile['_id'],pokemonId: Pokemon['_id']) => Promise<void>;
  partyPokemon: Pokemon | undefined;
}

import './MainGame.css'
const MainGame = (props: MainGameProps): JSX.Element => {
  const {allPokemon, userProfile, currentMap, handleUpdateProfile, onLand, setOnLand, newPokemon, handleGeneratePokemon, starterPokemon, handleGenerateStarters, handleAddToParty, partyPokemon} = props

  //^ State:

  const [battleActive, setBattleActive] = useState<boolean>(false)

  let newX = 0
  let newY = 0
  

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'w':
        keys.w.pressed = true
        break
      case 'a':
        keys.a.pressed = true
        break
      case 's':
        keys.s.pressed = true
        break
      case 'd':
        keys.d.pressed = true
        break
    }
  }



  const handleKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'w':
        keys.w.pressed = false
        break
      case 'a':
        keys.a.pressed = false
        break
      case 's':
        keys.s.pressed = false
        break
      case 'd':
        keys.d.pressed = false
        break
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  window.addEventListener('keyup', handleKeyUp)


  let randomNum = (Math.random())


  const keys = {
    w: {
      pressed: false
    },
    a: {
      pressed: false
    },
    s: {
      pressed: false
    },
    d: {
      pressed: false
    },
  }
  
  const capPokemon = (pokemon: Pokemon): string | undefined => {
    if (pokemon.name) {
      return (pokemon.name[0].toUpperCase() + pokemon.name.slice(1))
    }
  }

  if (currentMap && userProfile) {
    if (partyPokemon) {
      

      const image = new Image()
      image.src = currentMap.backgroundUrl
    
      const foregroundImage = new Image()
      foregroundImage.src = currentMap.foregroundUrl
    
      const playerDown = new Image()
      playerDown.src = '/playerDown.png'
    
      const playerUp = new Image()
      playerUp.src = '/playerUp.png'
    
      const playerLeft = new Image()
      playerLeft.src = '/playerLeft.png'
    
      const playerRight = new Image()
      playerRight.src = '/playerRight.png'
  
  
      const collisions: number[] = currentMap.hardBoundaries
      const battleZonesData: number[] = currentMap.battleZones
  
  
  
      const collisionMap: number[][] = []
      const battleZoneMap: number[][] = []
    
      for (let i = 0; i < collisions.length; i += 70) {
        collisionMap.push(collisions.slice(i, i + 70))
      }
      for (let i = 0; i < battleZonesData.length; i += 70) {
        battleZoneMap.push(battleZonesData.slice(i, i + 70))
      }
    
      const boundaries: Boundary[] = []
      const battleZones: Boundary[] = []
    
      collisionMap.forEach((row: number[], i) => {
        row.forEach((sym, j) => {
          if (sym === 1025) {
            boundaries.push({
              position: {
                x: j * 48 + currentMap.offset.x + userProfile.coordinates.x,
                y: i * 48 + currentMap.offset.y + userProfile.coordinates.y
              },
              width: 48,
              height: 48,
            })
          }
        })
      })
      battleZoneMap.forEach((row: number[], i) => {
        row.forEach((sym, j) => {
          if (sym === 1025) {
            battleZones.push({
              position: {
                x: j * 48 + currentMap.offset.x + userProfile.coordinates.x,
                y: i * 48 + currentMap.offset.y + userProfile.coordinates.y
              },
              width: 48,
              height: 48,
            })
          }
        })
      })
  
      const background: Sprite = {
        position: {
          x: currentMap.offset.x + userProfile.coordinates.x,
          y: currentMap.offset.y + userProfile.coordinates.y,
        },
        image: image,
        frames: {
          max: 1,
          hold: 10,
          val: 0,
          elapsed: 0,
        },
        animate: false,
        width: image.width,
        height: image.height
      }
    
      const foreground: Sprite = {
        position: {
          x: currentMap.offset.x + userProfile.coordinates.x,
          y: currentMap.offset.y + userProfile.coordinates.y,
        },
        image: foregroundImage,
        frames: {
          max: 1,
          hold: 10,
          val: 0,
          elapsed: 0,
        },
        animate: false,
        width: foregroundImage.width,
        height: foregroundImage.height,
      }
    
      const movables = [background, ...boundaries, foreground, ...battleZones]
    
      const rectangularCollision = (sprite: Sprite, boundary: Boundary): boolean => {
        return (
          sprite.position.x + sprite.width >= boundary.position.x &&
          sprite.position.x <= boundary.position.x + boundary.width &&
          sprite.position.y + sprite.height / 2 <= boundary.position.y + boundary.height &&
          sprite.position.y + sprite.height - 5 >= boundary.position.y
        )
      } 
    
      const overlappingArea = (sprite: Sprite, boundary: Boundary): number => {
        const overlap = (Math.min(sprite.position.x + sprite.width, boundary.position.x + boundary.width) - Math.max(sprite.position.x, boundary.position.x)) * (Math.min(sprite.position.y + sprite.height, boundary.position.y + boundary.height) - Math.max(sprite.position.y, boundary.position.y))
        return overlap
      }
    
      const canvas = document.querySelector('canvas')
  
      const context = canvas?.getContext('2d')
  
          if (canvas) {
            canvas.width = 1024
            canvas.height = 576
          }
    
          const player: Sprite = {
            position: {
              x: ((1024 / 2) - ((192 / 4) / 2)),
              y: ((576 / 2) - (68 / 2)),
            },
            image: playerDown,
            frames: {
              max: 4,
              hold: 10,
              val: 0,
              elapsed: 0,
            },
            animate: false,
            width: playerDown.width / 4,
            height: playerDown.height,
            sprites: {
              up: playerUp,
              down: playerDown,
              left: playerLeft,
              right: playerRight,
            },
          }
          if (canvas) {
            player.position = {
              x: ((canvas.width / 2) - ((192 / 4) / 2)),
              y: ((canvas.height / 2) - (68 / 2)),
            }
          }
    
            const draw = (sprite: Sprite): void => {
              if (context) {
                let value = 0
                if (sprite.frames.val) {
                  value = sprite.frames.val
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
                  sprite.image.width / sprite.frames.max,
                  sprite.image.height,
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
    
            const drawBoundary = (boundary: Boundary): void => {
              if (context) {
                context.fillStyle = 'rgba(255, 0, 0, .5)'
                context.fillRect(boundary.position.x, boundary.position.y, boundary.width, boundary.height)
    
              }
            }
    
            const animate = () => {
              const animationId = window.requestAnimationFrame(animate)
              
    
          
              //^ Keyboard Event listeners:
    
    
              //^ Draw Map, Boundaries, Player, and Foreground:
    
              draw(background)
              boundaries.forEach(boundary => {
                drawBoundary(boundary)
              })
              battleZones.forEach(boundary => {
                drawBoundary(boundary)
              })
              draw(player)
              draw(foreground)
    
              let moving: boolean = true
              player.animate = false
    
              if (battleActive) {
                return
              }
    
              //^ Activate Battle:
              if(onLand) {
                if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
                  for (let i = 0; i < battleZones.length; i++) {
                    const battleZone = battleZones[i]
                    if (
                      rectangularCollision(player, battleZone) && (overlappingArea(player, battleZone)) > ((player.width * player.height) / 2) && (randomNum < 0.004)
                    ) {
                      window.cancelAnimationFrame(animationId)
                      setBattleActive(true)
                      handleUpdateProfile({
                        coordinates: {
                          x: (userProfile.coordinates.x + newX),
                          y: (userProfile.coordinates.y + newY),
                          land: true
                        }
                      }, userProfile._id)
                      console.log('WILD POKEMON ENCOUNTERED')
                      let minLevel = currentMap.grassPokemon.minLevel
                      let maxLevel = currentMap.grassPokemon.maxLevel
                      const pokemonFound = currentMap.grassPokemon.pokedexNums
                      const pokemonLevel = (Math.floor(Math.random() * ((maxLevel + 1) - minLevel) + minLevel))
                      let pokemonIdx = (Math.floor(Math.random() * pokemonFound.length))
                      const pokemonNum = pokemonFound[pokemonIdx]
                      console.log('num:', pokemonNum, 'level:', pokemonLevel)
                      handleGeneratePokemon(pokemonNum, pokemonLevel)
                      
                      break
                    } else {
                      randomNum = (Math.random())
                    }
                  }
                }
              }
    
    
              //^ Control Movement:
    
              if (keys.s.pressed) {
                player.animate = true
                if (player.sprites) {
                  player.image = player.sprites.down
                }
            
                for (let i = 0; i < boundaries.length; i++) {
                  const boundary = boundaries[i]
                  if (rectangularCollision(player, {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                  }})) {
                    moving = false
                    break
                  }
                }
                if (moving) {
                  movables.forEach(movable => {
                    movable.position.y -= 3
                  })
                  newY -= 3
                }
                
            
              }
              if (keys.w.pressed) {
                player.animate = true
                if (player.sprites) {
                  player.image = player.sprites.up
                }
                for (let i = 0; i < boundaries.length; i++) {
                  const boundary = boundaries[i]
                  if (rectangularCollision(player, {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                  }})) {
                    moving = false
                    break
                  }
                }
                if (moving) {
                  movables.forEach(movable => {
                    movable.position.y += 3
                  })
                  newY += 3
                }
              }
              if(keys.a.pressed) {
                player.animate = true
                if (player.sprites) {
                  player.image = player.sprites.left
                }
                for (let i = 0; i < boundaries.length; i++) {
                  const boundary = boundaries[i]
                  if (rectangularCollision(player, {...boundary, position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                  }})) {
                    moving = false
                    break
                  }
                }
                if (moving) {
                  movables.forEach(movable => {
                    movable.position.x += 3
                  })
                  newX +=3
                }
              }
              if(keys.d.pressed) {
                player.animate = true
                if (player.sprites) {
                  player.image = player.sprites.right
                }
                for (let i = 0; i < boundaries.length; i++) {
                  const boundary = boundaries[i]
                  if (rectangularCollision(player, {...boundary, position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                  }})) {
                    moving = false
                    break
                  }
                }
                if (moving) {
                  movables.forEach(movable => {
                    movable.position.x -= 3
                  })
                  newX -= 3
                }
              }
            }
  
            let opponent: Sprite
            let playerPok: Sprite
        
            if (newPokemon) {
              const opponentImg = new Image()
              opponentImg.src = `${newPokemon.spriteFront}`
              opponentImg.className = 'opponent'
        
              opponent = {
                position: {
                  x: 700,
                  y: -10,
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
            }
            if (partyPokemon) {
              const playerImg = new Image()
              playerImg.src = `${partyPokemon.spriteBack}`
              playerImg.className = 'opponent'
        
              playerPok = {
                position: {
                  x: 200,
                  y: 50,
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
                isPokemon: true
              }
            }
    
            animate()
    
            const battleUnInit = () => {
              setBattleActive(false)
              animate()
            }
  
  
            return (
              <>
                <h1>Main Game Page</h1>
                <canvas id='canvas'></canvas>
                <button onClick={() => battleUnInit()}>Test</button>
                {battleActive ? (
                <BattleScreen battleUnInit={battleUnInit} newPokemon={newPokemon} userProfile={userProfile} partyPokemon={partyPokemon} capPokemon={capPokemon}/>
                ) : (<></>) }
              </>
            )
      
    } else {
      if (starterPokemon) {
      } else {
        handleGenerateStarters([1, 4, 7])
      }

      return (
        <>
          <div className='starter-pok-header'>
            <h1>Please choose a starter pokemon:</h1>
            <p>This decision can only be made once!</p>
          </div>
          <div>
            {starterPokemon ? (
              <div className='starter-pok-div'>
                <div className='starter-pok'>
                  <p className='starter-pok-name'>{capPokemon(starterPokemon[0])}</p>
                  <img src={starterPokemon[0].spriteFront} alt="" className='starter-pok-img' onClick={() => handleAddToParty(userProfile._id, starterPokemon[0]._id)}/>
                </div>
                <div className='starter-pok'>
                  <p className='starter-pok-name'>{capPokemon(starterPokemon[1])}</p>
                  <img src={starterPokemon[1].spriteFront} alt="" className='starter-pok-img' onClick={() => handleAddToParty(userProfile._id, starterPokemon[1]._id)}/>
                </div>
                <div className='starter-pok'>
                  <p className='starter-pok-name'>{capPokemon(starterPokemon[2])}</p>
                  <img src={starterPokemon[2].spriteFront} alt="" className='starter-pok-img' onClick={() => handleAddToParty(userProfile._id, starterPokemon[2]._id)}/>
                </div>
              </div>
            ) : (
              <>
                <h2>Loading...</h2>
              </>
            )}
          </div>
        </>
      )
    }

  } else {
    return (
      <>
        <h1>Loading...</h1>
      </>
    )
  }









  
}

export default MainGame
