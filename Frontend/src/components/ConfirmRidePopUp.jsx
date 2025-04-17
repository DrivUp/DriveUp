import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }


    }
    return (
        <div className='md:p-8 md:w-[600px] md:mx-auto md:rounded-2xl md:shadow-2xl md:bg-white md:space-y-6'>

      
        <h5
            className='p-1 text-center w-[93%] absolute top-0'
            onClick={() => props.setRidePopupPanel(false)}
        >
            <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        </h5>
    
     
        <h3 className='text-2xl font-semibold text-center text-gray-800 md:text-3xl'>Confirm this ride to Start</h3>
    
        
        <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-xl shadow-sm md:p-5'>
            <div className='flex items-center gap-4'>
                <img
                    className='h-14 w-14 rounded-full object-cover shadow'
                    src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                    alt=""
                />
                <h2 className='text-xl font-medium text-gray-800 capitalize'>
                    {props.ride?.user.fullname.firstname}
                </h2>
            </div>
            <h5 className='text-lg font-semibold text-gray-700'>2.2 KM</h5>
        </div>
    
       
        <div className='space-y-5 md:px-2'>
            <div className='flex items-start gap-5 p-4 border-b'>
                <i className="ri-map-pin-user-fill text-xl text-blue-600"></i>
                <div>
                    <h3 className='text-lg font-semibold text-gray-800'>Pickup</h3>
                    <p className='text-sm text-gray-600'>{props.ride?.pickup}</p>
                </div>
            </div>
    
            <div className='flex items-start gap-5 p-4 border-b'>
                <i className="ri-map-pin-2-fill text-xl text-red-600"></i>
                <div>
                    <h3 className='text-lg font-semibold text-gray-800'>Destination</h3>
                    <p className='text-sm text-gray-600'>{props.ride?.destination}</p>
                </div>
            </div>
    
            <div className='flex items-start gap-5 p-4'>
                <i className="ri-currency-line text-xl text-green-600"></i>
                <div>
                    <h3 className='text-lg font-semibold text-gray-800'>Fare</h3>
                    <p className='text-sm text-gray-600'>₹{props.ride?.fare} · Cash</p>
                </div>
            </div>
        </div>
    
        
        <form onSubmit={submitHandler} className='space-y-4 md:px-2'>
            <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                className='bg-[#f0f0f0] px-6 py-4 font-mono text-lg rounded-lg w-full outline-none focus:ring-2 focus:ring-green-400 transition'
                placeholder='Enter OTP'
            />
    
            <button
                type="submit"
                className='w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 rounded-lg transition'
            >
                Confirm
            </button>
    
            <button
                type="button"
                onClick={() => {
                    props.setConfirmRidePopupPanel(false)
                    props.setRidePopupPanel(false)
                    
                }}
                className='w-full bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-3 rounded-lg transition'
            >
                Cancel
            </button>
        </form>
    </div>
    )    
}

export default ConfirmRidePopUp