
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
    Plus,
    Pencil,
    Trash2,
    Upload,
    RefreshCw,
    X,
    UtensilsCrossed,
    ImagePlus,
    Star,
} from "lucide-react";
import { toast } from "sonner";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MenuItem {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
    location: string;
    ingredients: string[];
    isAvailable: boolean;
    isFeatured: boolean;
    approvalStatus: "pending" | "approved" | "rejected";
}

interface MenuForm {
    title: string;
    description: string;
    category: string;
    price: string;
    image: string;
    location: string;
    ingredients: string;
    isAvailable: boolean;
}

const initialForm: MenuForm = {
    title: "",
    description: "",
    category: "",
    price: "",
    image: "",
    location: "",
    ingredients: "",
    isAvailable: true,
};

const categories = [
    "Classic Pizza",
    "Pepperoni Pizza",
    "Chicken Pizza",
    "BBQ Pizza",
    "Veggie Pizza",
    "Cheese Pizza",
];

const statusStyles: Record<string, string> = {
    pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    approved: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    rejected: "bg-destructive/10 text-destructive",
};

const VendorMenuManagement = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<MenuForm>(initialForm);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [featuredActionId, setFeaturedActionId] = useState<string | null>(null);


    const getToken = useCallback(async () => {
        const response = await fetch("/api/auth/token");
        const result = await response.json();

        if (!response.ok || !result.token) {
            throw new Error("Authentication token could not be retrieved.");
        }

        return result.token as string;
    }, []);



    const fetchItems = useCallback(async () => {
        console.count("fetchItems started");
        const startTime = performance.now();

        setLoading(true);
        setError("");

        try {
            const tokenStart = performance.now();
            const token = await getToken();

            console.log(
                "Token loading time:",
                (performance.now() - tokenStart).toFixed(2),
                "ms"
            );

            const apiStart = performance.now();

            const response = await fetch(`${API_URL}/api/menu-items/my`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });

            console.log(
                "API response time:",
                (performance.now() - apiStart).toFixed(2),
                "ms"
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to load menu items.");
            }

            const data = Array.isArray(result.data)
                ? result.data
                : result.data?.menuItems || [];

            setItems(data);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
            console.log("fetchItems finished - loading set to false");

            console.log(
                "Total fetchItems time:",
                (performance.now() - startTime).toFixed(2),
                "ms"
            );
        }
    }, [getToken]);


    useEffect(() => {
        const timer = window.setTimeout(() => {
            void fetchItems();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [fetchItems]);

    const openCreateForm = () => {
        setEditingId(null);
        setForm(initialForm);
        setShowForm(true);
    };

    const openEditForm = (item: MenuItem) => {
        setEditingId(item._id);

        setForm({
            title: item.title,
            description: item.description,
            category: item.category,
            price: String(item.price),
            image: item.image,
            location: item.location,
            ingredients: item.ingredients?.join(", ") || "",
            isAvailable: item.isAvailable,
        });

        setShowForm(true);
    };

    const closeForm = () => {
        if (saving || uploading) return;

        setShowForm(false);
        setEditingId(null);
        setForm(initialForm);
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            toast.error("Only JPG, PNG and WEBP images are allowed.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB.");
            event.target.value = "";
            return;
        }

        setUploading(true);

        try {
            const token = await getToken();
            const formData = new FormData();

            formData.append("image", file);

            const response = await fetch(`${API_URL}/api/images/menu`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Image upload failed.");
            }

            const imageUrl =
                result.imageUrl || result.data?.imageUrl;

            if (!imageUrl) {
                throw new Error("Image URL was not returned by the server.");
            }

            setForm((previous) => ({
                ...previous,
                image: imageUrl,
            }));

            toast.success("Image uploaded successfully.");
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Image upload failed."
            );
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.image.trim()) {
            toast.error("Please upload a pizza image.");
            return;
        }

        setSaving(true);

        try {
            const token = await getToken();

            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category,
                price: Number(form.price),
                image: form.image.trim(),
                location: form.location.trim(),
                ingredients: form.ingredients
                    .split(",")
                    .map((ingredient) => ingredient.trim())
                    .filter(Boolean),
                isAvailable: form.isAvailable,
            };

            const endpoint = editingId
                ? `${API_URL}/api/menu-items/${editingId}`
                : `${API_URL}/api/menu-items`;

            const response = await fetch(endpoint, {
                method: editingId ? "PATCH" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Could not save menu item.");
            }

            toast.success(
                editingId
                    ? "Menu item updated successfully."
                    : "Menu item created successfully. Waiting for admin approval."
            );

            setShowForm(false);
            setEditingId(null);
            setForm(initialForm);

            await fetchItems();
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (itemId: string) => {
        setDeletingId(itemId);

        try {
            const token = await getToken();

            const response = await fetch(
                `${API_URL}/api/menu-items/${itemId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Could not delete menu item.");
            }

            setItems((previous) =>
                previous.filter((item) => item._id !== itemId)
            );

            toast.success("Menu item deleted successfully.");
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleFeatured = async (
        itemId: string,
        isFeatured: boolean
    ) => {
        setFeaturedActionId(itemId);

        try {
            const token = await getToken();

            const response = await fetch(
                `${API_URL}/api/menu-items/${itemId}/featured`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ isFeatured }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to update featured status."
                );
            }

            setItems((prev) =>
                prev.map((item) =>
                    item._id === itemId
                        ? { ...item, isFeatured }
                        : item
                )
            );

            toast.success(
                isFeatured
                    ? "Pizza added to featured section."
                    : "Pizza removed from featured section."
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Featured status update failed."
            );
        } finally {
            setFeaturedActionId(null);
        }
    };

    const activeItems = items.filter((item) => item.isAvailable).length;
    const approvedItems = items.filter(
        (item) => item.approvalStatus === "approved"
    ).length;
    const pendingItems = items.filter(
        (item) => item.approvalStatus === "pending"
    ).length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-[#D94B35]">
                        Vendor Workspace
                    </p>
                    <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-foreground sm:text-4xl">
                        Manage Your Menu
                    </h1>
                    <p className="mt-2 text-sm text-foreground/60">
                        Create, update and manage your restaurant&apos;s pizza menu.
                    </p>
                </div>

                <button
                    onClick={openCreateForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D94B35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bd3d2a]"
                >
                    <Plus size={18} />
                    Add New Pizza
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    { label: "Total Items", value: items.length },
                    { label: "Approved Items", value: approvedItems },
                    { label: "Pending Approval", value: pendingItems },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-border bg-card p-5"
                    >
                        <p className="text-sm text-foreground/60">
                            {stat.label}
                        </p>
                        <p className="mt-2 text-3xl font-bold text-foreground">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-[#D94B35]/20 bg-[#D94B35]/5 p-5">
                <p className="text-sm leading-6 text-foreground/75">
                    <strong>Free Plan:</strong> Up to 3 active menu items.
                    <strong> Premium Plan:</strong> Unlimited active menu items.
                    Your subscription plan and item limit are enforced by the server.
                </p>
                <p className="mt-2 text-xs text-foreground/50">
                    Currently active items: {activeItems}
                </p>
            </div>

            {loading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-[#D94B35]" />
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
                    <p className="font-medium text-destructive">{error}</p>
                    <button
                        onClick={() => void fetchItems()}
                        className="mt-4 rounded-xl bg-[#D94B35] px-5 py-2.5 text-sm font-semibold text-white"
                    >
                        Try Again
                    </button>
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card px-5 py-16 text-center">
                    <UtensilsCrossed
                        size={42}
                        className="mx-auto text-foreground/30"
                    />
                    <h2 className="mt-4 text-xl font-bold text-foreground">
                        Your menu is empty
                    </h2>
                    <p className="mt-2 text-sm text-foreground/50">
                        Add your first pizza to start receiving customer orders.
                    </p>
                    <button
                        onClick={openCreateForm}
                        className="mt-6 rounded-xl bg-[#D94B35] px-5 py-3 text-sm font-semibold text-white"
                    >
                        Add Your First Pizza
                    </button>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                        >
                            <div className="relative h-52 bg-background">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <ImagePlus
                                            size={40}
                                            className="text-foreground/30"
                                        />
                                    </div>
                                )}

                                <span
                                    className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[item.approvalStatus] ||
                                        "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {item.approvalStatus}
                                </span>
                            </div>

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-[#D94B35]">
                                            {item.category}
                                        </p>
                                        <h3 className="mt-1 text-lg font-bold text-foreground">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="shrink-0 text-lg font-bold text-[#D94B35]">
                                        ${item.price}
                                    </p>
                                </div>

                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground/60">
                                    {item.description}
                                </p>

                                <div className="mt-4 flex items-center justify-between text-xs text-foreground/60">
                                    <span>{item.location}</span>
                                    <span
                                        className={
                                            item.isAvailable
                                                ? "font-semibold text-green-600 dark:text-green-400"
                                                : "font-semibold text-destructive"
                                        }
                                    >
                                        {item.isAvailable
                                            ? "Available"
                                            : "Unavailable"}
                                    </span>
                                </div>
                                {item.approvalStatus === "approved" && (
                                    <button
                                        disabled={featuredActionId === item._id}
                                        onClick={() =>
                                            void handleToggleFeatured(
                                                item._id,
                                                item.isFeatured !== true
                                            )
                                        }
                                        className={`mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${item.isFeatured
                                                ? "border border-[#D94B35] bg-card text-[#D94B35] hover:bg-destructive/10"
                                                : "bg-[#D94B35] text-white hover:bg-[#bd3d2a]"
                                            }`}
                                    >
                                        {featuredActionId === item._id ? (
                                            <RefreshCw size={15} className="animate-spin" />
                                        ) : (
                                            <Star size={15} />
                                        )}

                                        {featuredActionId === item._id
                                            ? "Updating..."
                                            : item.isFeatured
                                                ? "Remove from Featured"
                                                : "Add to Featured"}
                                    </button>
                                )}

                                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                                    <button
                                        onClick={() => openEditForm(item)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-foreground transition hover:border-[#D94B35] hover:text-[#D94B35]"
                                    >
                                        <Pencil size={15} />
                                        Edit
                                    </button>

                                    <button
                                        disabled={deletingId === item._id}
                                        onClick={() => void handleDelete(item._id)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
                                    >
                                        <Trash2 size={15} />
                                        {deletingId === item._id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="my-auto max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-5 sm:p-6">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">
                                    {editingId ? "Edit Pizza" : "Add New Pizza"}
                                </h2>
                                <p className="mt-1 text-sm text-foreground/50">
                                    Enter your pizza details below.
                                </p>
                            </div>

                            <button
                                onClick={closeForm}
                                disabled={saving || uploading}
                                className="rounded-full p-2 text-foreground/60 transition hover:bg-background"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-foreground">
                                    Pizza Name
                                </label>
                                <input
                                    required
                                    minLength={3}
                                    maxLength={100}
                                    value={form.title}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            title: event.target.value,
                                        })
                                    }
                                    placeholder="e.g. Classic Margherita"
                                    className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-[#D94B35]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-foreground">
                                    Description
                                </label>
                                <textarea
                                    required
                                    minLength={10}
                                    maxLength={1000}
                                    rows={3}
                                    value={form.description}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            description: event.target.value,
                                        })
                                    }
                                    placeholder="Describe your pizza..."
                                    className="w-full resize-y rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-[#D94B35]"
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">
                                        Category
                                    </label>
                                    <select
                                        required
                                        value={form.category}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                category: event.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-[#D94B35]"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">
                                        Price (USD)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                price: event.target.value,
                                            })
                                        }
                                        placeholder="12.99"
                                        className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-[#D94B35]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-foreground">
                                    Restaurant Location
                                </label>
                                <input
                                    required
                                    minLength={2}
                                    value={form.location}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            location: event.target.value,
                                        })
                                    }
                                    placeholder="e.g. Dhanmondi, Dhaka"
                                    className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-[#D94B35]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-foreground">
                                    Ingredients
                                </label>
                                <input
                                    required
                                    value={form.ingredients}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            ingredients: event.target.value,
                                        })
                                    }
                                    placeholder="Cheese, Tomato, Basil, Olive"
                                    className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-[#D94B35]"
                                />
                                <p className="mt-1 text-xs text-foreground/40">
                                    Separate ingredients with commas.
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-foreground">
                                    Pizza Image
                                </label>

                                {form.image && (
                                    <div className="relative mb-3 h-48 overflow-hidden rounded-xl">
                                        <Image
                                            src={form.image}
                                            alt="Pizza preview"
                                            fill
                                            sizes="600px"
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setForm({
                                                    ...form,
                                                    image: "",
                                                })
                                            }
                                            className="absolute right-3 top-3 rounded-full bg-card p-2 text-destructive shadow"
                                        >
                                            <X size={17} />
                                        </button>
                                    </div>
                                )}

                                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background/50 px-4 py-5 text-sm font-semibold text-foreground/70 transition hover:border-[#D94B35] hover:text-[#D94B35]">
                                    {uploading ? (
                                        <RefreshCw
                                            size={18}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Upload size={18} />
                                    )}
                                    {uploading
                                        ? "Uploading image..."
                                        : "Choose JPG, PNG or WEBP image"}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        disabled={uploading || saving}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                                <p className="mt-1 text-xs text-foreground/40">
                                    Maximum image size: 5MB.
                                </p>
                            </div>

                            <label className="flex items-center gap-3 rounded-xl bg-background p-4">
                                <input
                                    type="checkbox"
                                    checked={form.isAvailable}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            isAvailable: event.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 accent-[#D94B35]"
                                />
                                <span className="text-sm font-medium text-foreground">
                                    This pizza is currently available for orders.
                                </span>
                            </label>

                            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving || uploading}
                                    className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-background disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving || uploading}
                                    className="rounded-xl bg-[#D94B35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#bd3d2a] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Pizza"
                                            : "Create Pizza"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorMenuManagement;
