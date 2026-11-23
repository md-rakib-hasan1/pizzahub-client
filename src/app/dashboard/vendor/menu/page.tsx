
import type { Metadata } from "next";
import VendorMenuManagement from "@/components/menu/vendor-menu-management";

export const metadata: Metadata = {
    title: "Manage Menu | PizzaHub",
    description: "Create and manage your restaurant's pizza menu.",
};

const VendorMenuPage = () => {
    return (
        <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <VendorMenuManagement />
            </div>
        </main>
    );
};

export default VendorMenuPage;
