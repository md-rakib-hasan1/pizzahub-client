
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    MapPin,
    Pizza,
    ShoppingBag,
    Loader2,
    CheckCircle2,
    XCircle,
} from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MenuItemDetails {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
    location: string;
    ingredients: string[];
    isAvailable: boolean;
}

interface MenuDetailsResponse {
    success: boolean;
    message: string;
    data: MenuItemDetails;
}

interface MenuDetailsProps {
    id: string;
}

const MenuDetails = ({ id }: MenuDetailsProps) => {
    const [item, setItem] = useState<MenuItemDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchMenuDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/menu-items/${id}`,
                    { signal: controller.signal }
                );

                const result: MenuDetailsResponse =
                    await response.json();

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

        fetchMenuDetails();

        return () => controller.abort();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#F8F1E7]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2
                        size={36}
                        className="animate-spin text-[#D94B35]"
                    />
                    <p className="text-sm font-medium text-[#29231F]/60">
                        Preparing your pizza details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F8F1E7] px-5 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#D94B35]/10">
                    <Pizza size={36} className="text-[#D94B35]" />
                </div>

                <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#29231F]">
                    Pizza Not Found
                </h1>

                <p className="mt-3 max-w-md text-sm leading-7 text-[#29231F]/60">
                    {error || "This pizza may no longer be available."}
                </p>

                <Link
                    href="/menu"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#D94B35] px-6 py-3 font-semibold text-white transition hover:bg-[#BD3D2B]"
                >
                    <ArrowLeft size={18} />
                    Back to Menu
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F1E7] px-5 py-12 sm:px-8 lg:py-20">
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/menu"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#29231F]/65 transition hover:text-[#D94B35]"
                >
                    <ArrowLeft size={18} />
                    Back to Menu
                </Link>

                <div className="grid overflow-hidden rounded-3xl border border-[#29231F]/10 bg-white shadow-sm lg:grid-cols-2">
                    {/* Pizza Image */}
                    <div className="relative min-h-[320px] bg-[#29231F]/5 sm:min-h-[480px] lg:min-h-[600px]">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />

                        <div className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#D94B35] shadow-sm">
                            {item.category}
                        </div>
                    </div>

                    {/* Pizza Information */}
                    <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D94B35]">
                            Discover the Flavor
                        </span>

                        <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl font-bold leading-tight text-[#29231F] sm:text-5xl">
                            {item.title}
                        </h1>

                        <p className="mt-6 text-base leading-8 text-[#29231F]/65">
                            {item.description}
                        </p>

                        <div className="mt-8 flex items-center justify-between border-y border-[#29231F]/10 py-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#29231F]/45">
                                    Price
                                </p>

                                <p className="mt-2 text-3xl font-bold text-[#D94B35]">
                                    ${item.price.toFixed(2)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-medium text-[#29231F]/65">
                                <MapPin size={18} className="text-[#D94B35]" />
                                {item.location}
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="mt-8">
                            <h2 className="text-lg font-bold text-[#29231F]">
                                Ingredients
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {item.ingredients?.map((ingredient) => (
                                    <span
                                        key={ingredient}
                                        className="rounded-full bg-[#F8F1E7] px-4 py-2 text-sm font-medium text-[#29231F]/75"
                                    >
                                        {ingredient}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="mt-8 flex items-center gap-2">
                            {item.isAvailable ? (
                                <>
                                    <CheckCircle2
                                        size={19}
                                        className="text-[#71836A]"
                                    />
                                    <span className="text-sm font-semibold text-[#71836A]">
                                        Available for Order
                                    </span>
                                </>
                            ) : (
                                <>
                                    <XCircle
                                        size={19}
                                        className="text-red-500"
                                    />
                                    <span className="text-sm font-semibold text-red-500">
                                        Currently Unavailable
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Order CTA - Authentication integration will follow */}
                        <Link
                            href="/login"
                            className={`mt-8 flex items-center justify-center gap-3 rounded-xl px-6 py-4 font-bold text-white transition ${item.isAvailable
                                    ? "bg-[#D94B35] hover:bg-[#BD3D2B]"
                                    : "pointer-events-none bg-gray-400"
                                }`}
                            aria-disabled={!item.isAvailable}
                            tabIndex={item.isAvailable ? 0 : -1}
                        >
                            <ShoppingBag size={20} />
                            Sign In to Order
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MenuDetails;
