"use client";
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaCamera, FaUserPlus, FaUserCheck, FaMapMarkerAlt, FaHome, FaCity, FaGlobe } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Address {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
}

interface UserData {
    _id: string;
    name: string;
    username: string;
    email?: string;
    bio?: string;
    phone?: string;
    address?: Address;
    image?: string[];
    coverImage?: string;
    followersCount?: number;
    followingCount?: number;
    followers?: any[];
    following?: any[];
    isFollowing?: boolean;
}

interface AboutProps {
    user: UserData | null;
    isOwnProfile: boolean;
}

export default function About({ user, isOwnProfile }: AboutProps) {
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [localUser, setLocalUser] = useState<UserData | null>(user);
    const [isFollowing, setIsFollowing] = useState(user?.isFollowing || false);
    const [followersCount, setFollowersCount] = useState(user?.followersCount || 0);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        setLocalUser(user);
        if (user) {
            setIsFollowing(user.isFollowing || false);
            setFollowersCount(user.followersCount || 0);
        }
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
            router.refresh();
        } catch (err) {
            console.error('Error uploading image:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !localUser) return;

        setUploadingCover(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'cover');

        try {
            const response = await fetch('/api/user/upload-cover', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload cover image');
            }

            const data = await response.json();
            setLocalUser({ ...localUser, coverImage: data.imageUrl });
            router.refresh();
        } catch (err) {
            console.error('Error uploading cover image:', err);
            alert('Failed to upload cover image. Please try again.');
        } finally {
            setUploadingCover(false);
        }
    };

    const handleFollow = async () => {
        if (!localUser || loadingFollow) return;

        setLoadingFollow(true);
        const previousIsFollowing = isFollowing;
        const previousFollowersCount = followersCount;

        setIsFollowing(!isFollowing);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);

        try {
            const response = await fetch('/api/user/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ targetUserId: localUser._id }),
            });

            if (!response.ok) {
                throw new Error('Failed to toggle follow status');
            }

            const data = await response.json();
            setIsFollowing(data.isFollowing);
            setFollowersCount(data.followersCount);
        } catch (error) {
            console.error("Error toggling follow:", error);
            setIsFollowing(previousIsFollowing);
            setFollowersCount(previousFollowersCount);
            alert("Failed to update follow status. Please try again.");
        } finally {
            setLoadingFollow(false);
        }
    };

    if (!localUser) return null;

    const profileImage = localUser.image && localUser.image.length > 0 ? localUser.image[0] : null;
    const hasAddress = localUser.address && (localUser.address.line1 || localUser.address.city || localUser.address.country);

    return (
        <div className="transition-all duration-500 ease-in-out">
            {/* Artistic Header Card with Cover Picture */}
            <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl overflow-hidden shadow-2xl mb-8">
                {/* Cover Picture Section */}
                <div className="relative h-64 md:h-80 overflow-hidden group">
                    {localUser.coverImage ? (
                        <Image
                            src={localUser.coverImage}
                            alt="Cover"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <>
                            {/* Default gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600"></div>
                            <div className="absolute inset-0 bg-black/10"></div>
                            {/* Animated Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                            {/* Floating Orbs */}
                            <div className="absolute top-10 left-20 w-20 h-20 bg-white/20 rounded-full blur-xl animate-float"></div>
                            <div className="absolute bottom-10 right-32 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>
                        </>
                    )}

                    {/* Cover Upload Button */}
                    {isOwnProfile && (
                        <label
                            htmlFor="cover-upload"
                            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-xl hover:scale-110 z-10"
                        >
                            <FaCamera className="text-lg" />
                            <input
                                id="cover-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                className="hidden"
                                disabled={uploadingCover}
                            />
                        </label>
                    )}

                    {uploadingCover && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
                            <div className="text-center text-white">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
                                <p>Uploading cover...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Content */}
                <div className="relative px-8 pb-10 -mt-24">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Profile Picture with Artistic Frame */}
                        <div className="relative group mx-auto lg:mx-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <div className="relative w-48 h-48 rounded-full p-2 bg-white shadow-2xl">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-gradient-to-br from-purple-100 to-pink-100 relative">
                                    {profileImage ? (
                                        <Image
                                            src={profileImage}
                                            alt={localUser.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                                            <span className="text-6xl font-display font-bold text-white drop-shadow-lg">
                                                {localUser.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isOwnProfile && (
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute bottom-2 right-2 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-xl hover:scale-110 z-10"
                                >
                                    <FaCamera className="text-xl" />
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
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full z-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
                                </div>
                            )}
                        </div>

                        {/* User Info & Stats */}
                        <div className="flex-1 text-center lg:text-left pt-24 lg:pt-0">
                            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-3 tracking-tight">
                                {localUser.name}
                            </h1>
                            <p className="text-gray-600 text-lg font-light italic mb-6 max-w-2xl leading-relaxed">
                                {localUser.bio || '✨ Fashion enthusiast & creative designer'}
                            </p>

                            {/* Stats & Follow Button Row */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
                                {/* Stats Cards */}
                                <div className="flex gap-4">
                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                                        <div className="relative bg-white px-6 py-4 rounded-2xl shadow-lg">
                                            <div className="text-3xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                {followersCount}
                                            </div>
                                            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Followers</div>
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                                        <div className="relative bg-white px-6 py-4 rounded-2xl shadow-lg">
                                            <div className="text-3xl font-display font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">
                                                {localUser.followingCount || localUser.following?.length || 0}
                                            </div>
                                            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Following</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Follow Button */}
                                {!isOwnProfile && (
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                                        <button
                                            onClick={handleFollow}
                                            disabled={loadingFollow}
                                            className={`relative px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${isFollowing
                                                ? 'bg-white text-gray-900 shadow-xl'
                                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {loadingFollow ? (
                                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                ) : isFollowing ? (
                                                    <>
                                                        <FaUserCheck /> Following
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUserPlus /> Follow
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information - Artistic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Card */}
                {localUser.email && (
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
                            <div className="relative flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <FaEnvelope className="text-white text-xl" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                                    <p className="text-base font-semibold text-gray-900 truncate">{localUser.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Phone Card */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
                        <div className="relative flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <FaPhone className="text-white text-xl" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                                <p className="text-base font-semibold text-gray-900">{localUser.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Card - Full Width */}
                {hasAddress && (
                    <div className="md:col-span-2 group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                        <FaMapMarkerAlt className="text-white text-xl" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Location</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-0 sm:ml-16">
                                    {localUser.address?.line1 && (
                                        <div className="flex items-start gap-2">
                                            <FaHome className="text-purple-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold">Street Address</p>
                                                <p className="text-sm font-medium text-gray-900">{localUser.address.line1}</p>
                                                {localUser.address.line2 && <p className="text-sm text-gray-700">{localUser.address.line2}</p>}
                                            </div>
                                        </div>
                                    )}
                                    {localUser.address?.city && (
                                        <div className="flex items-start gap-2">
                                            <FaCity className="text-pink-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold">City & State</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {localUser.address.city}{localUser.address.state && `, ${localUser.address.state}`}
                                                </p>
                                                {localUser.address.postal_code && <p className="text-sm text-gray-700">{localUser.address.postal_code}</p>}
                                            </div>
                                        </div>
                                    )}
                                    {localUser.address?.country && (
                                        <div className="flex items-start gap-2">
                                            <FaGlobe className="text-indigo-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold">Country</p>
                                                <p className="text-sm font-medium text-gray-900">{localUser.address.country}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes tilt {
                    0%, 100% { transform: rotate(-1deg); }
                    50% { transform: rotate(1deg); }
                }
                .animate-shimmer {
                    animation: shimmer 3s infinite;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                }
                .animate-tilt {
                    animation: tilt 10s infinite linear;
                }
            `}</style>
        </div>
    );
}
