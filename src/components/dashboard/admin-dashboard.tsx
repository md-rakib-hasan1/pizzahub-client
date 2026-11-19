
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Activity,
    Ban,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    LayoutDashboard,
    Loader2,
    RefreshCw,
    ShieldCheck,
    Store,
    Users,
    Utensils,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Tab = "overview" | "users" | "menu" | "transactions";

interface AdminStats {
    totalUsers: number;
    totalCustomers: number;
    totalVendors: number;
    blockedUsers: number;
    totalMenuItems: number;
    pendingMenuItems: number;
    totalOrders: number;
    totalTransactions: number;
}

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    subscriptionPlan?: string;
    createdAt: string;
    image?: string;
}

interface PendingMenuItem {
    _id: string;
    title: string;
    description?: string;
    category: string;
    price: number;
    image: string;
    location: string;
    vendorId: string;
    approvalStatus: string;
    createdAt: string;
}

interface Transaction {
    _id: string;
    vendorId?: string;
    vendorEmail?: string;
    amount?: number;
    currency?: string;
    status?: string;
    stripeSessionId?: string;
    createdAt: string;
}

const emptyStats: AdminStats = {
    totalUsers: 0,
    totalCustomers: 0,
    totalVendors: 0,
    blockedUsers: 0,
    totalMenuItems: 0,
    pendingMenuItems: 0,
    totalOrders: 0,
    totalTransactions: 0,
};

const getArray = <T,>(result: unknown): T[] => {
    if (!result || typeof result !== "object") return [];

    const response = result as {
        data?: T[] | { users?: T[]; menuItems?: T[]; transactions?: T[] };
    };

    if (Array.isArray(response.data)) return response.data;

    if (response.data && typeof response.data === "object") {
        const nested = response.data as {
            users?: T[];
            menuItems?: T[];
            transactions?: T[];
        };

        return (
            nested.users ||
            nested.menuItems ||
            nested.transactions ||
            []
        );
    }

    return [];
};

const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const AdminDashboard = () => {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [stats, setStats] = useState<AdminStats>(emptyStats);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [menuItems, setMenuItems] = useState<PendingMenuItem[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState("");
    const [error, setError] = useState("");

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const tokenResponse = await fetch("/api/auth/token");
            const tokenData = await tokenResponse.json();

            if (!tokenResponse.ok || !tokenData.token) {
                throw new Error("Unable to authenticate your admin session.");
            }

            const headers = {
                Authorization: `Bearer ${tokenData.token}`,
            };

            const endpoints = [
                `${API_URL}/api/dashboard/admin/stats`,
                `${API_URL}/api/users`,
                `${API_URL}/api/menu-items/pending`,
                `${API_URL}/api/transactions`,
            ];

            const responses = await Promise.all(
                endpoints.map((url) =>
                    fetch(url, { headers, cache: "no-store" }),
                ),
            );

            const results = await Promise.all(
                responses.map(async (response) => {
                    const data = await response.json();

                    if (!response.ok || data.success === false) {
                        throw new Error(
                            data.message || "Failed to load admin dashboard data.",
                        );
                    }

                    return data;
                }),
            );

            setStats({
                ...emptyStats,
                ...(results[0].data || {}),
            });

            setUsers(getArray<AdminUser>(results[1]));
            setMenuItems(getArray<PendingMenuItem>(results[2]));
            setTransactions(getArray<Transaction>(results[3]));
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong while loading the dashboard.";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!session?.user) return;

        const timer = window.setTimeout(() => {
            void fetchDashboard();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [session?.user, fetchDashboard]);

    const updateUserStatus = async (
        userId: string,
        isBlocked: boolean,
    ) => {
        try {
            setActionId(userId);

            const tokenResponse = await fetch("/api/auth/token");
            const tokenData = await tokenResponse.json();

            if (!tokenData.token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch(
                `${API_URL}/api/users/${userId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                    body: JSON.stringify({ isBlocked }),
                },
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to update user status.");
            }

            setUsers((previous) =>
                previous.map((user) =>
                    user._id === userId ? { ...user, isBlocked } : user,
                ),
            );

            setStats((previous) => ({
                ...previous,
                blockedUsers: Math.max(
                    0,
                    previous.blockedUsers + (isBlocked ? 1 : -1),
                ),
            }));

            toast.success(
                isBlocked
                    ? "User blocked successfully."
                    : "User unblocked successfully.",
            );
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "User update failed.",
            );
        } finally {
            setActionId("");
        }
    };

    const reviewMenuItem = async (
        itemId: string,
        approvalStatus: "approved" | "rejected",
    ) => {
        try {
            setActionId(itemId);

            const tokenResponse = await fetch("/api/auth/token");
            const tokenData = await tokenResponse.json();

            if (!tokenData.token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch(
                `${API_URL}/api/menu-items/${itemId}/review`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                    body: JSON.stringify({ approvalStatus }),
                },
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Menu review failed.");
            }

            setMenuItems((previous) =>
                previous.filter((item) => item._id !== itemId),
            );

            setStats((previous) => ({
                ...previous,
                pendingMenuItems: Math.max(0, previous.pendingMenuItems - 1),
            }));

            toast.success(
                approvalStatus === "approved"
                    ? "Menu item approved successfully."
                    : "Menu item rejected successfully.",
            );
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Menu review failed.",
            );
        } finally {
            setActionId("");
        }
    };

    const tabs: {
        id: Tab;
        label: string;
        icon: typeof LayoutDashboard;
    }[] = [
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "users", label: "Users", icon: Users },
            { id: "menu", label: "Menu Approval", icon: Utensils },
            { id: "transactions", label: "Transactions", icon: CreditCard },
        ];

    const statCards = [
        {
            label: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Total Vendors",
            value: stats.totalVendors,
            icon: Store,
            color: "bg-orange-50 text-orange-600",
        },
        {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: Activity,
            color: "bg-green-50 text-green-600",
        },
        {
            label: "Transactions",
            value: stats.totalTransactions,
            icon: CreditCard,
            color: "bg-purple-50 text-purple-600",
        },
        {
            label: "Pending Menus",
            value: stats.pendingMenuItems,
            icon: Clock,
            color: "bg-amber-50 text-amber-600",
        },
        {
            label: "Blocked Users",
            value: stats.blockedUsers,
            icon: Ban,
            color: "bg-red-50 text-red-600",
        },
    ];

    if (isPending || loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#D94B35]" />
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-24 text-center">
                <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-[#D94B35]" />
                <h2 className="text-2xl font-bold">Admin Sign In Required</h2>
                <p className="mt-2 text-muted-foreground">
                    Please sign in with your administrator account.
                </p>
                <Button className="mt-6" onClick={() => router.push("/login")}>
                    Sign In
                </Button>
            </div>
        );
    }

    if (session.user.role !== "admin") {
        return (
            <div className="mx-auto max-w-2xl px-4 py-24 text-center">
                <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-[#D94B35]" />
                <h2 className="text-2xl font-bold">Admin Access Only</h2>
                <p className="mt-2 text-muted-foreground">
                    Your account does not have administrator permissions.
                </p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F1E7]/50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#D94B35]">
                            PizzaHub Administration
                        </p>
                        <h1 className="text-3xl font-bold text-[#29231F] sm:text-4xl">
                            Admin Dashboard
                        </h1>
                        <p className="mt-2 text-sm text-[#29231F]/60">
                            Manage users, review menus and monitor platform activity.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => void fetchDashboard()}
                        disabled={loading}
                        className="border-[#29231F]/15 bg-white"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Data
                    </Button>
                </div>

                <div className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-[#29231F]/10 bg-white p-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTab === tab.id
                                        ? "bg-[#D94B35] text-white"
                                        : "text-[#29231F]/65 hover:bg-[#F8F1E7]"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                                {tab.id === "menu" && stats.pendingMenuItems > 0 && (
                                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                                        {stats.pendingMenuItems}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {error && (
                    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
                        <p>{error}</p>
                        <Button size="sm" variant="outline" onClick={() => void fetchDashboard()}>
                            Try Again
                        </Button>
                    </div>
                )}

                {activeTab === "overview" && (
                    <section>
                        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {statCards.map((stat) => {
                                const Icon = stat.icon;

                                return (
                                    <div
                                        key={stat.label}
                                        className="rounded-2xl border border-[#29231F]/10 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-[#29231F]/55">
                                                    {stat.label}
                                                </p>
                                                <p className="mt-2 text-3xl font-bold text-[#29231F]">
                                                    {stat.value}
                                                </p>
                                            </div>
                                            <div className={`rounded-xl p-3 ${stat.color}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-2xl border border-[#29231F]/10 bg-white p-6">
                                <h2 className="mb-5 text-lg font-bold text-[#29231F]">
                                    Platform Users
                                </h2>
                                <div className="space-y-5">
                                    {[
                                        { label: "Customers", value: stats.totalCustomers },
                                        { label: "Vendors", value: stats.totalVendors },
                                        { label: "Blocked Users", value: stats.blockedUsers },
                                    ].map((item) => {
                                        const percentage =
                                            stats.totalUsers > 0
                                                ? (item.value / stats.totalUsers) * 100
                                                : 0;

                                        return (
                                            <div key={item.label}>
                                                <div className="mb-2 flex justify-between text-sm">
                                                    <span className="text-[#29231F]/65">
                                                        {item.label}
                                                    </span>
                                                    <span className="font-semibold text-[#29231F]">
                                                        {item.value}
                                                    </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-[#F8F1E7]">
                                                    <div
                                                        className="h-full rounded-full bg-[#D94B35]"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#29231F]/10 bg-white p-6">
                                <h2 className="mb-5 text-lg font-bold text-[#29231F]">
                                    Platform Activity
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-xl bg-[#F8F1E7] p-4">
                                        <Utensils className="mb-3 h-5 w-5 text-[#D94B35]" />
                                        <p className="text-2xl font-bold text-[#29231F]">
                                            {stats.totalMenuItems}
                                        </p>
                                        <p className="mt-1 text-xs text-[#29231F]/60">
                                            Total Menu Items
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[#F8F1E7] p-4">
                                        <Clock className="mb-3 h-5 w-5 text-amber-600" />
                                        <p className="text-2xl font-bold text-[#29231F]">
                                            {stats.pendingMenuItems}
                                        </p>
                                        <p className="mt-1 text-xs text-[#29231F]/60">
                                            Awaiting Review
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[#F8F1E7] p-4">
                                        <Activity className="mb-3 h-5 w-5 text-green-600" />
                                        <p className="text-2xl font-bold text-[#29231F]">
                                            {stats.totalOrders}
                                        </p>
                                        <p className="mt-1 text-xs text-[#29231F]/60">
                                            Total Orders
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[#F8F1E7] p-4">
                                        <CreditCard className="mb-3 h-5 w-5 text-purple-600" />
                                        <p className="text-2xl font-bold text-[#29231F]">
                                            {stats.totalTransactions}
                                        </p>
                                        <p className="mt-1 text-xs text-[#29231F]/60">
                                            Subscription Transactions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === "users" && (
                    <section className="overflow-hidden rounded-2xl border border-[#29231F]/10 bg-white">
                        <div className="border-b border-[#29231F]/10 p-5">
                            <h2 className="text-xl font-bold text-[#29231F]">
                                User Management
                            </h2>
                            <p className="mt-1 text-sm text-[#29231F]/55">
                                Manage customer and vendor account access.
                            </p>
                        </div>

                        {users.length === 0 ? (
                            <div className="p-12 text-center text-sm text-[#29231F]/55">
                                No users found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[750px] text-left text-sm">
                                    <thead className="bg-[#F8F1E7] text-[#29231F]/65">
                                        <tr>
                                            <th className="px-5 py-4 font-semibold">User</th>
                                            <th className="px-5 py-4 font-semibold">Role</th>
                                            <th className="px-5 py-4 font-semibold">Plan</th>
                                            <th className="px-5 py-4 font-semibold">Joined</th>
                                            <th className="px-5 py-4 font-semibold">Status</th>
                                            <th className="px-5 py-4 text-right font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#29231F]/10">
                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-[#29231F]">
                                                        {user.name || "Unnamed User"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[#29231F]/50">
                                                        {user.email}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4 capitalize">
                                                    {user.role}
                                                </td>
                                                <td className="px-5 py-4 capitalize">
                                                    {user.subscriptionPlan || "—"}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {formatDate(user.createdAt)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isBlocked
                                                                ? "bg-red-50 text-red-600"
                                                                : "bg-green-50 text-green-700"
                                                            }`}
                                                    >
                                                        {user.isBlocked ? "Blocked" : "Active"}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={
                                                            actionId === user._id ||
                                                            user.email === session.user.email
                                                        }
                                                        onClick={() =>
                                                            void updateUserStatus(
                                                                user._id,
                                                                !user.isBlocked,
                                                            )
                                                        }
                                                    >
                                                        {actionId === user._id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : user.isBlocked ? (
                                                            "Unblock"
                                                        ) : (
                                                            "Block"
                                                        )}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {activeTab === "menu" && (
                    <section>
                        <div className="mb-5">
                            <h2 className="text-xl font-bold text-[#29231F]">
                                Pending Menu Approvals
                            </h2>
                            <p className="mt-1 text-sm text-[#29231F]/55">
                                Review vendor submissions before they appear in the public menu.
                            </p>
                        </div>

                        {menuItems.length === 0 ? (
                            <div className="rounded-2xl border border-[#29231F]/10 bg-white p-12 text-center">
                                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" />
                                <h3 className="font-semibold text-[#29231F]">
                                    All caught up!
                                </h3>
                                <p className="mt-1 text-sm text-[#29231F]/55">
                                    There are no menu items waiting for approval.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {menuItems.map((item) => (
                                    <article
                                        key={item._id}
                                        className="overflow-hidden rounded-2xl border border-[#29231F]/10 bg-white shadow-sm"
                                    >
                                        <div className="relative h-48 bg-[#F8F1E7]">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <div className="mb-2 flex items-start justify-between gap-3">
                                                <h3 className="font-bold text-[#29231F]">
                                                    {item.title}
                                                </h3>
                                                <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                                                    Pending
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#29231F]/55">
                                                {item.category} · {item.location}
                                            </p>
                                            <p className="mt-3 text-lg font-bold text-[#D94B35]">
                                                ${Number(item.price).toFixed(2)}
                                            </p>
                                            {item.description && (
                                                <p className="mt-2 line-clamp-2 text-sm text-[#29231F]/65">
                                                    {item.description}
                                                </p>
                                            )}
                                            <p className="mt-3 text-xs text-[#29231F]/45">
                                                Submitted {formatDate(item.createdAt)}
                                            </p>
                                            <div className="mt-5 grid grid-cols-2 gap-3">
                                                <Button
                                                    disabled={actionId === item._id}
                                                    onClick={() =>
                                                        void reviewMenuItem(item._id, "approved")
                                                    }
                                                    className="bg-green-600 text-white hover:bg-green-700"
                                                >
                                                    {actionId === item._id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Check className="mr-1 h-4 w-4" />
                                                            Approve
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    disabled={actionId === item._id}
                                                    onClick={() =>
                                                        void reviewMenuItem(item._id, "rejected")
                                                    }
                                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    <X className="mr-1 h-4 w-4" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === "transactions" && (
                    <section className="overflow-hidden rounded-2xl border border-[#29231F]/10 bg-white">
                        <div className="border-b border-[#29231F]/10 p-5">
                            <h2 className="text-xl font-bold text-[#29231F]">
                                Subscription Transactions
                            </h2>
                            <p className="mt-1 text-sm text-[#29231F]/55">
                                Read-only records of vendor premium subscriptions.
                            </p>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="p-12 text-center text-sm text-[#29231F]/55">
                                No transactions found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[700px] text-left text-sm">
                                    <thead className="bg-[#F8F1E7] text-[#29231F]/65">
                                        <tr>
                                            <th className="px-5 py-4 font-semibold">Vendor</th>
                                            <th className="px-5 py-4 font-semibold">Amount</th>
                                            <th className="px-5 py-4 font-semibold">Session ID</th>
                                            <th className="px-5 py-4 font-semibold">Status</th>
                                            <th className="px-5 py-4 font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#29231F]/10">
                                        {transactions.map((transaction) => (
                                            <tr key={transaction._id}>
                                                <td className="px-5 py-4">
                                                    {transaction.vendorEmail ||
                                                        transaction.vendorId ||
                                                        "—"}
                                                </td>
                                                <td className="px-5 py-4 font-semibold">
                                                    {transaction.amount !== undefined
                                                        ? `${transaction.currency?.toUpperCase() || "USD"} ${transaction.amount}`
                                                        : "—"}
                                                </td>
                                                <td className="max-w-[180px] truncate px-5 py-4 text-xs text-[#29231F]/55">
                                                    {transaction.stripeSessionId || "—"}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                                                        {transaction.status || "Completed"}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {formatDate(transaction.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
};

export default AdminDashboard;
