import { CadastroData } from "@/pages/Cadastro";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import pessoaFisicaIcon from "@/assets/icons/pessoa_fisica.png";
import pessoaJuridicaIcon from "@/assets/icons/pessoa_juridica.png";

interface Props {
  data: CadastroData;
  updateData: (updates: Partial<CadastroData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const naturezas = [
  {
    id: "pessoa_fisica",
    label: "Pessoa Física",
    description: "Selecione esta opção se você está criando uma conta para uso pessoal. Indicado para consumidores individuais que desejam comprar produtos ou contratar serviços.",
    icon: pessoaFisicaIcon,
  },
  {
    id: "pessoa_juridica",
    label: "Pessoa Jurídica",
    description: "Selecione esta opção caso você esteja criando uma conta em nome de uma empresa ou organização. Utilize somente se for compras feitas pela instituição.",
    icon: pessoaJuridicaIcon,
  },
];

const StepNaturezaConta = ({ data, updateData, onNext, onBack }: Props) => {
  const canProceed = data.naturezaConta !== "";

  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Title */}
      <h2 className="text-2xl font-bold text-foreground mb-2">CADASTRE-SE</h2>
      <span className="text-primary text-sm font-medium mb-12 block">NATUREZA DA CONTA</span>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {naturezas.map((natureza) => {
          const isSelected = data.naturezaConta === natureza.id;
          return (
            <div
              key={natureza.id}
              onClick={() => updateData({ naturezaConta: natureza.id })}
              className={cn(
                "p-8 rounded-lg cursor-pointer transition-all hover:shadow-lg bg-[#FBFBFB]",
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:ring-1 hover:ring-primary/50"
              )}
            >
              <div className="flex flex-col items-center">
                <img src={natureza.icon} alt={natureza.label} className="w-16 h-16 object-contain mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-3">{natureza.label}</h3>
                <p className="text-muted-foreground text-sm">{natureza.description}</p>
              </div>
            </div>
          );
        })}
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

export default StepNaturezaConta;
