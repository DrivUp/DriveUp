import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext.jsx'

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext)

    return (
        <div className='p-6 bg-white rounded-2xl shadow-lg space-y-8'>

         
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <img
                        className='h-14 w-14 rounded-full object-cover border-2 border-gray-300 shadow'
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s"
                        alt="Captain"
                    />
                    <div>
                        <h2 className='text-xl font-bold text-gray-800 capitalize'>
                            {captain.fullname.firstname + " " + captain.fullname.lastname}
                        </h2>
                        <p className='text-sm text-gray-500'>{captain.email}</p>
                    </div>
                </div>

                <div className='text-right'>
                    <h3 className='text-2xl font-bold text-green-600'>₹{captain.totalEarnings?.toFixed(2)}</h3>
                    <p className='text-sm text-gray-500'>Totals Earnings</p>
                </div>
            </div>

            
            <div>
                <h3 className='text-md font-semibold text-gray-700 mb-2'>Performance Stats</h3>
                <div className='grid grid-cols-3 gap-6 text-center bg-gray-100 rounded-xl p-4 shadow-inner'>
                    <div className='flex flex-col items-center'>
                        <i className="text-3xl text-blue-500 ri-timer-2-line mb-1"></i>
                        <p className='text-xl font-semibold text-gray-800'>{captain.totalDistance} km</p>
                        <p className='text-sm text-gray-600'>Distance Travelled</p>
                    </div>

                    <div className='flex flex-col items-center'>
                        <i className="text-3xl text-yellow-500 ri-speed-up-line mb-1"></i>
                        <p className='text-xl font-semibold text-gray-800'>{captain.tripsCompleted}</p>
                        <p className='text-sm text-gray-600'>Trips Completed</p>
                    </div>

                    <div className='flex flex-col items-center'>
                        <i className="text-3xl text-purple-500 ri-star-smile-line mb-1"></i>
                        <p className='text-xl font-semibold text-gray-800'>{captain.avgRating}</p>
                        <p className='text-sm text-gray-600'>Avg Rating</p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Vehicle Information</h3>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-100 p-6 rounded-2xl shadow-md border border-gray-100">

    <div className="space-y-1">
      <p className="text-sm text-gray-500">Vehicle Type</p>
      <p className="text-base font-medium text-gray-900">{captain.vehicle.vehicleType}</p>
    </div>

    <div className="space-y-1">
      <p className="text-sm text-gray-500">Color</p>
      <p className="text-base font-medium text-gray-900">{captain.vehicle.color}</p>
    </div>

    
    <div className="space-y-1">
      <p className="text-sm text-gray-500">Plate Number</p>
      <p className="text-base font-medium text-gray-900">{captain.vehicle.plate}</p>
    </div>

    <div className="space-y-1">
      <p className="text-sm text-gray-500">Capacity</p>
      <p className="text-base font-medium text-gray-900">{captain.vehicle.capacity} passengers</p>
    </div>
  </div>
</div>


          

        </div>
    )
}

export default CaptainDetails
