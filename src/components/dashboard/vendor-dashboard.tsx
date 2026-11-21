
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    UtensilsCrossed,
    ShoppingBag,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    RefreshCw,
    TrendingUp,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface DashboardStats {
    totalMenuItems: number;
    approvedMenuItems: number;
    pendingMenuItems: number;
    totalOrders: number;
    pendingOrders: number;
    acceptedOrders: number;
    rejectedOrders: number;
}

interface Order {
    _id: string;
    menuItemTitle: string;
    price: number;
    status: string;
    customerEmail: string;
    deliveryDate: string;
    createdAt: string;
}

interface ChartItem {
    month: string;
    totalOrders?: number;
    revenue?: number;
}

const initialStats: DashboardStats = {
    totalMenuItems: 0,
    approvedMenuItems: 0,
    pendingMenuItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    rejectedOrders: 0,
};

const VendorDashboard = () => {
    const { data: session } = authClient.useSession();

    const [stats, setStats] = useState(initialStats);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [monthlyOrders, setMonthlyOrders] = useState<ChartItem[]>([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState<ChartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const tokenResponse = await fetch("/api/auth/token");
            const tokenData = await tokenResponse.json();

            if (!tokenResponse.ok || !tokenData.token) {
                throw new Error("Authentication token could not be retrieved.");
            }

            const headers = {
                Authorization: `Bearer ${tokenData.token}`,
            };

            const endpoints = [
                "/api/dashboard/vendor/stats",
                "/api/dashboard/vendor/recent-orders",
                "/api/dashboard/vendor/monthly-orders",
                "/api/dashboard/vendor/monthly-revenue",
            ];

            const responses = await Promise.all(
                endpoints.map((endpoint) =>
                    fetch(`${API_URL}${endpoint}`, { headers })
                )
            );

            const results = await Promise.all(
                responses.map(async (response) => {
                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        throw new Error(
                            result.message || "Failed to load dashboard data."
                        );
                    }

                    return result;
                })
            );

            const dashboardData = results[0].data;

            setStats({
                totalMenuItems: dashboardData.menu?.total ?? 0,
                approvedMenuItems: dashboardData.menu?.approved ?? 0,
                pendingMenuItems: dashboardData.menu?.pending ?? 0,
                totalOrders: dashboardData.orders?.total ?? 0,
                pendingOrders: dashboardData.orders?.pending ?? 0,
                acceptedOrders: dashboardData.orders?.accepted ?? 0,
                rejectedOrders: dashboardData.orders?.rejected ?? 0,
            });
            
            setRecentOrders(results[1].data || []);
            setMonthlyOrders(results[2].data || []);
            setMonthlyRevenue(results[3].data || []);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!session?.user) return;

        const timer = window.setTimeout(() => {
            void fetchDashboard();
        }, 0);

        return () => {
            window.clearTimeout(timer);
        };
    }, [session?.user, fetchDashboard]);

    const statCards = [
        {
            title: "Total Menu Items",
            value: stats.totalMenuItems,
            icon: UtensilsCrossed,
            color: "text-orange-600",
            bg: "bg-orange-100",
        },
        {
            title: "Approved Items",
            value: stats.approvedMenuItems,
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: "Pending Items",
            value: stats.pendingMenuItems,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-100",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-100",
        },
        {
            title: "Accepted Orders",
            value: stats.acceptedOrders,
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: "Rejected Orders",
            value: stats.rejectedOrders,
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-100",
        },
    ];

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-BD", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-[#D94B35]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                <p className="font-medium text-red-700">{error}</p>
                <button
                    onClick={() => void fetchDashboard()}
                    className="mt-4 rounded-xl bg-[#D94B35] px-5 py-2.5 text-sm font-semibold text-white"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-[#D94B35]">
                        Vendor Workspace
                    </p>
                    <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#29231F] sm:text-4xl">
                        Dashboard Overview
                    </h1>
                    <p className="mt-2 text-sm text-[#29231F]/60">
                        Welcome back, {session?.user?.name || "Vendor"}.
                        Here is your restaurant performance.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/dashboard/vendor/menu"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#29231F]/10 bg-white px-4 py-3 text-sm font-semibold text-[#29231F] transition hover:border-[#D94B35] hover:text-[#D94B35]"
                    >
                        <UtensilsCrossed size={17} />
                        Manage Menu
                    </Link>

                    <Link
                        href="/dashboard/vendor/orders"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#D94B35] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#bd3d2a]"
                    >
                        <ShoppingBag size={17} />
                        Manage Orders
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-2xl border border-[#29231F]/10 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#29231F]/60">
                                        {stat.title}
                                    </p>
                                    <p className="mt-3 text-3xl font-bold text-[#29231F]">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className={`rounded-xl p-3 ${stat.bg}`}>
                                    <Icon className={stat.color} size={22} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-[#29231F]/10 bg-white p-5 sm:p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-[#29231F]">
                                Monthly Orders
                            </h2>
                            <p className="mt-1 text-sm text-[#29231F]/50">
                                Your order activity over time
                            </p>
                        </div>
                        <TrendingUp className="text-[#D94B35]" />
                    </div>

                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyOrders}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis dataKey="month" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="totalOrders"
                                    name="Orders"
                                    fill="#D94B35"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#29231F]/10 bg-white p-5 sm:p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-[#29231F]">
                                Monthly Revenue
                            </h2>
                            <p className="mt-1 text-sm text-[#29231F]/50">
                                Accepted order value (USD)
                            </p>
                        </div>
                        <TrendingUp className="text-green-600" />
                    </div>

                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyRevenue}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => `$${value}`}
                                />
                                <Bar
                                    dataKey="revenue"
                                    name="Order Value"
                                    fill="#71836A"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#29231F]/10 bg-white">
                <div className="flex flex-col justify-between gap-3 border-b border-[#29231F]/10 p-5 sm:flex-row sm:items-center sm:p-6">
                    <div>
                        <h2 className="text-lg font-bold text-[#29231F]">
                            Recent Orders
                        </h2>
                        <p className="mt-1 text-sm text-[#29231F]/50">
                            Latest orders received by your restaurant
                        </p>
                    </div>

                    <Link
                        href="/dashboard/vendor/orders"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#D94B35] hover:underline"
                    >
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingBag
                            size={36}
                            className="mx-auto text-[#29231F]/30"
                        />
                        <p className="mt-3 font-semibold text-[#29231F]">
                            No orders yet
                        </p>
                        <p className="mt-1 text-sm text-[#29231F]/50">
                            New customer orders will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left text-sm">
                            <thead className="bg-[#F8F1E7] text-[#29231F]/70">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Pizza</th>
                                    <th className="px-6 py-4 font-semibold">Customer</th>
                                    <th className="px-6 py-4 font-semibold">Price</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#29231F]/10">
                                {recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="px-6 py-4 font-semibold text-[#29231F]">
                                            {order.menuItemTitle}
                                        </td>
                                        <td className="px-6 py-4 text-[#29231F]/60">
                                            {order.customerEmail}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-[#29231F]">
                                            ${order.price}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-[#F8F1E7] px-3 py-1 text-xs font-semibold capitalize text-[#29231F]">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#29231F]/60">
                                            {formatDate(order.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => void fetchDashboard()}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#29231F]/10 px-4 py-2.5 text-sm font-semibold text-[#29231F] transition hover:bg-[#F8F1E7]"
                >
                    <RefreshCw size={16} />
                    Refresh Dashboard
                </button>
            </div>
        </div>
    );
};

export default VendorDashboard;
