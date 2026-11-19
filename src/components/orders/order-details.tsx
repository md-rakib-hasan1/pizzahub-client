
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    MessageSquare,
    Pizza,
    Loader2,
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

interface Order {
    _id: string;
    menuItemId: string;
    menuItemTitle: string;
    price: number;
    customerEmail: string;
    deliveryDate: string;
    deliveryAddress: string;
    message?: string;
    status: "pending" | "accepted" | "rejected" | "cancelled";
    createdAt: string;
    updatedAt: string;
}

interface OrderDetailsProps {
    orderId: string;
}

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const statusDetails = {
    pending: {
        label: "Pending",
        description: "Waiting for vendor confirmation.",
        icon: Clock3,
        color: "text-amber-600",
        background: "bg-amber-100",
    },
    accepted: {
        label: "Accepted",
        description: "The vendor has accepted your order.",
        icon: CheckCircle2,
        color: "text-green-600",
        background: "bg-green-100",
    },
    rejected: {
        label: "Rejected",
        description: "The vendor could not accept your order.",
        icon: XCircle,
        color: "text-red-600",
        background: "bg-red-100",
    },
    cancelled: {
        label: "Cancelled",
        description: "You cancelled this order.",
        icon: XCircle,
        color: "text-gray-600",
        background: "bg-gray-100",
    },
};

const OrderDetails = ({ orderId }: OrderDetailsProps) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const tokenResponse = await fetch("/api/auth/token");
                const tokenData = await tokenResponse.json();

                if (!tokenResponse.ok || !tokenData.token) {
                    throw new Error("Unable to authenticate your account.");
                }

                const response = await fetch(
                    `${API_URL}/api/orders/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${tokenData.token}`,
                        },
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Failed to load order details.");
                }

                setOrder(result.data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E7]">
                <Loader2 size={40} className="animate-spin text-[#D94B35]" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F8F1E7] px-5 text-center">
                <XCircle size={48} className="text-[#D94B35]" />
                <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#29231F]">
                    Order Not Found
                </h1>
                <p className="mt-3 text-sm text-[#29231F]/60">
                    {error || "We couldn't find this order."}
                </p>
                <Link
                    href="/dashboard/customer/orders"
                    className="mt-6 rounded-xl bg-[#D94B35] px-6 py-3 font-semibold text-white hover:bg-[#BD3D2B]"
                >
                    Back to My Orders
                </Link>
            </main>
        );
    }

    const status = statusDetails[order.status];
    const StatusIcon = status.icon;

    return (
        <main className="min-h-screen bg-[#F8F1E7] px-5 py-16">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/dashboard/customer/orders"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#29231F]/60 transition hover:text-[#D94B35]"
                >
                    <ArrowLeft size={17} />
                    Back to My Orders
                </Link>

                <div className="mt-8 overflow-hidden rounded-3xl border border-[#29231F]/10 bg-white shadow-sm">
                    <div className="bg-[#29231F] px-6 py-9 text-white sm:px-9">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E88A45]">
                            PizzaHub Order
                        </p>

                        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl font-bold sm:text-4xl">
                            Order Details
                        </h1>

                        <p className="mt-3 break-all text-xs text-white/50">
                            Order ID: {order._id}
                        </p>
                    </div>

                    <div className="p-6 sm:p-9">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#29231F]/10 pb-7">
                            <div>
                                <p className="text-sm text-[#29231F]/50">
                                    Ordered Pizza
                                </p>
                                <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#29231F]">
                                    {order.menuItemTitle}
                                </h2>
                            </div>

                            <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${status.background}`}>
                                <StatusIcon size={17} className={status.color} />
                                <span className={`text-sm font-bold ${status.color}`}>
                                    {status.label}
                                </span>
                            </div>
                        </div>

                        <div className="mt-7 grid gap-6 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Pizza className="mt-1 text-[#D94B35]" size={20} />
                                <div>
                                    <p className="text-xs text-[#29231F]/45">Order Price</p>
                                    <p className="mt-1 text-xl font-bold text-[#D94B35]">
                                        ${Number(order.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CalendarDays className="mt-1 text-[#D94B35]" size={20} />
                                <div>
                                    <p className="text-xs text-[#29231F]/45">Delivery Date</p>
                                    <p className="mt-1 text-sm font-semibold text-[#29231F]">
                                        {new Date(order.deliveryDate).toLocaleDateString("en-BD", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="mt-1 text-[#D94B35]" size={20} />
                                <div>
                                    <p className="text-xs text-[#29231F]/45">Delivery Address</p>
                                    <p className="mt-1 text-sm font-semibold text-[#29231F]">
                                        {order.deliveryAddress}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MessageSquare className="mt-1 text-[#D94B35]" size={20} />
                                <div>
                                    <p className="text-xs text-[#29231F]/45">Special Message</p>
                                    <p className="mt-1 text-sm font-semibold text-[#29231F]">
                                        {order.message || "No special instructions."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl bg-[#F8F1E7] p-6">
                            <h3 className="font-bold text-[#29231F]">
                                Current Order Status
                            </h3>
                            <div className="mt-4 flex items-center gap-3">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${status.background}`}>
                                    <StatusIcon size={22} className={status.color} />
                                </div>
                                <div>
                                    <p className={`font-bold ${status.color}`}>
                                        {status.label}
                                    </p>
                                    <p className="mt-1 text-sm text-[#29231F]/55">
                                        {status.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-7 grid gap-4 border-t border-[#29231F]/10 pt-6 text-xs text-[#29231F]/50 sm:grid-cols-2">
                            <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
                            <p>Last Updated: {new Date(order.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderDetails;
