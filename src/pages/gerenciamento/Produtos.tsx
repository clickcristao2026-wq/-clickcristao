import { GerenciamentoLayout } from "@/components/GerenciamentoLayout";
import { DashboardCategorySummary } from "@/components/DashboardCategorySummary";
import { produtosGerenciamento } from "@/data/dashboardCategories";

export default function GerenciamentoProdutos() {
  return (
    <GerenciamentoLayout title="Produtos">
      <DashboardCategorySummary categories={produtosGerenciamento} totalLabel="Total Cadastrados" />
    </GerenciamentoLayout>
  );
}
