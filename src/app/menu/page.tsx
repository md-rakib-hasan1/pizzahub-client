
import type { Metadata } from "next";

import MenuContent from "@/components/menu/menu-content";

export const metadata: Metadata = {
    title: "Browse Menu",
    description:
        "Explore delicious pizzas from local restaurants on PizzaHub.",
};

const MenuPage = () => {
    return (
        <main className="min-h-screen bg-background">
            {/* Page Header */}
            <section className="relative overflow-hidden bg-brand-surface px-5 py-20 sm:px-8 lg:py-28">
                <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D94B35]/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl">
                    <div className="max-w-3xl">
                        <span className="inline-block rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E88A45]">
                            Explore Our Collection
                        </span>

                        <h1 className="mt-6 font-[family-name:var(--font-fraunces)] text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                            Find Your Next
                            <span className="block text-[#E88A45]">
                                Favorite Pizza.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
                            From timeless classics to exciting new flavors,
                            discover delicious pizzas from local restaurants
                            around you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Menu Content */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#D94B35]">
                            The Menu
                        </span>

                        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-foreground sm:text-4xl">
                            Explore All Pizzas
                        </h2>

                        <p className="mt-3 text-sm text-foreground/60">
                            Find something delicious for every craving.
                        </p>
                    </div>
                </div>

                {/* Pizza Grid */}
                <div className="mt-8">
                     <MenuContent />
                </div>
            </section>
        </main>
    );
};

export default MenuPage;
