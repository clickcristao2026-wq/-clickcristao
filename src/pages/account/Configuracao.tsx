import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { getPermissionLabels } from "@/config/menuConfig";
import { useState } from "react";

const Configuracao = () => {
  const { tipoUsuario, tipoConta } = useUser();
  const permissionLabels = getPermissionLabels(tipoUsuario);
  
  const [permissions, setPermissions] = useState<Record<string, boolean>>(
    permissionLabels.reduce((acc, label) => ({ ...acc, [label]: false }), {})
  );

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setPermissions(prev => ({ ...prev, [permission]: checked }));
  };

  const getTituloPermissao = () => {
    if (tipoConta === "conta_compartilhada") {
      return "PERMISSÃO DO COMPARTILHADO";
    }
    return "PERMISSÃO DO VINCULADO";
  };

  return (
    <AccountLayout title="Configuração">
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{getTituloPermissao()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Configure as permissões de acesso para os usuários vinculados à sua conta.
            </p>
            
            <div className="space-y-4">
              {permissionLabels.map((permission) => (
                <div key={permission} className="flex items-center gap-3">
                  <Checkbox
                    id={permission}
                    checked={permissions[permission]}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(permission, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={permission} 
                    className="cursor-pointer font-normal"
                  >
                    {permission}
                  </Label>
                </div>
              ))}
            </div>

            <Button 
              className="mt-6 w-full"
              style={{ backgroundColor: '#2035F2' }}
            >
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
};

export default Configuracao;
