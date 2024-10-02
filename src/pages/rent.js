import React, { useState } from 'react';

const UpdatePrices = () => {
    const [carPrice, setCarPrice] = useState('');
    const [bikePrice, setBikePrice] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isNaN(carPrice) || isNaN(bikePrice) || carPrice <= 0 || bikePrice <= 0) {
            setError('Please enter valid positive numbers for prices.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/updatePrices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carPrice: parseFloat(carPrice), bikePrice: parseFloat(bikePrice) })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Prices updated successfully!');
                setError('');
            } else {
                throw new Error(data.message || 'Error updating prices');
            }
        } catch (error) {
            setError(error.message);
            setMessage('');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 px-4 py-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">Update Parking Prices</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carPrice">
                        Car Price (per hour)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="carPrice"
                        type="number"
                        placeholder="Enter car price"
                        value={carPrice}
                        onChange={(e) => setCarPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bikePrice">
                        Bike Price (per hour)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="bikePrice"
                        type="number"
                        placeholder="Enter bike price"
                        value={bikePrice}
                        onChange={(e) => setBikePrice(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Update Prices
                    </button>
                </div>
                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </form>
        </div>
    );
};

export default UpdatePrices;
