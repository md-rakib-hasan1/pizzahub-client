
import type { Metadata } from "next";
import VendorDashboard from "@/components/dashboard/vendor-dashboard";

export const metadata: Metadata = {
    title: "Vendor Dashboard | PizzaHub",
    description: "Manage your restaurant, menu and customer orders.",
};

const VendorDashboardPage = () => {
    return (
        <main className="min-h-screen bg-[#F8F1E7] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <VendorDashboard />
            </div>
        </main>
    );
};

export default VendorDashboardPage;
