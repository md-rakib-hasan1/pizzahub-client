
import type { Metadata } from "next";
import VendorSubscription from "@/components/dashboard/vendor-subscription";

export const metadata: Metadata = {
  title: "Vendor Subscription | PizzaHub",
  description: "Manage your PizzaHub vendor subscription plan.",
};

const VendorSubscriptionPage = () => {
  return <VendorSubscription />;
};

export default VendorSubscriptionPage;
