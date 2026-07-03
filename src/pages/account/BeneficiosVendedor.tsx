import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Ticket, Tag, Calendar, Star, Heart } from "lucide-react";

const benefits = [
  {
    icon: Store,
    title: "Minha Loja",
    description: "É hora de montar suas prateleiras e trazer ainda mais variedade para seu público.",
    color: "#2035F2",
  },
  {
    icon: Ticket,
    title: "Rifas",
    description: "Com pouco investimento, realize o sonho de ter o produto que sempre quis.",
    color: "#8B5CF6",
  },
  {
    icon: Tag,
    title: "Cupons",
    description: "Ofereça cupons de desconto exclusivos para seus clientes.",
    color: "#10B981",
  },
  {
    icon: Calendar,
    title: "Meu Evento",
    description: "Estamos presentes para tornar suas comemorações ainda mais inesquecíveis.",
    color: "#F59E0B",
  },
  {
    icon: Star,
    title: "Promover Destaque",
    description: "Coloque seus produtos em destaque na plataforma.",
    color: "#EC4899",
  },
  {
    icon: Heart,
    title: "Amparo",
    description: "Com seu apoio, podemos servir e ajudar quem realmente precisa.",
    color: "#EF4444",
  },
];

export default function BeneficiosVendedor() {
  return (
    <AccountLayout title="Benefícios">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <Card 
              key={benefit.title} 
              className="hover:shadow-lg transition-shadow cursor-pointer border-border group"
              onClick={() => console.log(`Acessar: ${benefit.title}`)}
            >
              <CardHeader className="text-center pb-4">
                <div 
                  className="mx-auto mb-4 p-4 rounded-full w-fit transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${benefit.color}15` }}
                >
                  <Icon 
                    className="h-10 w-10" 
                    style={{ color: benefit.color }}
                    strokeWidth={1.5} 
                  />
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm leading-relaxed">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AccountLayout>
  );
}