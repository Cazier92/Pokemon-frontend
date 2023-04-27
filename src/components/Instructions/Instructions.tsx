// npm modules
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// services
import './Instructions.css'

// stylesheets


// types


interface InstructionsProps {
  setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
}

const Instructions = (props: InstructionsProps): JSX.Element => {
  const {setShowInstructions} = props




  return (
    <div className='instructions'>
      <div className='inst-title'>
        <p>How to play:</p>
      </div>
      
      <button className='close' onClick={() => setShowInstructions(false)}>Close</button>
    </div>
  )
}

export default Instructions
