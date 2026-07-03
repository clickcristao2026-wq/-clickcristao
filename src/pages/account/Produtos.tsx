import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pause, Settings } from "lucide-react";

const Produtos = () => {
  const acoes = [
    { 
      title: "Adicionar Publicação", 
      description: "Cadastre um novo produto para venda",
      icon: Plus, 
      color: "#10B981",
      buttonStyle: { backgroundColor: "#10B981", color: "white" }
    },
    { 
      title: "Remover Publicação", 
      description: "Exclua o produto do anunciado.",
      icon: Trash2, 
      color: "#EF4444",
      buttonStyle: { backgroundColor: "#EF4444", color: "white" }
    },
    { 
      title: "Pausar Publicação", 
      description: "Suspender temporariamente o anúncio.",
      icon: Pause, 
      color: "#F59E0B",
      buttonStyle: { backgroundColor: "#F59E0B", color: "white" }
    },
    { 
      title: "Gerenciar Publicação", 
      description: "Edite informações dos seus produtos",
      icon: Settings, 
      color: "#2035F2",
      buttonStyle: { backgroundColor: "#2035F2", color: "white" }
    },
  ];

  return (
    <AccountLayout title="Produtos">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {acoes.map((acao) => (
          <Card key={acao.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-full"
                  style={{ backgroundColor: `${acao.color}15` }}
                >
                  <acao.icon className="h-6 w-6" style={{ color: acao.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{acao.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{acao.description}</p>
                  <Button 
                    className="w-full"
                    style={acao.buttonStyle}
                  >
                    {acao.title}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AccountLayout>
  );
};

export default Produtos;
