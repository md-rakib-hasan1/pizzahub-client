
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import MenuFilter from "./menu-filter";
import MenuGrid from "./menu-grid";
import type { MenuItem } from "./menu-grid";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiMenuItem extends Omit<MenuItem, "id"> {
    _id: string;
}

interface MenuApiResponse {
    success: boolean;
    message: string;
    data: ApiMenuItem[];
    pagination: {
        currentPage: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
    };
}

const MenuContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const category = searchParams.get("category") || "all";

    const [items, setItems] = useState<MenuItem[]>([]);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 8,
    });



    useEffect(() => {
        const controller = new AbortController();

        const fetchMenuItems = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams({
                    limit: "8",
                    sort,
                    page: String(currentPage),
                });

                if (search.trim()) {
                    params.set("search", search.trim());
                }

                if (category !== "all") {
                    params.set("category", category);
                }

                if (location.trim()) {
                    params.set("location", location.trim());
                }

                const response = await fetch(
                    `${API_URL}/api/menu-items?${params.toString()}`,
                    { signal: controller.signal }
                );

                const result: MenuApiResponse = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to load menu items."
                    );
                }

                const formattedItems = result.data.map((item) => ({
                    ...item,
                    id: item._id,
                }));

                setItems(formattedItems);
                setPagination(result.pagination);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                console.error("Menu fetch error:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong while loading pizzas."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        const debounceTimer = setTimeout(fetchMenuItems, 350);

        return () => {
            clearTimeout(debounceTimer);
            controller.abort();
        };
    }, [search, category, location, sort, currentPage]);

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setSort("newest");
        setCurrentPage(1);

        router.replace("/menu", {
            scroll: false,
        });
    };

    return (
        <div className="space-y-8">
            {/* Menu Filters */}
            <MenuFilter
                search={search}
                category={category}
                location={location}
                sort={sort}
                onSearchChange={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                onCategoryChange={(value) => {
                    const params = new URLSearchParams(searchParams.toString());

                    if (value === "all") {
                        params.delete("category");
                    } else {
                        params.set("category", value);
                    }

                    router.replace(`/menu?${params.toString()}`, {
                        scroll: false,
                    });

                    setCurrentPage(1);
                }}
                onLocationChange={(value) => {
                    setLocation(value);
                    setCurrentPage(1);
                }}
                onSortChange={(value) => {
                    setSort(value);
                    setCurrentPage(1);
                }}
            />

            {/* Loading State */}
            {loading ? (
                <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#29231F]/10 bg-white">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2
                            size={32}
                            className="animate-spin text-[#D94B35]"
                        />

                        <p className="text-sm font-medium text-[#29231F]/60">
                            Preparing something delicious...
                        </p>
                    </div>
                </div>
            ) : error ? (
                /* Error State */
                <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
                    <h3 className="text-xl font-bold text-[#29231F]">
                        Unable to Load Pizzas
                    </h3>

                    <p className="mt-2 text-sm text-red-500">
                        {error}
                    </p>
                </div>
            ) : (
                <>
                    {/* Result Count */}
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <p className="text-sm text-[#29231F]/60">
                            Showing{" "}
                            <span className="font-bold text-[#29231F]">
                                {items.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-bold text-[#29231F]">
                                {pagination.totalItems}
                            </span>{" "}
                            delicious pizzas
                        </p>

                        {(search ||
                            location ||
                            category !== "all" ||
                            sort !== "newest") && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-sm font-semibold text-[#D94B35] transition hover:text-[#BD3D2B]"
                                >
                                    Clear all filters
                                </button>
                            )}
                    </div>

                    {/* Pizza Grid */}
                    <MenuGrid items={items} />

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-[#29231F]/10 pt-8 sm:flex-row">
                            <p className="text-sm text-[#29231F]/60">
                                Showing page{" "}
                                <span className="font-bold text-[#29231F]">
                                    {pagination.currentPage}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold text-[#29231F]">
                                    {pagination.totalPages}
                                </span>{" "}
                                ({pagination.totalItems} pizzas)
                            </p>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((previous) =>
                                            previous - 1
                                        )
                                    }
                                    className="rounded-xl border border-[#29231F]/15 bg-white px-5 py-3 text-sm font-semibold text-[#29231F] transition hover:border-[#D94B35] hover:text-[#D94B35] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <span className="min-w-10 text-center text-sm font-bold text-[#29231F]">
                                    {currentPage}
                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        currentPage === pagination.totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage((previous) =>
                                            previous + 1
                                        )
                                    }
                                    className="rounded-xl bg-[#D94B35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#BD3D2B] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MenuContent;
