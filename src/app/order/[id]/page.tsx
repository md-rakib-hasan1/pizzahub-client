
import type { Metadata } from "next";
import OrderForm from "@/components/orders/order-form";

export const metadata: Metadata = {
    title: "Place Your Order | PizzaHub",
    description: "Complete your pizza delivery order on PizzaHub.",
};

interface OrderPageProps {
    params: Promise<{
        id: string;
    }>;
}

const OrderPage = async ({ params }: OrderPageProps) => {
    const { id } = await params;

    return <OrderForm menuItemId={id} />;
};

export default OrderPage;
