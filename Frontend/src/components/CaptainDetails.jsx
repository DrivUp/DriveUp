import React, { useContext } from 'react';
import { CaptainDataContext } from '../context/CaptainContext.jsx';

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext);
    const initials = `${captain.fullname.firstname?.[0]?.toUpperCase() ?? ''}${captain.fullname.lastname?.[0]?.toUpperCase() ?? ''}`;
    
    const gradients = [
        'from-blue-400 to-purple-500',
        'from-green-400 to-blue-500',
        'from-pink-400 to-red-500',
        'from-yellow-400 to-orange-500',
        'from-purple-400 to-indigo-500',
        'from-teal-400 to-cyan-500',
        'from-red-400 to-pink-500'
    ];
    const randomIndex = Math.floor(Math.random() * gradients.length);

    return (
        <div className='p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-3xl shadow-xl space-y-6 sm:space-y-8'>

            {/* Profile Header */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 sm:p-6 rounded-xl shadow-md gap-4 sm:gap-0'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto'>
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr ${gradients[randomIndex]} flex items-center justify-center`}>
                        <span className="text-2xl sm:text-3xl font-bold text-white">
                            {initials || <i className="ri-user-line text-xl sm:text-2xl"></i>}
                        </span>
                    </div>
                    
                    <div className='flex-1'>
                        <h2 className='text-lg sm:text-2xl font-bold text-gray-800 capitalize break-words'>
                            {captain.fullname.firstname + " " + captain.fullname.lastname}
                        </h2>
                        <p className='text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-1'>
                            <i className="ri-mail-line text-sm"></i>
                            {captain.email}
                        </p>
                    </div>
                </div>

                <div className='text-left sm:text-right bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl w-full sm:w-auto'>
                    <h3 className='text-xl sm:text-2xl font-bold text-blue-600'>₹{captain.totalEarnings?.toFixed(2)}</h3>
                    <p className='text-xs sm:text-sm text-blue-500 font-medium'>Total Earnings</p>
                </div>
            </div>

            {/* Riding Stats */}
            <div className='space-y-4 sm:space-y-6'>
                <h3 className='text-lg sm:text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3 sm:pl-4'>Riding Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4'>
                    <div className='bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow'>
                        <div className='flex items-center gap-3 sm:gap-4'>
                            <div className='p-2 sm:p-3 bg-blue-100 rounded-lg'>
                                <i className="ri-road-map-line text-xl sm:text-2xl text-blue-500"></i>
                            </div>
                            <div>
                                <p className='text-lg sm:text-2xl font-bold text-gray-800'>{captain.totalDistance} km</p>
                                <p className='text-xs sm:text-sm text-gray-500'>Distance Travelled</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow'>
                        <div className='flex items-center gap-3 sm:gap-4'>
                            <div className='p-2 sm:p-3 bg-green-100 rounded-lg'>
                                <i className="ri-checkbox-circle-line text-xl sm:text-2xl text-green-500"></i>
                            </div>
                            <div>
                                <p className='text-lg sm:text-2xl font-bold text-gray-800'>{captain.tripsCompleted}</p>
                                <p className='text-xs sm:text-sm text-gray-500'>Trips Completed</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow'>
                        <div className='flex items-center gap-3 sm:gap-4'>
                            <div className='p-2 sm:p-3 bg-amber-100 rounded-lg'>
                                <i className="ri-star-s-fill text-xl sm:text-2xl text-amber-500"></i>
                            </div>
                            <div>
                                <p className='text-lg sm:text-2xl font-bold text-gray-800'>{captain.avgRating}</p>
                                <p className='text-xs sm:text-sm text-gray-500'>Avg Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicle Info */}
            <div className='space-y-4 sm:space-y-6'>
                <h3 className='text-lg sm:text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3 sm:pl-4'>Vehicle Details</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-xl shadow-md'>
                    <div className='space-y-3 sm:space-y-4'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 gap-2'>
                            <span className='text-xs sm:text-sm text-gray-500'>Vehicle Type</span>
                            <span className='font-medium text-gray-700 bg-blue-50 px-2 sm:px-3 py-1 rounded text-sm sm:text-base'>
                                {captain.vehicle.vehicleType}
                            </span>
                        </div>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
                            <span className='text-xs sm:text-sm text-gray-500'>Plate Number</span>
                            <span className='font-medium text-gray-700 bg-blue-50 px-2 sm:px-3 py-1 rounded text-sm sm:text-base'>
                                {captain.vehicle.plate}
                            </span>
                        </div>
                    </div>

                    <div className='space-y-3 sm:space-y-4'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 gap-2'>
                            <span className='text-xs sm:text-sm text-gray-500'>Color</span>
                            <div className='flex items-center gap-2'>
                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-${captain.vehicle.color.toLowerCase()}-500`}></div>
                                <span className='font-medium text-gray-700 text-sm sm:text-base'>{captain.vehicle.color}</span>
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
                            <span className='text-xs sm:text-sm text-gray-500'>Capacity</span>
                            <span className='font-medium text-gray-700 text-sm sm:text-base'>
                                {captain.vehicle.capacity} passengers
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CaptainDetails;
