import { RhLayout } from "@/components/RhLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface CooperadorForm {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  genero: string;
  cargo: string;
  setor: string;
  email: string;
  telefone: string;
  whatsapp: string;
  nomeUsuario: string;
  senha: string;
  confirmarSenha: string;
  dataCadastro: string;
  responsavelCadastro: string;
  statusConta: "Ativo" | "Inativo" | "Suspenso";
}

const today = new Date().toLocaleDateString("pt-BR");

const initialForm: CooperadorForm = {
  nomeCompleto: "",
  cpf: "",
  dataNascimento: "",
  genero: "",
  cargo: "",
  setor: "",
  email: "",
  telefone: "",
  whatsapp: "",
  nomeUsuario: "",
  senha: "",
  confirmarSenha: "",
  dataCadastro: today,
  responsavelCadastro: "",
  statusConta: "Ativo",
};

export default function CadastroCooperador() {
  const [form, setForm] = useState<CooperadorForm>(initialForm);
  const { toast } = useToast();

  const update = (field: keyof CooperadorForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.nomeCompleto || !form.cpf || !form.email || !form.nomeUsuario || !form.senha) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    console.log("Cadastro cooperador:", form);
    toast({ title: "Sucesso", description: "Cooperador cadastrado com sucesso!" });
    setForm(initialForm);
  };

  return (
    <RhLayout title="Cadastro de Cooperador">
      <div className="max-w-3xl space-y-8">
        {/* Dados do Cooperador */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">DADOS DO COOPERADOR</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Informe os dados de identificação para o cadastro do cooperador (funcionário).
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="font-semibold">Nome completo</Label>
              <Input placeholder="Informe seu nome completo conforme consta em seus documentos oficiais" value={form.nomeCompleto} onChange={(e) => update("nomeCompleto", e.target.value)} />
            </div>
            <div>
              <Label className="font-semibold">CPF</Label>
              <Input placeholder="Digite seu CPF válido" value={form.cpf} onChange={(e) => update("cpf", e.target.value)} />
            </div>
            <div>
              <Label className="font-semibold">Data de nascimento</Label>
              <Input placeholder="dd/mm/aaaa" value={form.dataNascimento} onChange={(e) => update("dataNascimento", e.target.value)} />
            </div>
            <div>
              <Label className="font-semibold">Gênero</Label>
              <Select value={form.genero} onValueChange={(v) => update("genero", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione seu gênero" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-semibold">Cargo</Label>
              <Input placeholder="Função na empresa" value={form.cargo} onChange={(e) => update("cargo", e.target.value)} />
            </div>
            <div>
              <Label className="font-semibold">Setor</Label>
              <Select value={form.setor} onValueChange={(v) => update("setor", v)}>
                <SelectTrigger><SelectValue placeholder="Departamento de atuação" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="ADM">ADM</SelectItem>
                  <SelectItem value="Logística">Logística</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Comissionado">Comissionado</SelectItem>
                  <SelectItem value="Gerenciamento">Gerenciamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <Separator />

        {/* Dados de Contato */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Dados de Contato</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="font-semibold">E-mail</Label>
              <Input type="email" placeholder="Endereço eletrônico para contato" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <Label className="font-semibold">Telefone</Label>
              <Input placeholder="Informe o número principal para contato" value={form.telefone} onChange={(e) => update("telefone", e.target.value)} />
            </div>
            <div>
              <Label className="font-semibold">WhatsApp</Label>
              <Input placeholder="Informe o número para mensagens" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
            </div>
          </div>
        </section>

        <Separator />

        {/* Dados de Acesso */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Dados de Acesso ao Sistema</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="font-semibold">Nome de usuário</Label>
              <Input placeholder="Crie um login para acessar o sistema" value={form.nomeUsuario} onChange={(e) => update("nomeUsuario", e.target.value)} />
            </div>
            <div>
              <Label className="font-semibold">Senha de acesso</Label>
              <Input type="password" placeholder="Crie uma senha segura" value={form.senha} onChange={(e) => update("senha", e.target.value)} />
            </div>
            <div>
              <Label className="font-semibold">Confirmar senha</Label>
              <Input type="password" placeholder="Repita a mesma senha" value={form.confirmarSenha} onChange={(e) => update("confirmarSenha", e.target.value)} />
            </div>
          </div>
        </section>

        <Separator />

        {/* Controle Administrativo */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Controle Administrativo</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Data de cadastro</Label>
              <Input value={form.dataCadastro} readOnly className="bg-muted" />
            </div>
            <div>
              <Label className="font-semibold">Responsável pelo cadastro</Label>
              <Input placeholder="Nome do responsável" value={form.responsavelCadastro} onChange={(e) => update("responsavelCadastro", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label className="font-semibold mb-2 block">Status da conta</Label>
              <RadioGroup value={form.statusConta} onValueChange={(v) => update("statusConta", v)} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Ativo" id="status-ativo" />
                  <Label htmlFor="status-ativo" className="cursor-pointer">Ativo</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Inativo" id="status-inativo" />
                  <Label htmlFor="status-inativo" className="cursor-pointer">Inativo</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Suspenso" id="status-suspenso" />
                  <Label htmlFor="status-suspenso" className="cursor-pointer">Suspenso</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </section>

        <div className="pt-4">
          <Button onClick={handleSubmit} style={{ backgroundColor: '#2035F2' }} className="text-white px-8">
            Cadastrar
          </Button>
        </div>
      </div>
    </RhLayout>
  );
}
