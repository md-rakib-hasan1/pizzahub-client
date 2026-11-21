import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import Footer from "@/components/layout/footer";

const DashboardLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />

            <SidebarInset className="min-w-0 flex-1">
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger />
                    <div className="h-4 w-px bg-border" />
                    <span className="text-sm font-medium text-muted-foreground">
                        PizzaHub Dashboard
                    </span>
                </header>

                <main className="min-w-0 flex-1">
                    {children}
                </main>

                <Footer />
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;