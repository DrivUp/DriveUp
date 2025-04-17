import React from 'react'

const WaitingForDriver = (props) => {
  return (
    <div className="md:max-w-2xl md:mx-auto md:rounded-2xl md:shadow-lg md:mt-10 bg-white p-4 md:p-6 relative">
    {/* Close Button */}
    <h5
      className="absolute top-1 right-4 cursor-pointer"
      onClick={() => props.waitingForDriver(false)}
    >
      <i className="text-3xl text-gray-400 hover:text-gray-600 ri-arrow-down-wide-line"></i>
    </h5>
  
    {/* Driver and Vehicle Info */}
    <div className="flex items-center justify-between mb-6">
      <img className="h-14 md:h-20 object-contain" src={props.vehicleImage} alt="Vehicle" />
      <div className="text-right">
        <h2 className="text-xl font-semibold capitalize text-gray-800">{props.ride?.captain.fullname.firstname}</h2>
        <h4 className="text-lg md:text-xl font-bold text-gray-700 -mt-1">{props.ride?.captain.vehicle.plate}</h4>
        <p className="text-sm text-gray-500">Maruti Suzuki Alto</p>
        <h1 className="text-xl font-bold text-green-600 mt-1">{props.ride?.otp}</h1>
      </div>
    </div>
  
    {/* Ride Details */}
    <div className="space-y-4">
      {/* Pickup */}
      <div className="flex items-start gap-4 border-b pb-3">
        <i className="ri-map-pin-user-fill text-lg text-blue-600 mt-1"></i>
        <div>
          <h3 className="text-base font-semibold text-gray-800">562/11-A</h3>
          <p className="text-sm text-gray-600">{props.ride?.pickup}</p>
        </div>
      </div>
  
      {/* Destination */}
      <div className="flex items-start gap-4 border-b pb-3">
        <i className="ri-map-pin-2-fill text-lg text-red-500 mt-1"></i>
        <div>
          <h3 className="text-base font-semibold text-gray-800">562/11-A</h3>
          <p className="text-sm text-gray-600">{props.ride?.destination}</p>
        </div>
      </div>
  
      {/* Fare */}
      <div className="flex items-start gap-4">
        <i className="ri-currency-line text-lg text-green-600 mt-1"></i>
        <div>
          <h3 className="text-base font-semibold text-gray-800">₹{props.ride?.fare}</h3>
          <p className="text-sm text-gray-600">Cash Payment</p>
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default WaitingForDriver