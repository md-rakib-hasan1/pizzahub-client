
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MapPin, Pizza } from "lucide-react";

import { Button } from "@/components/ui/button";

type MenuItem = {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
    location: string;
    isFeatured?: boolean;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FeaturedPizzasSection = () => {
    const [pizzas, setPizzas] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchFeaturedPizzas = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/menu-items/featured`,
                    { signal: controller.signal }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to load featured pizzas."
                    );
                }

                if (!Array.isArray(result.data)) {
                    throw new Error("Invalid featured pizzas response.");
                }

                setPizzas(result.data.slice(0, 6));
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }

                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchFeaturedPizzas();

        return () => controller.abort();
    }, []);

    return (
        <section className="bg-[#F8F1E7] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-7xl">
                {/* Heading */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#D94B35]">
                            Handpicked For You
                        </span>

                        <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#29231F] sm:text-4xl lg:text-5xl">
                            Our Featured{" "}
                            <span className="text-[#D94B35]">Pizzas</span>
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-[#29231F]/65 sm:text-base">
                            Discover special picks from local pizza shops,
                            made to satisfy every craving.
                        </p>
                    </div>

                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#D94B35] transition-all hover:gap-3"
                    >
                        Explore All Pizzas
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-[360px] animate-pulse rounded-2xl bg-white"
                            />
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
                        <p className="font-semibold text-[#29231F]">
                            Unable to load featured pizzas.
                        </p>

                        <p className="mt-2 text-sm text-[#29231F]/60">
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && pizzas.length === 0 && (
                    <div className="rounded-2xl border border-[#29231F]/10 bg-white px-6 py-14 text-center">
                        <Pizza className="mx-auto size-12 text-[#D94B35]" />

                        <h3 className="mt-4 font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#29231F]">
                            Something Delicious Is Coming!
                        </h3>

                        <p className="mt-2 text-sm text-[#29231F]/60">
                            Our featured pizza collection will be available soon.
                        </p>

                        <Link href="/menu" className="mt-5 inline-block">
                            <Button className="bg-[#D94B35] text-white hover:bg-[#B83B29]">
                                Browse Menu
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Pizza Cards */}
                {!loading && !error && pizzas.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {pizzas.map((pizza, index) => (
                            <motion.article
                                key={pizza._id}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                className="group overflow-hidden rounded-2xl border border-[#29231F]/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <Link
                                    href={`/menu/${pizza._id}`}
                                    className="relative block h-56 overflow-hidden"
                                >
                                    <Image
                                        src={pizza.image}
                                        alt={pizza.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    <span className="absolute left-4 top-4 rounded-full bg-[#D94B35] px-3 py-1 text-xs font-bold text-white">
                                        Featured
                                    </span>
                                </Link>

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-[#D94B35]">
                                                {pizza.category}
                                            </span>

                                            <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-xl font-bold text-[#29231F]">
                                                {pizza.title}
                                            </h3>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-lg font-bold text-[#D94B35]">
                                                ${pizza.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#29231F]/60">
                                        {pizza.description}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between border-t border-[#29231F]/10 pt-4">
                                        <span className="flex items-center gap-1 text-xs text-[#29231F]/60">
                                            <MapPin size={14} />
                                            {pizza.location}
                                        </span>

                                        <Link
                                            href={`/menu/${pizza._id}`}
                                            className="flex items-center gap-1 text-sm font-bold text-[#D94B35] transition-all hover:gap-2"
                                        >
                                            View Details
                                            <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedPizzasSection;
