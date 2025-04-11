import React, { useState, useContext } from 'react'
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }


    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f0f0f0] to-[#e8e8e8] px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="CarPooler Logo" className="w-20 mb-4" />
          <h2 className="text-2xl font-semibold">Welcome !!!</h2>
          <p className="text-gray-500 text-sm mt-1">Login to continue</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => {
          submitHandler(e)
        }}>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
            Your Email, Please
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <input
              type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          New here?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>

        <div className="mt-8">
          <Link
            to="/captain-login"
            className="w-full block text-center py-2 bg-[#003366] hover:bg-blue-900 text-white font-semibold rounded-lg transition"
          >
            Sign in as Captain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
