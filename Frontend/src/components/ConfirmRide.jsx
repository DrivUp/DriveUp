import React from 'react'

const ConfirmRide = (props) => {
    return (
        <div className='px-4 md:px-8 lg:px-16 py-4'>
            <h5
                className='absolute top-0 right-4 cursor-pointer'
                onClick={() => props.setConfirmRidePanel(false)}
            >
                <i className="text-3xl text-gray-300 hover:text-gray-500 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className='text-2xl font-semibold mb-6 text-center'>Confirm your Ride</h3>

            <div className='flex flex-col items-center gap-6'>
                {props.vehicleImage && (
                    <img
                        className='h-24 md:h-28 object-contain'
                        src={props.vehicleImage}
                        alt="Selected Vehicle"
                    />
                )}

                <div className='w-full max-w-xl mt-2 space-y-4'>
                    <div className='flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-gray-50'>
                        <i className="ri-map-pin-user-fill text-2xl text-blue-500 mt-1"></i>
                        <div>
                            <h3 className='text-base font-semibold'>Pick-up Location</h3>
                            <p className='text-sm text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-gray-50'>
                        <i className="ri-map-pin-2-fill text-2xl text-red-400 mt-1"></i>
                        <div>
                            <h3 className='text-base font-semibold'>Destination</h3>
                            <p className='text-sm text-gray-600'>{props.destination}</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-gray-50'>
                        <i className="ri-currency-line text-2xl text-green-500 mt-1"></i>
                        <div>
                            <h3 className='text-base font-semibold'>Fare</h3>
                            <p className='text-sm text-gray-600'>₹{props.fare[props.vehicleType]}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        props.setVehicleFound(true);
                        props.setConfirmRidePanel(false);
                        props.createRide();
                    }}
                    className='w-full max-w-xl bg-green-600 hover:bg-green-700 transition duration-300 text-white font-semibold py-3 rounded-lg mt-6'
                >
                    Confirm Ride
                </button>
            </div>
        </div>
    );
}

export default ConfirmRide