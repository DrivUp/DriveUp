import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

// ...



const RideReview = () => {
  const { user } = useContext(UserDataContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { ride } = location.state || {}

  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRatingChange = (value) => {
    setRating(value)
  }

  const submitReview = async () => {
    if (rating < 1 || rating > 5 || !ride?._id) return

    try {
      setLoading(true)
      //await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/review`, {
        rideId: ride._id,
        rating,
        review
      })

      navigate('/home')
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Rate Your Ride</h2>
        <div className="text-center mb-2">
          <p className="text-lg font-medium capitalize">{ride?.captain?.fullname?.firstname}</p>
        </div>

        <div className="flex justify-center gap-2 my-4">
          {[1, 2, 3, 4, 5].map((val) => (
            <i
              key={val}
              className={`ri-star-${val <= rating ? 'fill' : 'line'} text-3xl cursor-pointer text-yellow-500`}
              onClick={() => handleRatingChange(val)}
            ></i>
          ))}
        </div>

        <textarea
          placeholder="Leave a comment (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full p-2 border rounded-lg resize-none h-24"
        />

        <button
          onClick={submitReview}
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 mt-4 rounded-lg font-semibold"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  )
}

export default RideReview
