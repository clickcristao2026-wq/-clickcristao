import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, TipoUsuario, TipoConta } from "@/contexts/UserContext";
import { ShoppingCart, Store, Megaphone, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { setTipoUsuario, setTipoConta } = useUser();

  const tiposUsuario: { tipo: TipoUsuario; label: string; icon: React.ElementType; color: string }[] = [
    { tipo: "consumidor", label: "Consumidor", icon: ShoppingCart, color: "#10B981" },
    { tipo: "vendedor", label: "Vendedor", icon: Store, color: "#2035F2" },
    { tipo: "anunciante", label: "Anunciante", icon: Megaphone, color: "#8B5CF6" },
    { tipo: "afiliado", label: "Afiliado", icon: Users, color: "#F59E0B" },
  ];

  const tiposConta: { tipo: TipoConta; label: string }[] = [
    { tipo: "conta_unica", label: "Conta Única" },
    { tipo: "conta_vinculada", label: "Conta Vinculada" },
    { tipo: "conta_compartilhada", label: "Conta Compartilhada" },
  ];

  const handleAccessDashboard = (tipoUsuario: TipoUsuario, tipoConta: TipoConta) => {
    setTipoUsuario(tipoUsuario);
    setTipoConta(tipoConta);
    navigate("/account/dados");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Click Cristão</h1>
          <p className="text-muted-foreground text-lg">
            Selecione o tipo de usuário e conta para acessar a dashboard
          </p>
        </div>

        <div className="grid gap-8">
          {tiposUsuario.map((usuario) => (
            <Card key={usuario.tipo} className="overflow-hidden">
              <CardHeader 
                className="text-white py-4"
                style={{ backgroundColor: usuario.color }}
              >
                <CardTitle className="flex items-center gap-3">
                  <usuario.icon className="h-6 w-6" />
                  Dashboard {usuario.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tiposConta.map((conta) => (
                    <Button
                      key={conta.tipo}
                      variant="outline"
                      className="h-auto py-4 flex flex-col gap-2"
                      onClick={() => handleAccessDashboard(usuario.tipo, conta.tipo)}
                    >
                      <span className="font-semibold">{conta.label}</span>
                      <span className="text-xs text-muted-foreground">
                        Acessar como {usuario.label.toLowerCase()}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            size="lg"
            onClick={() => navigate("/cadastro")}
            style={{ backgroundColor: '#2035F2' }}
          >
            Criar Nova Conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
