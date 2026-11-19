
import MenuCard from "@/components/menu/menu-card";
import { Pizza } from "lucide-react";

export interface MenuItem {
    id: string;
    title: string;
    category: string;
    description: string;
    price: number;
    location: string;
    image: string;
}

interface MenuGridProps {
    items: MenuItem[];
}

const MenuGrid = ({ items }: MenuGridProps) => {
    if (items.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#29231F]/15 bg-white px-6 py-16 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#D94B35]/10">
                    <Pizza size={36} className="text-[#D94B35]" />
                </div>

                <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#29231F]">
                    No Pizzas Found
                </h3>

                <p className="mt-3 max-w-md text-sm leading-7 text-[#29231F]/60">
                    We couldn&apos;t find any pizzas matching your search.
                    Try adjusting your filters or explore something different.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <MenuCard key={item.id} {...item} />
            ))}
        </div>
    );
};

export default MenuGrid;
