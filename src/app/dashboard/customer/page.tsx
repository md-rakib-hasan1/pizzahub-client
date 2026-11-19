
import type { Metadata } from "next";
import CustomerDashboard from "@/components/dashboard/customer-dashboard";

export const metadata: Metadata = {
  title: "Customer Dashboard | PizzaHub",
  description:
    "Track your PizzaHub orders and explore your customer dashboard.",
};

const CustomerDashboardPage = () => {
  return <CustomerDashboard />;
};

export default CustomerDashboardPage;
