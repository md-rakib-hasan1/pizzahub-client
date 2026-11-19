
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    ShoppingBag,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    MapPin,
    CalendarDays,
    Mail,
    MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface VendorOrder {
    _id: string;
    menuItemTitle: string;
    price: number;
    customerEmail: string;
    deliveryDate: string;
    deliveryAddress: string;
    message?: string;
    status: "pending" | "accepted" | "rejected" | "cancelled";
    createdAt: string;
}

type FilterStatus = "all" | VendorOrder["status"];

const statusStyles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-600",
};

const VendorOrders = () => {
    const { data: session } = authClient.useSession();

    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState<FilterStatus>("all");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const tokenResponse = await fetch("/api/auth/token");
            const tokenData = await tokenResponse.json();

            if (!tokenResponse.ok || !tokenData.token) {
                throw new Error("Authentication token could not be retrieved.");
            }

            const response = await fetch(`${API_URL}/api/orders/vendor`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to load orders.");
            }

            setOrders(result.data || []);
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
            void fetchOrders();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [session?.user, fetchOrders]);

    const updateOrderStatus = async (
        orderId: string,
        action: "accept" | "reject"
    ) => {
        setProcessingId(orderId);

        try {
            const tokenResponse = await fetch("/api/auth/token");
            const tokenData = await tokenResponse.json();

            if (!tokenResponse.ok || !tokenData.token) {
                throw new Error("Authentication token could not be retrieved.");
            }

            const response = await fetch(
                `${API_URL}/api/orders/${orderId}/${action}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Could not update order.");
            }

            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, status: action === "accept" ? "accepted" : "rejected" }
                        : order
                )
            );

            toast.success(
                action === "accept"
                    ? "Order accepted successfully."
                    : "Order rejected successfully."
            );
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-BD", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    const filteredOrders =
        filter === "all"
            ? orders
            : orders.filter((order) => order.status === filter);

    const filterOptions: { label: string; value: FilterStatus }[] = [
        { label: "All Orders", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Accepted", value: "accepted" },
        { label: "Rejected", value: "rejected" },
        { label: "Cancelled", value: "cancelled" },
    ];

    const counts = {
        all: orders.length,
        pending: orders.filter((order) => order.status === "pending").length,
        accepted: orders.filter((order) => order.status === "accepted").length,
        rejected: orders.filter((order) => order.status === "rejected").length,
        cancelled: orders.filter((order) => order.status === "cancelled").length,
    };

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
                    onClick={() => void fetchOrders()}
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
                        Manage Orders
                    </h1>
                    <p className="mt-2 text-sm text-[#29231F]/60">
                        Review customer orders and manage their status.
                    </p>
                </div>

                <button
                    onClick={() => void fetchOrders()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#29231F]/10 bg-white px-4 py-3 text-sm font-semibold text-[#29231F] transition hover:bg-[#F8F1E7]"
                >
                    <RefreshCw size={16} />
                    Refresh Orders
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {filterOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`rounded-2xl border p-4 text-left transition ${
                            filter === option.value
                                ? "border-[#D94B35] bg-[#D94B35] text-white shadow-md"
                                : "border-[#29231F]/10 bg-white text-[#29231F] hover:border-[#D94B35]/50"
                        }`}
                    >
                        <p className="text-sm opacity-80">{option.label}</p>
                        <p className="mt-2 text-2xl font-bold">
                            {counts[option.value]}
                        </p>
                    </button>
                ))}
            </div>

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#29231F]">
                        {filter === "all"
                            ? "All Customer Orders"
                            : `${filter.charAt(0).toUpperCase()}${filter.slice(1)} Orders`}
                    </h2>
                    <span className="text-sm text-[#29231F]/50">
                        {filteredOrders.length} orders
                    </span>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="rounded-2xl border border-[#29231F]/10 bg-white px-5 py-16 text-center">
                        <ShoppingBag
                            size={42}
                            className="mx-auto text-[#29231F]/30"
                        />
                        <h3 className="mt-4 text-lg font-bold text-[#29231F]">
                            No orders found
                        </h3>
                        <p className="mt-2 text-sm text-[#29231F]/50">
                            {filter === "all"
                                ? "Customer orders will appear here when someone places an order."
                                : `There are no ${filter} orders right now.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="rounded-2xl border border-[#29231F]/10 bg-white p-5 shadow-sm sm:p-6"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-[#29231F]/40">
                                            Order ID
                                        </p>
                                        <p className="mt-1 break-all text-sm font-semibold text-[#29231F]">
                                            #{order._id}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                                            statusStyles[order.status] ||
                                            "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="mt-5 border-b border-[#29231F]/10 pb-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#29231F]">
                                                {order.menuItemTitle}
                                            </h3>
                                            <p className="mt-1 text-sm text-[#29231F]/50">
                                                Customer order
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-xl font-bold text-[#D94B35]">
                                            ${order.price}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3 text-sm">
                                    <div className="flex items-start gap-3 text-[#29231F]/70">
                                        <Mail
                                            size={17}
                                            className="mt-0.5 shrink-0 text-[#D94B35]"
                                        />
                                        <span className="break-all">
                                            {order.customerEmail}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-3 text-[#29231F]/70">
                                        <CalendarDays
                                            size={17}
                                            className="mt-0.5 shrink-0 text-[#D94B35]"
                                        />
                                        <span>
                                            Delivery: {formatDate(order.deliveryDate)}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-3 text-[#29231F]/70">
                                        <MapPin
                                            size={17}
                                            className="mt-0.5 shrink-0 text-[#D94B35]"
                                        />
                                        <span>{order.deliveryAddress}</span>
                                    </div>

                                    {order.message && (
                                        <div className="flex items-start gap-3 text-[#29231F]/70">
                                            <MessageSquare
                                                size={17}
                                                className="mt-0.5 shrink-0 text-[#D94B35]"
                                            />
                                            <span>{order.message}</span>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 text-xs text-[#29231F]/40">
                                        <Clock size={15} className="mt-0.5 shrink-0" />
                                        <span>
                                            Placed on {formatDate(order.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {order.status === "pending" && (
                                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#29231F]/10 pt-5">
                                        <button
                                            disabled={processingId === order._id}
                                            onClick={() =>
                                                void updateOrderStatus(
                                                    order._id,
                                                    "accept"
                                                )
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <CheckCircle2 size={17} />
                                            {processingId === order._id
                                                ? "Processing..."
                                                : "Accept"}
                                        </button>

                                        <button
                                            disabled={processingId === order._id}
                                            onClick={() =>
                                                void updateOrderStatus(
                                                    order._id,
                                                    "reject"
                                                )
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <XCircle size={17} />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorOrders;
