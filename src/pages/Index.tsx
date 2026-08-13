import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Store, Megaphone, Users } from "lucide-react";

const tiposUsuario = [
  { label: "Consumidor", description: "Compre produtos e serviços com facilidade.", icon: ShoppingCart, color: "#10B981" },
  { label: "Vendedor", description: "Comercialize produtos e impulsione suas vendas.", icon: Store, color: "#2035F2" },
  { label: "Anunciante", description: "Divulgue seus bens e serviços para mais pessoas.", icon: Megaphone, color: "#8B5CF6" },
  { label: "Afiliado", description: "Revenda produtos e lucre a cada venda.", icon: Users, color: "#F59E0B" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Click Cristão</h1>
          <p className="text-muted-foreground text-lg">
            A plataforma para comprar, vender, anunciar e revender com propósito.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button size="lg" onClick={() => navigate("/login")} style={{ backgroundColor: "#2035F2" }} className="text-white">
              Entrar
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/cadastro")}>
              Criar Nova Conta
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {tiposUsuario.map((tipo) => (
            <Card key={tipo.label} className="overflow-hidden">
              <CardHeader className="text-white py-4" style={{ backgroundColor: tipo.color }}>
                <CardTitle className="flex items-center gap-3">
                  <tipo.icon className="h-6 w-6" />
                  {tipo.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-sm">{tipo.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
