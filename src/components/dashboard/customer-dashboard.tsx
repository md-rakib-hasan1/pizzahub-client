
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CustomerStats {
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
  cancelledOrders: number;
}

interface CustomerOrder {
  _id: string;
  menuItemTitle: string;
  price: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  deliveryDate: string;
  deliveryAddress: string;
  createdAt: string;
}

const emptyStats: CustomerStats = {
  totalOrders: 0,
  pendingOrders: 0,
  acceptedOrders: 0,
  rejectedOrders: 0,
  cancelledOrders: 0,
};

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-amber-50 text-amber-700",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-700",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-50 text-red-700",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-gray-100 text-gray-600",
  },
};

const formatDate = (date: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const CustomerDashboard = () => {
  const { data: session, isPending } = authClient.useSession();

  const [stats, setStats] = useState<CustomerStats>(emptyStats);
  const [recentOrders, setRecentOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResponse = await fetch("/api/auth/token");
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Unable to verify your session.");
      }

      const headers = {
        Authorization: `Bearer ${tokenData.token}`,
      };

      const [statsResponse, ordersResponse] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/customer/stats`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/dashboard/customer/recent-orders`, {
          headers,
          cache: "no-store",
        }),
      ]);

      const [statsResult, ordersResult] = await Promise.all([
        statsResponse.json(),
        ordersResponse.json(),
      ]);

      if (
        !statsResponse.ok ||
        !ordersResponse.ok ||
        statsResult.success === false ||
        ordersResult.success === false
      ) {
        throw new Error(
          statsResult.message ||
            ordersResult.message ||
            "Unable to load dashboard data.",
        );
      }

      setStats({
        ...emptyStats,
        ...(statsResult.data || {}),
      });

      setRecentOrders(
        Array.isArray(ordersResult.data) ? ordersResult.data : [],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    const timer = window.setTimeout(() => {
      void fetchDashboard();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [session?.user, fetchDashboard]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D94B35]" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-[#D94B35]" />
        <h2 className="text-2xl font-bold text-[#29231F]">
          Sign In Required
        </h2>
        <p className="mt-2 text-sm text-[#29231F]/60">
          Sign in to view your orders and customer dashboard.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-[#D94B35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#BD3C29]"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (session.user.role !== "customer") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-[#D94B35]" />
        <h2 className="text-2xl font-bold text-[#29231F]">
          Customer Access Only
        </h2>
        <p className="mt-2 text-sm text-[#29231F]/60">
          This dashboard is available for customer accounts only.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Accepted",
      value: stats.acceptedOrders,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Rejected",
      value: stats.rejectedOrders,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelledOrders,
      icon: Activity,
      color: "bg-gray-100 text-gray-600",
    },
  ];

  const statusItems = [
    { label: "Pending", value: stats.pendingOrders },
    { label: "Accepted", value: stats.acceptedOrders },
    { label: "Rejected", value: stats.rejectedOrders },
    { label: "Cancelled", value: stats.cancelledOrders },
  ];

  return (
    <main className="min-h-screen bg-[#F8F1E7]/50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#D94B35]">
              Your PizzaHub Account
            </p>
            <h1 className="text-3xl font-bold text-[#29231F] sm:text-4xl">
              Welcome, {session.user.name || "Customer"}!
            </h1>
            <p className="mt-2 text-sm text-[#29231F]/60">
              Keep track of your orders and discover your next favorite pizza.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => void fetchDashboard()}
            disabled={loading}
            className="border-[#29231F]/15 bg-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <p>{error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void fetchDashboard()}
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#29231F]/10 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#29231F]/55">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-[#29231F]">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#29231F]/10 bg-white p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-[#29231F]">
              Order Status Overview
            </h2>
            <p className="mt-1 text-sm text-[#29231F]/55">
              A quick look at your order activity.
            </p>

            <div className="mt-6 space-y-5">
              {statusItems.map((item) => {
                const percentage =
                  stats.totalOrders > 0
                    ? (item.value / stats.totalOrders) * 100
                    : 0;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-[#29231F]/65">
                        {item.label}
                      </span>
                      <span className="font-semibold text-[#29231F]">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#F8F1E7]">
                      <div
                        className="h-full rounded-full bg-[#D94B35] transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-[#29231F] p-6 text-white">
            <div>
              <ShoppingCart className="mb-5 h-8 w-8 text-[#E88A45]" />
              <h2 className="text-xl font-bold">
                Hungry for something delicious?
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Explore local pizza shops and find something perfect for your
                next meal.
              </p>
            </div>

            <Link
              href="/menu"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#D94B35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#BD3C29]"
            >
              Explore Menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#29231F]/10 bg-white">
          <div className="flex flex-col justify-between gap-3 border-b border-[#29231F]/10 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#29231F]">
                Recent Orders
              </h2>
              <p className="mt-1 text-sm text-[#29231F]/55">
                Your latest pizza orders and their current status.
              </p>
            </div>

            <Link
              href="/dashboard/customer/orders"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D94B35] hover:text-[#BD3C29]"
            >
              View All Orders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-[#29231F]/20" />
              <h3 className="font-semibold text-[#29231F]">
                No orders yet
              </h3>
              <p className="mt-2 text-sm text-[#29231F]/55">
                Your recent orders will appear here after you place an order.
              </p>
              <Link
                href="/menu"
                className="mt-5 inline-flex rounded-xl bg-[#D94B35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#BD3C29]"
              >
                Browse Pizzas
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#29231F]/10">
              {recentOrders.map((order) => {
                const status =
                  statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div
                    key={order._id}
                    className="flex flex-col justify-between gap-4 p-5 transition hover:bg-[#F8F1E7]/40 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#29231F]">
                        {order.menuItemTitle}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#29231F]/55">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Delivery: {formatDate(order.deliveryDate)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {order.deliveryAddress}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <p className="font-bold text-[#29231F]">
                          ${Number(order.price).toFixed(2)}
                        </p>
                        <span
                          className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>

                      <Link
                        href={`/dashboard/customer/orders/${order._id}`}
                        className="rounded-lg border border-[#29231F]/15 p-2 text-[#29231F]/60 transition hover:border-[#D94B35] hover:text-[#D94B35]"
                        aria-label="View order details"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default CustomerDashboard;
