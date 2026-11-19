
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

interface MenuCardProps {
    id: string;
    title: string;
    category: string;
    description: string;
    price: number;
    location: string;
    image: string;
}

const MenuCard = ({
    id,
    title,
    category,
    description,
    price,
    location,
    image,
}: MenuCardProps) => {
    return (
        <div className="group overflow-hidden rounded-2xl border border-[#29231F]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Pizza Image */}
            <div className="relative h-56 overflow-hidden bg-[#F8F1E7]">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#D94B35] shadow-sm">
                    {category}
                </span>
            </div>

            {/* Pizza Information */}
            <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-xl font-bold text-[#29231F]">
                        {title}
                    </h3>

                    <p className="shrink-0 text-lg font-bold text-[#D94B35]">
                        ${price.toFixed(2)}
                    </p>
                </div>

                <p className="mb-4 line-clamp-2 min-h-10 text-sm leading-5 text-[#29231F]/60">
                    {description}
                </p>

                {/* Location */}
                <div className="mb-5 flex items-center gap-2 text-sm text-[#29231F]/55">
                    <MapPin size={16} className="shrink-0 text-[#D94B35]" />
                    <span className="line-clamp-1">{location}</span>
                </div>

                {/* Details Button */}
                <Link
                    href={`/menu/${id}`}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#29231F] text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#D94B35]"
                >
                    View Details
                    <ArrowUpRight size={17} />
                </Link>
            </div>
        </div>
    );
};

export default MenuCard;
