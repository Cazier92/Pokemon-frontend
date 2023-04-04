// npm packages
import { useState, useEffect } from 'react'

// services
import * as profileService from '../../services/profileService'

// types
import { Profile } from '../../types/models'
import { Pokemon } from '../../types/models'
import { Sprite } from '../../types/models'
import { Frames } from '../../types/models'
import { Position } from '../../types/models'
import { Boundary } from '../../types/models'

// data imports

import {collisions} from '../../data/collisions.js'
import { battleZonesData } from '../../data/battleZones.js'

interface MainGameProps {
  allPokemon: Pokemon[];
}

import './MainGame.css'
const MainGame = (props: MainGameProps): JSX.Element => {
  const {allPokemon} = props

  const offset = {
    x: -1790,
    y: -100,
  }

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
            x: j * 48 + offset.x,
            y: i * 48 + offset.y
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
            x: j * 48 + offset.x,
            y: i * 48 + offset.y
          },
          width: 48,
          height: 48,
        })
      }
    })
  })

  // console.log(boundaries)

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
  
  const image = new Image()
  image.src = '/PokemonGameMap.png'

  const foregroundImage = new Image()
  foregroundImage.src = '/foregroundObj.png'

  const playerDown = new Image()
  playerDown.src = '/playerDown.png'

  const playerUp = new Image()
  playerUp.src = '/playerUp.png'

  const playerLeft = new Image()
  playerLeft.src = '/playerLeft.png'

  const playerRight = new Image()
  playerRight.src = '/playerRight.png'

  
  const canvas = document.querySelector('canvas')

  const background: Sprite = {
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: image,
    frames: {
      max: 1,
      hold: 10,
    },
    animate: false,
    width: image.width,
    height: image.height
  }

  const foreground: Sprite = {
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: foregroundImage,
    frames: {
      max: 1,
      hold: 10,
    },
    animate: false,
    width: foregroundImage.width,
    height: foregroundImage.height,
  }

  // const player: Sprite = {
  //   position: {
  //     x: ((canvas.width / 2) - ((192 / 4) / 2)),
  //     y: ((canvas.height / 2) - (68 / 2)),
  //   },
  //   image: playerDown,
  //   frames: {
  //     max: 4,
  //     hold: 10,
  //     val: 0,
  //     elapsed: 0,
  //   },
  //   animate: false,
  //   width: playerDown.width / 4,
  //   height: playerDown.height,
  //   sprites: {
  //     up: playerUp,
  //     down: playerDown,
  //     left: playerLeft,
  //     right: playerRight,
  //   },
  // }



  // console.log(background)

  const movables = [background, ...boundaries, foreground, ...battleZones]

  const rectangularCollision = (sprite: Sprite, boundary: Boundary): boolean => {
    return (
      sprite.position.x + sprite.width >= boundary.position.x &&
      sprite.position.x <= boundary.position.x + boundary.width &&
      sprite.position.y + sprite.height / 2 <= boundary.position.y + boundary.height &&
      sprite.position.y + sprite.height - 5 >= boundary.position.y
    )
  } 

  const battle = {
    initiated: false
  }
  
  if (!canvas) {
    
  } else {
    const context = canvas.getContext('2d')
    if (!context) {
      
    } else {
      canvas.width = 1024
      canvas.height = 576

      const player: Sprite = {
        position: {
          x: ((canvas.width / 2) - ((192 / 4) / 2)),
          y: ((canvas.height / 2) - (68 / 2)),
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
      const playerXPlus: Sprite = {
        position: {
          x: player.position.x -3,
          y: player.position.y,
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

        const draw = (sprite: Sprite): void => {
          let value = 0
          if (sprite.frames.val) {
            value = sprite.frames.val
          }
          // console.log(sprite.image)
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

        const drawBoundary = (boundary: Boundary): void => {
          context.fillStyle = 'rgba(255, 0, 0, .5)'
          context.fillRect(boundary.position.x, boundary.position.y, boundary.width, boundary.height)
        }

        const animate = () => {
          const animationId = window.requestAnimationFrame(animate)
      
          window.addEventListener('keydown', (e) => {
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
          })
          window.addEventListener('keyup', (e) => {
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
          })

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

          if (battle.initiated) {
            return
          }
          //! Activate Battle:


          //! Movement:
          // for (let i = 0; i < boundaries.length; i++) {
          //   const boundary = boundaries[i]
          //   if (rectangularCollision(player, boundary)) {
          //     // console.log('collision')
          //     // movables.forEach(movable => {
          //     //   movable.position.y += 3
          //     // })
          //     // moving = false
          //     // break
          //     // if (!rectangularCollision(playerXPlus, boundary)) {
          //     //   moving = false
          //     //   player.position.x = playerXPlus.position.x
          //     //   console.log(player.position.x)
          //     //   break
          //     // }
          //     moving = false
          //     player.position.x += 3
          //     break
          //   }
          // }
          if (keys.s.pressed) {
            // console.log('S down')
            player.animate = true
            
            player.image = player.sprites.down
        
            for (let i = 0; i < boundaries.length; i++) {
              const boundary = boundaries[i]
              if (rectangularCollision(player, {...boundary, position: {
                x: boundary.position.x,
                y: boundary.position.y - 3
              }})) {
                // console.log('collision')
                // movables.forEach(movable => {
                //   movable.position.y += 3
                // })
                moving = false
                break
              }
            }
            if (moving)
            movables.forEach(movable => {
              movable.position.y -= 3
            })
            
        
          }
          if (keys.w.pressed) {
            // console.log('W down')
            player.animate = true
            player.image = player.sprites.up
            for (let i = 0; i < boundaries.length; i++) {
              const boundary = boundaries[i]
              if (rectangularCollision(player, {...boundary, position: {
                x: boundary.position.x,
                y: boundary.position.y + 3
              }})) {
                // console.log('collision')
                moving = false
                // movables.forEach(movable => {
                //   movable.position.y -= 3
                // })
                break
              }
            }
            if (moving)
            movables.forEach(movable => {
              movable.position.y += 3
            })
          }
          if(keys.a.pressed) {
            // console.log('A down')
            player.animate = true
            player.image = player.sprites.left
            for (let i = 0; i < boundaries.length; i++) {
              const boundary = boundaries[i]
              if (rectangularCollision(player, {...boundary, position: {
                x: boundary.position.x + 3,
                y: boundary.position.y
              }})) {
                // console.log('collision')
                // movables.forEach(movable => {
                //   movable.position.x -= 3
                // })
                moving = false
                break
              }
            }
            if (moving)
            movables.forEach(movable => {
              movable.position.x += 3
            })
          }
          if(keys.d.pressed) {
            // console.log('D down')
            player.animate = true
            player.image = player.sprites.right
            for (let i = 0; i < boundaries.length; i++) {
              const boundary = boundaries[i]
              if (rectangularCollision(player, {...boundary, position: {
                x: boundary.position.x - 3,
                y: boundary.position.y
              }})) {
                // console.log('collision')
                moving = false
                // movables.forEach(movable => {
                //   movable.position.x += 3
                // })
                break
              }
            }
            if (moving)
            movables.forEach(movable => {
              movable.position.x -= 3
            })
          }
        }

        animate()
    }
  }





  return (
    <>
      <h1>Main Game Page</h1>
      <canvas id='canvas'></canvas>
    </>
  )
}

export default MainGame
