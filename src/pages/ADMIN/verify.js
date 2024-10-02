import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Verify = () => {
  const { user, isLoading } = useAuth0();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  // Check verification status directly from the backend
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (user && user.email) {
        try {
          const response = await fetch(`https://park-server.onrender.com/api/check-verification?email=${user.email}`);
          const data = await response.json();
          
          if (data.verified) {
            setVerified(true);
            setMessage("Your phone number is already verified.");
          }
        } catch (error) {
          console.error("Error checking verification status:", error);
        }
      }
    };

    checkVerificationStatus();
  }, [user]);

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage("Please enter a valid phone number.");
      return;
    }

    // Generate a 4-digit OTP
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setMessage(`OTP sent! Your OTP is: ${randomOtp}`);
  };

  const handleVerifyOtp = async () => {
    if (!phoneNumber) {
      setMessage("Please enter your phone number.");
      return;
    }
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    if (otp === generatedOtp) {
      setMessage("Phone number verified successfully!");
      setVerified(true);

      // Save user details to the database after verification
      try {
        const response = await fetch("https://park-server.onrender.com/api/usersdet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            phoneNumber,
          }),
        });

        if (response.ok) {
          setMessage("User details saved to the database.");
        } else {
          setMessage("Error saving user details to the database.");
        }
      } catch (error) {
        console.error("Error saving user details:", error);
        setMessage("An error occurred while saving user details.");
      }
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="text-white font-bold">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {!user?.email ? (
        <div className="text-white font-bold">Loading...</div>
      ) : (
        <>
          {!verified ? (
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
              <span className="text-red-300">
                Verification required to book a slot
              </span>
              <h1 className="text-2xl font-bold mb-4">Phone Verification</h1>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="bg-gray-700 text-white p-2 rounded-md w-full mb-4"
              />
              <button
                onClick={handleSendOtp}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
              >
                Send OTP
              </button>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="bg-gray-700 text-white p-2 rounded-md w-full mb-4"
              />
              <button
                onClick={handleVerifyOtp}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Verify OTP
              </button>
              <p className="mt-4">{message}</p>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                Your phone number is already verified.
              </h1>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Verify;
