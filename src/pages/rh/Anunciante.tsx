import { UserDashboardPage } from "@/components/rh/UserDashboardPage";

const usuarios = [
  { id: 1, nome: "Rafael Mendes", contato: "(11) 98888-1101", ultimoAcesso: "10/04/2026", status: "Ativo" as const, email: "rafael@email.com", endereco: "Rua F, 600", cpf: "333.444.555-01" },
  { id: 2, nome: "Larissa Gomes", contato: "(21) 97777-1202", ultimoAcesso: "05/04/2026", status: "Ativo" as const, email: "larissa@email.com", endereco: "Rua G, 700", cpf: "333.444.555-02" },
  { id: 3, nome: "Felipe Araújo", contato: "(31) 96666-1303", ultimoAcesso: "20/01/2026", status: "Suspenso" as const, email: "felipe@email.com", endereco: "Rua H, 800", cpf: "333.444.555-03" },
];

const pieData = [
  { name: "Ativos", value: 2, color: "#22C55E" },
  { name: "Inativos", value: 0, color: "#9CA3AF" },
  { name: "Suspensos", value: 1, color: "#EF4444" },
];

export default function RhAnunciante() {
  return (
    <UserDashboardPage
      title="Anunciante"
      categoria="Anunciante"
      ativos={2}
      inativos={0}
      suspensos={1}
      usuarios={usuarios}
      pieData={pieData}
    />
  );
}
