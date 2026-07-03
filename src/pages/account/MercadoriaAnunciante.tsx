import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import visualizacaoIcon from "@/assets/icons/mercadoria-anunciante/visualizacao.png";
import conversaoIcon from "@/assets/icons/mercadoria-anunciante/conversao.png";
import engajamentoIcon from "@/assets/icons/mercadoria-anunciante/engajamento.png";

const MercadoriaAnunciante = () => {
  const metricas = [
    { 
      title: "Taxa de Visualizações", 
      value: "85%", 
      icon: visualizacaoIcon,
      color: "#2035F2",
      description: "Percentual de alcance do seu anúncio"
    },
    { 
      title: "Taxa de Conversão", 
      value: "12%", 
      icon: conversaoIcon,
      color: "#10B981",
      description: "Usuários que clicaram no anúncio"
    },
    { 
      title: "Taxa de Engajamento", 
      value: "45%", 
      icon: engajamentoIcon,
      color: "#EC4899",
      description: "Interações com o seu conteúdo"
    },
  ];

  return (
    <AccountLayout title="Mercadoria">
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Acompanhe as métricas de desempenho dos seus anúncios
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metricas.map((metrica) => (
            <Card key={metrica.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div 
                  className="mx-auto p-4 rounded-full w-fit mb-2"
                  style={{ backgroundColor: `${metrica.color}15` }}
                >
                  <img src={metrica.icon} alt={metrica.title} className="h-10 w-10 object-contain" />
                </div>
                <CardTitle className="text-lg">{metrica.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <span 
                  className="text-5xl font-bold block mb-2"
                  style={{ color: metrica.color }}
                >
                  {metrica.value}
                </span>
                <p className="text-sm text-muted-foreground">{metrica.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
};

export default MercadoriaAnunciante;
