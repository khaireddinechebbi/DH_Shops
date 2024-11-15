"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


const SettingsPage = () => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        phone: "",
        address: {
            city: "",
            country: "",
            line1: "",
            line2: "",
            postal_code: "",
            state: "",
        },
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

        setFormData(prev => {
            if (name.includes("address.")) {
                // Handle nested address fields
                const addressField = name.split(".")[1];
                return {
                    ...prev,
                    address: {
                        ...prev.address,
                        [addressField]: value,
                    },
                };
            } else {
                // Handle top-level fields
                return { ...prev, [name]: value };
            }
        });
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
        <>
        <Button>Return</Button>
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <form onSubmit={handleSubmit} className="flex-row">
                    <Label>Name</Label>
                    <Input type="text" name="name" value={formData.name} onChange={handleInputChange} />

                    <Label>Bio</Label>
                    <Textarea name="bio" value={formData.bio} onChange={handleInputChange}></Textarea>

                    <Label>Phone Number</Label>
                    <Input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />

                    <div className="flex-col">
                        <h2>Address</h2>
                        <div>
                            <Label>Line 1</Label>
                            <Input
                                type="text"
                                name="address.line1"
                                value={formData.address.line1}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div>
                            <Label>Line 2</Label>
                            <Input
                                type="text"
                                name="address.line2"
                                value={formData.address.line2}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div>
                            <Label>City</Label>
                            <Input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div>
                            <Label>State</Label>
                            <Input
                                type="text"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div>
                            <Label>Postal Code</Label>
                            <Input
                                type="text"
                                name="address.postal_code"
                                value={formData.address.postal_code}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div>
                            <Label>Country</Label>
                            <Input
                                type="text"
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                    </div>
                    <button type="submit">Update Profile</button>
                </form>
            </CardContent>
        </Card>
        </>
    );
};

export default SettingsPage;
