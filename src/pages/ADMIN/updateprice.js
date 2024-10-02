import React, { useEffect, useState } from 'react';

const UpdatePrices = () => {
    const [carPrice, setCarPrice] = useState('');
    const [bikePrice, setBikePrice] = useState('');
    const [fetchedcar, setFetchedcar] = useState('');
    const [fetchedbike, setFetchedbike] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
   const [count,setcount]=useState(0);


useEffect(() => {





    const fetchPrices = async () => {
        try {
            const response = await fetch('https://park-server.onrender.com/api/prices');
            const data = await response.json();
            if (response.ok) {
                setFetchedcar(data[0].carprice);
                setFetchedbike(data[0].bikeprice);

            }
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    };

    fetchPrices();
}, [count]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isNaN(carPrice) || isNaN(bikePrice) || carPrice <= 0 || bikePrice <= 0) {
            setError('Please enter valid positive numbers for prices.');
            return;
        }

        try {
            const response = await fetch('https://park-server.onrender.com/api/updatePrices', {
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
        <div className="max-w-md mx-auto mt-10 px-4 py-8 bg-primary rounded-lg shadow-xl shadow-gray-500">
            <h1 className="text-2xl text-center text-white font-bold mb-4">Update Parking Prices</h1>
            <button className='bg-cyan-500 text-black p-1 font-bold rounded-md hover:bg-cyan-600 animate-pulse' onClick={() => {setcount(count+1)}}> Fetch latest prices
           

            
            </button>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="carPrice">
                        Car Price (per minute)
                    </label>
                    <span className='text-cyan-500 animate-pulse'>Current Price: <span className='text-red-400 animate-pulse'>{fetchedcar}</span> </span> 
                    <br></br>
                    <input
                        className="shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-primary border border-gray-500"
                        id="carPrice"
                        type="number"
                        placeholder="Enter car price"
                        value={carPrice}
                        onChange={(e) => setCarPrice(e.target.value)}
                        formNoValidate
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="bikePrice">
                        Bike Price (per minute)
                    </label>
                    <span className='text-cyan-400 animate-pulse'>Current Price:  <span className='text-red-400 animate-pulse'>{fetchedbike}</span> </span>
                    <br></br>

                    <input
                        className="shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-primary border border-gray-500"
                        id="bikePrice"
                        type="number"
                        placeholder="Enter bike price"
                        value={bikePrice}
                        onChange={(e) => setBikePrice(e.target.value)}
                        
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-white hover:bg-black text-black hover:text-white border border-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Update Prices
                    </button>
                </div>
                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}{<span className='text-900 p-1 rounded bg-white '   onClick={()=>{setError("")}}>X</span>}</p>}
            </form>
        </div>
    );
};

export default UpdatePrices;
