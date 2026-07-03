import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent } from "@/components/ui/card";

import fazerEnviosIcon from "@/assets/icons/mercadoria-vendedor/fazer-envios.png";
import vendasAtenderIcon from "@/assets/icons/mercadoria-vendedor/vendas-atender.png";
import perguntasResponderIcon from "@/assets/icons/mercadoria-vendedor/perguntas-responder.png";
import publicacaoMelhorarIcon from "@/assets/icons/mercadoria-vendedor/publicacao-melhorar.png";
import produtosVendidosIcon from "@/assets/icons/mercadoria-vendedor/produtos-vendidos.png";
import prazoPublicacaoIcon from "@/assets/icons/mercadoria-vendedor/prazo-publicacao.png";
import cancelarFornecimentoIcon from "@/assets/icons/mercadoria-vendedor/cancelar-fornecimento.png";
import produtosDevolvidosIcon from "@/assets/icons/mercadoria-vendedor/produtos-devolvidos.png";

interface MetricCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  onClick?: () => void;
}

const MetricCard = ({ title, value, icon, color, onClick }: MetricCardProps) => (
  <Card 
    className="hover:shadow-lg transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center">
        <span className="text-4xl font-bold mb-3" style={{ color }}>{value}</span>
        <div className={`p-3 rounded-full mb-3`} style={{ backgroundColor: `${color}15` }}>
          <img src={icon} alt={title} className="h-8 w-8 object-contain" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
    </CardContent>
  </Card>
);

const MercadoriaVendedor = () => {
  const metricas = [
    { title: "Fazer Envios", value: 5, icon: fazerEnviosIcon, color: "#2035F2" },
    { title: "Vendas para Atender", value: 12, icon: vendasAtenderIcon, color: "#10B981" },
    { title: "Perguntas a Responder", value: 8, icon: perguntasResponderIcon, color: "#F59E0B" },
    { title: "Publicações para Melhorar", value: 3, icon: publicacaoMelhorarIcon, color: "#8B5CF6" },
    { title: "Produtos Vendidos", value: 156, icon: produtosVendidosIcon, color: "#06B6D4" },
    { title: "Prazo de Publicação", value: 2, icon: prazoPublicacaoIcon, color: "#EC4899" },
    { title: "Cancelamento Fornecimento", value: 1, icon: cancelarFornecimentoIcon, color: "#EF4444" },
    { title: "Produtos Devolvidos", value: 4, icon: produtosDevolvidosIcon, color: "#6366F1" },
  ];

  return (
    <AccountLayout title="Mercadoria">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {metricas.map((metrica) => (
          <MetricCard
            key={metrica.title}
            title={metrica.title}
            value={metrica.value}
            icon={metrica.icon}
            color={metrica.color}
            onClick={() => console.log(`Acessar: ${metrica.title}`)}
          />
        ))}
      </div>
    </AccountLayout>
  );
};

export default MercadoriaVendedor;
