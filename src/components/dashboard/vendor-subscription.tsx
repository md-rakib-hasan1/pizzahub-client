
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Crown, Loader2, ShieldCheck} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const VendorSubscription = () => {
    const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] =
    useState(false);

  const user = session?.user as
  | {
      role?: string;
      subscriptionPlan?: string;
      subscriptionStatus?: string;
      subscriptionExpiresAt?: string;
    }
  | undefined;

  const isPremium = user?.subscriptionPlan === "premium";

  const getToken = async () => {
    const response = await fetch("/api/auth/token");
    const result = await response.json();

    if (!response.ok || !result.token) {
      throw new Error("Unable to verify your session. Please sign in again.");
    }

    return result.token as string;
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await fetch(`${API_URL}/api/subscription/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.checkoutUrl) {
        throw new Error(
          result.message || "Unable to start Premium checkout.",
        );
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await fetch(`${API_URL}/api/subscription/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to cancel your subscription.",
        );
      }

      toast.success(
        result.message ||
          "Your subscription cancellation has been scheduled.",
      );

      setShowCancelConfirmation(false);
      await authClient.getSession();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to cancel your subscription.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D94B35]" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-[#D94B35]" />
        <h2 className="text-2xl font-bold text-[#29231F]">
          Sign In Required
        </h2>
        <p className="mt-2 text-sm text-[#29231F]/60">
          Sign in with your vendor account to manage your subscription.
        </p>
        <Button
          className="mt-6 bg-[#D94B35] text-white hover:bg-[#BD3C29]"
          onClick={() => router.push("/login")}
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (user?.role !== "vendor") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-[#D94B35]" />
        <h2 className="text-2xl font-bold text-[#29231F]">
          Vendor Access Only
        </h2>
        <p className="mt-2 text-sm text-[#29231F]/60">
          Subscription plans are available for vendor accounts only.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F1E7]/50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D94B35]">
            Grow Your Restaurant
          </p>
          <h1 className="text-3xl font-bold text-[#29231F] sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#29231F]/60 sm:text-base">
            Start free and upgrade to Premium when your restaurant is ready
            for more visibility and unlimited menu listings.
          </p>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-2">
          <section className="flex flex-col rounded-3xl border border-[#29231F]/10 bg-white p-7 shadow-sm sm:p-9">
            <div>
              <span className="rounded-full bg-[#F8F1E7] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#29231F]/65">
                Starter
              </span>
              <h2 className="mt-5 text-2xl font-bold text-[#29231F]">
                Free Plan
              </h2>
              <p className="mt-2 text-sm text-[#29231F]/55">
                Everything you need to get started.
              </p>
              <p className="mt-6 text-4xl font-bold text-[#29231F]">
                $0
                <span className="text-base font-medium text-[#29231F]/45">
                  {" "} / forever
                </span>
              </p>
            </div>

            <div className="my-8 space-y-4">
              {[
                "Up to 3 active menu items",
                "Manage incoming customer orders",
                "Basic vendor dashboard",
                "Standard menu visibility",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#71836A]" />
                  <span className="text-sm text-[#29231F]/75">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto rounded-xl bg-[#F8F1E7] p-4">
              <p className="text-sm font-semibold text-[#29231F]">
                {isPremium ? "Available anytime" : "Your current plan"}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#29231F]/55">
                You can continue using the Free plan without any subscription.
              </p>
            </div>
          </section>

          <section className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-[#D94B35] bg-[#29231F] p-7 text-white shadow-xl sm:p-9">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#D94B35]/20 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#D94B35] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Recommended
                </span>
                <Crown className="h-6 w-6 text-[#E88A45]" />
              </div>

              <h2 className="mt-5 text-2xl font-bold">Premium Plan</h2>
              <p className="mt-2 text-sm text-white/55">
                More freedom. More visibility. More growth.
              </p>

              <p className="mt-6 text-4xl font-bold">
                $9.99
                <span className="text-base font-medium text-white/50">
                  {" "} / month
                </span>
              </p>
            </div>

            <div className="relative my-8 space-y-4">
              {[
                "Unlimited active menu items",
                "Featured menu placement",
                "Premium vendor badge",
                "Manage all customer orders",
                "Full vendor dashboard and analytics",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#E88A45]" />
                  <span className="text-sm text-white/85">{feature}</span>
                </div>
              ))}
            </div>

            <div className="relative mt-auto">
              {isPremium ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-green-400/25 bg-green-400/10 p-4">
                    <p className="flex items-center gap-2 font-semibold text-green-300">
                      <CheckCircleIcon />
                      Premium is active
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/60">
                      Your Premium benefits are enabled for this vendor account.
                    </p>
                  </div>

                  {!showCancelConfirmation ? (
                    <Button
                      variant="outline"
                      disabled={loading}
                      onClick={() => setShowCancelConfirmation(true)}
                      className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      Cancel Subscription
                    </Button>
                  ) : (
                    <div className="space-y-3 rounded-xl border border-red-300/20 bg-red-400/10 p-4">
                      <p className="text-sm leading-6 text-white/85">
                        Are you sure? Your subscription will be scheduled to
                        cancel at the end of the current billing period.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          disabled={loading}
                          onClick={() => setShowCancelConfirmation(false)}
                          className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                        >
                          Keep Plan
                        </Button>
                        <Button
                          disabled={loading}
                          onClick={() => void handleCancelSubscription()}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Confirm Cancel"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  disabled={loading}
                  onClick={() => void handleCheckout()}
                  className="h-12 w-full bg-[#D94B35] font-semibold text-white hover:bg-[#BD3C29]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting to Stripe...
                    </>
                  ) : (
                    <>
                      Upgrade to Premium
                      <Crown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
              <p className="mt-3 text-center text-xs text-white/40">
                Secure subscription checkout powered by Stripe.
              </p>
            </div>
          </section>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-6 text-[#29231F]/50">
          Premium activation is confirmed by our secure payment webhook.
          Your plan changes only after Stripe verifies the subscription payment.
        </p>
      </div>
    </main>
  );
};

const CheckCircleIcon = () => (
  <Check className="h-4 w-4" />
);

export default VendorSubscription;
