import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSection } from "./FormSections";

const nichosAfiliado = [
  "Moda e Vestuário",
  "Eletrônicos e Tecnologia",
  "Saúde e Beleza",
  "Casa e Decoração",
  "Esportes e Fitness",
  "Livros e Educação",
  "Alimentação",
  "Infantil",
  "Automotivo",
  "Diversos/Generalista",
];

const experienciasAfiliado = [
  "Iniciante (nunca trabalhei como afiliado)",
  "Básico (menos de 1 ano)",
  "Intermediário (1 a 3 anos)",
  "Avançado (mais de 3 anos)",
];

export interface DadosAfiliado {
  nichoAtuacao: string;
  experiencia: string;
  descricaoAtuacao: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  blog: string;
  outraPlataforma: string;
  quantidadeSeguidores: string;
  publicoAlvo: string;
  comoConheceu: string;
  usaInstagram: boolean;
  usaYoutube: boolean;
  usaTiktok: boolean;
  usaWhatsapp: boolean;
  usaBlog: boolean;
  usaEmail: boolean;
  usaOutro: boolean;
}

export const initialAfiliado: DadosAfiliado = {
  nichoAtuacao: "",
  experiencia: "",
  descricaoAtuacao: "",
  instagram: "",
  youtube: "",
  tiktok: "",
  blog: "",
  outraPlataforma: "",
  quantidadeSeguidores: "",
  publicoAlvo: "",
  comoConheceu: "",
  usaInstagram: false,
  usaYoutube: false,
  usaTiktok: false,
  usaWhatsapp: false,
  usaBlog: false,
  usaEmail: false,
  usaOutro: false,
};

interface DadosAfiliadoSectionProps {
  data: DadosAfiliado;
  onChange: (updates: Partial<DadosAfiliado>) => void;
}

export const DadosAfiliadoSection = ({ data, onChange }: DadosAfiliadoSectionProps) => (
  <>
    {/* Perfil do Afiliado */}
    <FormSection title="PERFIL DO AFILIADO" description="Conte-nos sobre sua experiência e área de atuação como afiliado.">
      <div>
        <Label htmlFor="nichoAtuacao" className="font-normal">Nicho de atuação *</Label>
        <Select value={data.nichoAtuacao} onValueChange={(value) => onChange({ nichoAtuacao: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione seu nicho principal" />
          </SelectTrigger>
          <SelectContent>
            {nichosAfiliado.map((nicho) => (
              <SelectItem key={nicho} value={nicho}>{nicho}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="experiencia" className="font-normal">Experiência como afiliado *</Label>
        <Select value={data.experiencia} onValueChange={(value) => onChange({ experiencia: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione seu nível" />
          </SelectTrigger>
          <SelectContent>
            {experienciasAfiliado.map((exp) => (
              <SelectItem key={exp} value={exp}>{exp}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="descricaoAtuacao" className="font-normal">Descreva como você atua/pretende atuar</Label>
        <Textarea
          id="descricaoAtuacao"
          value={data.descricaoAtuacao}
          onChange={(e) => onChange({ descricaoAtuacao: e.target.value })}
          placeholder="Conte como você divulga produtos, quais estratégias usa, etc."
          className="mt-1 min-h-[80px]"
        />
      </div>
      <div>
        <Label htmlFor="publicoAlvo" className="font-normal">Público-alvo</Label>
        <Input
          id="publicoAlvo"
          value={data.publicoAlvo}
          onChange={(e) => onChange({ publicoAlvo: e.target.value })}
          placeholder="Ex.: Jovens 18-30, mães, cristãos..."
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="quantidadeSeguidores" className="font-normal">Alcance total (seguidores/inscritos)</Label>
        <Input
          id="quantidadeSeguidores"
          value={data.quantidadeSeguidores}
          onChange={(e) => onChange({ quantidadeSeguidores: e.target.value })}
          placeholder="Ex.: 5.000, 50.000, 100.000+"
          className="mt-1"
        />
      </div>
    </FormSection>

    {/* Canais de Divulgação */}
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-2 border-b pb-2">
        CANAIS DE DIVULGAÇÃO
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        Selecione os canais que você utiliza ou pretende utilizar para divulgar produtos.
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="flex items-center gap-3">
          <Checkbox
            id="usaInstagram"
            checked={data.usaInstagram}
            onCheckedChange={(checked) => onChange({ usaInstagram: checked as boolean })}
          />
          <Label htmlFor="usaInstagram" className="font-normal cursor-pointer">
            Instagram (Feed, Stories, Reels)
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="usaYoutube"
            checked={data.usaYoutube}
            onCheckedChange={(checked) => onChange({ usaYoutube: checked as boolean })}
          />
          <Label htmlFor="usaYoutube" className="font-normal cursor-pointer">
            YouTube (Vídeos, Shorts)
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="usaTiktok"
            checked={data.usaTiktok}
            onCheckedChange={(checked) => onChange({ usaTiktok: checked as boolean })}
          />
          <Label htmlFor="usaTiktok" className="font-normal cursor-pointer">
            TikTok
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="usaWhatsapp"
            checked={data.usaWhatsapp}
            onCheckedChange={(checked) => onChange({ usaWhatsapp: checked as boolean })}
          />
          <Label htmlFor="usaWhatsapp" className="font-normal cursor-pointer">
            WhatsApp (Grupos, Status, Listas)
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="usaBlog"
            checked={data.usaBlog}
            onCheckedChange={(checked) => onChange({ usaBlog: checked as boolean })}
          />
          <Label htmlFor="usaBlog" className="font-normal cursor-pointer">
            Blog / Site próprio
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="usaEmail"
            checked={data.usaEmail}
            onCheckedChange={(checked) => onChange({ usaEmail: checked as boolean })}
          />
          <Label htmlFor="usaEmail" className="font-normal cursor-pointer">
            E-mail Marketing
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="usaOutro"
            checked={data.usaOutro}
            onCheckedChange={(checked) => onChange({ usaOutro: checked as boolean })}
          />
          <Label htmlFor="usaOutro" className="font-normal cursor-pointer">
            Outro canal
          </Label>
        </div>
      </div>
    </section>

    {/* Links das Redes */}
    <FormSection title="LINKS DAS SUAS REDES" description="Informe os links dos seus canais de divulgação (opcional, mas ajuda na aprovação).">
      <div>
        <Label htmlFor="instagramLink" className="font-normal">Instagram</Label>
        <Input
          id="instagramLink"
          value={data.instagram}
          onChange={(e) => onChange({ instagram: e.target.value })}
          placeholder="@seuinstagram ou link completo"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="youtubeLink" className="font-normal">YouTube</Label>
        <Input
          id="youtubeLink"
          value={data.youtube}
          onChange={(e) => onChange({ youtube: e.target.value })}
          placeholder="youtube.com/@seucanal"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="tiktokLink" className="font-normal">TikTok</Label>
        <Input
          id="tiktokLink"
          value={data.tiktok}
          onChange={(e) => onChange({ tiktok: e.target.value })}
          placeholder="@seutiktok"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="blogLink" className="font-normal">Blog / Site</Label>
        <Input
          id="blogLink"
          value={data.blog}
          onChange={(e) => onChange({ blog: e.target.value })}
          placeholder="https://www.seublog.com.br"
          className="mt-1"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="outraPlataforma" className="font-normal">Outra plataforma</Label>
        <Input
          id="outraPlataforma"
          value={data.outraPlataforma}
          onChange={(e) => onChange({ outraPlataforma: e.target.value })}
          placeholder="Link de outra rede ou plataforma que você utiliza"
          className="mt-1"
        />
      </div>
    </FormSection>

    {/* Como Conheceu */}
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-2 border-b pb-2">
        INFORMAÇÃO ADICIONAL
      </h3>
      <div>
        <Label htmlFor="comoConheceu" className="font-normal">Como você conheceu o Click Cristão?</Label>
        <Input
          id="comoConheceu"
          value={data.comoConheceu}
          onChange={(e) => onChange({ comoConheceu: e.target.value })}
          placeholder="Ex.: Indicação, redes sociais, Google..."
          className="mt-1 max-w-md"
        />
      </div>
    </section>
  </>
);
