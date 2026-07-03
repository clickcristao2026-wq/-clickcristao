import { UserDashboardPage } from "@/components/rh/UserDashboardPage";

const usuarios = [
  { id: 1, nome: "Gustavo Lima", contato: "(11) 98888-2101", ultimoAcesso: "09/04/2026", status: "Ativo" as const, email: "gustavo@email.com", endereco: "Rua I, 900", cpf: "444.555.666-01" },
  { id: 2, nome: "Amanda Ribeiro", contato: "(21) 97777-2202", ultimoAcesso: "08/04/2026", status: "Ativo" as const, email: "amanda@email.com", endereco: "Rua J, 1000", cpf: "444.555.666-02" },
  { id: 3, nome: "Vinícius Barros", contato: "(31) 96666-2303", ultimoAcesso: "10/02/2026", status: "Inativo" as const, email: "vinicius@email.com", endereco: "Rua K, 1100", cpf: "444.555.666-03" },
  { id: 4, nome: "Isabela Campos", contato: "(41) 95555-2404", ultimoAcesso: "06/04/2026", status: "Suspenso" as const, email: "isabela@email.com", endereco: "Rua L, 1200", cpf: "444.555.666-04" },
];

const pieData = [
  { name: "Ativos", value: 2, color: "#22C55E" },
  { name: "Inativos", value: 1, color: "#9CA3AF" },
  { name: "Suspensos", value: 1, color: "#EF4444" },
];

export default function RhAfiliado() {
  return (
    <UserDashboardPage
      title="Afiliado"
      categoria="Afiliado"
      ativos={2}
      inativos={1}
      suspensos={1}
      usuarios={usuarios}
      pieData={pieData}
    />
  );
}
