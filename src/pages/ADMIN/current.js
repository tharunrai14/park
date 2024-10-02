import React, { useEffect, useState } from 'react';
import { IoCarSportSharp } from "react-icons/io5";
import { PiMotorcycleFill } from "react-icons/pi";

const Current = () => {
    const [slots, setSlots] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const bookedFrom = new Date();
    const bookedTill = new Date(Date.now() + 5 * 60 * 1000);
    const [booking, setBooking] = useState({ vehicleType: "car" });

    useEffect(() => {
        async function fetchSlots() {
            try {
                setLoading(true);
                const url = `https://park-server.onrender.com/api/parkingSlots?bookedFrom=${bookedFrom}&bookedTill=${bookedTill}&type=${booking.vehicleType}`;
                const response = await fetch(url);
                const data = await response.json();

                if (Array.isArray(data)) {
                    const uniqueSlots = data.filter((slot, index, self) => self.findIndex(s => s.slotId === slot.slotId) === index);
                    setSlots(uniqueSlots);
                    console.log(uniqueSlots);
                    setError(null);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch slots:', error);
                setSlots([]);
                setError("Error fetching slots");
            }
        }
        fetchSlots();
    }, [booking.vehicleType, refresh]);

    return (
        <div className='text-white'>
            <div className='flex justify-between items-center mb-4'>
                <span>From: {new Date(bookedFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>Booked Till: {new Date(bookedTill).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className='flex justify-center gap-4 mb-4'>
                <button
                    className={` w-32 hover:bg-[#864AF9] ${booking.vehicleType === 'car' ? 'bg-[#864AF9] text-black' : 'bg-slate-500'}`}
                    onClick={() => { setBooking({ vehicleType: "car" }) }}>
                    CAR SLOTS
                </button>
                <button
                    className={` w-32 hover:bg-[#864AF9] ${booking.vehicleType === 'bike' ? 'bg-[#864AF9] text-black' : 'bg-slate-500'}`}
                    onClick={() => { setBooking({ vehicleType: "bike" }) }}>
                    BIKE SLOTS
                </button>
                <button
                    className='bg-red-400 w-32 hover:bg-red-500'
                    onClick={() => { setRefresh(!refresh) }}>
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>
            <div className='grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8'>
                {slots.map((slot) => (
                    <div
                        key={slot.slotId}
                        className={`flex flex-col justify-center items-center cursor-pointer p-2 py-4 w-32 h-22 sm:w-32 sm:h-32 md:w-32 md:h-32 ${
                            slot.slotId === booking.slotId
                                ? 'bg-cyan-400 text-black'
                                : slot.isOccupied
                                    ? 'bg-red-100 text-black p-1'
                                    : 'bg-3 text-black'
                        } rounded-lg`}
                    >
                        {slot.isOccupied ? (
                            <p>Slot {slot.slotId}  <br />
                                Veh. number {slot.bookingDetails[0].vehicleNumber}
                            </p>
                        ) : (
                            <p>
                                Slot {slot.slotId} <br />
                                Available
                            </p>
                        )}
                    </div>
                ))}
                {error && <div>{error}</div>}
            </div>
        </div>
    );
}

export default Current;
