import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import UserSignup from './pages/UserSignup.jsx'
import UserLogin from './pages/UserLogin.jsx'
import CapatainLogin from './pages/CapatainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'
import Start from './pages/Start.jsx'
const App = () => {
  return (
    <div >
      <Routes>
        <Route path='/' element={<Start/>} />
        <Route path='/login' element={<UserLogin/>} />
        <Route path='/captain-login' element={<CapatainLogin/>} />
        <Route path='/signup' element={<UserSignup/>} />
        <Route path='/captain-signup' element={<CaptainSignup/>} />


      </Routes>
    </div>
    
  )
}

export default App