import { UserDashboardPage } from "@/components/rh/UserDashboardPage";

const usuarios = [
  { id: 1, nome: "Marcos Pereira", contato: "(11) 98888-6001", ultimoAcesso: "09/04/2026", status: "Ativo" as const, email: "marcos@email.com", endereco: "Av. Central, 10", cpf: "222.333.444-01" },
  { id: 2, nome: "Juliana Costa", contato: "(21) 97777-7002", ultimoAcesso: "07/04/2026", status: "Ativo" as const, email: "juliana@email.com", endereco: "Av. Brasil, 20", cpf: "222.333.444-02" },
  { id: 3, nome: "Thiago Nunes", contato: "(31) 96666-8003", ultimoAcesso: "15/02/2026", status: "Inativo" as const, email: "thiago@email.com", endereco: "Rua Norte, 30", cpf: "222.333.444-03" },
  { id: 4, nome: "Patricia Ramos", contato: "(41) 95555-9004", ultimoAcesso: "10/04/2026", status: "Ativo" as const, email: "patricia@email.com", endereco: "Rua Sul, 40", cpf: "222.333.444-04" },
];

const pieData = [
  { name: "Ativos", value: 3, color: "#22C55E" },
  { name: "Inativos", value: 1, color: "#9CA3AF" },
  { name: "Suspensos", value: 0, color: "#EF4444" },
];

export default function RhVendedor() {
  return (
    <UserDashboardPage
      title="Vendedor"
      categoria="Vendedor"
      ativos={3}
      inativos={1}
      suspensos={0}
      usuarios={usuarios}
      pieData={pieData}
    />
  );
}
