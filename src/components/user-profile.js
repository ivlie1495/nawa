import { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login'
import { userQuery, userCreatedPinsQuery, userSavedPinsQuery } from '../utils/data'
import { readClient, writeClient } from '../client'
import MasonryLayout from './masonry-layout'
import Spinner from './spinner'
import { fetchUser } from '../utils/fetch-user'

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'
const activeButtonStyle = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'
const notActiveButtonStyle = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'

const UserProfile = () => {
  const [ user, setUser ] = useState(null)
  const [ pins, setPins ] = useState(null)
  const [ text, setText ] = useState('Created')
  const [ activeButton, setActiveButton ] = useState('created')
  const { userId } = useParams()
  const userInfo = fetchUser()
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  useEffect(() => {
    if (text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId)
      writeClient.fetch(createdPinsQuery).then((data) => {
        setPins(data)
      })
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId)
      writeClient.fetch(savedPinsQuery ).then((data) => {
        setPins(data)
      })
    }
  }, [text, userId])

  useEffect(() => {
    const query = userQuery(userId)
    readClient.fetch(query).then((data) => {
      setUser(data[0])
    })
  }, [userId])

  if (!user || !pins) {
    return (
      <Spinner message="Loading profile..." />
    )
  }
  
  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img src={randomImage} alt="banner-pic" className="w-full h-370 2xl:h-510 shadow-lg object-cover" />
            <img src={user?.image} alt="user-pic" className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover" />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user?.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === userInfo.googleId && (
                <GoogleLogout 
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button 
                      type="button" 
                      className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button 
              type="button" 
              className={`${activeButton === 'created' ? activeButtonStyle : notActiveButtonStyle}`}
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveButton('created')
              }}
            >
              Created
            </button>
            <button 
              type="button" 
              className={`${activeButton === 'saved' ? activeButtonStyle : notActiveButtonStyle}`}
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveButton('saved')
              }}
            >
              Saved
            </button>
          </div>
          {pins?.length > 0 ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No Pins found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile