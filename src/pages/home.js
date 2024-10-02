import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Profile from './Profile';
import { FaRegArrowAltCircleRight, FaBars, FaTimes } from "react-icons/fa";
import { GiFallingStar } from "react-icons/gi";
import { IoCarSportSharp } from "react-icons/io5";

import '../index.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const user = useAuth0();
  const [message, setMessage] = useState('');
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // To store error messages

  useEffect(() => {
    async function checkverify() {
      try {
        if (user.user.email) {
          const response = await fetch('https://park-server.onrender.com/api/check-verification', {
            method: 'POST', // Use POST here
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.user.email }) // Send email in body
          });
          const data = await response.json();
          console.log(data);
          if (data.verified === true) { // Check for verified status
            setVerified(true);
            setErrorMessage(''); // Clear any error message
          } else {
            setVerified(false);
            setErrorMessage(data.message); // Set error message from backend
          }
        }
      } catch (error) {
        console.error('Failed to verify:', error);
        setErrorMessage('An error occurred during verification.');
      }
    }
    checkverify();
  }, [user.user.email]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsNavOpen(false);
  };

  function handlebook(e) {
    e.preventDefault();
    if (verified) {
      navigate('/book');
    } else {
      setMessage(errorMessage || 'Please verify your phone number to book a slot');
    }
  }

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 bg-primary text-white">
      <Profile />

      {/* Navigation bar */}
      <div className="px-4 py-2 shadow-lg bg-gray-800 flex items-center justify-between mb-4">
        <img src="https://th.bing.com/th/id/OIP.yat3HsshdS-vQTir3a4xLAAAAA?rs=1&pid=ImgDetMain" alt="Logo" className="h-8 w-auto" />
        
        <div className="md:hidden">
          <button onClick={() => setIsNavOpen(!isNavOpen)} className="text-gray-300">
            <FaBars size={24} />
          </button>
        </div>

        <div className="hidden md:flex space-x-4">
          {['admin', 'history', 'verify'].map((item) => (
            <button 
              key={item} 
              onClick={() => handleNavigation(`/${item}`)} 
              className="bg-gray-700 hover:bg-[#864AF9] border-white hover:text-black text-gray-200 font-semibold py-2 px-4 rounded"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
          <button onClick={() => logout({ returnTo: window.location.origin })} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Log Out
          </button>
        </div>
      </div>

      {isNavOpen && (
        <div className="fixed inset-0 z-50 flex bg-black bg-opacity-75">
          <div className="flex-1" onClick={() => setIsNavOpen(false)} />
          <div className="w-64 bg-gray-800 p-4">
            <button onClick={() => setIsNavOpen(false)} className="text-gray-300">
              <FaTimes size={24} />
            </button>
            {['admin', 'history', 'verify'].map((item) => (
              <button 
                key={item} 
                onClick={() => handleNavigation(`/${item}`)} 
                className="block mt-4 text-gray-200 font-bold py-2 px-4 hover:bg-white-700 hover:text-black rounded"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
            <button onClick={() => logout({ returnTo: window.location.origin })} className="mt-4 text-gray-200 font-bold py-2 px-4 hover:bg-red-600 rounded">
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative py-3 sm:max-w-xl sm:mx-auto px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl"></div>
        <div className="bg-gray-800 border border-gray-700 relative px-4 py-10 text-white shadow-lg rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <IoCarSportSharp size={50} color='cyan' className='mx-auto' />
            </div>
            <div className="divide-y divide-gray-700">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-300 sm:text-lg sm:leading-7">
                <p className='font-bold flex items-center justify-center'>An advanced online parking booking system <GiFallingStar size={30} color='cyan' className='ml-2' /></p>
                <form className="mt-6">
                  <div>
                    <label htmlFor="location" className="sr-only">Location</label>
                    <select className='bg-gray-700 rounded text-gray-200'>
                      <option value="location">Railway MlR CNTRL</option>
                      <option value="location">none</option>
                    </select>
                  </div>
                  <div className="mt-6">
                    <button onClick={handlebook} className="w-full mr-auto px-4 py-2 font-bold bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none flex justify-center items-center">
                      Book a parking space <FaRegArrowAltCircleRight size={25} className='ml-1' />
                    </button>
                  </div>
                  {message && <p className="mt-4 text-red-600">{message}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(HomePage, {
  onRedirecting: () => (<div>Loading...</div>)
});
