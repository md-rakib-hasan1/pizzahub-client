
import Link from "next/link";
import { XCircle } from "lucide-react";

const SubscriptionCancelPage = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background/50 px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <XCircle className="mx-auto h-16 w-16 text-[#D94B35]" />
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#D94B35]">
          Checkout Cancelled
        </p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">
          No Worries!
        </h1>
        <p className="mt-4 text-sm leading-7 text-foreground/60">
          Your checkout was cancelled. You have not been charged through this
          checkout session, and you can choose Premium whenever you are ready.
        </p>
        <Link
          href="/dashboard/vendor/subscription"
          className="mt-8 inline-flex rounded-xl bg-[#D94B35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#BD3C29]"
        >
          Back to Plans
        </Link>
      </div>
    </main>
  );
};

export default SubscriptionCancelPage;
