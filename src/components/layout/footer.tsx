
import Link from "next/link";
import {
    Mail,
    MapPin,
    Phone,
    Pizza,
    ArrowUpRight,
} from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
    FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
    return (
        <footer id="contact" className="bg-brand-surface text-white">
            <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 lg:pt-20">
                <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D94B35]">
                                <Pizza size={23} />
                            </span>
                            <span className="font-[family-name:var(--font-fraunces)] text-2xl font-bold">
                                Pizza<span className="text-[#E88A45]">Hub</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
                            Bringing local pizza lovers and restaurants together. Discover
                            delicious pizzas and make every meal a great moment.
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            {[
                                {
                                    icon: FaFacebookF,
                                    href: "https://facebook.com",
                                    label: "Facebook",
                                },
                                {
                                    icon: FaInstagram,
                                    href: "https://instagram.com",
                                    label: "Instagram",
                                },
                                {
                                    icon: FaXTwitter,
                                    href: "https://x.com",
                                    label: "X",
                                },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 transition-all hover:border-[#D94B35] hover:bg-[#D94B35] hover:text-white"
                                >
                                    <Icon size={17} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="mb-6 font-semibold text-white">Explore</h3>
                        <ul className="space-y-4 text-sm text-white/55">
                            <li>
                                <Link href="/" className="transition-colors hover:text-[#E88A45]">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu" className="transition-colors hover:text-[#E88A45]">
                                    Browse Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/#categories" className="transition-colors hover:text-[#E88A45]">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link href="/#why-choose" className="transition-colors hover:text-[#E88A45]">
                                    Why PizzaHub
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="mb-6 font-semibold text-white">Your Account</h3>
                        <ul className="space-y-4 text-sm text-white/55">
                            <li>
                                <Link href="/login" className="transition-colors hover:text-[#E88A45]">
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="transition-colors hover:text-[#E88A45]">
                                    Create Account
                                </Link>
                            </li>
                            <li>
                                <Link href="/register?type=vendor" className="transition-colors hover:text-[#E88A45]">
                                    Become a Vendor
                                </Link>
                            </li>
                            <li>
                                <Link href="/account" className="transition-colors hover:text-[#E88A45]">
                                    My Account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-6 font-semibold text-white">Get in Touch</h3>
                        <ul className="space-y-5 text-sm text-white/55">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="mt-0.5 shrink-0 text-[#E88A45]" />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="shrink-0 text-[#E88A45]" />
                                <a href="mailto:support@pizzahub.com" className="transition-colors hover:text-[#E88A45]">
                                    support@pizzahub.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="shrink-0 text-[#E88A45]" />
                                <span>Customer Support</span>
                            </li>
                        </ul>

                        <Link
                            href="/register?type=vendor"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#E88A45] transition-colors hover:text-white"
                        >
                            Partner with us <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center sm:flex-row sm:text-left">
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} PizzaHub. All rights reserved.
                    </p>

                    <p className="text-xs text-white/40">
                        Made with <span className="text-[#D94B35]">♥</span> for pizza lovers.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
