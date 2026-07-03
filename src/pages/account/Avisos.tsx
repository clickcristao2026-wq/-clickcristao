import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, CheckCircle } from "lucide-react";
import { useState, useRef } from "react";

interface ArquivoAnexo {
  id: number;
  file: File | null;
}

const Avisos = () => {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [arquivos, setArquivos] = useState<ArquivoAnexo[]>([{ id: 1, file: null }]);
  const [enviado, setEnviado] = useState(false);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const adicionarArquivo = () => {
    const novoId = Math.max(...arquivos.map(a => a.id)) + 1;
    setArquivos([...arquivos, { id: novoId, file: null }]);
  };

  const removerArquivo = (id: number) => {
    if (arquivos.length > 1) {
      setArquivos(arquivos.filter(a => a.id !== id));
    }
  };

  const handleFileChange = (id: number, file: File | null) => {
    setArquivos(arquivos.map(a => a.id === id ? { ...a, file } : a));
  };

  const handleEnviar = () => {
    // Simulação de envio
    setEnviado(true);
  };

  const canSubmit = nome && login && departamento && prioridade && assunto && mensagem;

  if (enviado) {
    return (
      <AccountLayout title="Avisos">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-6 p-4 rounded-full bg-green-100 w-fit">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Agradecemos seu contato!
            </h2>
            <p className="text-muted-foreground mb-6">
              Sua mensagem foi enviada com sucesso e a equipe Click Cristão retornará em breve.
            </p>
            <Button 
              onClick={() => {
                setEnviado(false);
                setNome("");
                setLogin("");
                setDepartamento("");
                setPrioridade("");
                setAssunto("");
                setMensagem("");
                setArquivos([{ id: 1, file: null }]);
              }}
              style={{ backgroundColor: '#2035F2' }}
              className="text-white"
            >
              Enviar Nova Mensagem
            </Button>
          </CardContent>
        </Card>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Avisos">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Informações do Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações do Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Seu login/usuário"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Select value={departamento} onValueChange={setDepartamento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                    <SelectItem value="logistica">Logística</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="comissionado">Comissionado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={prioridade} onValueChange={setPrioridade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finalidade da Mensagem */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Finalidade da Mensagem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assunto">Assunto</Label>
              <Input
                id="assunto"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                placeholder="Assunto da mensagem"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Escreva sua mensagem aqui..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Arquivo e Anexo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Arquivo e Anexo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {arquivos.map((arquivo, index) => (
              <div key={arquivo.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".jpg,.gif,.jpeg,.png,.pdf"
                      ref={(el) => fileInputRefs.current[arquivo.id] = el}
                      onChange={(e) => handleFileChange(arquivo.id, e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {arquivos.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removerArquivo(arquivo.id)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Extensões de arquivos permitidas: .jpg, .gif, .jpeg, .png, .pdf (Tamanho máximo do arquivo: 32MB)
              </p>
              <Button
                variant="outline"
                onClick={adicionarArquivo}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Mais
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botão Enviar */}
        <Button 
          onClick={handleEnviar}
          disabled={!canSubmit}
          className="w-full text-white py-6 text-lg font-semibold"
          style={{ backgroundColor: '#2035F2' }}
        >
          Enviar Mensagem
        </Button>
      </div>
    </AccountLayout>
  );
};

export default Avisos;