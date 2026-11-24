import { AdminLayout } from "@/components/AdminLayout";
import { DashboardCategorySummary } from "@/components/DashboardCategorySummary";
import { anuncios, produtos } from "@/data/dashboardCategories";

export default function AdminCadastrados() {
  return (
    <AdminLayout title="Cadastrados - Produtos e Anúncios">
      <DashboardCategorySummary categories={[anuncios[0], ...produtos.slice(0, -1), ...anuncios.slice(1), produtos[produtos.length - 1]]} totalLabel="Total de Cadastros" />
    </AdminLayout>
  );
}
