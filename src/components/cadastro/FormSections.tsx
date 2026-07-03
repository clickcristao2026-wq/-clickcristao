import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Endereco, DadosTitular, DadosInstitucionais, ResponsavelLegal, DadosFinanceiros, DadosCartao, DadosVinculado, DadosAcesso, Aceites } from "@/pages/Cadastro";

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const tiposInstituicao = [
  "Comércio",
  "Empresa",
  "Autônomo",
  "ONGs",
  "Religiosas"
];

const bancos = [
  "Banco do Brasil",
  "Bradesco",
  "Caixa Econômica",
  "Itaú",
  "Santander",
  "Nubank",
  "Inter",
  "C6 Bank",
  "Sicoob",
  "Sicredi",
  "Outro"
];

const bandeirasCartao = [
  "Visa",
  "Mastercard",
  "American Express",
  "Elo",
  "Hipercard"
];

const tiposChavePix = [
  "CPF",
  "CNPJ",
  "Telefone",
  "E-mail",
  "Chave Aleatória"
];

const grausRelacionamento = [
  "Esposo(a)",
  "Filho(a)",
  "Irmão(ã)",
  "Pai/Mãe",
  "Cuidador(a)",
  "Assistente",
  "Amigo(a) de confiança",
  "Outro"
];

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection = ({ title, description, children }: SectionProps) => (
  <section className="mb-8">
    <h3 className="text-lg font-semibold text-foreground mb-2 border-b pb-2">
      {title}
    </h3>
    {description && (
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
    )}
    <div className="grid md:grid-cols-2 gap-4">
      {children}
    </div>
  </section>
);

// =============== DADOS DO TITULAR (PF) ===============
interface DadosTitularSectionProps {
  data: DadosTitular;
  onChange: (updates: Partial<DadosTitular>) => void;
}

export const DadosTitularSection = ({ data, onChange }: DadosTitularSectionProps) => (
  <FormSection title="DADOS DO TITULAR" description="Informe seus dados pessoais conforme constam em seus documentos oficiais.">
    <div className="md:col-span-2">
      <Label htmlFor="nomeCompleto" className="font-normal">Nome completo *</Label>
      <Input
        id="nomeCompleto"
        value={data.nomeCompleto}
        onChange={(e) => onChange({ nomeCompleto: e.target.value })}
        placeholder="Informe seu nome completo conforme consta em seus documentos oficiais"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="cpf" className="font-normal">CPF *</Label>
      <Input
        id="cpf"
        value={data.cpf}
        onChange={(e) => onChange({ cpf: e.target.value })}
        placeholder="Digite seu CPF válido"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="dataNascimento" className="font-normal">Data de nascimento *</Label>
      <Input
        id="dataNascimento"
        type="date"
        value={data.dataNascimento}
        onChange={(e) => onChange({ dataNascimento: e.target.value })}
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="genero" className="font-normal">Gênero *</Label>
      <Select value={data.genero} onValueChange={(value) => onChange({ genero: value })}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecione seu gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="masculino">Masculino</SelectItem>
          <SelectItem value="feminino">Feminino</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="telefonePrincipal" className="font-normal">Telefone principal *</Label>
      <Input
        id="telefonePrincipal"
        value={data.telefonePrincipal}
        onChange={(e) => onChange({ telefonePrincipal: e.target.value })}
        placeholder="Informe o telefone de contato principal"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="telefoneSecundario" className="font-normal">Telefone secundário</Label>
      <Input
        id="telefoneSecundario"
        value={data.telefoneSecundario}
        onChange={(e) => onChange({ telefoneSecundario: e.target.value })}
        placeholder="Outro número para contato (opcional)"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="whatsapp" className="font-normal">WhatsApp *</Label>
      <Input
        id="whatsapp"
        value={data.whatsapp}
        onChange={(e) => onChange({ whatsapp: e.target.value })}
        placeholder="Número do WhatsApp para notificações"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="email" className="font-normal">E-mail *</Label>
      <Input
        id="email"
        type="email"
        value={data.email}
        onChange={(e) => onChange({ email: e.target.value })}
        placeholder="E-mail para login e recuperação de senha"
        className="mt-1"
      />
    </div>
    <div className="md:col-span-2 space-y-2 mt-2">
      <p className="text-sm font-medium text-foreground">Confirmações:</p>
      <div className="flex items-center gap-3">
        <Checkbox
          id="confirmarEmail"
          checked={data.confirmarEmail}
          onCheckedChange={(checked) => onChange({ confirmarEmail: checked as boolean })}
        />
        <Label htmlFor="confirmarEmail" className="text-sm font-normal cursor-pointer">
          E-mail – Você receberá um link ou código para validar seu e-mail.
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          id="confirmarWhatsapp"
          checked={data.confirmarWhatsapp}
          onCheckedChange={(checked) => onChange({ confirmarWhatsapp: checked as boolean })}
        />
        <Label htmlFor="confirmarWhatsapp" className="text-sm font-normal cursor-pointer">
          WhatsApp – Você receberá um código para confirmar seu número.
        </Label>
      </div>
    </div>
  </FormSection>
);

// =============== DADOS INSTITUCIONAIS (PJ) ===============
interface DadosInstitucionaisSectionProps {
  data: DadosInstitucionais;
  onChange: (updates: Partial<DadosInstitucionais>) => void;
}

export const DadosInstitucionaisSection = ({ data, onChange }: DadosInstitucionaisSectionProps) => (
  <FormSection title="DADOS INSTITUCIONAIS" description="Informe o nome jurídico oficial da empresa, exatamente como registrado no CNPJ.">
    <div className="md:col-span-2">
      <Label htmlFor="razaoSocial" className="font-normal">Razão social *</Label>
      <Input
        id="razaoSocial"
        value={data.razaoSocial}
        onChange={(e) => onChange({ razaoSocial: e.target.value })}
        placeholder="Informe o nome jurídico completo da empresa"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="nomeFantasia" className="font-normal">Nome fantasia *</Label>
      <Input
        id="nomeFantasia"
        value={data.nomeFantasia}
        onChange={(e) => onChange({ nomeFantasia: e.target.value })}
        placeholder="Nome comercial da empresa"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="cnpj" className="font-normal">CNPJ *</Label>
      <Input
        id="cnpj"
        value={data.cnpj}
        onChange={(e) => onChange({ cnpj: e.target.value })}
        placeholder="Digite o número completo do CNPJ"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="telefoneComercial" className="font-normal">Telefone comercial *</Label>
      <Input
        id="telefoneComercial"
        value={data.telefoneComercial}
        onChange={(e) => onChange({ telefoneComercial: e.target.value })}
        placeholder="Telefone principal da empresa"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="tipoInstituicao" className="font-normal">Tipo de instituição *</Label>
      <Select value={data.tipoInstituicao} onValueChange={(value) => onChange({ tipoInstituicao: value })}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          {tiposInstituicao.map((tipo) => (
            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </FormSection>
);

// =============== RESPONSÁVEL LEGAL (PJ) ===============
interface ResponsavelLegalSectionProps {
  data: ResponsavelLegal;
  onChange: (updates: Partial<ResponsavelLegal>) => void;
}

export const ResponsavelLegalSection = ({ data, onChange }: ResponsavelLegalSectionProps) => (
  <FormSection title="RESPONSÁVEL LEGAL DA INSTITUIÇÃO">
    <div className="md:col-span-2">
      <Label htmlFor="nomeResponsavel" className="font-normal">Nome *</Label>
      <Input
        id="nomeResponsavel"
        value={data.nome}
        onChange={(e) => onChange({ nome: e.target.value })}
        placeholder="Nome completo do responsável legal vinculado ao CNPJ"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="cpfResponsavel" className="font-normal">CPF *</Label>
      <Input
        id="cpfResponsavel"
        value={data.cpf}
        onChange={(e) => onChange({ cpf: e.target.value })}
        placeholder="Número do CPF do responsável legal"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="dataNascimentoResponsavel" className="font-normal">Data de nascimento *</Label>
      <Input
        id="dataNascimentoResponsavel"
        type="date"
        value={data.dataNascimento}
        onChange={(e) => onChange({ dataNascimento: e.target.value })}
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="generoResponsavel" className="font-normal">Gênero</Label>
      <Select value={data.genero} onValueChange={(value) => onChange({ genero: value })}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecione o gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="masculino">Masculino</SelectItem>
          <SelectItem value="feminino">Feminino</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </FormSection>
);

// =============== ENDEREÇO ===============
interface EnderecoSectionProps {
  title: string;
  description?: string;
  data: Endereco;
  onChange: (updates: Partial<Endereco>) => void;
  prefix: string;
}

export const EnderecoSection = ({ title, description, data, onChange, prefix }: EnderecoSectionProps) => (
  <FormSection title={title} description={description}>
    <div className="md:col-span-2">
      <Label htmlFor={`${prefix}Logradouro`} className="font-normal">Logradouro *</Label>
      <Input
        id={`${prefix}Logradouro`}
        value={data.logradouro}
        onChange={(e) => onChange({ logradouro: e.target.value })}
        placeholder="Rua, avenida, alameda, etc."
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor={`${prefix}Numero`} className="font-normal">Número *</Label>
      <Input
        id={`${prefix}Numero`}
        value={data.numero}
        onChange={(e) => onChange({ numero: e.target.value })}
        placeholder="Número (use S/N se não tiver)"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor={`${prefix}Complemento`} className="font-normal">Complemento</Label>
      <Input
        id={`${prefix}Complemento`}
        value={data.complemento}
        onChange={(e) => onChange({ complemento: e.target.value })}
        placeholder="Apartamento, bloco, sala, etc."
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor={`${prefix}Referencia`} className="font-normal">Referência</Label>
      <Input
        id={`${prefix}Referencia`}
        value={data.referencia}
        onChange={(e) => onChange({ referencia: e.target.value })}
        placeholder="Ponto conhecido próximo ao local"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor={`${prefix}Bairro`} className="font-normal">Bairro *</Label>
      <Input
        id={`${prefix}Bairro`}
        value={data.bairro}
        onChange={(e) => onChange({ bairro: e.target.value })}
        placeholder="Nome do bairro"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor={`${prefix}Cidade`} className="font-normal">Cidade *</Label>
      <Input
        id={`${prefix}Cidade`}
        value={data.cidade}
        onChange={(e) => onChange({ cidade: e.target.value })}
        placeholder="Cidade"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor={`${prefix}Estado`} className="font-normal">Estado *</Label>
      <Select value={data.estado} onValueChange={(value) => onChange({ estado: value })}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecione o estado" />
        </SelectTrigger>
        <SelectContent>
          {estados.map((uf) => (
            <SelectItem key={uf} value={uf}>{uf}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor={`${prefix}Pais`} className="font-normal">País *</Label>
      <Input
        id={`${prefix}Pais`}
        value={data.pais}
        onChange={(e) => onChange({ pais: e.target.value })}
        placeholder="Informe o país"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor={`${prefix}Cep`} className="font-normal">CEP *</Label>
      <Input
        id={`${prefix}Cep`}
        value={data.cep}
        onChange={(e) => onChange({ cep: e.target.value })}
        placeholder="Digite o CEP"
        className="mt-1"
      />
    </div>
  </FormSection>
);

// =============== SELEÇÃO DE ENDEREÇO DE ENTREGA ===============
interface EnderecoEntregaSectionProps {
  value: string;
  onChange: (value: string) => void;
  isPJ?: boolean;
}

export const EnderecoEntregaSection = ({ value, onChange, isPJ }: EnderecoEntregaSectionProps) => (
  <section className="mb-8">
    <h3 className="text-lg font-semibold text-foreground mb-2 border-b pb-2">
      ENDEREÇO DE ENTREGA
    </h3>
    <p className="text-muted-foreground text-sm mb-4">
      Selecione o local para receber suas compras:
    </p>
    <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
      <div className="flex items-center gap-3">
        <RadioGroupItem value={isPJ ? "institucional" : "residencial"} id="entregaPrincipal" />
        <Label htmlFor="entregaPrincipal" className="font-normal cursor-pointer">
          {isPJ ? "Institucional" : "Residencial"} – Entrega no endereço principal.
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="alternativo" id="entregaAlternativo" />
        <Label htmlFor="entregaAlternativo" className="font-normal cursor-pointer">
          Alternativo – Entrega no endereço secundário cadastrado.
        </Label>
      </div>
    </RadioGroup>
  </section>
);

// =============== DADOS DE ACESSO ===============
interface DadosAcessoSectionProps {
  data: DadosAcesso;
  onChange: (updates: Partial<DadosAcesso>) => void;
  title?: string;
}

export const DadosAcessoSection = ({ data, onChange, title = "DADOS DE ACESSO" }: DadosAcessoSectionProps) => (
  <FormSection title={title}>
    <div className="md:col-span-2">
      <Label htmlFor="nomeUsuario" className="font-normal">Nome de usuário *</Label>
      <Input
        id="nomeUsuario"
        value={data.nomeUsuario}
        onChange={(e) => onChange({ nomeUsuario: e.target.value })}
        placeholder="Crie um nome único para acessar sua conta"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="senha" className="font-normal">Senha de acesso *</Label>
      <Input
        id="senha"
        type="password"
        value={data.senha}
        onChange={(e) => onChange({ senha: e.target.value })}
        placeholder="Crie uma senha segura"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="confirmarSenha" className="font-normal">Confirmar senha *</Label>
      <Input
        id="confirmarSenha"
        type="password"
        value={data.confirmarSenha}
        onChange={(e) => onChange({ confirmarSenha: e.target.value })}
        placeholder="Repita a mesma senha"
        className="mt-1"
      />
    </div>
    <div className="md:col-span-2 space-y-2 mt-2">
      <p className="text-sm font-medium text-foreground">Verificação de acesso:</p>
      <div className="flex items-center gap-3">
        <Checkbox
          id="verificacaoEmail"
          checked={data.verificacaoEmail}
          onCheckedChange={(checked) => onChange({ verificacaoEmail: checked as boolean })}
        />
        <Label htmlFor="verificacaoEmail" className="text-sm font-normal cursor-pointer">
          Código por e-mail – Você receberá um código no seu e-mail para confirmar sua identidade.
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          id="verificacaoWhatsapp"
          checked={data.verificacaoWhatsapp}
          onCheckedChange={(checked) => onChange({ verificacaoWhatsapp: checked as boolean })}
        />
        <Label htmlFor="verificacaoWhatsapp" className="text-sm font-normal cursor-pointer">
          Código por WhatsApp – Você receberá o código diretamente no WhatsApp.
        </Label>
      </div>
    </div>
  </FormSection>
);

// =============== DADOS FINANCEIROS ===============
interface DadosFinanceirosSectionProps {
  data: DadosFinanceiros;
  onChange: (updates: Partial<DadosFinanceiros>) => void;
  title?: string;
}

export const DadosFinanceirosSection = ({ data, onChange, title = "DADOS FINANCEIROS" }: DadosFinanceirosSectionProps) => (
  <FormSection title={title} description="Essas informações são usadas para facilitar pagamentos, reembolsos e depósitos. Todos os dados são protegidos.">
    <div className="md:col-span-2">
      <Label htmlFor="nomeTitularBanco" className="font-normal">Nome do titular da conta bancária *</Label>
      <Input
        id="nomeTitularBanco"
        value={data.nomeTitularBanco}
        onChange={(e) => onChange({ nomeTitularBanco: e.target.value })}
        placeholder="Exatamente como aparece no banco"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="banco" className="font-normal">Banco *</Label>
      <Select value={data.banco} onValueChange={(value) => onChange({ banco: value })}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecione o banco" />
        </SelectTrigger>
        <SelectContent>
          {bancos.map((banco) => (
            <SelectItem key={banco} value={banco}>{banco}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="agencia" className="font-normal">Agência *</Label>
      <Input
        id="agencia"
        value={data.agencia}
        onChange={(e) => onChange({ agencia: e.target.value })}
        placeholder="Digite a agência sem dígitos especiais"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="conta" className="font-normal">Conta *</Label>
      <Input
        id="conta"
        value={data.conta}
        onChange={(e) => onChange({ conta: e.target.value })}
        placeholder="Número da conta bancária"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="tipoChavePix" className="font-normal">Tipo de chave PIX *</Label>
      <Select value={data.tipoChavePix} onValueChange={(value) => onChange({ tipoChavePix: value })}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          {tiposChavePix.map((tipo) => (
            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="chavePix" className="font-normal">Chave PIX *</Label>
      <Input
        id="chavePix"
        value={data.chavePix}
        onChange={(e) => onChange({ chavePix: e.target.value })}
        placeholder="Digite a chave correspondente"
        className="mt-1"
      />
    </div>
  </FormSection>
);

// =============== DADOS CARTÃO ===============
interface DadosCartaoSectionProps {
  data: DadosCartao;
  onChange: (updates: Partial<DadosCartao>) => void;
}

export const DadosCartaoSection = ({ data, onChange }: DadosCartaoSectionProps) => (
  <FormSection title="DADOS CARTÃO DE CRÉDITO" description="Coletados de forma totalmente segura via gateway de pagamento.">
    <div>
      <Label htmlFor="ultimosDigitos" className="font-normal">4 últimos dígitos do cartão</Label>
      <Input
        id="ultimosDigitos"
        value={data.ultimosDigitos}
        onChange={(e) => onChange({ ultimosDigitos: e.target.value })}
        placeholder="Usado para identificação"
        maxLength={4}
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="bandeira" className="font-normal">Bandeira</Label>
      <Select value={data.bandeira} onValueChange={(value) => onChange({ bandeira: value })}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecione a bandeira" />
        </SelectTrigger>
        <SelectContent>
          {bandeirasCartao.map((bandeira) => (
            <SelectItem key={bandeira} value={bandeira}>{bandeira}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="md:col-span-2">
      <Label htmlFor="nomeTitularCartao" className="font-normal">Nome do titular</Label>
      <Input
        id="nomeTitularCartao"
        value={data.nomeTitular}
        onChange={(e) => onChange({ nomeTitular: e.target.value })}
        placeholder="Nome impresso no cartão"
        className="mt-1"
      />
    </div>
  </FormSection>
);

// =============== DADOS DO VINCULADO ===============
interface DadosVinculadoSectionProps {
  data: DadosVinculado;
  onChange: (updates: Partial<DadosVinculado>) => void;
  title: string;
  isPJ?: boolean;
}

export const DadosVinculadoSection = ({ data, onChange, title, isPJ }: DadosVinculadoSectionProps) => (
  <>
    <FormSection title={title} description={isPJ ? "Usuário adicional autorizado pela empresa para acessar a conta corporativa." : "Pessoa autorizada a usar a mesma conta."}>
      <div className="md:col-span-2">
        <Label htmlFor="nomeVinculado" className="font-normal">Nome completo *</Label>
        <Input
          id="nomeVinculado"
          value={data.nomeCompleto}
          onChange={(e) => onChange({ nomeCompleto: e.target.value })}
          placeholder="Nome completo da pessoa"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="cpfVinculado" className="font-normal">CPF *</Label>
        <Input
          id="cpfVinculado"
          value={data.cpf}
          onChange={(e) => onChange({ cpf: e.target.value })}
          placeholder="CPF para verificação"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="dataNascimentoVinculado" className="font-normal">Data de nascimento *</Label>
        <Input
          id="dataNascimentoVinculado"
          type="date"
          value={data.dataNascimento}
          onChange={(e) => onChange({ dataNascimento: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="generoVinculado" className="font-normal">Gênero</Label>
        <Select value={data.genero} onValueChange={(value) => onChange({ genero: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione o gênero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="feminino">Feminino</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {!isPJ ? (
        <div>
          <Label htmlFor="grauRelacionamento" className="font-normal">Grau de relacionamento *</Label>
          <Select value={data.grauRelacionamento} onValueChange={(value) => onChange({ grauRelacionamento: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o vínculo" />
            </SelectTrigger>
            <SelectContent>
              {grausRelacionamento.map((grau) => (
                <SelectItem key={grau} value={grau}>{grau}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <>
          <div>
            <Label htmlFor="departamento" className="font-normal">Departamento *</Label>
            <Input
              id="departamento"
              value={data.departamento}
              onChange={(e) => onChange({ departamento: e.target.value })}
              placeholder="Ex.: Compras, RH, Financeiro"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="funcao" className="font-normal">Função *</Label>
            <Input
              id="funcao"
              value={data.funcao}
              onChange={(e) => onChange({ funcao: e.target.value })}
              placeholder="Cargo desempenhado"
              className="mt-1"
            />
          </div>
        </>
      )}
      <div>
        <Label htmlFor="telefoneVinculado" className="font-normal">Telefone *</Label>
        <Input
          id="telefoneVinculado"
          value={data.telefonePrincipal}
          onChange={(e) => onChange({ telefonePrincipal: e.target.value })}
          placeholder="Número de contato"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="whatsappVinculado" className="font-normal">WhatsApp *</Label>
        <Input
          id="whatsappVinculado"
          value={data.whatsapp}
          onChange={(e) => onChange({ whatsapp: e.target.value })}
          placeholder="WhatsApp para códigos e avisos"
          className="mt-1"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="emailVinculado" className="font-normal">E-mail *</Label>
        <Input
          id="emailVinculado"
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="E-mail para convite de acesso"
          className="mt-1"
        />
      </div>
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mt-2">
          <Checkbox
            id="acessoAutorizado"
            checked={data.acessoAutorizado}
            onCheckedChange={(checked) => onChange({ acessoAutorizado: checked as boolean })}
          />
          <Label htmlFor="acessoAutorizado" className="text-sm font-normal cursor-pointer">
            Acesso à conta – O sistema enviará um convite para que a pessoa crie sua própria senha.
          </Label>
        </div>
      </div>
    </FormSection>

    {data.acessoAutorizado && (
      <FormSection title={`DADOS DE ACESSO - ${title.replace("DADOS DO ", "").replace("DADOS DA ", "")}`}>
        <div className="md:col-span-2">
          <Label htmlFor="nomeUsuarioVinculado" className="font-normal">Nome de usuário *</Label>
          <Input
            id="nomeUsuarioVinculado"
            value={data.nomeUsuario}
            onChange={(e) => onChange({ nomeUsuario: e.target.value })}
            placeholder="Nome único para acessar a conta"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="senhaVinculado" className="font-normal">Senha de acesso *</Label>
          <Input
            id="senhaVinculado"
            type="password"
            value={data.senha}
            onChange={(e) => onChange({ senha: e.target.value })}
            placeholder="Senha do vinculado"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="confirmarSenhaVinculado" className="font-normal">Confirmar senha *</Label>
          <Input
            id="confirmarSenhaVinculado"
            type="password"
            value={data.confirmarSenha}
            onChange={(e) => onChange({ confirmarSenha: e.target.value })}
            placeholder="Repita a senha"
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2 space-y-2 mt-2">
          <p className="text-sm font-medium text-foreground">Verificação de segurança:</p>
          <div className="flex items-center gap-3">
            <Checkbox
              id="verificacaoEmailVinculado"
              checked={data.verificacaoEmail}
              onCheckedChange={(checked) => onChange({ verificacaoEmail: checked as boolean })}
            />
            <Label htmlFor="verificacaoEmailVinculado" className="text-sm font-normal cursor-pointer">
              Código por e-mail
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="verificacaoWhatsappVinculado"
              checked={data.verificacaoWhatsapp}
              onCheckedChange={(checked) => onChange({ verificacaoWhatsapp: checked as boolean })}
            />
            <Label htmlFor="verificacaoWhatsappVinculado" className="text-sm font-normal cursor-pointer">
              Código por WhatsApp
            </Label>
          </div>
        </div>
      </FormSection>
    )}
  </>
);

// =============== ACEITES ===============
interface AceitesSectionProps {
  data: Aceites;
  onChange: (updates: Partial<Aceites>) => void;
  isPJ?: boolean;
}

export const AceitesSection = ({ data, onChange, isPJ }: AceitesSectionProps) => (
  <section className="mb-8">
    <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">
      ACEITES OBRIGATÓRIOS
    </h3>
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Checkbox
          id="aceitaTermos"
          checked={data.aceitaTermos}
          onCheckedChange={(checked) => onChange({ aceitaTermos: checked as boolean })}
        />
        <Label htmlFor="aceitaTermos" className="text-sm font-normal cursor-pointer">
          Li e aceito os Termos e Condições. Confirma que você concorda com as regras de uso da plataforma.
        </Label>
      </div>
      {isPJ && (
        <div className="flex items-start gap-3">
          <Checkbox
            id="aceitaPoliticaPrivacidade"
            checked={data.aceitaPoliticaPrivacidade}
            onCheckedChange={(checked) => onChange({ aceitaPoliticaPrivacidade: checked as boolean })}
          />
          <Label htmlFor="aceitaPoliticaPrivacidade" className="text-sm font-normal cursor-pointer">
            Li e aceito a Política de Privacidade. Autoriza o uso e tratamento dos dados conforme a lei.
          </Label>
        </div>
      )}
      <div className="flex items-start gap-3">
        <Checkbox
          id="aceitaDados"
          checked={data.aceitaDados}
          onCheckedChange={(checked) => onChange({ aceitaDados: checked as boolean })}
        />
        <Label htmlFor="aceitaDados" className="text-sm font-normal cursor-pointer">
          Concordo com o tratamento dos meus dados pessoais. Permite que suas informações sejam processadas.
        </Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id="aceitaComunicacao"
          checked={data.aceitaComunicacao}
          onCheckedChange={(checked) => onChange({ aceitaComunicacao: checked as boolean })}
        />
        <Label htmlFor="aceitaComunicacao" className="text-sm font-normal cursor-pointer">
          Autorizo comunicação por WhatsApp e e-mail. Permite o envio de notificações e atualizações.
        </Label>
      </div>
      {isPJ && (
        <div className="flex items-start gap-3">
          <Checkbox
            id="declaraResponsavelLegal"
            checked={data.declaraResponsavelLegal}
            onCheckedChange={(checked) => onChange({ declaraResponsavelLegal: checked as boolean })}
          />
          <Label htmlFor="declaraResponsavelLegal" className="text-sm font-normal cursor-pointer">
            Afirmo ser responsável legal da instituição. Declara que possui poderes legais para realizar o cadastro.
          </Label>
        </div>
      )}
      <div className="flex items-start gap-3">
        <Checkbox
          id="declaraResponsavel"
          checked={data.declaraResponsavel}
          onCheckedChange={(checked) => onChange({ declaraResponsavel: checked as boolean })}
        />
        <Label htmlFor="declaraResponsavel" className="text-sm font-normal cursor-pointer">
          Declaro ser responsável pela conta. Você confirma que é responsável pelo uso e segurança da conta.
        </Label>
      </div>
      {!isPJ && (
        <div className="flex items-start gap-3">
          <Checkbox
            id="declaraMaior18"
            checked={data.declaraMaior18}
            onCheckedChange={(checked) => onChange({ declaraMaior18: checked as boolean })}
          />
          <Label htmlFor="declaraMaior18" className="text-sm font-normal cursor-pointer">
            Afirmo ser maior de 18 anos. Declara que possui idade legal para criar e utilizar uma conta.
          </Label>
        </div>
      )}
    </div>
  </section>
);

// =============== CONTATO INSTITUCIONAL (PJ) ===============
interface ContatoInstitucionalSectionProps {
  data: {
    telefonePrincipal: string;
    telefoneSecundario: string;
    whatsapp: string;
    email: string;
    confirmarEmail: boolean;
    confirmarWhatsapp: boolean;
  };
  onChange: (updates: Partial<ContatoInstitucionalSectionProps['data']>) => void;
}

export const ContatoInstitucionalSection = ({ data, onChange }: ContatoInstitucionalSectionProps) => (
  <FormSection title="CONTATO INSTITUCIONAL">
    <div>
      <Label htmlFor="telefonePrincipalInst" className="font-normal">Telefone principal *</Label>
      <Input
        id="telefonePrincipalInst"
        value={data.telefonePrincipal}
        onChange={(e) => onChange({ telefonePrincipal: e.target.value })}
        placeholder="Número de contato principal da empresa"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="telefoneSecundarioInst" className="font-normal">Telefone secundário</Label>
      <Input
        id="telefoneSecundarioInst"
        value={data.telefoneSecundario}
        onChange={(e) => onChange({ telefoneSecundario: e.target.value })}
        placeholder="Número adicional (opcional)"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="whatsappInst" className="font-normal">WhatsApp *</Label>
      <Input
        id="whatsappInst"
        value={data.whatsapp}
        onChange={(e) => onChange({ whatsapp: e.target.value })}
        placeholder="WhatsApp institucional"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="emailInst" className="font-normal">E-mail *</Label>
      <Input
        id="emailInst"
        type="email"
        value={data.email}
        onChange={(e) => onChange({ email: e.target.value })}
        placeholder="E-mail corporativo"
        className="mt-1"
      />
    </div>
    <div className="md:col-span-2 space-y-2 mt-2">
      <p className="text-sm font-medium text-foreground">Confirmações:</p>
      <div className="flex items-center gap-3">
        <Checkbox
          id="confirmarEmailInst"
          checked={data.confirmarEmail}
          onCheckedChange={(checked) => onChange({ confirmarEmail: checked as boolean })}
        />
        <Label htmlFor="confirmarEmailInst" className="text-sm font-normal cursor-pointer">
          E-mail – Você receberá um link ou código para validar o e-mail institucional.
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          id="confirmarWhatsappInst"
          checked={data.confirmarWhatsapp}
          onCheckedChange={(checked) => onChange({ confirmarWhatsapp: checked as boolean })}
        />
        <Label htmlFor="confirmarWhatsappInst" className="text-sm font-normal cursor-pointer">
          WhatsApp – Um código será enviado para verificar o número.
        </Label>
      </div>
    </div>
  </FormSection>
);

// =============== TITULAR PJ (OPERADOR) ===============
interface TitularPJSectionProps {
  data: {
    nomeCompleto: string;
    cpf: string;
    dataNascimento: string;
    genero: string;
    departamento: string;
    funcao: string;
    telefonePrincipal: string;
    telefoneAlternativo: string;
    whatsapp: string;
    email: string;
  };
  onChange: (updates: Partial<TitularPJSectionProps['data']>) => void;
}

export const TitularPJSection = ({ data, onChange }: TitularPJSectionProps) => (
  <FormSection title="DADOS DO TITULAR" description="Responsável pela operação da conta corporativa na plataforma.">
    <div className="md:col-span-2">
      <Label htmlFor="nomeTitularPJ" className="font-normal">Nome completo *</Label>
      <Input
        id="nomeTitularPJ"
        value={data.nomeCompleto}
        onChange={(e) => onChange({ nomeCompleto: e.target.value })}
        placeholder="Nome do responsável que utilizará a conta"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="cpfTitularPJ" className="font-normal">CPF *</Label>
      <Input
        id="cpfTitularPJ"
        value={data.cpf}
        onChange={(e) => onChange({ cpf: e.target.value })}
        placeholder="CPF para autenticação"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="dataNascimentoTitularPJ" className="font-normal">Data de nascimento *</Label>
      <Input
        id="dataNascimentoTitularPJ"
        type="date"
        value={data.dataNascimento}
        onChange={(e) => onChange({ dataNascimento: e.target.value })}
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="generoTitularPJ" className="font-normal">Gênero</Label>
      <Select value={data.genero} onValueChange={(value) => onChange({ genero: value })}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecione o gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="masculino">Masculino</SelectItem>
          <SelectItem value="feminino">Feminino</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="departamentoTitularPJ" className="font-normal">Departamento *</Label>
      <Input
        id="departamentoTitularPJ"
        value={data.departamento}
        onChange={(e) => onChange({ departamento: e.target.value })}
        placeholder="Ex.: Financeiro, Compras, RH"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="funcaoTitularPJ" className="font-normal">Função *</Label>
      <Input
        id="funcaoTitularPJ"
        value={data.funcao}
        onChange={(e) => onChange({ funcao: e.target.value })}
        placeholder="Cargo exercido na instituição"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="telefoneTitularPJ" className="font-normal">Telefone principal *</Label>
      <Input
        id="telefoneTitularPJ"
        value={data.telefonePrincipal}
        onChange={(e) => onChange({ telefonePrincipal: e.target.value })}
        placeholder="Número para contato direto"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="telefoneAltTitularPJ" className="font-normal">Telefone alternativo</Label>
      <Input
        id="telefoneAltTitularPJ"
        value={data.telefoneAlternativo}
        onChange={(e) => onChange({ telefoneAlternativo: e.target.value })}
        placeholder="Outro número (opcional)"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="whatsappTitularPJ" className="font-normal">WhatsApp *</Label>
      <Input
        id="whatsappTitularPJ"
        value={data.whatsapp}
        onChange={(e) => onChange({ whatsapp: e.target.value })}
        placeholder="Para notificações e códigos"
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="emailTitularPJ" className="font-normal">E-mail *</Label>
      <Input
        id="emailTitularPJ"
        type="email"
        value={data.email}
        onChange={(e) => onChange({ email: e.target.value })}
        placeholder="E-mail corporativo para acesso"
        className="mt-1"
      />
    </div>
  </FormSection>
);
