"use client";
import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaInfoCircle } from 'react-icons/fa';

export default function About() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUserInfo, setShowUserInfo] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user/get');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                setUser(userData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setShowUserInfo(true); // Show user info after loading
            }
        };

        fetchUser();
    }, []);

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    if (loading) {
        return <p className="animate-pulse">Loading user information...</p>;
    }

    return (
        <div className={`transition-transform duration-500 ease-in-out transform ${showUserInfo ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            <div className="bg-white shadow-lg rounded-lg p-6 transition-transform duration-500 ease-in-out">
                <div className="flex items-center mb-4">
                    <FaUser className="text-blue-600 mr-2" size={24} />
                    <p className="font-semibold text-lg"><strong>Name:</strong> {user.name}</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaEnvelope className="text-blue-600 mr-2" size={24} />
                    <p className="font-semibold text-lg"><strong>Email:</strong> {user.email}</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaInfoCircle className="text-blue-600 mr-2" size={24} />
                    <p className="font-semibold text-lg"><strong>Bio:</strong> {user.bio || 'Not provided'}</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaPhone className="text-blue-600 mr-2" size={24} />
                    <p className="font-semibold text-lg"><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                </div>
            </div>
        </div>
    );
}
