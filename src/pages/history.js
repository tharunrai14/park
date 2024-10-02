import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Alert from '@mui/material/Alert';
import LoadingAnimation from './steering';

const History = () => {
    const { user } = useAuth0();
    const [bookings, setBookings] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserBookings = async (userEmail) => {
            try {
                const url = `https://park-server.onrender.com/api/userBookings?email=${encodeURIComponent(userEmail)}`;
                const response = await fetch(url);
                if (response.ok) {
                    const bookings = await response.json();
                    console.log('User bookings:', bookings);
                    // Sort bookings by date
                    bookings.sort((a, b) => new Date(b.bookedFrom) - new Date(a.bookedFrom));
                    setBookings(bookings);
                } else {
                    throw new Error('Failed to fetch bookings');
                }
            } catch (error) {
                console.error('Error fetching user bookings:', error);
            }
        };
        if (user) {
            fetchUserBookings(user.email);
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [user, count]);

    const isBookingExpired = (bookedTill) => {
        const now = new Date();
        const tillDate = new Date(bookedTill);
        return now > tillDate;
    };

    return (
        <div className="bg-primary text-white min-h-screen ">
            <div className="flex justify-between items-center text-2xl font-bold mb-4 px-2 py-4 border-b border-gray-500 bg-secondary  ">
                <h1 className="l-border fam ">Booking History</h1>
                <button onClick={() => setCount(count + 1)} className="bg-white hover:bg-black hover:text-white text-black font-bold py-1 px-2 border border-white ml-2 rounded-md">
                    Refresh
                </button>
            </div>
            
            {!loading ? (
                <div className="px-4 py-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border rounded-lg fam">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Booking ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Vehicleno</th>
                                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                                    <th className="border border-gray-300 px-4 py-2">Slot ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Booked From</th>
                                    <th className="border border-gray-300 px-4 py-2">Booked Till</th>
                                    <th className="border border-gray-300 px-4 py-2">Checkin OTP</th>
                                    <th className="border border-gray-300 px-4 py-2">Checkout OTP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.bookingId}>
                                        <td className="border px-4 py-2">{booking.bookingId}</td>
                                        <td className="border px-4 py-2">{booking.vehicleNumber}</td>
                                        <td className="border px-4 py-2">{booking.amount}</td>
                                        <td className="border px-4 py-2">{booking.slotId}</td>
                                        <td className="border px-4 py-2">{booking.bookedFrom}</td>
                                        <td className="border px-4 py-2">{booking.bookedTill}</td>
                                        <td className="border px-4 py-2 font-bold">
                                            {!booking.isCheckedIn ? 
                                                (isBookingExpired(booking.bookedTill) ? (
                                                    <span className="text-red-600 font-bold">Booking Expired</span>
                                                ) : (
                                                    booking.checkinotp
                                                )) : (
                                                <p className="text-green-600 font-bold">Checked in</p>
                                            )}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {!booking.isCheckedOut ? (
                                                booking.checkoutotp ? (
                                                    booking.checkoutotp
                                                ) : (
                                                    <p className="text-red-600 font-bold">Not Checked In</p>
                                                )
                                            ) : (
                                                <p className="text-green-600 font-bold">Checked Out</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <LoadingAnimation />
            )}
        </div>
    );
};

export default History;
