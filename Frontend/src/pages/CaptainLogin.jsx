import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';
const  CaptainLogin = () => {
    const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const navigate = useNavigate()
  const { captain, setCaptain } = useContext(CaptainDataContext)
//   const { user, setUser } = useContext(UserDataContext)
const submitHandler = async (e) => {
    e.preventDefault();

    const captain = {
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

    if (response.status === 200) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }


    setEmail('')
    setPassword('')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f0f0f0] to-[#e8e8e8] px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="CarPooler Logo" className="w-20 mb-4" />
          <h2 className="text-2xl font-semibold">Greetings, Captain!</h2>
          <p className="text-gray-500 text-sm mt-1">Login to continue</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => {
          submitHandler(e)
        }}>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
            What's Your  Email
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
        Ready to Drive?{' '}
          <Link to="/captain-signup" className="text-blue-600 hover:underline">
           Register as captain
          </Link>
        </p>

      
      </div>
    </div>
  );
};

export default  CaptainLogin;
