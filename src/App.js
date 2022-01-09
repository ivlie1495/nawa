import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import { useEffect } from 'react'
import { fetchUser } from './utils/fetch-user'

const App = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const user = fetchUser()

    if (!user) {
      navigate('/login')
    }
  }, [navigate])
  
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  )
}

export default App