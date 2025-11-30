import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Orders";



export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const userEmail = session.user.email;

        // Fetch all orders
        const allOrders = await Order.find({}).sort({ createdAt: -1 }).lean();

        // Calculate Income (from products sold to others)
        let totalIncome = 0;
        let incomeThisMonth = 0;
        const incomeTransactions: unknown[] = [];
        const productSales: Map<string, { title: string; count: number; revenue: number }> = new Map();

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        /* eslint-disable @typescript-eslint/no-explicit-any */
        allOrders.forEach((order: any) => {
            // Skip own purchases
            if (order.userEmail === userEmail) return;

            // Check if any items in this order belong to current user
            const myItems = order.items.filter((item: any) => item.ownerEmail === userEmail);

            if (myItems.length > 0) {
                const orderTotal = myItems.reduce((sum: number, item: any) => {
                    const itemTotal = (item.price / 100) * item.quantity;

                    // Track product sales
                    const key = item.productId?.toString() || item.title;
                    const existing = productSales.get(key);
                    if (existing) {
                        existing.count += item.quantity;
                        existing.revenue += itemTotal;
                    } else {
                        productSales.set(key, {
                            title: item.title,
                            count: item.quantity,
                            revenue: itemTotal
                        });
                    }

                    return sum + itemTotal;
                }, 0);

                totalIncome += orderTotal;

                if (new Date(order.createdAt) >= firstDayOfMonth) {
                    incomeThisMonth += orderTotal;
                }

                incomeTransactions.push({
                    orderId: order._id,
                    buyer: order.userEmail,
                    items: myItems,
                    total: orderTotal,
                    date: order.createdAt
                });
            }
        });

        // Calculate Expenses (from own purchases)
        let totalExpenses = 0;
        let expensesThisMonth = 0;
        const expenseTransactions: unknown[] = [];

        const myOrders = allOrders.filter((order: any) => order.userEmail === userEmail);

        myOrders.forEach((order: any) => {
            const orderTotal = order.totalPrice;
            totalExpenses += orderTotal;

            if (new Date(order.createdAt) >= firstDayOfMonth) {
                expensesThisMonth += orderTotal;
            }

            expenseTransactions.push({
                orderId: order._id,
                items: order.items,
                total: orderTotal,
                date: order.createdAt
            });
        });

        // Get top selling products
        const topProducts = Array.from(productSales.entries())
            .map(([id, data]) => ({
                productId: id,
                title: data.title,
                soldCount: data.count,
                revenue: data.revenue
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return NextResponse.json({
            income: {
                total: totalIncome,
                thisMonth: incomeThisMonth,
                transactions: incomeTransactions.slice(0, 10) // Latest 10
            },
            expenses: {
                total: totalExpenses,
                thisMonth: expensesThisMonth,
                transactions: expenseTransactions.slice(0, 10) // Latest 10
            },
            topProducts
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}
