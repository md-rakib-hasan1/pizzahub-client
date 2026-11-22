
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Loader2,
    CheckCircle2,
    Clock3,
    XCircle,
    Ban,
    LoaderCircle,
    CalendarDays,
    MapPin,
    RefreshCw,
    Pizza,
    Eye,
} from "lucide-react";
import { toast } from "sonner";

interface Order {
    _id: string;
    menuItemTitle: string;
    price: number;
    quantity?: number;
    unitPrice?: number;
    status: "pending" | "accepted" | "rejected" | "cancelled";
    deliveryDate: string;
    deliveryAddress: string;
    createdAt: string;
}

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const statusConfig = {
    pending: {
        label: "Order Pending",
        description: "Your order is waiting for vendor confirmation.",
        icon: Clock3,
        color: "text-amber-600",
        background: "bg-amber-100",
        border: "border-amber-200",
    },
    accepted: {
        label: "Order Accepted",
        description: "The vendor has accepted your order.",
        icon: CheckCircle2,
        color: "text-green-600",
        background: "bg-green-100",
        border: "border-green-200",
    },
    rejected: {
        label: "Order Rejected",
        description: "The vendor could not accept your order.",
        icon: XCircle,
        color: "text-red-600",
        background: "bg-red-100",
        border: "border-red-200",
    },
    cancelled: {
        label: "Order Cancelled",
        description: "This order has been cancelled.",
        icon: XCircle,
        color: "text-gray-600",
        background: "bg-gray-100",
        border: "border-gray-200",
    },
};

const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

    return parsedDate.toLocaleDateString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const CustomerOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
        null
    );
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const tokenResponse = await fetch("/api/auth/token");
                const tokenData = await tokenResponse.json();

                if (!tokenResponse.ok || !tokenData.token) {
                    throw new Error("Unable to authenticate your account.");
                }

                const response = await fetch(`${API_URL}/api/orders/my`, {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Failed to load orders.");
                }

                setOrders(Array.isArray(result.data) ? result.data : []);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [refreshKey]);

    const handleCancelOrder = async (orderId: string) => {
        try {
            setCancellingOrderId(orderId);

            const tokenResponse = await fetch("/api/auth/token");
            const tokenData = await tokenResponse.json();

            if (!tokenResponse.ok || !tokenData.token) {
                throw new Error("Unable to authenticate your account.");
            }

            const response = await fetch(
                `${API_URL}/api/orders/${orderId}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to cancel order.");
            }

            setOrders((previous) =>
                previous.map((order) =>
                    order._id === orderId
                        ? { ...order, status: "cancelled" }
                        : order
                )
            );

            toast.success("Your order has been cancelled.");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setCancellingOrderId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#F8F1E7]">
                <Loader2 className="animate-spin text-[#D94B35]" size={40} />
                <p className="text-sm font-medium text-[#29231F]/60">
                    Loading your orders...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F1E7] px-5">
                <div className="max-w-md rounded-3xl border border-[#29231F]/10 bg-white p-8 text-center shadow-sm">
                    <XCircle className="mx-auto text-[#D94B35]" size={44} />
                    <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#29231F]">
                        Unable to Load Orders
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#29231F]/60">
                        {error}
                    </p>
                    <button
                        type="button"
                        onClick={() => setRefreshKey((previous) => previous + 1)}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D94B35] px-6 py-3 text-sm font-bold text-white hover:bg-[#BD3D2B]"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F1E7] px-5 py-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D94B35]">
                            Your Activity
                        </p>
                        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-4xl font-bold text-[#29231F] sm:text-5xl">
                            My Orders
                        </h1>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-[#29231F]/60">
                            Keep track of your pizza orders and their delivery status.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setRefreshKey((previous) => previous + 1)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#29231F]/15 bg-white px-5 py-3 text-sm font-semibold text-[#29231F] hover:border-[#D94B35] hover:text-[#D94B35]"
                    >
                        <RefreshCw size={16} />
                        Refresh Orders
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#29231F]/20 bg-white px-6 py-20 text-center">
                        <Pizza size={40} className="mx-auto text-[#D94B35]" />
                        <h2 className="mt-6 font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#29231F]">
                            No Orders Yet
                        </h2>
                        <p className="mt-3 text-sm text-[#29231F]/60">
                            Your pizza orders will appear here once you place your first order.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#29231F]/10 bg-white px-6 py-5">
                            <div>
                                <p className="text-sm text-[#29231F]/55">Total Orders</p>
                                <p className="mt-1 text-3xl font-bold text-[#29231F]">
                                    {orders.length}
                                </p>
                            </div>
                            <Pizza size={30} className="text-[#D94B35]" />
                        </div>

                        <div className="grid gap-6">
                            {orders.map((order) => {
                                const status = statusConfig[order.status];
                                const StatusIcon = status.icon;

                                return (
                                    <div
                                        key={order._id}
                                        className="overflow-hidden rounded-3xl border border-[#29231F]/10 bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="p-6 sm:p-8">
                                            <div className="flex flex-wrap items-start justify-between gap-5">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-[#D94B35]">
                                                        Order Details
                                                    </p>
                                                    <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#29231F]">
                                                        {order.menuItemTitle}
                                                    </h2>
                                                    <p className="mt-2 break-all text-xs text-[#29231F]/45">
                                                        Order ID: {order._id}
                                                    </p>
                                                </div>

                                                <div className={`flex items-center gap-2 rounded-full border px-4 py-2 ${status.background} ${status.border}`}>
                                                    <StatusIcon size={16} className={status.color} />
                                                    <span className={`text-xs font-bold ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="mt-4 text-sm leading-6 text-[#29231F]/60">
                                                {status.description}
                                            </p>

                                            <div className="mt-7 grid gap-5 border-t border-[#29231F]/10 pt-6 sm:grid-cols-3">
                                                <div className="flex items-start gap-3">
                                                    <CalendarDays size={19} className="mt-0.5 text-[#D94B35]" />
                                                    <div>
                                                        <p className="text-xs text-[#29231F]/45">Delivery Date</p>
                                                        <p className="mt-1 text-sm font-semibold text-[#29231F]">
                                                            {formatDate(order.deliveryDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <MapPin size={19} className="mt-0.5 text-[#D94B35]" />
                                                    <div>
                                                        <p className="text-xs text-[#29231F]/45">Delivery Address</p>
                                                        <p className="mt-1 text-sm font-semibold text-[#29231F]">
                                                            {order.deliveryAddress}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Pizza size={19} className="mt-0.5 text-[#D94B35]" />
                                                    <div>
                                                        <p className="text-xs text-[#29231F]/45">Quantity</p>
                                                        <p className="mt-1 text-sm font-semibold text-[#29231F]">
                                                            {order.quantity ?? 1} {((order.quantity ?? 1) === 1) ? "pizza" : "pizzas"}
                                                        </p>

                                                        <p className="mt-3 text-xs text-[#29231F]/45">Total Price</p>
                                                        <p className="mt-1 text-lg font-bold text-[#D94B35]">
                                                            ${Number(order.price).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="mt-7 rounded-2xl bg-[#F8F1E7] p-5">
                                                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#29231F]/50">
                                                    Order Status Timeline
                                                </p>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D94B35] text-white">
                                                        <CheckCircle2 size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#29231F]">Order Placed</p>
                                                        <p className="text-xs text-[#29231F]/50">Your order has been submitted.</p>
                                                    </div>
                                                </div>

                                                <div className="ml-4 h-5 w-0.5 bg-[#29231F]/15" />

                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${order.status === "accepted"
                                                        ? "bg-green-600 text-white"
                                                        : order.status === "rejected"
                                                            ? "bg-red-500 text-white"
                                                            : order.status === "cancelled"
                                                                ? "bg-gray-500 text-white"
                                                                : "bg-amber-100 text-amber-600"
                                                        }`}>
                                                        {order.status === "accepted" ? (
                                                            <CheckCircle2 size={18} />
                                                        ) : order.status === "pending" ? (
                                                            <Clock3 size={18} />
                                                        ) : (
                                                            <XCircle size={18} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#29231F]">{status.label}</p>
                                                        <p className="text-xs text-[#29231F]/50">{status.description}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#29231F]/10 pt-5">
                                                <Link
                                                    href={`/dashboard/customer/orders/${order._id}`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-[#29231F]/15 px-5 py-3 text-sm font-semibold text-[#29231F] transition hover:border-[#D94B35] hover:text-[#D94B35]"
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </Link>

                                                {order.status === "pending" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        disabled={cancellingOrderId !== null}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {cancellingOrderId === order._id ? (
                                                            <>
                                                                <LoaderCircle size={16} className="animate-spin" />
                                                                Cancelling...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Ban size={16} />
                                                                Cancel Order
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default CustomerOrders;
