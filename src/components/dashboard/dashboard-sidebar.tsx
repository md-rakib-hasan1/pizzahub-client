"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    LayoutDashboard,
    Utensils,
    ShoppingBag,
    Users,
    ClipboardList,
    CreditCard,
    UserRound,
    Pizza,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
    title: string;
    url: string;
    icon: React.ElementType;
    tab?: string;
};

const navigation: Record<string, NavItem[]> = {
    vendor: [
        {
            title: "Dashboard",
            url: "/dashboard/vendor",
            icon: LayoutDashboard,
        },
        {
            title: "Manage Menu",
            url: "/dashboard/vendor/menu",
            icon: Utensils,
        },
        {
            title: "Manage Orders",
            url: "/dashboard/vendor/orders",
            icon: ShoppingBag,
        },
        {
            title: "Subscription",
            url: "/dashboard/vendor/subscription",
            icon: CreditCard,
        },
    ],

    admin: [
        {
            title: "Dashboard",
            url: "/dashboard/admin",
            icon: LayoutDashboard,
            tab: "overview",
        },
        {
            title: "Manage Users",
            url: "/dashboard/admin?tab=users",
            icon: Users,
            tab: "users",
        },
        {
            title: "Manage Menus",
            url: "/dashboard/admin?tab=menu",
            icon: Utensils,
            tab: "menu",
        },
        {
            title: "Transactions",
            url: "/dashboard/admin?tab=transactions",
            icon: ClipboardList,
            tab: "transactions",
        },
    ],

    customer: [
        {
            title: "Dashboard",
            url: "/dashboard/customer",
            icon: LayoutDashboard,
        },
        {
            title: "My Orders",
            url: "/dashboard/customer/orders",
            icon: ShoppingBag,
        },
    ],
};

const DashboardSidebar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session } = authClient.useSession();

    const role = session?.user?.role || "customer";
    const items = navigation[role] || navigation.customer;

    const currentTab = searchParams.get("tab") || "overview";

    const isActive = (item: NavItem) => {
        if (role === "admin") {
            return (
                pathname === "/dashboard/admin" &&
                currentTab === item.tab
            );
        }

        const isDashboardLink = item.url === `/dashboard/${role}`;

        if (isDashboardLink) {
            return pathname === item.url;
        }

        return (
            pathname === item.url ||
            pathname.startsWith(`${item.url}/`)
        );
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="shrink-0 border-b border-sidebar-border p-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Pizza className="size-5" />
                    </div>

                    <span className="font-serif text-xl font-bold group-data-[collapsible=icon]:hidden">
                        PizzaHub
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent className="min-h-0 flex-1 overflow-y-auto">
                <SidebarGroup>
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.url}>
                                        <SidebarMenuButton
                                            render={<Link href={item.url} />}
                                            isActive={isActive(item)}
                                            tooltip={item.title}
                                        >
                                            <Icon />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto shrink-0 border-t border-sidebar-border p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={<Link href="/account" />}
                            isActive={pathname === "/account"}
                            tooltip="Profile Settings"
                        >
                            <UserRound />
                            <span>Profile Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default DashboardSidebar;