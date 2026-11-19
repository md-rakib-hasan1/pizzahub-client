
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const SubscriptionSuccessPage = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F1E7]/50 px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-[#29231F]/10 bg-white p-8 text-center shadow-sm sm:p-12">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#D94B35]">
          Payment Submitted
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#29231F]">
          Thank You!
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#29231F]/60">
          Your Stripe checkout has completed. Premium access will be enabled
          after our server verifies the subscription payment through Stripe.
          This may take a short moment.
        </p>
        <Link
          href="/dashboard/vendor/subscription"
          className="mt-8 inline-flex rounded-xl bg-[#D94B35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#BD3C29]"
        >
          Return to Subscription
        </Link>
      </div>
    </main>
  );
};

export default SubscriptionSuccessPage;
