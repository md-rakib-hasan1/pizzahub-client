
import type { Metadata } from "next";
import VendorOrders from "@/components/orders/vendor-orders";

export const metadata: Metadata = {
    title: "Manage Orders | PizzaHub",
    description: "Review and manage customer orders for your restaurant.",
};

const VendorOrdersPage = () => {
    return (
        <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <VendorOrders />
            </div>
        </main>
    );
};

export default VendorOrdersPage;
