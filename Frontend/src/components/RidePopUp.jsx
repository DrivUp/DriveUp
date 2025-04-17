import React from 'react'

const RidePopUp = (props) => {
    const { ride, setRidePopupPanel, setConfirmRidePopupPanel, confirmRide } = props

    return (
        <div className='w-full max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-2xl space-y-6'>

            
            <div className='flex justify-center relative'>
                <button
                    onClick={() => {
                        setRidePopupPanel(false)
                        console.log("HELLO FROM RIDEPOPUP")
                    }}
                    className='absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition'
                >
                    <i className="ri-arrow-down-wide-line text-3xl"></i>
                </button>
            </div>

            
            <h3 className='text-2xl font-bold text-center text-gray-800'>New Ride Available!</h3>

           
            <div className='flex items-center justify-between p-4 bg-yellow-400 rounded-xl shadow'>
                <div className='flex items-center gap-4'>
                    <img
                        className='h-12 w-12 rounded-full object-cover border border-white shadow'
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                        alt="User"
                    />
                    <h4 className='text-lg font-medium text-gray-800'>
                        {ride?.user.fullname.firstname + " " + ride?.user.fullname.lastname}
                    </h4>
                </div>
                <span className='text-lg font-semibold text-gray-900'>2.2 KM</span>
            </div>

            <div className='space-y-4'>

               
                <div className='flex items-start gap-4 p-3 border-b'>
                    <i className="ri-map-pin-user-fill text-xl text-blue-500 mt-1"></i>
                    <div>
                        <h4 className='text-md font-semibold text-gray-800'>Pickup</h4>
                        <p className='text-sm text-gray-600'>{ride?.pickup}</p>
                    </div>
                </div>

               
                <div className='flex items-start gap-4 p-3 border-b'>
                    <i className="ri-map-pin-2-fill text-xl text-red-500 mt-1"></i>
                    <div>
                        <h4 className='text-md font-semibold text-gray-800'>Destination</h4>
                        <p className='text-sm text-gray-600'>{ride?.destination}</p>
                    </div>
                </div>

                
                <div className='flex items-start gap-4 p-3'>
                    <i className="ri-currency-line text-xl text-green-600 mt-1"></i>
                    <div>
                        <h4 className='text-md font-semibold text-gray-800'>Fare</h4>
                        <p className='text-sm text-gray-600'>₹{ride?.fare} &middot; Cash Payment</p>
                    </div>
                </div>
            </div>

         
            <div className='flex flex-col gap-3'>
                <button
                    onClick={() => {
                        setConfirmRidePopupPanel(true)
                        confirmRide()
                    }}
                    className='bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 rounded-lg'
                >
                    Accept Ride
                </button>

                <button
                    onClick={() => setRidePopupPanel(false)}
                    className='bg-gray-200 hover:bg-gray-300 transition text-gray-800 font-semibold py-2 rounded-lg'
                >
                    Ignore
                </button>
            </div>
        </div>
    )
}

export default RidePopUp
