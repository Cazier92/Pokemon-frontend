// npm modules 
import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// page components
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Landing from './pages/Landing/Landing'
import Profiles from './pages/Profiles/Profiles'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import MainGame from './pages/MainGame/MainGame'

// components
import NavBar from './components/NavBar/NavBar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// services
import * as authService from './services/authService'
import * as pokemonService from './services/pokemonService'
import * as profileService from './services/profileService'
import * as mapService from './services/mapService'
import * as apiService from './services/apiService'
import * as packService from './services/packService'

// stylesheets
import './App.css'

// types
import { User } from './types/models'
import { Pokemon } from './types/models'
import { Profile } from './types/models'
import { Map } from './types/models'
import { Pack } from './types/models'

// data 
import { pokeball } from './data/ballData'

// forms
import { ProfileData } from './types/forms'

function App(): JSX.Element {
  const navigate = useNavigate()
  
  const [user, setUser] = useState<User | null>(authService.getUser())
  const [userProfile, setUserProfile] = useState<Profile>()
  const [allProfiles, setAllProfiles] = useState<Profile[]>()
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([])
  const [currentMap, setCurrentMap] = useState<Map>()
  const [updateMap, setUpdateMap] = useState<boolean>(false)
  const [profileData, setProfileData] = useState<ProfileData>()
  const [onLand, setOnLand] = useState<boolean>(true)
  const [newPokemon, setNewPokemon] = useState<Pokemon>()
  const [starterPokemon, setStarterPokemon] = useState<Pokemon[]>()
  const [profileUpdate, setProfileUpdate] = useState<boolean>(false)
  const [partyPokemon, setPartyPokemon] = useState<Pokemon>()
  const [pack, setPack] = useState<Pack>()

  useEffect((): void => {
    const fetchAllPokemon = async (): Promise<void> => {
    try {
        const pokemonData: Pokemon[] = await pokemonService.getAllPokemon()
        setAllPokemon(pokemonData)
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllPokemon()
  }, [])

  useEffect((): void => {
    const fetchAllProfiles = async (): Promise<void> => {
    try {
        const profilesData: Profile[] = await profileService.getAllProfiles()
        setAllProfiles(profilesData)
        setUserProfile(profilesData.find(profile => profile._id === user?.profile))
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllProfiles()
  }, [user, updateMap, profileUpdate])

  useEffect((): void => {
    if (userProfile) {
      if (!userProfile.pack) {
        const associatePack = async (): Promise<void> => {
          try {
            const updatedProfile: Profile = await profileService.associatePack()
            setUserProfile(updatedProfile)
          } catch (error) {
            console.log(error)
          }
        }
        associatePack()
      }
    }
  }, [userProfile])

  useEffect((): void => {
    if (userProfile) {
      if (userProfile.pack) {
        const userPack = async (): Promise<void> => {
          try {
            const pack: Pack = await packService.getUserPack()
            setPack(pack)
          } catch (error) {
            console.log(error)
          }
        }
        userPack()
      }
    }
  }, [userProfile])

  useEffect((): void => {
    if (pack) {
      if (pack.newPack === true) {
        if (pack.ballPocket.length < 5) {
          console.log('LESS THAN 5 BALLS')
          const createBall = async (): Promise<void> => {
            const updatedPack = await packService.createBall(pokeball)
            setPack(updatedPack)
            console.log('BALL CREATED')
          }
          createBall()
        } else {
          console.log('5+ BALLS')
          const changeStatus = async (): Promise<void> => {
            const updatedPack = await packService.changePackStatus()
            setPack(updatedPack)
            console.log('Pack Status Changed.')
          }
          changeStatus()

        }
      } else {
        console.log('NO CHANGES TO PACK')
      }
    }
  }, [pack])

  

  useEffect(():void => {
    if (userProfile?.coordinates.land) {
      setOnLand(userProfile.coordinates.land)
    }
  }, [userProfile])

  useEffect((): void => {
    const fetchMap = async (): Promise<void> => {
    try {
      if (userProfile) {
        const mapData: Map = await mapService.getMap(userProfile?.currentMap)
        setCurrentMap(mapData)
      }
      } catch (error) {
        console.log(error)
      }
    }
    fetchMap()
  }, [userProfile, updateMap])

  useEffect((): void => {
    if (userProfile && userProfile.party && userProfile.party.length) {
      const findPartyPokemon = async (): Promise<void> => {
        const partyPokemon = await pokemonService.findPokemon(userProfile.party[0])
        setPartyPokemon(partyPokemon)
      }
      findPartyPokemon()
    }
  }, [userProfile])

  console.log(userProfile)



  const handleLogout = (): void => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  const handleAuthEvt = (): void => {
    setUser(authService.getUser())
  }

  const handleUpdateProfile = async (profileData: ProfileData, _id: Profile['_id']): Promise<void> => {
    try {
      const updatedProfile = await profileService.updateProfile(profileData, _id)
      console.log(updatedProfile)
      setUpdateMap(!updateMap)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGeneratePokemon = async (num: Pokemon['pokedexNum'], level: Pokemon['level']): Promise<void> => {
    try {
      const newPokemon = await apiService.generatePokemon(num, level)
      setNewPokemon(newPokemon)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGenerateStarters = async (nums: number[]): Promise<void> => {
    try {
      if (nums.length === 3) {
        const starter1 = await apiService.generatePokemon(nums[0], 5)
        const starter2 = await apiService.generatePokemon(nums[1], 5)
        const starter3 = await apiService.generatePokemon(nums[2], 5)
        setStarterPokemon([starter1, starter2, starter3])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddToParty = async (userId: Profile['_id'], pokemonId: Pokemon['_id']): Promise<void> => {
    try {
      const updatedProfile = await pokemonService.addPokemonToParty(userId, pokemonId)
      console.log(updatedProfile)
      setStarterPokemon(undefined)
      setProfileUpdate(!profileUpdate)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing user={user} />} />
        <Route
          path="/signup"
          element={<Signup handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/login"
          element={<Login handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute user={user}>
              <Profiles allPokemon={allPokemon}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maingame"
          element={
            <ProtectedRoute user={user}>
              <MainGame allPokemon={allPokemon} userProfile={userProfile} currentMap={currentMap} handleUpdateProfile={handleUpdateProfile} onLand={onLand} setOnLand={setOnLand} newPokemon={newPokemon} handleGeneratePokemon={handleGeneratePokemon} handleGenerateStarters={handleGenerateStarters} starterPokemon={starterPokemon} handleAddToParty={handleAddToParty} partyPokemon={partyPokemon} setPartyPokemon={setPartyPokemon} setNewPokemon={setNewPokemon}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute user={user}>
              <ChangePassword handleAuthEvt={handleAuthEvt} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
