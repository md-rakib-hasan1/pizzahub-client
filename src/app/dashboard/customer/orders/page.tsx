
import CustomerOrders from "@/components/orders/customer-orders";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "My Orders | PizzaHub",
    description: "View and track your PizzaHub orders.",
};

const CustomerOrdersPage = () => {
    return <CustomerOrders />;
};

export default CustomerOrdersPage;
