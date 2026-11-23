
"use client";

import { motion } from "motion/react";
import {
    Store,
    ChefHat,
    Truck,
    ShieldCheck,
} from "lucide-react";

const benefits = [
    {
        icon: Store,
        title: "Local Pizza Shops",
        description:
            "Discover amazing pizzas from local restaurants and support the businesses around you.",
        number: "01",
    },
    {
        icon: ChefHat,
        title: "Freshly Made",
        description:
            "Explore delicious pizzas prepared with quality ingredients and care by local chefs.",
        number: "02",
    },
    {
        icon: Truck,
        title: "Easy Ordering",
        description:
            "Place your order in just a few steps and keep track of its progress with ease.",
        number: "03",
    },
    {
        icon: ShieldCheck,
        title: "Secure Experience",
        description:
            "Enjoy a reliable experience with secure accounts and transparent order management.",
        number: "04",
    },
];

const WhyChooseSection = () => {
    return (
        <section
            id="why-choose"
            className="bg-background px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto mb-14 max-w-2xl text-center"
                >
                    <span className="mb-4 inline-block rounded-full bg-[#D94B35]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D94B35]">
                        The PizzaHub Difference
                    </span>

                    <h2 className="font-[family-name:var(--font-fraunces)] text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                        More Than Pizza,
                        <span className="text-[#D94B35]"> It&apos;s an Experience.</span>
                    </h2>

                    <p className="mt-5 text-base leading-7 text-foreground/65">
                        We bring local pizza lovers and restaurants together to make every
                        meal a little more special.
                    </p>
                </motion.div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;

                        return (
                            <motion.div
                                key={benefit.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.12,
                                }}
                                whileHover={{ y: -7 }}
                                className="group rounded-2xl border border-border bg-card p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl"
                            >
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D94B35]/10 text-[#D94B35] transition-colors duration-300 group-hover:bg-[#D94B35] group-hover:text-white">
                                        <Icon size={27} strokeWidth={1.8} />
                                    </div>

                                    <span className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-foreground/10">
                                        {benefit.number}
                                    </span>
                                </div>

                                <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-bold text-foreground">
                                    {benefit.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-foreground/65">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
