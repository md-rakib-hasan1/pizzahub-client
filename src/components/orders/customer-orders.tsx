
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
        color: "text-amber-600 dark:text-amber-300",
        background: "bg-amber-100 dark:bg-amber-900/30",
        border: "border-amber-200 dark:border-amber-800",
    },
    accepted: {
        label: "Order Accepted",
        description: "The vendor has accepted your order.",
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        background: "bg-green-100 dark:bg-green-900/30",
        border: "border-green-200 dark:border-green-800",
    },
    rejected: {
        label: "Order Rejected",
        description: "The vendor could not accept your order.",
        icon: XCircle,
        color: "text-destructive",
        background: "bg-destructive/10",
        border: "border-destructive/30",
    },
    cancelled: {
        label: "Order Cancelled",
        description: "This order has been cancelled.",
        icon: XCircle,
        color: "text-muted-foreground",
        background: "bg-muted",
        border: "border-border",
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
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-background">
                <Loader2 className="animate-spin text-[#D94B35]" size={40} />
                <p className="text-sm font-medium text-foreground/60">
                    Loading your orders...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-background px-5">
                <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
                    <XCircle className="mx-auto text-[#D94B35]" size={44} />
                    <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-2xl font-bold text-foreground">
                        Unable to Load Orders
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-foreground/60">
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
        <main className="min-h-screen bg-background px-5 py-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D94B35]">
                            Your Activity
                        </p>
                        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-4xl font-bold text-foreground sm:text-5xl">
                            My Orders
                        </h1>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-foreground/60">
                            Keep track of your pizza orders and their delivery status.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setRefreshKey((previous) => previous + 1)}
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:border-[#D94B35] hover:text-[#D94B35]"
                    >
                        <RefreshCw size={16} />
                        Refresh Orders
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-20 text-center">
                        <Pizza size={40} className="mx-auto text-[#D94B35]" />
                        <h2 className="mt-6 font-[family-name:var(--font-fraunces)] text-2xl font-bold text-foreground">
                            No Orders Yet
                        </h2>
                        <p className="mt-3 text-sm text-foreground/60">
                            Your pizza orders will appear here once you place your first order.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card px-6 py-5">
                            <div>
                                <p className="text-sm text-foreground/55">Total Orders</p>
                                <p className="mt-1 text-3xl font-bold text-foreground">
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
                                        className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="p-6 sm:p-8">
                                            <div className="flex flex-wrap items-start justify-between gap-5">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-[#D94B35]">
                                                        Order Details
                                                    </p>
                                                    <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-bold text-foreground">
                                                        {order.menuItemTitle}
                                                    </h2>
                                                    <p className="mt-2 break-all text-xs text-foreground/45">
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

                                            <p className="mt-4 text-sm leading-6 text-foreground/60">
                                                {status.description}
                                            </p>

                                            <div className="mt-7 grid gap-5 border-t border-border pt-6 sm:grid-cols-3">
                                                <div className="flex items-start gap-3">
                                                    <CalendarDays size={19} className="mt-0.5 text-[#D94B35]" />
                                                    <div>
                                                        <p className="text-xs text-foreground/45">Delivery Date</p>
                                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                                            {formatDate(order.deliveryDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <MapPin size={19} className="mt-0.5 text-[#D94B35]" />
                                                    <div>
                                                        <p className="text-xs text-foreground/45">Delivery Address</p>
                                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                                            {order.deliveryAddress}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Pizza size={19} className="mt-0.5 text-[#D94B35]" />
                                                    <div>
                                                        <p className="text-xs text-foreground/45">Quantity</p>
                                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                                            {order.quantity ?? 1} {((order.quantity ?? 1) === 1) ? "pizza" : "pizzas"}
                                                        </p>

                                                        <p className="mt-3 text-xs text-foreground/45">Total Price</p>
                                                        <p className="mt-1 text-lg font-bold text-[#D94B35]">
                                                            ${Number(order.price).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="mt-7 rounded-2xl bg-background p-5">
                                                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground/50">
                                                    Order Status Timeline
                                                </p>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D94B35] text-white">
                                                        <CheckCircle2 size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">Order Placed</p>
                                                        <p className="text-xs text-foreground/50">Your order has been submitted.</p>
                                                    </div>
                                                </div>

                                                <div className="ml-4 h-5 w-0.5 bg-border" />

                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${order.status === "accepted"
                                                        ? "bg-green-600 text-white"
                                                        : order.status === "rejected"
                                                            ? "bg-destructive text-destructive-foreground"
                                                            : order.status === "cancelled"
                                                                ? "bg-muted text-muted-foreground"
                                                                : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300"
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
                                                        <p className="text-sm font-bold text-foreground">{status.label}</p>
                                                        <p className="text-xs text-foreground/50">{status.description}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
                                                <Link
                                                    href={`/dashboard/customer/orders/${order._id}`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-[#D94B35] hover:text-[#D94B35]"
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </Link>

                                                {order.status === "pending" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        disabled={cancellingOrderId !== null}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-5 py-3 text-sm font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
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
