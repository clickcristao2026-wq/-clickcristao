import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const MeusDados = () => {
  return (
    <AccountLayout title="Meus Dados">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" defaultValue="João da Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" defaultValue="ageuvinhabh@gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" defaultValue="123.456.789-00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" defaultValue="(11) 98765-4321" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nascimento">Data de Nascimento</Label>
                <Input id="nascimento" type="date" defaultValue="1990-01-01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Gênero</Label>
                <Input id="genero" defaultValue="Masculino" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90">
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
};

export default MeusDados;
