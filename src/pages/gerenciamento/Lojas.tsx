import { GerenciamentoLayout } from "@/components/GerenciamentoLayout";
import { DashboardCategorySummary } from "@/components/DashboardCategorySummary";
import { lojas } from "@/data/dashboardCategories";

export default function GerenciamentoLojas() {
  return (
    <GerenciamentoLayout title="Lojas">
      <DashboardCategorySummary categories={lojas} totalLabel="Total de Lojas" />
    </GerenciamentoLayout>
  );
}
