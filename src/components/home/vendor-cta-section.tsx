
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Store, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VendorCTASection = () => {
    return (
        <section className="bg-background px-5 pb-20 sm:px-8 lg:pb-28">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65 }}
                    className="relative overflow-hidden rounded-[2rem] bg-brand-surface px-7 py-14 sm:px-12 lg:px-16 lg:py-20"
                >
                    <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#D94B35]/25 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#E88A45]/15 blur-3xl" />

                    <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E88A45]">
                                <Store size={15} />
                                Grow With PizzaHub
                            </span>

                            <h2 className="mt-6 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                                Own a Pizza Shop?
                                <span className="block text-[#E88A45]">
                                    Let&apos;s Grow Together.
                                </span>
                            </h2>

                            <p className="mt-5 max-w-xl text-base leading-8 text-white/65">
                                Bring your delicious pizzas to more customers. Join our local
                                food marketplace, manage your menu, and grow your restaurant
                                with PizzaHub.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href="/register?type=vendor"
                                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#D94B35] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#c43d2b]"
                                >
                                    Become a Vendor
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Link>

                                <Link
                                    href="/login"
                                    className="inline-flex h-12 items-center rounded-full border border-white/20 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                                >
                                    Already a Vendor?
                                </Link>
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-sm">
                            <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-sm">
                                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D94B35] text-white">
                                    <Store size={27} />
                                </div>

                                <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-white">
                                    Your Restaurant,
                                    <br />
                                    Your Growth.
                                </h3>

                                <div className="mt-7 space-y-5">
                                    {[
                                        "Manage your pizza menu",
                                        "Receive and track orders",
                                        "Choose a plan that fits your shop",
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-3">
                                            <CheckCircle2
                                                size={19}
                                                className="shrink-0 text-[#E88A45]"
                                            />
                                            <span className="text-sm text-white/75">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 border-t border-white/10 pt-6">
                                    <p className="text-xs font-medium uppercase tracking-widest text-white/40">
                                        Made for local pizza businesses
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-[#E88A45]">
                                        More visibility. More opportunities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default VendorCTASection;
