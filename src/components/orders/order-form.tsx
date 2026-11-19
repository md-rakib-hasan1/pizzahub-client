
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Loader2,
    MapPin,
    MessageSquare,
    ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MenuItem {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
    location: string;
    isAvailable: boolean;
}

interface MenuApiResponse {
    success: boolean;
    message: string;
    data: MenuItem;
}

interface OrderFormProps {
    menuItemId: string;
}

const getMinDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const timezoneOffset = date.getTimezoneOffset();

    return new Date(date.getTime() - timezoneOffset * 60000)
        .toISOString()
        .split("T")[0];
};

const OrderForm = ({ menuItemId }: OrderFormProps) => {
    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [item, setItem] = useState<MenuItem | null>(null);

    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchMenuItem = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/menu-items/${menuItemId}`,
                    { signal: controller.signal }
                );

                const result: MenuApiResponse = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Unable to load pizza details."
                    );
                }

                setItem(result.data);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchMenuItem();

        return () => controller.abort();
    }, [menuItemId]);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!session?.user) {
            toast.error("Please sign in before placing an order.");
            return;
        }

        if (!item || !item.isAvailable) {
            toast.error("This pizza is currently unavailable.");
            return;
        }

        if (!deliveryDate || !deliveryAddress.trim()) {
            toast.error("Please complete all required fields.");
            return;
        }

        try {
            setSubmitting(true);

            const tokenResponse = await fetch("/api/auth/token");

            const tokenResult = await tokenResponse.json();

            if (!tokenResponse.ok || !tokenResult.token) {
                throw new Error("Unable to verify your session. Please sign in again.");
            }

            const response = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenResult.token}`,
                },
                body: JSON.stringify({
                    menuItemId,
                    deliveryDate: new Date(
                        `${deliveryDate}T12:00:00`
                    ).toISOString(),
                    deliveryAddress: deliveryAddress.trim(),
                    message: message.trim(),
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to place your order."
                );
            }

            const createdOrderId =
                result.data?._id || result.data?.id || "";

            setOrderId(createdOrderId);
            toast.success("Your order has been placed successfully!");
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while placing your order."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || sessionLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#F8F1E7]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2
                        size={34}
                        className="animate-spin text-[#D94B35]"
                    />
                    <p className="text-sm font-medium text-[#29231F]/60">
                        Preparing your order...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F8F1E7] px-5 text-center">
                <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#29231F]">
                    Unable to Load Pizza
                </h1>

                <p className="mt-3 text-sm text-red-500">
                    {error || "Pizza not found."}
                </p>

                <Link
                    href="/menu"
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-[#D94B35]"
                >
                    <ArrowLeft size={18} />
                    Back to Menu
                </Link>
            </div>
        );
    }

    if (orderId) {
        return (
            <main className="flex min-h-[75vh] items-center justify-center bg-[#F8F1E7] px-5 py-16">
                <div className="w-full max-w-xl rounded-3xl border border-[#29231F]/10 bg-white p-8 text-center shadow-sm sm:p-12">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#71836A]/10">
                        <CheckCircle2
                            size={42}
                            className="text-[#71836A]"
                        />
                    </div>

                    <h1 className="mt-6 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#29231F]">
                        Order Placed Successfully!
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-[#29231F]/60">
                        Your order for {item.title} has been submitted.
                        You can track its status from your customer dashboard.
                    </p>

                    {orderId && (
                        <p className="mt-5 break-all rounded-xl bg-[#F8F1E7] p-4 text-xs text-[#29231F]/65">
                            Order ID: {orderId}
                        </p>
                    )}

                    <Link
                        href="/menu"
                        className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#D94B35] px-6 py-3 font-semibold text-white transition hover:bg-[#BD3D2B]"
                    >
                        <ShoppingBag size={18} />
                        Explore More Pizzas
                    </Link>
                </div>
            </main>
        );
    }

    if (!session?.user) {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F8F1E7] px-5 text-center">
                <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#29231F]">
                    Sign In to Continue
                </h1>

                <p className="mt-3 max-w-md text-sm leading-7 text-[#29231F]/60">
                    Please sign in to your PizzaHub account before placing an order.
                </p>

                <Link
                    href="/login"
                    className="mt-6 rounded-xl bg-[#D94B35] px-7 py-3 font-semibold text-white transition hover:bg-[#BD3D2B]"
                >
                    Sign In
                </Link>
            </main>
        );
    }

    if (session.user.role !== "customer") {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F8F1E7] px-5 text-center">
                <div className="max-w-lg rounded-3xl border border-[#29231F]/10 bg-white p-8 shadow-sm">
                    <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#29231F]">
                        Customer Access Only
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-[#29231F]/60">
                        Only customer accounts can place pizza orders.
                        Please sign in with a customer account to continue.
                    </p>

                    <Link
                        href="/"
                        className="mt-7 inline-flex rounded-xl bg-[#D94B35] px-6 py-3 font-semibold text-white transition hover:bg-[#BD3D2B]"
                    >
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F1E7] px-5 py-12 sm:px-8 lg:py-20">
            <div className="mx-auto max-w-7xl">
                <Link
                    href={`/menu/${menuItemId}`}
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#29231F]/65 transition hover:text-[#D94B35]"
                >
                    <ArrowLeft size={18} />
                    Back to Pizza Details
                </Link>

                <div className="mb-10">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D94B35]">
                        Almost There
                    </span>

                    <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-4xl font-bold text-[#29231F] sm:text-5xl">
                        Complete Your Order
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#29231F]/60">
                        Just a few details and your favorite pizza will be on its way.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
                    {/* Order Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-3xl border border-[#29231F]/10 bg-white p-6 shadow-sm sm:p-9"
                    >
                        <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#29231F]">
                            Delivery Information
                        </h2>

                        <div className="mt-8 space-y-6">
                            <div>
                                <label
                                    htmlFor="deliveryDate"
                                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#29231F]"
                                >
                                    <CalendarDays
                                        size={17}
                                        className="text-[#D94B35]"
                                    />
                                    Delivery Date
                                </label>

                                <Input
                                    id="deliveryDate"
                                    type="date"
                                    min={getMinDeliveryDate()}
                                    value={deliveryDate}
                                    onChange={(event) =>
                                        setDeliveryDate(event.target.value)
                                    }
                                    required
                                    className="h-12"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="deliveryAddress"
                                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#29231F]"
                                >
                                    <MapPin
                                        size={17}
                                        className="text-[#D94B35]"
                                    />
                                    Delivery Address
                                </label>

                                <Textarea
                                    id="deliveryAddress"
                                    placeholder="Enter your complete delivery address..."
                                    value={deliveryAddress}
                                    onChange={(event) =>
                                        setDeliveryAddress(event.target.value)
                                    }
                                    required
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#29231F]"
                                >
                                    <MessageSquare
                                        size={17}
                                        className="text-[#D94B35]"
                                    />
                                    Special Instructions
                                    <span className="font-normal text-[#29231F]/40">
                                        (Optional)
                                    </span>
                                </label>

                                <Textarea
                                    id="message"
                                    placeholder="Any special requests for your order?"
                                    value={message}
                                    onChange={(event) =>
                                        setMessage(event.target.value)
                                    }
                                    rows={4}
                                    maxLength={500}
                                    className="resize-none"
                                />

                                <p className="mt-2 text-right text-xs text-[#29231F]/40">
                                    {message.length}/500
                                </p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting || !item.isAvailable}
                            className="mt-8 h-13 w-full rounded-xl bg-[#D94B35] text-base font-bold text-white hover:bg-[#BD3D2B]"
                        >
                            {submitting ? (
                                <>
                                    <Loader2
                                        size={19}
                                        className="mr-2 animate-spin"
                                    />
                                    Placing Your Order...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={19} className="mr-2" />
                                    Place Order
                                </>
                            )}
                        </Button>

                        {!item.isAvailable && (
                            <p className="mt-3 text-center text-sm text-red-500">
                                This pizza is currently unavailable.
                            </p>
                        )}
                    </form>

                    {/* Order Summary */}
                    <aside className="h-fit rounded-3xl border border-[#29231F]/10 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#29231F]">
                            Order Summary
                        </h2>

                        <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl bg-[#F8F1E7]">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover"
                            />
                        </div>

                        <div className="mt-5">
                            <span className="rounded-full bg-[#D94B35]/10 px-3 py-1.5 text-xs font-bold text-[#D94B35]">
                                {item.category}
                            </span>

                            <h3 className="mt-4 text-xl font-bold text-[#29231F]">
                                {item.title}
                            </h3>

                            <p className="mt-2 text-sm text-[#29231F]/55">
                                {item.location}
                            </p>
                        </div>

                        <div className="mt-7 space-y-4 border-t border-[#29231F]/10 pt-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#29231F]/60">
                                    Pizza Price
                                </span>

                                <span className="font-semibold text-[#29231F]">
                                    ${item.price.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#29231F]/60">
                                    Payment Method
                                </span>

                                <span className="font-semibold text-[#71836A]">
                                    Cash on Delivery
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-t border-[#29231F]/10 pt-5">
                                <span className="font-bold text-[#29231F]">
                                    Total
                                </span>

                                <span className="text-2xl font-bold text-[#D94B35]">
                                    ${item.price.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <p className="mt-6 text-xs leading-6 text-[#29231F]/45">
                            Your order will be sent to the restaurant for confirmation.
                            Payment is not collected online.
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default OrderForm;
