"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const SettingsPage = () => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        phone: "",
        address: "",
    });

    useEffect(() => {
        // Fetch current user info to prepopulate the form
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/user/${session?.user?.email}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };
        if (session?.user?.email) fetchUserData();
    }, [session?.user?.email]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put("/api/user/update", { ...formData, userEmail: session?.user?.email });
            alert("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    
    return (
        <div>
            <h1>Settings</h1>
            <form onSubmit={handleSubmit}>
                <label>Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange}></textarea>
                
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default SettingsPage;
