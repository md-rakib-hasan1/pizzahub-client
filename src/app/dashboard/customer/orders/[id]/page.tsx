
import type { Metadata } from "next";
import OrderDetails from "@/components/orders/order-details";

export const metadata: Metadata = {
    title: "Order Details | PizzaHub",
    description: "View your PizzaHub order information and status.",
};

interface OrderDetailsPageProps {
    params: Promise<{ id: string }>;
}

const OrderDetailsPage = async ({ params }: OrderDetailsPageProps) => {
    const { id } = await params;

    return <OrderDetails orderId={id} />;
};

export default OrderDetailsPage;
