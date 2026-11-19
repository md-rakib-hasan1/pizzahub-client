import MenuDetails from "@/components/menu/menu-details";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Pizza Details | PizzaHub",
    description: "Explore delicious pizza details on PizzaHub.",
};

interface MenuDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

const MenuDetailsPage = async ({ params }: MenuDetailsPageProps) => {
    const { id } = await params;

    return <MenuDetails id={id} />;
};

export default MenuDetailsPage;