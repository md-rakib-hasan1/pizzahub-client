
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

const HeroSection = () => {
    return (
        <section className="overflow-hidden bg-background text-foreground">
            <div className="mx-auto grid min-h-[540px] max-w-7xl items-center gap-8 lg:gap-12 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-14">

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10"
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
                        <Star size={15} className="fill-[#E88A45] text-[#E88A45]" />
                        <span className="text-sm font-semibold text-foreground">
                            Freshly Baked, Always Delicious
                        </span>
                    </div>

                    <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        Good Food.
                        <br />
                        Great Moments.
                        <br />
                        <span className="text-[#D94B35]">
                            Perfect Pizza.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground/70 sm:text-lg">
                        Discover your favorite local pizza shops, explore
                        mouthwatering flavors, and get fresh pizza delivered
                        right to your doorstep.
                    </p>

                    <div className="mt-9 flex flex-wrap gap-4">
                        <Link href="/menu">
                            <Button
                                size="lg"
                                className="h-12 gap-2 bg-[#D94B35] px-7 text-white shadow-lg shadow-[#D94B35]/20 hover:bg-[#B83B29]"
                            >
                                <ShoppingBag size={18} />
                                Explore Menu
                                <ArrowRight size={17} />
                            </Button>
                        </Link>

                        <Link href="/register">
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 border-border bg-transparent px-7 text-foreground hover:bg-accent"
                            >
                                Join PizzaHub
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-5">
                        <div className="flex -space-x-3">
                            <div className="flex size-10 items-center justify-center rounded-full border-2 border-background bg-[#E88A45] text-sm font-bold text-white">
                                P
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-full border-2 border-background bg-[#71836A] text-sm font-bold text-white">
                                H
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-full border-2 border-background bg-[#D94B35] text-sm font-bold text-white">
                                +
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold text-foreground">
                                Discover local favorites
                            </p>
                            <p className="text-sm text-muted-foreground/60">
                                Find your next favorite pizza
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative mx-auto w-full max-w-[460px]"
                >
                    <div className="absolute inset-5 rounded-full bg-[#E88A45]/20 blur-3xl" />

                    <div className="relative aspect-square overflow-hidden rounded-full border-[10px] border-card shadow-2xl shadow-[#29231F]/10">
                        <Image
                            src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1000&q=85"
                            alt="Freshly baked delicious pizza"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>

                    <div className="absolute -bottom-3 left-0 rounded-2xl border border-border bg-card p-4 shadow-xl sm:-left-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-2xl">
                                🍕
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Made with love
                                </p>
                                <p className="font-bold text-card-foreground">
                                    Fresh & Delicious
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-0 top-5 rounded-full bg-[#D94B35] px-5 py-3 text-sm font-bold text-white shadow-lg sm:-right-3">
                        Taste the joy!
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
