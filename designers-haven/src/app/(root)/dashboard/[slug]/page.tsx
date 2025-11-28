"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navbar, Footer } from "@/components";
import { FaDollarSign, FaShoppingCart, FaTrophy, FaCalendar, FaArrowUp, FaArrowDown } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface DashboardData {
    income: {
        total: number;
        thisMonth: number;
        transactions: any[];
    };
    expenses: {
        total: number;
        thisMonth: number;
        transactions: any[];
    };
    topProducts: Array<{
        productId: string;
        title: string;
        soldCount: number;
        revenue: number;
    }>;
}

export default function Dashboard() {
    const { data: session } = useSession();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/user/dashboard');
            if (res.ok) {
                const dashboardData = await res.json();
                setData(dashboardData);
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </>
        );
    }

    const netProfit = (data?.income.total || 0) - (data?.expenses.total || 0);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-32 pb-20">
                {/* Header */}
                <div className="max-w-7xl mx-auto px-6 mb-12 animate-slide-down">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                Dashboard
                            </h1>
                            <p className="text-gray-600 text-lg">Track your sales and purchases</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Net Profit</p>
                            <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(netProfit)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                        {/* Income Card */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-white rounded-3xl shadow-lg p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium mb-1">Total Income</p>
                                        <p className="text-4xl font-bold text-green-600">{formatCurrency(data?.income.total || 0)}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                        <FaDollarSign className="text-white text-2xl" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <FaArrowUp className="text-green-500" />
                                    <span className="text-gray-600">This month:</span>
                                    <span className="font-semibold text-green-600">{formatCurrency(data?.income.thisMonth || 0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Expenses Card */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-white rounded-3xl shadow-lg p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium mb-1">Total Expenses</p>
                                        <p className="text-4xl font-bold text-red-600">{formatCurrency(data?.expenses.total || 0)}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <FaShoppingCart className="text-white text-2xl" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <FaArrowDown className="text-red-500" />
                                    <span className="text-gray-600">This month:</span>
                                    <span className="font-semibold text-red-600">{formatCurrency(data?.expenses.thisMonth || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                {data?.topProducts && data.topProducts.length > 0 && (
                    <div className="max-w-7xl mx-auto px-6 mb-12 animate-slide-up delay-100">
                        <div className="bg-white rounded-3xl shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                                    <FaTrophy className="text-white" />
                                </div>
                                <h2 className="text-2xl font-display font-bold text-gray-900">Top Selling Products</h2>
                            </div>

                            <div className="space-y-4">
                                {data.topProducts.map((product, index) => (
                                    <div key={product.productId} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{product.title}</p>
                                                <p className="text-sm text-gray-600">{product.soldCount} sold</p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-purple-600">{formatCurrency(product.revenue)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Transactions */}
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Income Transactions */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 animate-slide-up delay-200">
                            <h3 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FaCalendar className="text-green-600" />
                                Recent Sales
                            </h3>

                            {data?.income.transactions && data.income.transactions.length > 0 ? (
                                <div className="space-y-4">
                                    {data.income.transactions.map((transaction) => (
                                        <div key={transaction.orderId} className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-sm text-gray-600">Order #{transaction.orderId.toString().slice(-8)}</p>
                                                <p className="font-bold text-green-600">{formatCurrency(transaction.total)}</p>
                                            </div>
                                            <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                                            <p className="text-sm text-gray-700 mt-1">{transaction.items.length} item(s)</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No sales yet</p>
                            )}
                        </div>

                        {/* Expense Transactions */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 animate-slide-up delay-300">
                            <h3 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FaCalendar className="text-red-600" />
                                Recent Purchases
                            </h3>

                            {data?.expenses.transactions && data.expenses.transactions.length > 0 ? (
                                <div className="space-y-4">
                                    {data.expenses.transactions.map((transaction) => (
                                        <div key={transaction.orderId} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-sm text-gray-600">Order #{transaction.orderId.toString().slice(-8)}</p>
                                                <p className="font-bold text-red-600">{formatCurrency(transaction.total)}</p>
                                            </div>
                                            <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                                            <p className="text-sm text-gray-700 mt-1">{transaction.items.length} item(s)</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No purchases yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
