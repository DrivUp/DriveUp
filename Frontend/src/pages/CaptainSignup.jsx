import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext.jsx';

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');

  const [color, setVehicleColor] = useState('');
  const [plate, setVehiclePlate] = useState('');
  const [capacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const { captain, setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      email,
      password,
      vehicle: {
        color: color,
        plate: plate,
        capacity: capacity,
        vehicleType,
      },
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);

      if (response.status === 200 || response.status === 201)
{
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate('/captain-home');
      }

      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
      setVehicleColor('');
      setVehiclePlate('');
      setVehicleCapacity('');
      setVehicleType('');
    } catch (error) {
      console.error('Captain signup failed:', error.response?.data || error.message);
      // Optionally show a toast or message to user here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f0f0f0] to-[#e8e8e8] px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-semibold py-1">Create Captain Account</h2>
          <p className="text-gray-500 text-sm mt-1">Start your journey</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-2">
  {/* Full Name */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
    <div className="flex gap-3">
      <input
        type="text"
        required
        placeholder="First Name"
        className="w-1/2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
        value={firstname}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        required
        placeholder="Last Name"
        className="w-1/2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
        value={lastname}
        onChange={(e) => setLastName(e.target.value)}
      />
    </div>
  </div>

  {/* Email */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
    <input
      type="email"
      required
      placeholder="you@example.com"
      className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>

  {/* Password */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
    <input
      type="password"
      required
      placeholder="Create a strong password"
      className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>

  {/* Vehicle Color + Plate */}
  <div className="flex gap-3">
    <div className="w-1/2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Color</label>
      <input
        type="text"
        required
        placeholder="e.g. Red"
        className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
        value={color}
        onChange={(e) => setVehicleColor(e.target.value)}
      />
    </div>
    <div className="w-1/2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Plate</label>
      <input
        type="text"
        required
        placeholder="e.g. ABC-1234"
        className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
        value={plate}
        onChange={(e) => setVehiclePlate(e.target.value)}
      />
    </div>
  </div>

  {/* Vehicle Capacity + Type */}
  <div className="flex gap-3">
    <div className="w-1/2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Capacity</label>
      <select
        required
        className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
        value={capacity}
        onChange={(e) => setVehicleCapacity(e.target.value)}
      >
        <option value="">Select capacity</option>
        {Array.from({ length: 4 }, (_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
    </div>
    <div className="w-1/2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
      <select
        required
        className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
      >
        <option value="">Select type</option>
        <option value="car">Car</option>
        <option value="moto">Motorcycle</option>
        <option value="auto">Auto</option>
      </select>
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full py-2 mt-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
  >
    Create Account
  </button>
</form>


        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/captain-login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
