import { set } from 'firebase/database';
import React, { useState } from 'react';

const UpdateSlots = () => {
    const [slotId, setSlotId] = useState();
    const [vehicleType, setVehicleType] = useState('car');
    const [numSlots, setNumSlots] = useState(1);
    const [operation, setOperation] = useState('add'); // 'add' or 'remove'
    const [error,setError]=useState("")
    const [message, setMessage] = useState('');

    const handleAddSlots = async () => {
        if(!(slotId<0) && !(numSlots<=0))
        {

            setError("")
            setMessage("")
            
            const currentSlotId =slotId ;
            const slotData = {
                slotId: parseInt(currentSlotId),
                type: vehicleType,
                numberofslots:parseInt(numSlots)
            };
            try {
                const response = await fetch('https://park-server.onrender.com/api/slots', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(slotData)
                });
                const data = await response.json();
                if(data.error){
                    setError("  Failed to add slots/already exists");
                }
                else{
                console.log('Slot added:', data);
                setMessage("Slot added successfully")
                }
            } catch (error) {
                console.error('Failed to add slot:', error);
            
        }}
        else{
            setError("  Invalid data entered");
        }
    };

    const handleRemoveSlot = async () => {
        if(!(slotId<=0) && !(numSlots<=0)){
                const currentSlotId =slotId ;
            const slotData = {
                slotId: parseInt(currentSlotId),
                
            };
        try {
            setError("")
            setMessage("")

            const response = await fetch(`https://park-server.onrender.com/api/slotsdel`, {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(slotData)
            });
            const data = await response.json();
            console.log('Slot removed:', data);
            setMessage("Slot removed successfully")
        } catch (error) {
            console.log('Failed to remove slot:', error);
        }
        }
        else{
            setError("  Invalid data entered");
        }
     
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (operation === 'add') {
            handleAddSlots();
        } else {
            handleRemoveSlot();
        }
    };

    return (
        <div className="container bg-primary mx-auto px-4 shadow-lg shadow-gray-500 rounded-lg py-4 mt-6">
            <h1 className="text-4xl py-2 mt-4 font-bold text-white l-border">Update Parking Slots</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label htmlFor="slotId" className="block text-sm font-medium text-white">Starting Slot ID</label>
                    <input
                        type="number"
                        id="slotId"
                        value={slotId}
                        onChange={e => setSlotId(e.target.value)}
                        className="bg-primary picker form-input hover:border-cyan-500 mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md bg-transparent text-white"
                        
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-white">Vehicle Type</label>
                    <div className="flex">
                        <div className="mr-4">
                            <input
                                type="radio"
                                id="car"
                                value="car"
                                checked={vehicleType === 'car'}
                                onChange={e => setVehicleType(e.target.value)}
                                className="mr-2"
                            />
                            <label htmlFor="car" className="text-white">Car</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="bike"
                                value="bike"
                                checked={vehicleType === 'bike'}
                                onChange={e => setVehicleType(e.target.value)}
                                className="mr-2"
                            />
                            <label htmlFor="bike" className="text-white">Bike</label>
                        </div>
                    </div>
                </div>
                {operation==='add'?<div className="mb-4">
    <label htmlFor="numSlots" className="block text-sm font-medium text-white">Number of Slots</label>
    <div className="flex items-center mt-1">
        <button
            type="button"
            onClick={() => setNumSlots(Math.max(1, numSlots - 1))}
            className="bg-primary border border-gray-500 hover:border-cyan-500 rounded-l-md px-3 py-2 text-white"
        >
            -
        </button>
        <input
            type="number"
            id="numSlots"
            min={1}
            value={numSlots}
            onChange={e => setNumSlots(Math.max(1, Number(e.target.value)))}
            className="bg-primary picker block w-16 px-3 py-2 border-t border-b border-gray-500 text-center text-white bg-transparent"
            required
        />
        <button
            type="button"
            onClick={() => setNumSlots(numSlots + 1)}
            className="bg-primary border border-gray-500 hover:border-cyan-500 rounded-r-md px-3 py-2 text-white"
        >
            +
        </button>
    </div>
</div>
:""}
               <div className="mb-4">
    <label className="block text-sm font-medium text-white">Operation</label>
    <div className="mt-1">
        <label className="inline-flex items-center text-white">
            <input
                type="radio"
                value="add"
                checked={operation === 'add'}
                onChange={e => setOperation(e.target.value)}
                className="bg-primary picker border-gray-500 hover:border-cyan-500 rounded-md bg-transparent text-white"
            />
            <span className="ml-2">Add Slots</span>
        </label>
        <label className="inline-flex items-center text-white ml-4">
            <input
                type="radio"
                value="remove"
                checked={operation === 'remove'}
                onChange={e => setOperation(e.target.value)}
                className="bg-primary picker border-gray-500 hover:border-cyan-500 rounded-md bg-transparent text-white"
            />
            <span className="ml-2">Remove Slot</span>
        </label>
    </div>
</div>

                <button
                    type="submit"
                    className="bg-white hover:bg-black hover:text-white text-black border border-white font-bold py-2 px-4 rounded"
                >
                    {operation === 'add' ? 'Add Slots' : 'Remove Slot'}
                </button>
            </form>
            {error&&<p className="mt-4 text-red-600">{error}</p>}{message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
};

export default UpdateSlots;
