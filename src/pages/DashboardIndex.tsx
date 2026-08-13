import { Link } from "react-router-dom";
import {
  Users, Shield, Truck, DollarSign, Handshake, BarChart3,
} from "lucide-react";

const dashboards = [
  {
    title: "RH – Recursos Humanos",
    description: "Gerenciamento de cooperadores, usuários, funcionários e sistema. Controle de cadastros, status e dados funcionais.",
    icon: Users,
    color: "bg-blue-600",
    link: "/rh/cooperador",
    pages: [
      { name: "Cooperador", path: "/rh/cooperador" },
      { name: "Cadastro Cooperador", path: "/rh/cadastro-cooperador" },
      { name: "Consumidor", path: "/rh/consumidor" },
      { name: "Vendedor", path: "/rh/vendedor" },
      { name: "Anunciante", path: "/rh/anunciante" },
      { name: "Afiliado", path: "/rh/afiliado" },
      { name: "Sistema", path: "/rh/sistema" },
      { name: "Usuários", path: "/rh/usuarios" },
      { name: "Funcionários", path: "/rh/funcionarios" },
    ],
  },
  {
    title: "ADM – Administração Geral",
    description: "Configurações administrativas, gestão de cadastrados, produtos, anúncios, loja, campanhas, destaques e novidades.",
    icon: Shield,
    color: "bg-red-600",
    link: "/admin/cadastrados",
    pages: [
      { name: "Cadastrados", path: "/admin/cadastrados" },
      { name: "Registrados", path: "/admin/registrados" },
      { name: "Produtos", path: "/admin/produtos" },
      { name: "Anúncios", path: "/admin/anuncios" },
      { name: "Minha Loja", path: "/admin/minha-loja" },
      { name: "Vendidos", path: "/admin/vendidos" },
      { name: "Entregados", path: "/admin/entregados" },
      { name: "Mercadorias", path: "/admin/mercadorias" },
      { name: "Penalidades", path: "/admin/penalidades" },
      { name: "Campanhas", path: "/admin/campanhas" },
      { name: "Destaques", path: "/admin/destaques" },
      { name: "Novidades", path: "/admin/novidades" },
      { name: "Contatos", path: "/admin/contatos" },
      { name: "Notificações", path: "/admin/notificacoes" },
      { name: "Avisos", path: "/admin/avisos" },
    ],
  },
  {
    title: "Logística – Operações e Processos",
    description: "Acompanhamento de pedidos, entregas, solicitações, temporizador e controle operacional logístico.",
    icon: Truck,
    color: "bg-orange-600",
    link: "/logistica/pedidos",
    pages: [
      { name: "Pedidos", path: "/logistica/pedidos" },
      { name: "Solicitados", path: "/logistica/solicitados" },
      { name: "Entregas", path: "/logistica/entregas" },
      { name: "Temporizador", path: "/logistica/temporizador" },
      { name: "Click Transportes", path: "/logistica/transportes" },
      { name: "Notificações", path: "/logistica/notificacoes" },
      { name: "Avisos", path: "/logistica/avisos" },
    ],
  },
  {
    title: "Financeiro – Gestão Financeira",
    description: "Transações, faturamento, comissões, custos, crédito, doações, notas fiscais, multas e reembolsos.",
    icon: DollarSign,
    color: "bg-green-600",
    link: "/financeiro/transacao",
    pages: [
      { name: "Transação", path: "/financeiro/transacao" },
      { name: "Destaques", path: "/financeiro/destaques" },
      { name: "Rifas", path: "/financeiro/rifas" },
      { name: "Multas", path: "/financeiro/multas" },
      { name: "Reembolso", path: "/financeiro/reembolso" },
      { name: "Comissões", path: "/financeiro/comissoes" },
      { name: "Custos", path: "/financeiro/custos" },
      { name: "Faturamento", path: "/financeiro/faturamento" },
      { name: "Crédito", path: "/financeiro/credito" },
      { name: "Doação", path: "/financeiro/doacao" },
      { name: "Notas", path: "/financeiro/notas" },
      { name: "Notificações", path: "/financeiro/notificacoes" },
      { name: "Avisos", path: "/financeiro/avisos" },
    ],
  },
  {
    title: "Comissionado – Gestão de Comissões",
    description: "Acompanhamento de cadastrados, financeiro, comissões e relatórios de desempenho comercial.",
    icon: Handshake,
    color: "bg-purple-600",
    link: "/comissionado/cadastrados",
    pages: [
      { name: "Cadastrados", path: "/comissionado/cadastrados" },
      { name: "Financeiro", path: "/comissionado/financeiro" },
      { name: "Comissão", path: "/comissionado/comissao" },
      { name: "Notificações", path: "/comissionado/notificacoes" },
      { name: "Avisos", path: "/comissionado/avisos" },
    ],
  },
  {
    title: "Gerenciamento – Supervisão Operacional",
    description: "Supervisão de lojas, produtos, anúncios, financeiro e faturamento com indicadores de desempenho.",
    icon: BarChart3,
    color: "bg-teal-600",
    link: "/gerenciamento/lojas",
    pages: [
      { name: "Lojas", path: "/gerenciamento/lojas" },
      { name: "Produtos", path: "/gerenciamento/produtos" },
      { name: "Anúncios", path: "/gerenciamento/anuncios" },
      { name: "Financeiro", path: "/gerenciamento/financeiro" },
      { name: "Faturamento", path: "/gerenciamento/faturamento" },
    ],
  },
];

export default function DashboardIndex() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Central de Painéis – Administrador</h1>
          <p className="text-gray-500 mt-2">
            Como administrador, você tem acesso a todos os painéis internos da plataforma. Escolha um abaixo.
          </p>
        </div>

        <div className="grid gap-6">
          {dashboards.map((dash) => (
            <div key={dash.title} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-4 p-5 border-b border-gray-100">
                <div className={`${dash.color} p-3 rounded-lg text-white`}>
                  <dash.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">{dash.title}</h2>
                  <p className="text-sm text-gray-500">{dash.description}</p>
                </div>
                <Link
                  to={dash.link}
                  className={`${dash.color} text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
                >
                  Acessar
                </Link>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {dash.pages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">Área restrita à conta Administrador</p>
      </div>
    </div>
  );
}
