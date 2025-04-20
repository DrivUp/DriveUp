import React, { useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const CarpoolRideForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        vehicleType: 'car',
        availableSeats: 3,
        departureTime: new Date()
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Create Carpool Ride</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="car">Car</option>
                        <option value="moto">Motorcycle</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Available Seats</label>
                    <input
                        type="number"
                        name="availableSeats"
                        min="1"
                        max="6"
                        value={formData.availableSeats}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Departure Time</label>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            value={formData.departureTime}
                            onChange={(newValue) => setFormData(prev => ({ ...prev, departureTime: newValue }))}
                            renderInput={({ inputRef, inputProps, InputProps }) => (
                                <div className="flex items-center border rounded p-2">
                                    <input ref={inputRef} {...inputProps} className="flex-1 outline-none" />
                                    {InputProps?.endAdornment}
                                </div>
                            )}
                        />
                    </LocalizationProvider>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                    >
                        Create Carpool
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CarpoolRideForm;