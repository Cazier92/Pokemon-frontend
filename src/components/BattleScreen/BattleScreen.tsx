// npm modules

// types
import { User } from '../../types/models'
import { Sprite } from '../../types/models';
import { Pokemon } from '../../types/models';


interface BattleScreenProps {
  battleUnInit: () => void;
  newPokemon: Pokemon | undefined;
}

import './BattleScreen.css'

const BattleScreen = (props: BattleScreenProps): JSX.Element => {
  const {battleUnInit, newPokemon} = props

  const canvas = document.querySelector<HTMLCanvasElement>('#battle-canvas')
  const context = canvas?.getContext('2d')
  
  if (canvas) {

    canvas.width = 1024
    canvas.height = 576

    const divStyle = {
      width: canvas.width,
      height: canvas.height
    }

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
      if (newPokemon) {
        const opponentImg = new Image()
        opponentImg.src = `${newPokemon.spriteFront}`
        opponentImg.className = 'opponent'
  
        const opponentPok: Sprite = {
          position: {
            x: 720,
            y: 15,
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
        if(opponentPok) {
          draw(opponentPok)
        }
        const playerImg = new Image()
        playerImg.src = `${newPokemon.spriteBack}`
        playerImg.className = 'opponent'
  
        const playerPok = {
          position: {
            x: 170,
            y: 140,
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
        if(playerPok.image) {
          draw(playerPok)
        }
        
      }

    }

    animate()

    
    return (
      <div className='battle-screen'>
        <h1>This is a battle Screen</h1>
        <button onClick={battleUnInit}>finish battle</button>
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

  
}

export default BattleScreen