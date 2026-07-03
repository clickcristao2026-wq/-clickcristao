import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSection } from "./FormSections";

const categoriasAnuncio = [
  "Produtos",
  "Serviços Profissionais",
  "Eventos",
  "Cursos e Treinamentos",
  "Imóveis",
  "Veículos",
  "Saúde e Bem-estar",
  "Alimentação",
  "Turismo",
  "Outros",
];

const objetivosAnuncio = [
  "Aumentar vendas",
  "Gerar leads/contatos",
  "Aumentar visibilidade da marca",
  "Divulgar evento",
  "Promover serviço",
  "Outro",
];

export interface DadosAnunciante {
  categoriaAnuncio: string;
  descricaoNegocio: string;
  objetivoAnuncio: string;
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
  outraRede: string;
  publicoAlvo: string;
  regiaoAtuacao: string;
  aceitaContatoWhatsapp: boolean;
  aceitaContatoEmail: boolean;
  aceitaContatoTelefone: boolean;
}

export const initialAnunciante: DadosAnunciante = {
  categoriaAnuncio: "",
  descricaoNegocio: "",
  objetivoAnuncio: "",
  website: "",
  instagram: "",
  facebook: "",
  youtube: "",
  outraRede: "",
  publicoAlvo: "",
  regiaoAtuacao: "",
  aceitaContatoWhatsapp: true,
  aceitaContatoEmail: true,
  aceitaContatoTelefone: false,
};

interface DadosAnuncianteSectionProps {
  data: DadosAnunciante;
  onChange: (updates: Partial<DadosAnunciante>) => void;
}

export const DadosAnuncianteSection = ({ data, onChange }: DadosAnuncianteSectionProps) => (
  <>
    {/* Informações do Anúncio */}
    <FormSection title="INFORMAÇÕES DO ANÚNCIO" description="Conte-nos sobre o que você deseja anunciar na plataforma.">
      <div>
        <Label htmlFor="categoriaAnuncio" className="font-normal">Categoria do anúncio *</Label>
        <Select value={data.categoriaAnuncio} onValueChange={(value) => onChange({ categoriaAnuncio: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categoriasAnuncio.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="objetivoAnuncio" className="font-normal">Objetivo do anúncio *</Label>
        <Select value={data.objetivoAnuncio} onValueChange={(value) => onChange({ objetivoAnuncio: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione o objetivo" />
          </SelectTrigger>
          <SelectContent>
            {objetivosAnuncio.map((obj) => (
              <SelectItem key={obj} value={obj}>{obj}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="descricaoNegocio" className="font-normal">Descrição do negócio/serviço *</Label>
        <Textarea
          id="descricaoNegocio"
          value={data.descricaoNegocio}
          onChange={(e) => onChange({ descricaoNegocio: e.target.value })}
          placeholder="Descreva brevemente o que você oferece e deseja divulgar..."
          className="mt-1 min-h-[80px]"
        />
      </div>
      <div>
        <Label htmlFor="publicoAlvo" className="font-normal">Público-alvo</Label>
        <Input
          id="publicoAlvo"
          value={data.publicoAlvo}
          onChange={(e) => onChange({ publicoAlvo: e.target.value })}
          placeholder="Ex.: Mulheres 25-45 anos, empresários..."
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="regiaoAtuacao" className="font-normal">Região de atuação</Label>
        <Input
          id="regiaoAtuacao"
          value={data.regiaoAtuacao}
          onChange={(e) => onChange({ regiaoAtuacao: e.target.value })}
          placeholder="Ex.: Todo Brasil, São Paulo, Regional..."
          className="mt-1"
        />
      </div>
    </FormSection>

    {/* Presença Digital */}
    <FormSection title="PRESENÇA DIGITAL" description="Informe seus canais digitais para vincular ao seu perfil de anunciante.">
      <div className="md:col-span-2">
        <Label htmlFor="website" className="font-normal">Website</Label>
        <Input
          id="website"
          value={data.website}
          onChange={(e) => onChange({ website: e.target.value })}
          placeholder="https://www.seusite.com.br"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="instagram" className="font-normal">Instagram</Label>
        <Input
          id="instagram"
          value={data.instagram}
          onChange={(e) => onChange({ instagram: e.target.value })}
          placeholder="@seuinstagram"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="facebook" className="font-normal">Facebook</Label>
        <Input
          id="facebook"
          value={data.facebook}
          onChange={(e) => onChange({ facebook: e.target.value })}
          placeholder="facebook.com/suapagina"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="youtube" className="font-normal">YouTube</Label>
        <Input
          id="youtube"
          value={data.youtube}
          onChange={(e) => onChange({ youtube: e.target.value })}
          placeholder="youtube.com/@seucanal"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="outraRede" className="font-normal">Outra rede social</Label>
        <Input
          id="outraRede"
          value={data.outraRede}
          onChange={(e) => onChange({ outraRede: e.target.value })}
          placeholder="TikTok, LinkedIn, etc."
          className="mt-1"
        />
      </div>
    </FormSection>

    {/* Preferências de Contato */}
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-2 border-b pb-2">
        PREFERÊNCIAS DE CONTATO
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        Como você prefere receber contatos de interessados nos seus anúncios?
      </p>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Checkbox
            id="aceitaContatoWhatsapp"
            checked={data.aceitaContatoWhatsapp}
            onCheckedChange={(checked) => onChange({ aceitaContatoWhatsapp: checked as boolean })}
          />
          <Label htmlFor="aceitaContatoWhatsapp" className="font-normal cursor-pointer">
            WhatsApp – Receber mensagens diretamente no WhatsApp cadastrado.
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="aceitaContatoEmail"
            checked={data.aceitaContatoEmail}
            onCheckedChange={(checked) => onChange({ aceitaContatoEmail: checked as boolean })}
          />
          <Label htmlFor="aceitaContatoEmail" className="font-normal cursor-pointer">
            E-mail – Receber contatos por e-mail.
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="aceitaContatoTelefone"
            checked={data.aceitaContatoTelefone}
            onCheckedChange={(checked) => onChange({ aceitaContatoTelefone: checked as boolean })}
          />
          <Label htmlFor="aceitaContatoTelefone" className="font-normal cursor-pointer">
            Telefone – Aceito receber ligações telefônicas.
          </Label>
        </div>
      </div>
    </section>
  </>
);
