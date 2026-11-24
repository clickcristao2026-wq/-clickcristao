import { AdminLayout } from "@/components/AdminLayout";
import { DashboardCategorySummary } from "@/components/DashboardCategorySummary";
import { lojas } from "@/data/dashboardCategories";

export default function AdminRegistrados() {
  return (
    <AdminLayout title="Registrados - Lojas">
      <DashboardCategorySummary categories={lojas} totalLabel="Total de Registrados" />
    </AdminLayout>
  );
}
