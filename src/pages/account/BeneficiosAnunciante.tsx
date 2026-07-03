import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import myBankIcon from "@/assets/icons/beneficios/my-bank.png";
import meuEventoIcon from "@/assets/icons/beneficios/meu-evento.png";
import minhaLojaIcon from "@/assets/icons/beneficios/minha-loja.png";
import amparoIcon from "@/assets/icons/beneficios/amparo.png";
import myDootsIcon from "@/assets/icons/beneficios/my-doots.png";
import rifaIcon from "@/assets/icons/beneficios/rifa.png";

const benefits = [
  {
    icon: myBankIcon,
    title: "My Bank",
    description: "Compre direto pelo seu banco, de uma forma fácil, rápida e segura.",
  },
  {
    icon: meuEventoIcon,
    title: "Meu Evento",
    description: "Estamos presentes para tornar suas comemorações ainda mais inesquecíveis.",
  },
  {
    icon: minhaLojaIcon,
    title: "Minha Loja",
    description: "É hora de montar suas prateleiras e trazer ainda mais variedade para seu público.",
  },
  {
    icon: amparoIcon,
    title: "Amparo",
    description: "Com seu apoio, podemos servir e ajudar quem realmente precisa.",
  },
  {
    icon: myDootsIcon,
    title: "My Doots",
    description: "Participe, acumule e celebre. Suas escolhas rendem recompensas especiais.",
  },
  {
    icon: rifaIcon,
    title: "Rifas",
    description: "Com pouco investimento, realize o sonho de ter o produto que sempre quis.",
  },
];

const BeneficiosAnunciante = () => {
  return (
    <AccountLayout title="Benefícios">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <Card
            key={benefit.title}
            className="hover:shadow-lg transition-shadow cursor-pointer border-border"
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                <img src={benefit.icon} alt={benefit.title} className="h-12 w-12 object-contain" />
              </div>
              <CardTitle className="text-xl">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-sm leading-relaxed">
                {benefit.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </AccountLayout>
  );
};

export default BeneficiosAnunciante;
