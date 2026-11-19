
import type { Metadata } from "next";
import AdminDashboard from "@/components/dashboard/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | PizzaHub",
  description:
    "Manage PizzaHub users, menu approvals and subscription transactions.",
};

const AdminDashboardPage = () => {
  return <AdminDashboard />;
};

export default AdminDashboardPage;
