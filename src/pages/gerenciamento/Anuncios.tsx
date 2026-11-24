import { GerenciamentoLayout } from "@/components/GerenciamentoLayout";
import { DashboardCategorySummary } from "@/components/DashboardCategorySummary";
import { anuncios } from "@/data/dashboardCategories";

export default function GerenciamentoAnuncios() {
  return (
    <GerenciamentoLayout title="Anúncios">
      <DashboardCategorySummary categories={anuncios} totalLabel="Total Cadastrados" />
    </GerenciamentoLayout>
  );
}
