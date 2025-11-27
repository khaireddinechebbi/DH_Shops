"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "@/components";
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
import { FaArrowLeft, FaSave } from "react-icons/fa";


const SettingsPage = ({ params }: { params: { slug: string } }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        try {
            await axios.put("/api/user/update", { ...formData, userEmail: session?.user?.email });
            // Redirect to profile page using the slug from params or userCode from session
            const targetSlug = params.slug || session?.user?.userCode || session?.user?.username;
            if (targetSlug) {
                // Use window.location for a hard refresh to ensure data is reloaded
                window.location.href = `/profile/${targetSlug}`;
            } else {
                // Fallback if no slug found
                window.location.href = '/home';
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            className="flex items-center gap-2 hover:bg-white/50 transition-colors"
                        >
                            <FaArrowLeft /> Back to Profile
                        </Button>
                        <h1 className="text-3xl font-display font-bold text-gray-900">Edit Profile</h1>
                    </div>

                    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden">
                        <div className="h-2 bg-gradient-primary w-full"></div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl text-gray-700">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-gray-600 font-medium">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-gray-600 font-medium">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-gray-600 font-medium">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all min-h-[100px]"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-gray-600">Address Line 1</Label>
                                            <Input
                                                type="text"
                                                name="address.line1"
                                                value={formData.address.line1}
                                                onChange={handleInputChange}
                                                className="bg-white/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-600">Address Line 2</Label>
                                            <Input
                                                type="text"
                                                name="address.line2"
                                                value={formData.address.line2}
                                                onChange={handleInputChange}
                                                className="bg-white/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-600">City</Label>
                                            <Input
                                                type="text"
                                                name="address.city"
                                                value={formData.address.city}
                                                onChange={handleInputChange}
                                                className="bg-white/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-600">State / Province</Label>
                                            <Input
                                                type="text"
                                                name="address.state"
                                                value={formData.address.state}
                                                onChange={handleInputChange}
                                                className="bg-white/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-600">Postal Code</Label>
                                            <Input
                                                type="text"
                                                name="address.postal_code"
                                                value={formData.address.postal_code}
                                                onChange={handleInputChange}
                                                className="bg-white/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-600">Country</Label>
                                            <Input
                                                type="text"
                                                name="address.country"
                                                value={formData.address.country}
                                                onChange={handleInputChange}
                                                className="bg-white/50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaSave />
                                                <span>Update Profile</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SettingsPage;
