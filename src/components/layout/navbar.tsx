
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    Menu,
    Pizza,
    X,
    LayoutDashboard,
    UserRound,
    LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;
    const role = user?.role;

    const dashboardHref =
        role === "admin"
            ? "/dashboard/admin"
            : role === "vendor"
                ? "/dashboard/vendor"
                : "/dashboard/customer";

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Browse Menu", href: "/menu" },
    ];

    const handleLogout = async () => {
        await authClient.signOut();

        setMobileMenuOpen(false);
        router.push("/login");
        router.refresh();
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-[#29231F]/10 bg-[#F8F1E7]/95 backdrop-blur-md">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={closeMobileMenu}
                >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#D94B35] text-white">
                        <Pizza size={23} />
                    </div>

                    <span className="font-[family-name:var(--font-fraunces)] text-2xl font-bold tracking-tight text-[#29231F]">
                        Pizza<span className="text-[#D94B35]">Hub</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-semibold transition-colors ${pathname === link.href
                                    ? "text-[#D94B35]"
                                    : "text-[#29231F]/75 hover:text-[#D94B35]"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth Actions */}
                <div className="hidden items-center gap-3 md:flex">
                    {isPending ? (
                        <div className="h-9 w-28 animate-pulse rounded-lg bg-[#29231F]/10" />
                    ) : user ? (
                        <>
                            <Link href={dashboardHref}>
                                <Button
                                    variant="outline"
                                    className="gap-2 border-[#D94B35]/30 text-[#29231F] hover:bg-[#D94B35]/10"
                                >
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </Button>
                            </Link>

                            <Link href="/account">
                                <Button
                                    variant="ghost"
                                    className="gap-2 text-[#29231F]"
                                >
                                    <UserRound size={16} />
                                    Account
                                </Button>
                            </Link>

                            <Button
                                onClick={handleLogout}
                                className="gap-2 bg-[#D94B35] text-white hover:bg-[#B83B29]"
                            >
                                <LogOut size={16} />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    variant="ghost"
                                    className="text-[#29231F]"
                                >
                                    Sign In
                                </Button>
                            </Link>

                            <Link href="/register">
                                <Button className="bg-[#D94B35] text-white hover:bg-[#B83B29]">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#29231F] md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            </nav>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-[#29231F]/10 bg-[#F8F1E7] px-5 py-5 md:hidden">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMobileMenu}
                                className={`text-sm font-semibold ${pathname === link.href
                                        ? "text-[#D94B35]"
                                        : "text-[#29231F]"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="my-1 border-t border-[#29231F]/10" />

                        {isPending ? (
                            <div className="h-9 animate-pulse rounded-lg bg-[#29231F]/10" />
                        ) : user ? (
                            <>
                                <Link
                                    href={dashboardHref}
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-2 text-sm font-semibold text-[#29231F]"
                                >
                                    <LayoutDashboard size={17} />
                                    Dashboard
                                </Link>

                                <Link
                                    href="/account"
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-2 text-sm font-semibold text-[#29231F]"
                                >
                                    <UserRound size={17} />
                                    Account
                                </Link>

                                <Button
                                    onClick={handleLogout}
                                    className="w-full bg-[#D94B35] text-white hover:bg-[#B83B29]"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link href="/login" onClick={closeMobileMenu}>
                                    <Button variant="outline" className="w-full">
                                        Sign In
                                    </Button>
                                </Link>

                                <Link href="/register" onClick={closeMobileMenu}>
                                    <Button className="w-full bg-[#D94B35] text-white hover:bg-[#B83B29]">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
