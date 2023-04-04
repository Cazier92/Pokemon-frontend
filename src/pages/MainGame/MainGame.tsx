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
  
  const image = new Image()
  image.src = '/public/PokemonGameMap.png'

  const foregroundImage = new Image()
  foregroundImage.src = '/public/foregroundObj.png'

  const playerDown = new Image()
  playerDown.src = '/public/playerDown.png'

  const playerUp = new Image()
  playerUp.src = '/public/playerUp.png'

  const playerLeft = new Image()
  playerLeft.src = '/public/playerLeft.png'

  const playerRight = new Image()
  playerRight.src = '/public/playerRight.png'

  
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

  
  if (!canvas) {
    
  } else {
    const context = canvas.getContext('2d')
    if (!context) {
      
    } else {
      canvas.width = 1024
      canvas.height = 576
      // context.drawImage(
        //   image,
        //   0,
        //   0,
        //   image.width,
        //   image.height,
        //   offset.x,
        //   offset.y,
        //   image.width,
        //   image.height
        //   )
        const draw = (sprite: Sprite): void => {
          let val = 0
          if (sprite.frames.val) {
            val = sprite.frames.val
          }
          context.save()
          context.drawImage(
            sprite.image,
            val * sprite.width,
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
          if (sprite.frames.max > 1 && sprite.frames.elapsed) {
            sprite.frames.elapsed++
          }
          if (sprite.frames.elapsed && sprite.frames.elapsed % sprite.frames.hold === 0) {
            if (sprite.frames.val && sprite.frames.val < sprite.frames.max - 1) {
              sprite.frames.val++
            } else {
              sprite.frames.val = 0
            }
          }
        }

        draw(background)

        const drawBoundary = (boundary: Boundary): void => {
          context.fillStyle = 'rgba(255, 0, 0, .5)'
          context.fillRect(boundary.position.x, boundary.position.y, boundary.width, boundary.height)
        }

        boundaries.forEach(boundary => {
          drawBoundary(boundary)
        })

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
          
          context.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            offset.x,
            offset.y,
            image.width,
            image.height
          )
        }
    }
  }

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




  return (
    <>
      <h1>Main Game Page</h1>
      <canvas id='canvas'></canvas>
    </>
  )
}

export default MainGame
