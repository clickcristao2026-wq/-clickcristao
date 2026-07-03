import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { getExclusionReasons } from "@/config/menuConfig";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExcluirConta = () => {
  const { tipoUsuario } = useUser();
  const navigate = useNavigate();
  const reasons = getExclusionReasons(tipoUsuario);
  
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [outroMotivo, setOutroMotivo] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReasonChange = (reason: string, checked: boolean) => {
    if (checked) {
      setSelectedReasons(prev => [...prev, reason]);
    } else {
      setSelectedReasons(prev => prev.filter(r => r !== reason));
    }
  };

  const handleExcluirConta = () => {
    // Aqui seria a lógica de exclusão
    setShowConfirmation(true);
  };

  const getFeedbackQuestion = () => {
    if (tipoUsuario === "consumidor") {
      return "O que poderíamos fazer para melhorar sua experiência como usuário?";
    }
    if (tipoUsuario === "afiliado") {
      return "O que poderíamos fazer para melhorar sua experiência como afiliado?";
    }
    return "O que poderíamos fazer para melhorar sua experiência como vendedor?";
  };

  if (showConfirmation) {
    return (
      <AccountLayout title="">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="mb-6">
            <img 
              src="/placeholder.svg" 
              alt="Click Cristão" 
              className="h-20 w-20 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-primary mb-2">Click Cristão</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-md">
            Encerramos este ciclo com sincera gratidão! Desejamos uma caminhada abençoada e plena.
          </p>
          <Button 
            variant="outline" 
            className="mt-8"
            onClick={() => navigate("/")}
          >
            Voltar para o início
          </Button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Excluir Conta">
      <div className="max-w-2xl">
        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-lg text-destructive">
                Por que você deseja encerrar sua conta?
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-center gap-3">
                  <Checkbox
                    id={reason}
                    checked={selectedReasons.includes(reason)}
                    onCheckedChange={(checked) => 
                      handleReasonChange(reason, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={reason} 
                    className="cursor-pointer font-normal text-sm"
                  >
                    {reason}
                  </Label>
                </div>
              ))}
              
              {/* Outro motivo */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="outro"
                  checked={outroMotivo.length > 0}
                  onCheckedChange={(checked) => {
                    if (!checked) setOutroMotivo("");
                  }}
                />
                <div className="flex-1">
                  <Label htmlFor="outro" className="cursor-pointer font-normal text-sm">
                    Outro motivo:
                  </Label>
                  <input
                    type="text"
                    value={outroMotivo}
                    onChange={(e) => setOutroMotivo(e.target.value)}
                    placeholder="Digite aqui..."
                    className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Label className="font-medium mb-2 block">
                {getFeedbackQuestion()}
              </Label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Conte-nos sua experiência..."
                className="min-h-[100px]"
              />
            </div>

            <Button 
              variant="destructive"
              className="w-full"
              onClick={handleExcluirConta}
            >
              Excluir Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
};

export default ExcluirConta;
