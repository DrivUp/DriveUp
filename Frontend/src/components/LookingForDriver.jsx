import React from 'react';

const LookingForDriver = (props) => {
    return (
        <div className='px-4 md:px-8 lg:px-16 py-4 relative'>
            <h5
                className='absolute top-0 right-4 cursor-pointer'
                onClick={() => props.setVehicleFound(false)}
            >
                <i className="text-3xl text-gray-300 hover:text-gray-500 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className='text-2xl font-semibold mb-2 text-center'>Looking for a Driver</h3>

            
            <div className="flex flex-col items-center gap-3 mb-6">
                <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <p className='text-gray-500 text-sm animate-pulse'>Searching for nearby drivers...</p>
            </div>

            <div className='flex flex-col items-center gap-6'>
                <img
                    className='h-24 md:h-28 object-contain'
                    src={props.vehicleImage}
                    alt="Vehicle"
                />

                <div className='w-full max-w-xl space-y-4'>
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
            </div>
        </div>
    );
};

export default LookingForDriver;
