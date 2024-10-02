import React, { useState, useEffect } from 'react';
import UpdatePrices from './updateprice';
import UpdateSlots from './updateslots';
import Adminhist from './adminhist';
import Accessdenied from './accessdenied';
import Current from './current';
import UserList from './user';
import { useAuth0 } from '@auth0/auth0-react';

const Admin = () => {
    const { user } = useAuth0();
    const [page, setPage] = useState("1");
    const [admin, setAdmin] = useState(false);
    const [loading, setLoading] = useState(true); // Default to true while loading

    useEffect(() => {
        // Check if user is authenticated and set admin status accordingly
        if (user) {
            // Check if the user's email is in the admin list
            const adminEmails = [
                "deveshpoojary@gmail.com",
                "tharunrai69@gmail.com",
                "karkerabhuvan@gmail.com"
            ];

            setAdmin(adminEmails.includes(user.email));
        }
        // Set loading to false once the user check is complete
        setLoading(false);
    }, [user]); // Depend on user

    const handle = (e) => {
        setPage(e.target.name);
    };

    return (
        <div className='bg-primary min-h-screen'>
            {loading ? (
                <div className='text-white font-bold'>Loading...</div>
            ) : admin ? (
                <>
                    <div className='bg-primary flex px-4 py-4 shadow-lg border-b border-gray-500'>
                        <button className='bg-white text-black border border-white font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white mr-2' name='1' onClick={handle}>
                            Update Prices
                        </button>

                        <button className='bg-white text-black border border-white font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white mr-2' name="2" onClick={handle}>
                            Admin History
                        </button>

                        <button className='bg-white text-black border border-white font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white mr-2' name="3" onClick={handle}>
                            Slots
                        </button>

                        <button className='bg-white text-black border border-white font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white mr-2' name="4" onClick={handle}>
                            Current
                        </button>

                        <button className='bg-white text-black border border-white font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white mr-2' name="5" onClick={handle}>
                            User List
                        </button>
                    </div>

                    {page === "1" ? <UpdatePrices /> 
                        : page === "2" ? <Adminhist /> 
                        : page === "3" ? <UpdateSlots />
                        : page === "4" ? <Current /> 
                        : <UserList />}
                </>
            ) : (
                <Accessdenied />
            )}
        </div>
    );
};

export default Admin;
