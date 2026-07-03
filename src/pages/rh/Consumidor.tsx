import { UserDashboardPage } from "@/components/rh/UserDashboardPage";

const usuarios = [
  { id: 1, nome: "Lucas Martins", contato: "(11) 98888-1001", ultimoAcesso: "09/04/2026", status: "Ativo" as const, email: "lucas@email.com", endereco: "Rua A, 100", cpf: "111.222.333-01" },
  { id: 2, nome: "Bruna Alves", contato: "(21) 97777-2002", ultimoAcesso: "08/04/2026", status: "Ativo" as const, email: "bruna@email.com", endereco: "Rua B, 200", cpf: "111.222.333-02" },
  { id: 3, nome: "Roberto Dias", contato: "(31) 96666-3003", ultimoAcesso: "01/03/2026", status: "Inativo" as const, email: "roberto@email.com", endereco: "Rua C, 300", cpf: "111.222.333-03" },
  { id: 4, nome: "Camila Ferreira", contato: "(41) 95555-4004", ultimoAcesso: "05/04/2026", status: "Suspenso" as const, email: "camila@email.com", endereco: "Rua D, 400", cpf: "111.222.333-04" },
  { id: 5, nome: "Diego Rocha", contato: "(51) 94444-5005", ultimoAcesso: "10/04/2026", status: "Ativo" as const, email: "diego@email.com", endereco: "Rua E, 500", cpf: "111.222.333-05" },
];

const pieData = [
  { name: "Ativos", value: 3, color: "#22C55E" },
  { name: "Inativos", value: 1, color: "#9CA3AF" },
  { name: "Suspensos", value: 1, color: "#EF4444" },
];

export default function RhConsumidor() {
  return (
    <UserDashboardPage
      title="Consumidor"
      categoria="Consumidor"
      ativos={3}
      inativos={1}
      suspensos={1}
      usuarios={usuarios}
      pieData={pieData}
    />
  );
}
