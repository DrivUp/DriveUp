import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const setUserData = {
      fullName: {
        firstName: firstName,
        lastName: lastName,
      },
      email,
      password,
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

    if (response.status === 201) {
      const data = response.data;
      localStorage.setItem('token', data.token);
      navigate('/home');
    }

    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f0f0f0] to-[#e8e8e8] px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
         
          <h2 className="text-2xl font-semibold py-1.5">Create CarPooler Account</h2>
          <p className="text-gray-500 text-sm mt-1">Enjoy the rides</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Full Name
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                required
                placeholder="First Name"
                className="w-1/2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                required
                placeholder="Last Name"
                className="w-1/2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Create a strong password"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>

      
      </div>
    </div>
  );
};

export default UserSignup;
