import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 

const Start = () => {
  return (
    <div className="h-screen w-full bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] flex items-center justify-center">
      <div className="bg-gray-100  p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-11/12 text-center">
      <img
  className="w-24 mx-auto mb-6"
  src={logo}
  alt="CarPooler Logo"
/>

        <h2 className="text-2xl sm:text-3xl font-semibold text-black">Get Started with CarPooler</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Join the ride and explore new opportunities.</p>
        <Link
          to="/login"
          className="inline-block w-full bg-black text-white py-3 rounded-lg mt-6  transition-colors"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Start;
