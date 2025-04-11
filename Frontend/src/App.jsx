import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import UserSignup from './pages/UserSignup.jsx'
import UserLogin from './pages/UserLogin.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'
import Start from './pages/Start.jsx'
import UserProtectWrapper from './pages/UserProtectedWrapper.jsx'
import UserLogout from './pages/UserLogout.jsx'
import CaptainHome from './pages/CaptainHome.jsx'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainRiding from './pages/CaptainRiding.jsx'
import Riding from './pages/Riding'
import CaptainLogout from './pages/CaptainLogout'

const App = () => {
  return (
    <div >
      <Routes>
        <Route path='/' element={<Start/>} />
        <Route path='/login' element={<UserLogin/>} />
        <Route path='/captain-login' element={<CaptainLogin/>} />
        <Route path='/signup' element={<UserSignup/>} />
        <Route path='/captain-signup' element={<CaptainSignup/>} />
        <Route path='/captain-riding' element={<CaptainRiding />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/home' element={<UserProtectWrapper>
          <Home/>
          </UserProtectWrapper>
          } />
        <Route path='/logout' element={<UserProtectWrapper>
          <UserLogout/>
          </UserProtectWrapper>
          } />
        <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>

        } />
          <Route path='/captain-logout' element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        } />

      </Routes>
    </div>
    
  )
}

export default App