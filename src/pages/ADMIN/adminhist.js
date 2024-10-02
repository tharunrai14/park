import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Alert } from '@mui/material';
import LoadingAnimation from '../steering';
import Accessdenied from './accessdenied';

const Adminhist = () => {
    const { user } = useAuth0();
    const [bookings, setBookings] = useState([]);
    const [count, setCount] = useState(0);
    const [otp, setOtp] = useState('');
    const [otp2, setOtp2] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [mess, setMess] = useState('');
    const [adminhist, setAdminhist] = useState('false');
    

    useEffect(() => {
        fetchUserBookings();
    }, [count]);

    const fetchUserBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://park-server.onrender.com/api/allBookings`);
            if (response.ok) {
                const fetchedBookings = await response.json();
                fetchedBookings.sort((a, b) => new Date(b.bookedFrom) - new Date(a.bookedFrom));
                setBookings(fetchedBookings);
                setSearchResults(fetchedBookings);
                setLoading(false);
            } else {
                throw new Error('Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            setLoading(false);
            setError(error.message);
        }
    };

    const checkin = async (booking) => {
        try {
            const checkInTime = new Date();
            checkInTime.setHours(checkInTime.getHours() + 5);
            checkInTime.setMinutes(checkInTime.getMinutes() + 30);
            const trimdaytime = checkInTime.toISOString().slice(0, 19).replace('T', ' ');
            const url = `https://park-server.onrender.com/api/check-in`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: booking.bookingId,
                    checkInTime: trimdaytime,
                    checkinotp: otp
                })
            });

            const result = await response.json();
            switch (response.status) {
                case 200:
                    console.log("success");
                    setMess("Checked in successfully");
                    setCount(count + 1);
                    break;
                
                case 209:
                    console.log("New Slot Assigned", result.newSlotId);
                    setMess(`New Slot Assigned: ${result.newSlotId}`);
                    setCount(count + 1);
                    break;
                case 405:
                    console.log("Wrong OTP");
                    setError("Wrong OTP");
                    setCount(count + 1);
                    break;
                case 404:
                    console.log("Booking not found");
                    setError("Booking not found");
                    setCount(count + 1);
                    break;
                case 401:
                    console.log("Unauthorized");
                    setError("Unauthorized");
                    setCount(count + 1);
                    break;
                case 408:
                    console.log("Cannot check in now, check in after booking time");
                    setError("Cannot check in now, check in after booking time");
                    setCount(count + 1);
                    break;
                case 406:
                    console.log("Already checked in");
                    setError("Already checked in");
                    setCount(count + 1);
                    break;
                case 500:
                    console.log("Server error");
                    setError("Server error");
                    break;
                case 201:
                    console.log("Check in successful");
                    setMess("Checked in successfully");
                    setCount(count + 1);
                    break;
                default:
                    console.log("error");
            }
        } catch (error) {
            console.log('Error checking in:', error);
            setError(error.message);
        }
    };

    const checkout = async (booking) => {
        try {
            const checkOutTime = new Date();
            checkOutTime.setHours(checkOutTime.getHours() + 5);
            checkOutTime.setMinutes(checkOutTime.getMinutes() + 30);
            const trimdaytime = checkOutTime.toISOString().slice(0, 19).replace('T', ' ');
            const url = `https://park-server.onrender.com/api/check-out`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: booking.bookingId,
                    checkOutTime: trimdaytime,
                    checkoutotp: otp2
                })
            });
            const result = await response.json();
         switch(response.status){
            case 200:
                console.log("success");
                setMess("Checked out successfully");
                setCount(count + 1);
                break;
                case 202:
                    console.log("was late to checkout", result.charges);
                    setMess("Late to checkout,  Additonal charges: " + result.charges);
                    setCount(count + 1);
                    break;
                case 404:
                    console.log("Booking not found");
                    setError("Booking not found");
                    setCount(count + 1);
                    break;
                case 400: 
                    console.log("Wrong OTP");
                    setError("Wrong OTP");
                    setCount(count + 1);
                    break;
                    default:
                        console.log(result);
                        setError(result.message,result.charges);
                        setCount(count + 1);
         }
           
          
        } catch (error) {
            console.error('Error checking out:', error);
            setError(error.message);
        }
    };

    const handleOtpChange = (otp) => {
        setOtp(otp);
    };

    const handleOtpChange2 = (otp) => {
        setOtp2(otp);
    };

    const isBookingExpired = (bookedTill) => {
        const now = new Date();
        const tillDate =  new Date(bookedTill.replace(' ', 'T'));;
        return now > tillDate;
    };

    useEffect(() => {
        if (searchTerm === "") {
            setBookings(searchResults);
        } else {
            const results = bookings.filter(booking =>
                (booking.vehicleNumber && booking.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (booking.userId && booking.userId.toLowerCase().includes(searchTerm.toLowerCase()))||
                (booking.bookingId && booking.bookingId.toString().includes(searchTerm.toLowerCase()))
            );
            setBookings(results);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (user) {
            setAdminhist(user.email === "deveshpoojary@gmail.com" || user.email === "tharunrai69@gmail.com" || user.email === "karkerabhuvan@gmail.com");
            setLoading(true);
        }
        else {
            setLoading(false);
        }
        // Check if the user is an admin only when the component mounts or user changes

    }, [user]); // Depend on user.email

    return (<>{adminhist ? 
        <div className='bg-primary text-white min-h-screen'>
            <span className="flex text-2xl font-bold mb-4 px-2 py-4 border-b border-gray-500 bg-secondary shadow-lg">
                <h1 className='l-border fam'>All Bookings</h1>
                <button onClick={() => setCount(count + 1)} className="bg-white hover:bg-black hover:text-white text-black font-bold py-1 px-2 border border-white ml-2 rounded-md">
                    Refresh
                </button>
                {error && <Alert severity="error" onClose={() => { setError(null) }}>{error}</Alert>}
                {mess && <Alert severity="success" onClose={() => { setMess(null) }}>{mess}</Alert>}
            </span>

            {!loading ? (
                <div className='px-4 py-4'>
                    <div className='overflow-x-auto'>
                        <table className="min-w-full border-collapse mt-2 rounded-lg">
                            <thead>
                                <tr>
                                    <th colSpan={10} className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg bg-secondary"
                                        />
                                    </th>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">User</th>
                                    <th className="border border-gray-300 px-4 py-2"> Id</th>
                                    <th className="border border-gray-300 px-4 py-2">Vehicle no.</th>
                                    <th className="border border-gray-300 px-4 py-2">v.type</th>
                                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                                    <th className="border border-gray-300 px-4 py-2">Slot ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Booked From</th>
                                    <th className="border border-gray-300 px-4 py-2">Booked Till</th>
                                    <th className="border border-gray-300 px-4 py-2">Checkin</th>
                                    <th className="border border-gray-300 px-4 py-2">Checkout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.bookingId}>
                                        <td className="border border-gray-300 px-4 py-2">{booking.userId}</td>
                                        <td className="border border-gray-300 px-4 py-2">{booking.bookingId}</td>
                                        <td className="border border-gray-300 px-4 py-2">{booking.vehicleNumber}</td>
                                        <td className="border border-gray-300 px-4 py-2">{booking.vehicleType}</td>
                                        <td className="border border-gray-300 px-4 py-2">{booking.amount}</td>
                                        <td className="border border-gray-300 px-4 py-2">{booking.slotId}</td>
                                        <td className="border border-gray-300 px-4 py-2">{booking.bookedFrom}</td>
                                        <td className="border border-gray-300 px-4 py-2">{booking.bookedTill}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {!booking.isCheckedIn ? (
                                                isBookingExpired(booking.bookedTill) ? (
                                                    <span className="text-red-600 font-bold">Booking Expired</span>
                                                ) : (
                                                    <>
                                                        {new Date(booking.bookedFrom.split(' ')[0]) > new Date(new Date().toISOString().split('T')[0]) ? (
    <p className="text-yellow-400 font-bold">Not Today</p>

                                                        ) : (
                                                            <>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Enter OTP"
                                                                    onChange={(e) => handleOtpChange(e.target.value)}
                                                                    className="placeholder-gray-900 mr-2 text-black rounded-md py-1"
                                                                />
                                                                <button
                                                                    className="bg-cyan-500 hover:bg-black text-white font-bold py-1 px-2 rounded border border-white mt-2"
                                                                    onClick={(e) =>{
                                                                    e.preventDefault();
                                                                        
                                                                        
                                                                         checkin(booking)}}
                                                                >
                                                                    Checkin
                                                                </button>
                                                            </>
                                                        )}
                                                    </>
                                                )
                                            ) : (
                                                <span className="text-green-600 font-bold">Checked in</span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {booking.isCheckedIn ? (
                                                booking.isCheckedOut ? (
                                                    <span className="text-green-600 font-bold">Checked out</span>
                                                ) : (
                                                    <p className="px-4 py-2">
                                                        <input
                                                            type="number"
                                                            placeholder="Enter OTP"
                                                            onChange={(e) => handleOtpChange2(e.target.value)}
                                                            className="placeholder-gray-900 mr-3 text-black rounded-md py-1"
                                                        />
                                                        <button
                                                            className="bg-cyan-500 border border-white hover:bg-black text-white font-bold mt-2 py-1 px-2 rounded"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                checkout(booking)}}
                                                        >
                                                            Checkout
                                                        </button>
                                                    </p>
                                                )
                                            ) : (
                                                <p className="text-red-600 px-4 py-2 font-bold">Not checked in</p>
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
        </div> : <Accessdenied/>}</>
    ); 
};

export default Adminhist;
