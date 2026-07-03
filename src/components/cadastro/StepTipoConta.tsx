import { CadastroData } from "@/pages/Cadastro";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

import contaUnicaIcon from "@/assets/icons/conta_unica.png";
import contaVinculadaIcon from "@/assets/icons/conta_vinculada.png";
import contaCompartilhadaIcon from "@/assets/icons/conta_compartilhada.png";

interface Props {
  data: CadastroData;
  updateData: (updates: Partial<CadastroData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const tiposConta = [
  {
    id: "conta_unica",
    label: "Conta Única",
    description: "Selecione esta opção se você fará uso deste modelo de conta. Ideal para compras, serviços e necessidades pessoais.",
    icon: contaUnicaIcon,
  },
  {
    id: "conta_vinculada",
    label: "Conta Vinculada",
    description: "Selecione se deseja permitir que outra pessoa tenha acesso à mesma conta. Compartilhem dados e acompanhem compras juntas.",
    icon: contaVinculadaIcon,
  },
  {
    id: "conta_compartilhada",
    label: "Conta Compartilhada",
    description: "Selecione essa modalidade se deseja adicionar mais membros na conta. Condição perfeita para comprarem usando o mesmo perfil.",
    icon: contaCompartilhadaIcon,
  },
];

const StepTipoConta = ({ data, updateData, onNext, onBack }: Props) => {
  const canProceed = data.tipoConta !== "";
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? tiposConta.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === tiposConta.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-5xl mx-auto text-center">
      {/* Title */}
      <h2 className="text-2xl font-bold text-foreground mb-2">CADASTRE-SE</h2>
      <span className="text-primary text-sm font-medium mb-12 block">TIPO DE CONTA</span>

      {/* Cards - Desktop */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
        {tiposConta.map((tipo) => {
          const isSelected = data.tipoConta === tipo.id;
          return (
            <div
              key={tipo.id}
              onClick={() => updateData({ tipoConta: tipo.id })}
              className={cn(
                "p-6 rounded-lg cursor-pointer transition-all hover:shadow-lg bg-[#FBFBFB]",
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:ring-1 hover:ring-primary/50"
              )}
            >
              <div className="flex flex-col items-center">
                <img src={tipo.icon} alt={tipo.label} className="w-14 h-14 object-contain mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-3">{tipo.label}</h3>
                <p className="text-muted-foreground text-sm">{tipo.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cards - Mobile Carousel */}
      <div className="md:hidden relative mb-8">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-muted-foreground" />
          </button>

          <div className="w-72">
            {tiposConta.map((tipo, index) => {
              const isSelected = data.tipoConta === tipo.id;
              if (index !== currentIndex) return null;
              return (
                <div
                  key={tipo.id}
                  onClick={() => updateData({ tipoConta: tipo.id })}
                  className={cn(
                    "p-6 rounded-lg cursor-pointer transition-all bg-[#FBFBFB]",
                    isSelected
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  )}
                >
                  <div className="flex flex-col items-center">
                    <img src={tipo.icon} alt={tipo.label} className="w-14 h-14 object-contain mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-3">{tipo.label}</h3>
                    <p className="text-muted-foreground text-sm">{tipo.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          style={{ 
            backgroundColor: '#E4EDFC',
            borderColor: '#E4EDFC',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4E3FD'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E4EDFC'}
          className="text-foreground"
        >
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="text-white"
          style={{ 
            backgroundColor: '#2035F2',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F22C7'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2035F2'}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default StepTipoConta;
