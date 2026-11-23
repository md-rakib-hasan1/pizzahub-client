
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
    Menu,
    Pizza,
    X,
    LayoutDashboard,
    LogOut,
    ShoppingBag,
    Store,
    Settings,
    Moon,
    Sun,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileMenuProps {
    user: {
        name: string;
        email: string;
        image?: string | null;
        role?: string;
    };
    dashboardHref: string;
    onLogout: () => void;
}

const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle dark and light mode"
            title="Toggle theme"
            className="text-foreground"
        >
            <Sun className="hidden size-5 dark:block" />
            <Moon className="size-5 dark:hidden" />
        </Button>
    );
};

const ProfileMenu = ({
    user,
    dashboardHref,
    onLogout,
}: ProfileMenuProps) => {
    const router = useRouter();

    const initials =
        user.name
            ?.trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-full px-2 py-1.5 outline-none transition-colors hover:bg-[#D94B35]/10 focus-visible:ring-2 focus-visible:ring-[#D94B35]"
                    />
                }
            >
                <Avatar className="size-9 border border-[#D94B35]/20">
                    <AvatarImage
                        src={user.image || undefined}
                        alt={user.name}
                    />
                    <AvatarFallback className="bg-[#D94B35]/10 font-semibold text-[#D94B35]">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                <span className="max-w-28 truncate text-sm font-semibold text-foreground">
                    {user.name}
                </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-64 rounded-xl p-2"
            >
                <div className="px-3 py-3">
                    <p className="font-semibold text-foreground">
                        {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        {user.email}
                    </p>

                    <p className="mt-2 text-xs font-semibold capitalize text-[#D94B35]">
                        {user.role || "customer"} Account
                    </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => router.push("/account")}
                    className="cursor-pointer gap-2"
                >
                    <Settings className="size-4" />
                    Profile Settings
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push(dashboardHref)}
                    className="cursor-pointer gap-2"
                >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                </DropdownMenuItem>

                {user.role === "customer" && (
                    <DropdownMenuItem
                        onClick={() =>
                            router.push("/dashboard/customer/orders")
                        }
                        className="cursor-pointer gap-2"
                    >
                        <ShoppingBag className="size-4" />
                        My Orders
                    </DropdownMenuItem>
                )}

                {user.role === "vendor" && (
                    <DropdownMenuItem
                        onClick={() =>
                            router.push("/dashboard/vendor/menu")
                        }
                        className="cursor-pointer gap-2"
                    >
                        <Store className="size-4" />
                        My Restaurant
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                    <LogOut className="size-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [activeLink, setActiveLink] = useState("/");

    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;
    const role = (user as typeof user & { role?: string })?.role;

    const dashboardHref =
        role === "admin"
            ? "/dashboard/admin"
            : role === "vendor"
                ? "/dashboard/vendor"
                : "/dashboard/customer";

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Browse Menu", href: "/menu" },
        { name: "Categories", href: "/#categories" },
        { name: "About", href: "/#why-choose" },
        { name: "Contact", href: "/#contact" },
    ];

    useEffect(() => {
        const updateActiveLink = () => {
            if (pathname === "/") {
                const hash = window.location.hash;
                setActiveLink(hash ? `/${hash}` : "/");
            } else if (
                pathname === "/menu" ||
                pathname.startsWith("/menu/")
            ) {
                setActiveLink("/menu");
            } else {
                setActiveLink("");
            }
        };

        updateActiveLink();

        window.addEventListener("hashchange", updateActiveLink);

        return () => {
            window.removeEventListener("hashchange", updateActiveLink);
        };
    }, [pathname]);

    const handleLogout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            const { error } = await authClient.signOut();

            if (error) {
                toast.error(error.message || "Logout failed.");
                return;
            }

            toast.success("Logged out successfully.");
            setMobileMenuOpen(false);
            router.replace("/login");
            router.refresh();
        } catch {
            toast.error("Something went wrong during logout.");
        } finally {
            setLoggingOut(false);
        }
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const handleNavigation = (href: string) => {
        setActiveLink(href);
        closeMobileMenu();
    };

    const isActive = (href: string) => activeLink === href;

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 text-foreground backdrop-blur-md">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    onClick={() => handleNavigation("/")}
                    className="flex shrink-0 items-center gap-2"
                >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#D94B35] text-white">
                        <Pizza size={23} />
                    </div>

                    <span className="font-[family-name:var(--font-fraunces)] text-2xl font-bold tracking-tight text-foreground">
                        Pizza<span className="text-[#D94B35]">Hub</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => handleNavigation(link.href)}
                            className={`text-sm font-semibold transition-colors ${isActive(link.href)
                                ? "text-primary"
                                :"text-foreground/75 hover:text-primary"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Authentication */}
                <div className="hidden items-center gap-3 md:flex">
                     <ThemeToggle />
                    {isPending ? (
                        <div className="h-10 w-32 animate-pulse rounded-full bg-muted/10" />
                    ) : user ? (
                        <ProfileMenu
                            user={{
                                name: user.name,
                                email: user.email,
                                image: user.image,
                                role,
                            }}
                            dashboardHref={dashboardHref}
                            onLogout={handleLogout}
                        />
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    variant="ghost"
                                    className="text-foreground"
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

                {/* Mobile Controls */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    {!isPending && user && (
                        <ProfileMenu
                            user={{
                                name: user.name,
                                email: user.email,
                                image: user.image,
                                role,
                            }}
                            dashboardHref={dashboardHref}
                            onLogout={handleLogout}
                        />
                    )}

                    {isPending && (
                        <div className="size-9 animate-pulse rounded-full bg-muted/10" />
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-foreground"
                        onClick={() =>
                            setMobileMenuOpen(!mobileMenuOpen)
                        }
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </Button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-border bg-background px-5 py-5 text-foreground md:hidden">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => handleNavigation(link.href)}
                                className={`text-sm font-semibold transition-colors ${isActive(link.href)
                                    ? "text-primary"
                                    : "text-foreground hover:text-primary"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {!isPending && !user && (
                            <>
                                <div className="my-1 border-t border-border" />

                                <Link
                                    href="/login"
                                    onClick={closeMobileMenu}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full text-foreground"
                                    >
                                        Sign In
                                    </Button>
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={closeMobileMenu}
                                >
                                    <Button className="w-full bg-[#D94B35] text-white hover:bg-[#B83B29]">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
