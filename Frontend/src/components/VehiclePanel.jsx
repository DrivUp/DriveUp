import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div className='w-full max-w-screen-md mx-auto px-4'>
            <h5
                className='p-1 text-center absolute top-2 right-4 cursor-pointer'
                onClick={() => props.setVehiclePanel(false)}
            >
                <i className="text-3xl text-gray-400 hover:text-gray-600 transition ri-arrow-down-wide-line"></i>
            </h5>
    
            <h3 className='text-2xl font-semibold mb-6 text-center'>Choose a Vehicle</h3>
    
            <div
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('car')
                }}
                className='flex gap-4 border-2 hover:border-black transition-all duration-200 mb-4 rounded-xl w-full p-4 items-center justify-between cursor-pointer'
            >
                <img className='h-12 w-20 object-cover rounded' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="UberGo" />
                <div className='flex-1'>
                    <h4 className='font-medium text-base'>
                        UberGo <span className='ml-1 text-sm text-gray-600'><i className="ri-user-3-fill"></i> 4</span>
                    </h4>
                    <h5 className='text-sm text-gray-700'>2 mins away</h5>
                    <p className='text-xs text-gray-500'>Affordable, compact rides</p>
                </div>
                <h2 className='text-lg font-semibold whitespace-nowrap'>₹{props.fare.car}</h2>
            </div>
    
            <div
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('moto')
                }}
                className='flex gap-4 border-2 hover:border-black transition-all duration-200 mb-4 rounded-xl w-full p-4 items-center justify-between cursor-pointer'
            >
                <img className='h-12 w-20 object-cover rounded' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Moto" />
                <div className='flex-1'>
                    <h4 className='font-medium text-base'>
                        Moto <span className='ml-1 text-sm text-gray-600'><i className="ri-user-3-fill"></i> 1</span>
                    </h4>
                    <h5 className='text-sm text-gray-700'>3 mins away</h5>
                    <p className='text-xs text-gray-500'>Affordable motorcycle rides</p>
                </div>
                <h2 className='text-lg font-semibold whitespace-nowrap'>₹{props.fare.moto}</h2>
            </div>
    
            <div
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('auto')
                }}
                className='flex gap-4 border-2 hover:border-black transition-all duration-200 mb-4 rounded-xl w-full p-4 items-center justify-between cursor-pointer'
            >
                <img className='h-12 w-20 object-cover rounded' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="UberAuto" />
                <div className='flex-1'>
                    <h4 className='font-medium text-base'>
                        UberAuto <span className='ml-1 text-sm text-gray-600'><i className="ri-user-3-fill"></i> 3</span>
                    </h4>
                    <h5 className='text-sm text-gray-700'>3 mins away</h5>
                    <p className='text-xs text-gray-500'>Affordable Auto rides</p>
                </div>
                <h2 className='text-lg font-semibold whitespace-nowrap'>₹{props.fare.auto}</h2>
            </div>
        </div>
    )
    
}

export default VehiclePanel