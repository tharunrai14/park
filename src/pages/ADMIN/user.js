import React, { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import LoadingAnimation from '../steering';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://park-server.onrender.com/api/usersdet`);
            if (response.ok) {
                const fetchedUsers = await response.json();
                setUsers(fetchedUsers);
                setSearchResults(fetchedUsers);
                setLoading(false);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (searchTerm === "") {
            setSearchResults(users);
        } else {
            const results = users.filter(user =>
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.phoneNumber && user.phoneNumber.includes(searchTerm))
            );
            setSearchResults(results);
        }
    }, [searchTerm, users]);

    return (
        <div className='bg-primary text-white min-h-screen'>
            <span className="flex text-2xl font-bold mb-4 px-2 py-4 border-b border-gray-500 bg-secondary shadow-lg">
                <h1 className='l-border fam'>User List</h1>
                <button onClick={fetchUsers} className="bg-white hover:bg-black hover:text-white text-black font-bold py-1 px-2 border border-white ml-2 rounded-md">
                    Refresh
                </button>
                {error && <Alert severity="error" onClose={() => { setError(null) }}>{error}</Alert>}
            </span>

            {!loading ? (
                <div className='px-4 py-4'>
                    <div className='overflow-x-auto'>
                        <table className="min-w-full border-collapse mt-2 rounded-lg">
                            <thead>
                                <tr>
                                    <th colSpan={2} className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg bg-secondary"
                                        />
                                    </th>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Email</th>
                                    <th className="border border-gray-300 px-4 py-2">Phone Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map(user => (
                                    <tr key={user._id}>
                                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                        <td className="border border-gray-300 px-4 py-2">{user.phoneNumber}</td>
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

export default UserList;
