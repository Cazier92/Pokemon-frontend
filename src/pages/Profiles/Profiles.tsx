// npm packages
import { useState, useEffect } from 'react'

// services
import * as profileService from '../../services/profileService'

// types
import { Profile } from '../../types/models'
import { Pokemon } from '../../types/models'

interface ProfileProps {
  allPokemon: Pokemon[];
}

const Profiles = (props: ProfileProps): JSX.Element => {
  const [profiles, setProfiles] = useState<Profile[]>([])

  const {allPokemon} = props

  console.log(allPokemon[0].name)

  useEffect((): void => {
    const fetchProfiles = async (): Promise<void> => {
      try {
        const profileData: Profile[] = await profileService.getAllProfiles()
        setProfiles(profileData)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProfiles()
  }, [])

  if(!profiles.length) return <p>No profiles yet</p>

  return (
    <>
      <h1>Hello. This is a list of all the profiles.</h1>
      {profiles.map((profile: Profile) =>
        <p key={profile.id}>{profile.name}</p>
      )}
      <h1>And this is a list of all Pokemon in database:</h1>
      {allPokemon.map((pokemon) => 
        <>
        <h5>{pokemon.name}</h5>
        <img src={pokemon.spriteFront} alt="" />
        </>
      )}
    </>
  )
}

export default Profiles
