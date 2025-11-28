"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBell, FaHeart, FaComment, FaUserPlus } from 'react-icons/fa';

interface NotificationData {
    _id: string;
    sender: {
        _id: string;
        name: string;
        username?: string;
        image?: string[];
    };
    type: 'follow' | 'like' | 'comment';
    product?: {
        _id: string;
        title: string;
        images: string[];
    };
    read: boolean;
    createdAt: string;
}

export default function NotificationDropdown() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (session?.user) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [session]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/user/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.notifications.filter((n: NotificationData) => !n.read).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async () => {
        try {
            await fetch('/api/user/notifications', { method: 'PUT' });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            markAsRead();
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'follow':
                return <FaUserPlus className="text-blue-500" />;
            case 'like':
                return <FaHeart className="text-red-500" />;
            case 'comment':
                return <FaComment className="text-green-500" />;
            default:
                return <FaBell className="text-gray-500" />;
        }
    };

    const getNotificationText = (notification: NotificationData) => {
        const senderName = notification.sender?.name || 'Someone';
        switch (notification.type) {
            case 'follow':
                return `${senderName} started following you`;
            case 'like':
                return `${senderName} liked your product "${notification.product?.title || 'your product'}"`;
            case 'comment':
                return `${senderName} commented on "${notification.product?.title || 'your product'}"`;
            default:
                return 'New notification';
        }
    };

    const getNotificationLink = (notification: NotificationData) => {
        if (notification.type === 'follow') {
            return `/profile/${notification.sender.username || notification.sender._id}`;
        }
        if (notification.product) {
            return `/product/${notification.product._id}`;
        }
        return '#';
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    if (!session?.user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors"
                aria-label="Notifications"
            >
                <FaBell className="text-2xl" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-down">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                        <h3 className="text-white font-display font-bold text-lg">Notifications</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <FaBell className="text-4xl mx-auto mb-2 text-gray-300" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Link
                                    key={notification._id}
                                    href={getNotificationLink(notification)}
                                    onClick={() => setIsOpen(false)}
                                    className={`block p-4 border-b border-gray-100 hover:bg-purple-50 transition-colors ${!notification.read ? 'bg-purple-50/50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative flex-shrink-0">
                                            {notification.sender?.image?.[0] ? (
                                                <Image
                                                    src={notification.sender.image[0]}
                                                    alt={notification.sender.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                    {notification.sender?.name?.[0] || 'U'}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 line-clamp-2">
                                                {getNotificationText(notification)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {getTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>

                                        {notification.product?.images?.[0] && (
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={notification.product.images[0]}
                                                    alt={notification.product.title}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
