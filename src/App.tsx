import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthStatusBar } from "@/components/AuthStatusBar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardIndex from "./pages/DashboardIndex";
import NotFound from "./pages/NotFound";
import Cadastro from "./pages/Cadastro";
import MeusDados from "./pages/account/MeusDados";
import MeusCartoes from "./pages/account/MeusCartoes";
import Seguranca from "./pages/account/Seguranca";
import Financeiro from "./pages/account/Financeiro";
import FinanceiroVendedor from "./pages/account/FinanceiroVendedor";
import Faturamento from "./pages/account/Faturamento";
import Endereco from "./pages/account/Endereco";
import Compras from "./pages/account/Compras";
import Contas from "./pages/account/Contas";
import Avisos from "./pages/account/Avisos";
import Beneficios from "./pages/account/Beneficios";
import BeneficiosVendedor from "./pages/account/BeneficiosVendedor";
import BeneficiosAnunciante from "./pages/account/BeneficiosAnunciante";
import Mercadoria from "./pages/account/Mercadoria";
import MercadoriaVendedor from "./pages/account/MercadoriaVendedor";
import MercadoriaAnunciante from "./pages/account/MercadoriaAnunciante";
import Produtos from "./pages/account/Produtos";
import CadastroProduto from "./pages/account/CadastroProduto";
import Notificacao from "./pages/account/Notificacao";
import Configuracao from "./pages/account/Configuracao";
import ExcluirConta from "./pages/account/ExcluirConta";
import Historico from "./pages/account/Historico";
import Avaliacao from "./pages/account/Avaliacao";
import InteligenciaArtificial from "./pages/account/InteligenciaArtificial";

// Admin pages
import AdminCadastrados from "./pages/admin/Cadastrados";
import AdminRegistrados from "./pages/admin/Registrados";
import AdminProdutos from "./pages/admin/Produtos";
import AdminCatalogo from "./pages/admin/Catalogo";
import AdminAnuncios from "./pages/admin/Anuncios";
import AdminMinhaLoja from "./pages/admin/MinhaLoja";
import AdminVendidos from "./pages/admin/Vendidos";
import AdminEntregados from "./pages/admin/Entregados";
import AdminMercadorias from "./pages/admin/Mercadorias";
import AdminPenalidades from "./pages/admin/Penalidades";
import AdminCampanhas from "./pages/admin/Campanhas";
import AdminDestaques from "./pages/admin/Destaques";
import AdminNovidades from "./pages/admin/Novidades";
import AdminContatos from "./pages/admin/Contatos";
import AdminNotificacoes from "./pages/admin/Notificacoes";
import AdminAvisos from "./pages/admin/Avisos";

// Logistica pages
import LogisticaPedidos from "./pages/logistica/Pedidos";
import LogisticaSolicitados from "./pages/logistica/Solicitados";
import LogisticaEntregas from "./pages/logistica/Entregas";
import LogisticaTemporizador from "./pages/logistica/Temporizador";
import LogisticaTransportes from "./pages/logistica/Transportes";
import LogisticaNotificacoes from "./pages/logistica/Notificacoes";
import LogisticaAvisos from "./pages/logistica/Avisos";

// Financeiro pages
import FinanceiroTransacao from "./pages/financeiro/Transacao";
import FinanceiroDestaques from "./pages/financeiro/Destaques";
import FinanceiroRifas from "./pages/financeiro/Rifas";
import FinanceiroMultas from "./pages/financeiro/Multas";
import FinanceiroReembolso from "./pages/financeiro/Reembolso";
import FinanceiroComissoes from "./pages/financeiro/Comissoes";
import FinanceiroCustos from "./pages/financeiro/Custos";
import FinanceiroFaturamento from "./pages/financeiro/Faturamento";
import FinanceiroCredito from "./pages/financeiro/Credito";
import FinanceiroDoacao from "./pages/financeiro/Doacao";
import FinanceiroNotas from "./pages/financeiro/Notas";
import FinanceiroNotificacoes from "./pages/financeiro/Notificacoes";
import FinanceiroAvisos from "./pages/financeiro/Avisos";

// Comissionado pages
import ComissionadoCadastrados from "./pages/comissionado/Cadastrados";
import ComissionadoFinanceiro from "./pages/comissionado/Financeiro";
import ComissionadoComissao from "./pages/comissionado/Comissao";
import ComissionadoNotificacoes from "./pages/comissionado/Notificacoes";
import ComissionadoAvisos from "./pages/comissionado/Avisos";

// Gerenciamento pages
import GerenciamentoProdutos from "./pages/gerenciamento/Produtos";
import GerenciamentoAnuncios from "./pages/gerenciamento/Anuncios";
import GerenciamentoFinanceiro from "./pages/gerenciamento/Financeiro";
import GerenciamentoFaturamento from "./pages/gerenciamento/Faturamento";
import GerenciamentoLojas from "./pages/gerenciamento/Lojas";

// RH pages
import RhCooperador from "./pages/rh/Cooperador";
import RhCadastroCooperador from "./pages/rh/CadastroCooperador";
import RhConsumidor from "./pages/rh/Consumidor";
import RhVendedor from "./pages/rh/Vendedor";
import RhAnunciante from "./pages/rh/Anunciante";
import RhAfiliado from "./pages/rh/Afiliado";
import RhSistema from "./pages/rh/Sistema";
import RhUsuarios from "./pages/rh/Usuarios";
import RhFuncionarios from "./pages/rh/Funcionarios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthStatusBar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboards"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DashboardIndex />
                </ProtectedRoute>
              }
            />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route
              path="/account/*"
              element={
                <ProtectedRoute allowedRoles={["consumidor", "vendedor", "anunciante", "afiliado"]}>
                  <SidebarProvider>
                    <Routes>
                      <Route path="/dados" element={<MeusDados />} />
                      <Route path="/cartoes" element={<MeusCartoes />} />
                      <Route path="/seguranca" element={<Seguranca />} />
                      <Route path="/financeiro" element={<Financeiro />} />
                      <Route path="/financeiro-vendedor" element={<FinanceiroVendedor />} />
                      <Route path="/faturamento" element={<Faturamento />} />
                      <Route path="/endereco" element={<Endereco />} />
                      <Route path="/compras" element={<Compras />} />
                      <Route path="/contas" element={<Contas />} />
                      <Route path="/avisos" element={<Avisos />} />
                      <Route path="/beneficios" element={<Beneficios />} />
                      <Route path="/beneficios-vendedor" element={<BeneficiosVendedor />} />
                      <Route path="/beneficios-anunciante" element={<BeneficiosAnunciante />} />
                      <Route path="/mercadoria" element={<Mercadoria />} />
                      <Route path="/mercadoria-vendedor" element={<MercadoriaVendedor />} />
                      <Route path="/mercadoria-anunciante" element={<MercadoriaAnunciante />} />
                      <Route path="/produtos" element={<Produtos />} />
                      <Route path="/produtos/novo" element={<CadastroProduto />} />
                      <Route path="/produtos/:id/editar" element={<CadastroProduto />} />
                      <Route path="/notificacao" element={<Notificacao />} />
                      <Route path="/configuracao" element={<Configuracao />} />
                      <Route path="/excluir-conta" element={<ExcluirConta />} />
                      <Route path="/historico" element={<Historico />} />
                      <Route path="/avaliacao" element={<Avaliacao />} />
                      <Route path="/inteligencia-artificial" element={<InteligenciaArtificial />} />
                    </Routes>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SidebarProvider>
                    <Routes>
                      <Route path="/cadastrados" element={<AdminCadastrados />} />
                      <Route path="/registrados" element={<AdminRegistrados />} />
                      <Route path="/produtos" element={<AdminProdutos />} />
                      <Route path="/catalogo" element={<AdminCatalogo />} />
                      <Route path="/anuncios" element={<AdminAnuncios />} />
                      <Route path="/minha-loja" element={<AdminMinhaLoja />} />
                      <Route path="/vendidos" element={<AdminVendidos />} />
                      <Route path="/entregados" element={<AdminEntregados />} />
                      <Route path="/mercadorias" element={<AdminMercadorias />} />
                      <Route path="/penalidades" element={<AdminPenalidades />} />
                      <Route path="/campanhas" element={<AdminCampanhas />} />
                      <Route path="/destaques" element={<AdminDestaques />} />
                      <Route path="/novidades" element={<AdminNovidades />} />
                      <Route path="/contatos" element={<AdminContatos />} />
                      <Route path="/notificacoes" element={<AdminNotificacoes />} />
                      <Route path="/avisos" element={<AdminAvisos />} />
                    </Routes>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/logistica/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SidebarProvider>
                    <Routes>
                      <Route path="/pedidos" element={<LogisticaPedidos />} />
                      <Route path="/solicitados" element={<LogisticaSolicitados />} />
                      <Route path="/entregas" element={<LogisticaEntregas />} />
                      <Route path="/temporizador" element={<LogisticaTemporizador />} />
                      <Route path="/transportes" element={<LogisticaTransportes />} />
                      <Route path="/notificacoes" element={<LogisticaNotificacoes />} />
                      <Route path="/avisos" element={<LogisticaAvisos />} />
                    </Routes>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/financeiro/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SidebarProvider>
                    <Routes>
                      <Route path="/transacao" element={<FinanceiroTransacao />} />
                      <Route path="/destaques" element={<FinanceiroDestaques />} />
                      <Route path="/rifas" element={<FinanceiroRifas />} />
                      <Route path="/multas" element={<FinanceiroMultas />} />
                      <Route path="/reembolso" element={<FinanceiroReembolso />} />
                      <Route path="/comissoes" element={<FinanceiroComissoes />} />
                      <Route path="/custos" element={<FinanceiroCustos />} />
                      <Route path="/faturamento" element={<FinanceiroFaturamento />} />
                      <Route path="/credito" element={<FinanceiroCredito />} />
                      <Route path="/doacao" element={<FinanceiroDoacao />} />
                      <Route path="/notas" element={<FinanceiroNotas />} />
                      <Route path="/notificacoes" element={<FinanceiroNotificacoes />} />
                      <Route path="/avisos" element={<FinanceiroAvisos />} />
                    </Routes>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/comissionado/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SidebarProvider>
                    <Routes>
                      <Route path="/cadastrados" element={<ComissionadoCadastrados />} />
                      <Route path="/financeiro" element={<ComissionadoFinanceiro />} />
                      <Route path="/comissao" element={<ComissionadoComissao />} />
                      <Route path="/notificacoes" element={<ComissionadoNotificacoes />} />
                      <Route path="/avisos" element={<ComissionadoAvisos />} />
                    </Routes>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/gerenciamento/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SidebarProvider>
                    <Routes>
                      <Route path="/lojas" element={<GerenciamentoLojas />} />
                      <Route path="/produtos" element={<GerenciamentoProdutos />} />
                      <Route path="/anuncios" element={<GerenciamentoAnuncios />} />
                      <Route path="/financeiro" element={<GerenciamentoFinanceiro />} />
                      <Route path="/faturamento" element={<GerenciamentoFaturamento />} />
                    </Routes>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rh/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SidebarProvider>
                    <Routes>
                      <Route path="/cooperador" element={<RhCooperador />} />
                      <Route path="/cadastro-cooperador" element={<RhCadastroCooperador />} />
                      <Route path="/consumidor" element={<RhConsumidor />} />
                      <Route path="/vendedor" element={<RhVendedor />} />
                      <Route path="/anunciante" element={<RhAnunciante />} />
                      <Route path="/afiliado" element={<RhAfiliado />} />
                      <Route path="/sistema" element={<RhSistema />} />
                      <Route path="/usuarios" element={<RhUsuarios />} />
                      <Route path="/funcionarios" element={<RhFuncionarios />} />
                    </Routes>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
