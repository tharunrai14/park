import React, { useState, useEffect } from 'react';
import LoadingAnimation from './steering';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Alert from '@mui/material/Alert';
import { BsTicketPerforated } from 'react-icons/bs';
import { IoCarSportSharp } from "react-icons/io5";
import { PiMotorcycleFill } from "react-icons/pi";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";

import car from '../images/sport-car.png'
import bike from '../images/bike.webp'

import ConfirmationPage from './confirm';

const Book = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [booking, setBooking] = useState({
    vehicleType: "",
    date: "",
    date2: "",
    time: "",
    endTime: "",
    slotId: null,
    vehicleNumber: "",
    amount: 0
  });
  const [slots, setSlots] = useState([]);
  const [bookedFrom, setBookedFrom] = useState("");
  const [bookedTill, setBookedTill] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [carprice, setCarprice] = useState(0);
  const [bikeprice, setBikeprice] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [verified, setVerified] = useState(true);
  const slotsPerPage = 16;
  const [otp, setotp] = useState('');

  useEffect(() => {
    console.log("loading", loading);
  }, [loading]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://park-server.onrender.com/api/prices');
        const data = await response.json();
        setCarprice(data[0].carprice);
        setBikeprice(data[0].bikeprice);
        console.log(carprice);
        console.log(bikeprice);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      }
    };
    fetchPrice();
  }, [bookedFrom, bookedTill, booking.vehicleType, carprice, bikeprice]);

  useEffect(() => {
    if (bookedFrom && bookedTill && booking.vehicleType && carprice || bikeprice) {
      const calculatedAmount = calculateAmount(bookedFrom, bookedTill, booking.vehicleType);
      setAmount(calculatedAmount);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bikeprice, bookedFrom, bookedTill, booking.vehicleType, carprice]);

  useEffect(() => {
    if (error) {
      setSlots([]);
    } else {
      setBooking(prev => ({ ...prev, vehicleType: !booking.vehicleType }));
    }
  }, [error]);
  
    async function checkverify() {
      try {
        if (user.user.email) {
          const response = await fetch('https://park-server.onrender.com/api/isverified', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.user.email })
          });
          const data = await response.json();
          console.log(data);
          if (data.isverified === true) {
            alert('Your phone number is verified');
            setVerified(true);
          } else {
            setVerified(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    
  

  useEffect(() => {
    console.log('fetching slots');
    console.log(bookedFrom, bookedTill);
    console.log(booking.vehicleType);

    const fetchSlots = async () => {
      if (!bookedFrom || !bookedTill || !booking.vehicleType || !carprice || !bikeprice || !booking.vehicleNumber) {
        return;
      }
      
      try {
        const url = `https://park-server.onrender.com/api/parkingSlots?bookedFrom=${bookedFrom}&bookedTill=${bookedTill}&type=${booking.vehicleType}`;
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
          const uniqueSlots = data.filter((slot, index, self) => self.findIndex(s => s.slotId === slot.slotId) === index);
          setSlots(uniqueSlots);
            
        }
      } catch (error) {
        console.error('Failed to fetch slots:', error);
        setSlots([]);
        setError("Error fetching slots");
      }
    };

    fetchSlots();
  }, [bookedFrom, bookedTill, booking.vehicleType, booking.vehicleNumber,bikeprice,carprice]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!booking.vehicleType || !booking.date || !booking.time || !booking.date2 || !booking.endTime || !booking.slotId || !booking.vehicleNumber || !amount) {
      setError('Please fill all the fields');
      return;
    }
   
   
    setIsConfirmModalVisible(true);
  };
   const mask = 'AA-11-AA-1111';
  const regex = {
    A: /[A-Z]/,
    1: /\d/,
    '-': /-/
  };
  const handleChangee = (event) => {
    const { name, value } = event.target;

    if (name === "vehicleNumber") {
      let idx = 0, valid = true;
      let newValue = '';
      const splitValue = value.split('');
      
      for (const char of splitValue) {
        if (idx >= mask.length || !regex[mask[idx]].test(char)) {
          valid = false;
          break;
        } else {
          newValue += char;
          idx++;
        }
      }

      if (!valid) {
        setError("Invalid vehicle number format. Expected format: KA-19-HC-0123");
        return; // Prevent further state update if format is incorrect
      } else {
        setError(null); // Clear error if format is correct
      }

      setBooking(prev => ({
        ...prev,
        [name]: newValue.toUpperCase() // Ensuring input is uppercase
      }));
    } else {
      // Handle other inputs normally
      setBooking(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const confirmBooking = async () => {
    setLoading(true);
    const response = await fetch('https://park-server.onrender.com/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.email,
        vehicleType: booking.vehicleType,
        amount: amount,
        bookedFrom: `${booking.date} ${booking.time}`,
        bookedTill: `${booking.date2} ${booking.endTime}`,
        slotId: booking.slotId,
        vehicleNumber: booking.vehicleNumber,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setLoading(false);
      console.log('Booking successful:', data);
      
      setConfirm(true);
    } else {
      setLoading(false);
      setError(data.message);
      if(data.error){
      setError(data.error);
      }
      console.error('Failed to book:', data);
    }
  };

  const calculateAmount = (from, till, type) => {
    const start = new Date(from);
    const end = new Date(till);
    const diff = (end - start) / 60000; // difference in minutes
    const rate = type === "car" ? carprice : bikeprice;
    const calculatedAmount = diff * rate;
    try {
      if (calculatedAmount <= 0) {
        setError('Calculated amount is non-positive');
        throw new Error('Calculated amount is non-positive');
      }
      if (calculatedAmount < 10 && !(calculatedAmount > 10)) {
        setError('Minimum amount is 10');
        return 10;
      }
      return calculatedAmount;
    } catch (error) {
      console.error('Error calculating amount:', error);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
     checkverify();
    if (!verified) {
      setError('Please  your phone number to book a slot');
      navigate('/verify');
      return;
    }
    const { name, value } = event.target;
    setBooking(prev => ({ ...prev, [name]: value }));

    const { date, time, date2, endTime } = { ...booking, [name]: value };
    const now = new Date();

    if (date && time && date2 && endTime) {
      const startDateTime = new Date(`${date}T${time}`);
      const endDateTime = new Date(`${date2}T${endTime}`);

      if (startDateTime < now || endDateTime < now) {
        setError('Booking times must be in the future');
        setBookedFrom("");
        setBookedTill("");
      } else if (startDateTime >= endDateTime) {
        setError('End time should be later than start time');
        setBookedFrom("");
        setBookedTill("");
      } else {
        setBookedFrom(`${date}T${time}`);
        setBookedTill(`${date2}T${endTime}`);
        setError(null);
      }
    }
    if (name === "vehicleType") {
      setCurrentPage(1); // Reset to the first page when vehicle type changes
    }
  };

  const handleSlotSelect = (slotId) => {
    const slot = slots.find(s => s.slotId === slotId);
    if (slot.isOccupied) {
      setError('Slot is already occupied');
    } else {
      setBooking(prev => ({ ...prev, slotId }));
    }
  };

  const handleNextPage = (event) => {
    event.preventDefault();
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = (event) => {
    event.preventDefault();
    setCurrentPage(prevPage => prevPage - 1);
  };

  const currentSlots = slots.slice((currentPage - 1) * slotsPerPage, currentPage * slotsPerPage);

//delay in selecting vehicleType
  const handleVehicleTypeChange = (vehicleType) => {
    setLoading(true);
    setBooking((prev) => ({
      ...prev,
      vehicleType,
    }));
    setCurrentPage(1);
    setLoading(false);
  };


  return (
    <>
      {!confirm ?
      <div className=" min-h-screen bg-[#121127] text-white py-4 px-4 sm:px-2 md:px-6 lg:px-10">
      <div className="container  mx-auto py-8">
        <div className="bg-primary p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl shadow-primary">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Parking Booking</h1>
          <form id="bookingform">
            <div className="mb-4">
              <label htmlFor="vehicleType" className="font-medium">Vehicle Type:</label>
              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => handleVehicleTypeChange("car")}
                  className={`py-2 px-4 rounded-md border border-gray-400 transition-colors ${booking.vehicleType === "car" ? "bg-[#864AF9]" : "bg-3 hover:bg-[#864AF9]"} font-bold`}
                >
                  <IoCarSportSharp size={30} className="text-black-500" />
                  Car
                </button>
                <button
                  type="button"
                  onClick={() => handleVehicleTypeChange("bike")}
                  className={`py-2 px-4 rounded-md border border-gray-400 transition-colors ${booking.vehicleType === "bike" ? "bg-[#864AF9]" : "bg-black hover:bg-[#864AF9]"} font-bold`}
                >
                  <PiMotorcycleFill size={30} className="text-black-500" />
                  Bike
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="date" className="font-medium">Start Date:</label>
                <input type="date" name="date" required className="form-input w-full mt-1 p-2  border border-black rounded bg-gray-900 picker" onChange={handleChange} value={booking.date} />
              </div>
              <div>
                <label htmlFor="time" className="font-medium">Start Time:</label>
                <input type="time" name="time" required className="form-input w-full mt-1 p-2  border border-black rounded bg-gray-900 picker" onChange={handleChange} value={booking.time} />
              </div>
              <div>
                <label htmlFor="date2" className="font-medium">End Date:</label>
                <input type="date" name="date2" required className="form-input w-full mt-1 p-2  border border-black rounded bg-gray-900 picker" onChange={handleChange} value={booking.date2} />
              </div>
              <div>
                <label htmlFor="endTime" className="font-medium">End Time:</label>
                <input type="time" name="endTime" required className="form-input w-full mt-1 p-2  border border-black rounded bg-gray-900 picker" onChange={handleChange} value={booking.endTime} />
              </div>
            </div>
             <div>
    <label htmlFor="vehicleNumber" className="font-medium">Vehicle Number:</label>
    <input
      type="text"
      name="vehicleNumber"
      placeholder="KA-19-HC-0123"
      onChange={handleChangee}
      required
      className="form-input w-full mt-1 p-2  border border-black rounded bg-gray-900"
        // Use the specific change handler for vehicle number
      value={booking.vehicleNumber}
    />
    
  </div>
           
            {/* Total Charges Display */}
            {amount > 0 ? <p>Total Charges:<span className='font-medium text-bg-4'>INR: {amount.toFixed(2)}</span> </p> : <span className="relative flex h-3 w-3">Fetching
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-3 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-2"></span>
            </span>}
            {/* Slot Selection */}
            <div className="mb-6 mt-2">
              <label className="block text-sm font-medium text-gray-700">Select Slot</label>
              {!loading ? (
                <div className="flex justify-center">
                <div className=" grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2 ">
                  {currentSlots.map(slot => (
                    <div key={slot.slotId} onClick={() => handleSlotSelect(slot.slotId)}
                      className={`flex flex-col justify-center text-center items-center cursor-pointer p-4 w-24 h-22 sm:w-32 sm:h-32 md:w-32 md:h-32 ${slot.slotId === booking.slotId ? 'bg-[#3848b1] text-white border-2' : slot.isOccupied ? 'bg-red-100 text-white' : 'bg-3 text-white'} rounded-lg`}>


                      {slot.isOccupied ? booking.vehicleType === "car" ? <img src={car} alt="Car" width="100" height="50"/> : <img src={bike} className='' alt="Bike" width="100" height="50"/> :null}
                      
                      {slot.isOccupied? <p className='text-black'>Slot Full </p> : <p>Slot {slot.slotId} <br/>Available</p>}

                      
                    </div>
                  ))}
                </div></div>
              ) : (
                <LoadingAnimation />
              )}
              {slots.length > 0 && (
                <div className="flex justify-between mt-4">
                  <button disabled={currentPage === 1} onClick={handlePreviousPage} className="bg-gray-400 text-black font-bold py-2 px-4 rounded disabled:opacity-50">
                    Previous
                  </button>
                  <button disabled={currentSlots.length < slotsPerPage} onClick={handleNextPage} className="bg-gray-400 text-black font-bold py-2 px-4 rounded disabled:opacity-50">
                    Next
                  </button>
                </div>
              )}
              {error && <Alert variant="outlined" severity="error" onClose={() => { setError(null) }}>{error}</Alert>}
            </div>
            {/* Booking Button */}
            <button type="submit" className="w-full bg-[#864AF9] border-black text-white font-bold py-2 px-4 rounded-md hover:bg-[#3848b1] hover:text-white border  flex justify-center items-center" onClick={handleBooking}>
              Book Now <FaRegArrowAltCircleRight size={25} className='ml-1' />
            </button>
          </form>
        </div>
      </div>
      {/* Confirmation Modal */}
      {isConfirmModalVisible && (
        <div className="fixed inset-0 bg-grey-100  bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-700 border-2 border-green-200 rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold">Confirm Booking</h2>
            <p className="text-sm">Please confirm your booking details:</p>
            <ul className="text-sm list-disc pl-5 mt-2">
              <li>Vehicle Type: {booking.vehicleType}</li>
              <li>Vehicle Number: {booking.vehicleNumber}</li>
              <li>Start Date: {booking.date}</li>
              <li>Start Time: {booking.time}</li>
              <li>End Date: {booking.date2}</li>
              <li>End Time: {booking.endTime}</li>
              <li>Slot: {booking.slotId}</li>
              <li>Amount: INR: {amount.toFixed(2)}</li>
            </ul>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setIsConfirmModalVisible(false)} className="bg-5 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded flex justify-center items-center">
                Cancel<MdCancel className="ml-2" />
              </button>
              {!loading ? (
                <button onClick={confirmBooking} className="bg-[#864AF9] hover:bg-3 text-black font-bold py-2 px-4 rounded flex justify-center items-center">
                  Pay and Confirm<GiConfirmed className="ml-2" />
                </button>
              ) : (
                <button className="bg-[#864AF9] hover:bg-3 text-white py-2 px-4 rounded">
                  <BsTicketPerforated className="animate-spin" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
        :
        <ConfirmationPage code={otp} />}
    </>
  );
};

export default Book;
