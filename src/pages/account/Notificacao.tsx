import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Package, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Notificacao = () => {
  const notificacoes = [
    {
      id: 1,
      tipo: "pedido",
      titulo: "Pedido #1234 enviado",
      mensagem: "Seu pedido foi enviado e está a caminho!",
      data: "Há 2 horas",
      lida: false,
      icon: Package,
    },
    {
      id: 2,
      tipo: "pagamento",
      titulo: "Pagamento confirmado",
      mensagem: "O pagamento do pedido #1233 foi confirmado.",
      data: "Há 1 dia",
      lida: false,
      icon: CreditCard,
    },
    {
      id: 3,
      tipo: "alerta",
      titulo: "Produto quase esgotado",
      mensagem: "Um produto da sua lista de desejos está acabando.",
      data: "Há 2 dias",
      lida: true,
      icon: AlertCircle,
    },
    {
      id: 4,
      tipo: "sucesso",
      titulo: "Pedido entregue",
      mensagem: "Seu pedido #1230 foi entregue com sucesso!",
      data: "Há 5 dias",
      lida: true,
      icon: CheckCircle,
    },
  ];

  const getIconColor = (tipo: string) => {
    switch (tipo) {
      case "pedido": return "#2035F2";
      case "pagamento": return "#10B981";
      case "alerta": return "#F59E0B";
      case "sucesso": return "#10B981";
      default: return "#6B7280";
    }
  };

  return (
    <AccountLayout title="Notificação">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {notificacoes.filter(n => !n.lida).length} notificações não lidas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Suas Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificacoes.map((notificacao) => (
                <div
                  key={notificacao.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                    notificacao.lida ? "bg-muted/50" : "bg-primary/5 border border-primary/20"
                  }`}
                >
                  <div 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: `${getIconColor(notificacao.tipo)}15` }}
                  >
                    <notificacao.icon 
                      className="h-5 w-5" 
                      style={{ color: getIconColor(notificacao.tipo) }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{notificacao.titulo}</h4>
                      {!notificacao.lida && (
                        <Badge variant="default" className="text-xs">Nova</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notificacao.mensagem}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">{notificacao.data}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
};

export default Notificacao;
