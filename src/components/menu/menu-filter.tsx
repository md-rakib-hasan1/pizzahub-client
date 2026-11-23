
"use client";

import {
    Search,
    SlidersHorizontal,
    MapPin,
    Tags,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MenuFilterProps {
    search: string;
    category: string;
    location: string;
    sort: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onSortChange: (value: string) => void;
}

const MenuFilter = ({
    search,
    category,
    location,
    sort,
    onSearchChange,
    onCategoryChange,
    onLocationChange,
    onSortChange,
}: MenuFilterProps) => {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            {/* Filter Heading */}
            <div className="mb-5 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D94B35]/10 text-[#D94B35]">
                    <SlidersHorizontal size={18} />
                </div>

                <div>
                    <h3 className="font-semibold text-foreground">
                        Find Your Pizza
                    </h3>

                    <p className="text-xs text-foreground/50">
                        Search and refine your choices
                    </p>
                </div>
            </div>

            {/* Filter Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40"
                    />

                    <Input
                        value={search}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        placeholder="Search pizzas..."
                        className="!h-12 min-h-12 w-full box-border rounded-xl border-border bg-background/50 pl-10 text-foreground placeholder:text-foreground/40 focus-visible:ring-[#D94B35]"
                    />
                </div>

                {/* Category */}
                <Select
                    value={category || "all"}
                    onValueChange={(value) => onCategoryChange(value ?? "all")}
                >
                    <SelectTrigger className="!h-12 min-h-12 w-full box-border rounded-xl border-border bg-background/50 text-foreground">
                        <div className="flex items-center gap-2">
                            <Tags
                                size={17}
                                className="shrink-0 text-[#D94B35]"
                            />

                            <SelectValue placeholder="All Categories" />
                        </div>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Classic Pizza">
                            Classic Pizza
                        </SelectItem>
                        <SelectItem value="Pepperoni Pizza">
                            Pepperoni Pizza
                        </SelectItem>
                        <SelectItem value="Chicken Pizza">
                            Chicken Pizza
                        </SelectItem>
                        <SelectItem value="BBQ Pizza">BBQ Pizza</SelectItem>
                        <SelectItem value="Veggie Pizza">
                            Veggie Pizza
                        </SelectItem>
                        <SelectItem value="Cheese Pizza">
                            Cheese Pizza
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* Location */}
                <div className="relative">
                    <MapPin
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D94B35]"
                    />

                    <Input
                        value={location}
                        onChange={(event) =>
                            onLocationChange(event.target.value)
                        }
                        placeholder="Enter location..."
                        className="!h-12 min-h-12 w-full box-border rounded-xl border-border bg-background/50 pl-10 text-foreground placeholder:text-foreground/40 focus-visible:ring-[#D94B35]"
                    />
                </div>

                {/* Sorting */}
                <Select
                    value={sort}
                    onValueChange={(value) => onSortChange(value ?? "newest")}
                >
                    <SelectTrigger className="!h-12 min-h-12 w-full box-border rounded-xl border-border bg-background/50 text-foreground">
                        <SelectValue placeholder="Sort by: Newest" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price_asc">
                            Price: Low to High
                        </SelectItem>
                        <SelectItem value="price_desc">
                            Price: High to Low
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default MenuFilter;
