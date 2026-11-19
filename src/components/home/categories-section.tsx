
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const categories = [
    {
        name: "Classic Pizza",
        slug: "Classic Pizza",
        description: "Timeless flavors, endless happiness.",
        image:
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=85",
    },
    {
        name: "Pepperoni Pizza",
        slug: "Pepperoni Pizza",
        description: "A deliciously spicy favorite.",
        image:
            "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&q=85",
    },
    {
        name: "Chicken Pizza",
        slug: "Chicken Pizza",
        description: "Loaded with juicy chicken toppings.",
        image:
            "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700&q=85",
    },
    {
        name: "BBQ Pizza",
        slug: "BBQ Pizza",
        description: "Smoky, savory, and irresistible.",
        image:
            "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=700&q=85",
    },
    {
        name: "Veggie Pizza",
        slug: "Veggie Pizza",
        description: "Fresh ingredients in every bite.",
        image:
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&q=85",
    },
    {
        name: "Cheese Pizza",
        slug: "Cheese Pizza",
        description: "Extra cheese, extra happiness.",
        image:
            "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=700&q=85",
    },
];

const CategoriesSection = () => {
    return (
        <section
            id="categories"
            className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
        >
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#D94B35]">
                            Explore Our Collection
                        </span>

                        <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#29231F] sm:text-4xl lg:text-5xl">
                            Find Your Perfect <span className="text-[#D94B35]">Slice</span>
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-[#29231F]/65 sm:text-base">
                            From timeless classics to bold new flavors, discover
                            the pizza that makes every moment special.
                        </p>
                    </div>

                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#D94B35] transition-all hover:gap-3"
                    >
                        View All Pizzas
                        <ArrowUpRight size={18} />
                    </Link>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.08,
                            }}
                        >
                            <Link
                                href={`/menu?category=${encodeURIComponent(category.slug)}`}
                                className="group relative block h-[260px] overflow-hidden rounded-2xl bg-[#29231F] sm:h-[280px]"
                            >
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Image Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                                {/* Category Content */}
                                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-6">
                                    <div>
                                        <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-white">
                                            {category.name}
                                        </h3>

                                        <p className="mt-2 text-sm text-white/75">
                                            {category.description}
                                        </p>
                                    </div>

                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#D94B35] transition-all duration-300 group-hover:bg-[#D94B35] group-hover:text-white">
                                        <ArrowUpRight size={20} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
