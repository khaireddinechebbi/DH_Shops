"use client";
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaCamera } from 'react-icons/fa';
import Image from 'next/image';

interface UserData {
    _id: string;
    name: string;
    username: string;
    email?: string;
    bio?: string;
    phone?: string;
    image?: string[];
    followersCount?: number;
    followingCount?: number;
    followers?: any[];
    following?: any[];
}

interface AboutProps {
    user: UserData | null;
    isOwnProfile: boolean;
}

export default function About({ user, isOwnProfile }: AboutProps) {
    const [uploadingImage, setUploadingImage] = useState(false);
    const [localUser, setLocalUser] = useState<UserData | null>(user);

    React.useEffect(() => {
        setLocalUser(user);
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !localUser) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/user/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            setLocalUser({ ...localUser, image: [data.imageUrl] });
        } catch (err) {
            console.error('Error uploading image:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleFollow = async () => {
        // TODO: Implement follow logic
        console.log("Follow clicked");
    };

    if (!localUser) return null;

    const profileImage = localUser.image && localUser.image.length > 0 ? localUser.image[0] : null;

    return (
        <div className="transition-all duration-500 ease-in-out translate-y-0 opacity-100">
            <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl overflow-hidden">
                {/* Header with gradient background */}
                <div className="bg-gradient-primary h-32 relative"></div>

                {/* Profile content */}
                <div className="px-8 pb-8 -mt-16 relative">
                    {/* Profile picture */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                                {profileImage ? (
                                    <Image
                                        src={profileImage}
                                        alt={localUser.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-accent">
                                        <span className="text-4xl font-display font-bold text-white">
                                            {localUser.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Upload button overlay - Only for own profile */}
                            {isOwnProfile && (
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <FaCamera className="text-white text-2xl" />
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={uploadingImage}
                                    />
                                </label>
                            )}

                            {uploadingImage && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        {/* Name and bio */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                                {localUser.name}
                            </h1>
                            <p className="text-gray-600 italic">
                                {localUser.bio || 'Fashion enthusiast & designer'}
                            </p>
                            {!isOwnProfile && (
                                <button
                                    onClick={handleFollow}
                                    className="mt-2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    Follow
                                </button>
                            )}
                        </div>

                        {/* Followers/Following stats */}
                        <div className="flex gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-display font-bold bg-gradient-accent bg-clip-text text-transparent">
                                    {localUser.followersCount || localUser.followers?.length || 0}
                                </div>
                                <div className="text-sm text-gray-600">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-display font-bold bg-gradient-accent bg-clip-text text-transparent">
                                    {localUser.followingCount || localUser.following?.length || 0}
                                </div>
                                <div className="text-sm text-gray-600">Following</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {localUser.email && (
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <FaEnvelope className="text-purple-600" size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 font-medium">Email</p>
                                    <p className="text-sm text-gray-900 truncate">{localUser.email}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                <FaPhone className="text-pink-600" size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">Phone</p>
                                <p className="text-sm text-gray-900">{localUser.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
