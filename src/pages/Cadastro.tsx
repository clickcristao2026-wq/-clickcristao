import { useState } from "react";
import { useNavigate } from "react-router-dom";
import headerBg from "@/assets/header-bg.png";
import StepTipoUsuario from "@/components/cadastro/StepTipoUsuario";
import StepNaturezaConta from "@/components/cadastro/StepNaturezaConta";
import StepTipoConta from "@/components/cadastro/StepTipoConta";
import StepFormulario from "@/components/cadastro/StepFormulario";
import { DadosAnunciante, initialAnunciante } from "@/components/cadastro/AnuncianteFormSections";
import { DadosAfiliado, initialAfiliado } from "@/components/cadastro/AfiliadoFormSections";

// Dados do Titular / Pessoa Física
export interface DadosTitular {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  genero: string;
  telefonePrincipal: string;
  telefoneSecundario: string;
  whatsapp: string;
  email: string;
  confirmarEmail: boolean;
  confirmarWhatsapp: boolean;
}

// Dados Institucionais (Pessoa Jurídica)
export interface DadosInstitucionais {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  telefoneComercial: string;
  tipoInstituicao: string;
}

// Responsável Legal (PJ)
export interface ResponsavelLegal {
  nome: string;
  cpf: string;
  dataNascimento: string;
  genero: string;
}

// Endereço
export interface Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  referencia: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  cep: string;
}

// Dados de Acesso
export interface DadosAcesso {
  nomeUsuario: string;
  senha: string;
  confirmarSenha: string;
  verificacaoEmail: boolean;
  verificacaoWhatsapp: boolean;
}

// Dados Financeiros
export interface DadosFinanceiros {
  nomeTitularBanco: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoChavePix: string;
  chavePix: string;
}

// Dados Cartão
export interface DadosCartao {
  ultimosDigitos: string;
  bandeira: string;
  nomeTitular: string;
}

// Dados do Vinculado/Compartilhado
export interface DadosVinculado {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  genero: string;
  grauRelacionamento: string;
  departamento: string;
  funcao: string;
  telefonePrincipal: string;
  telefoneSecundario: string;
  whatsapp: string;
  email: string;
  acessoAutorizado: boolean;
  nomeUsuario: string;
  senha: string;
  confirmarSenha: string;
  verificacaoEmail: boolean;
  verificacaoWhatsapp: boolean;
}

// Aceites
export interface Aceites {
  aceitaTermos: boolean;
  aceitaPoliticaPrivacidade: boolean;
  aceitaDados: boolean;
  aceitaComunicacao: boolean;
  declaraResponsavelLegal: boolean;
  declaraResponsavel: boolean;
  declaraMaior18: boolean;
}

// Dados completos do cadastro
export interface CadastroData {
  // Step selections
  tipoUsuario: string;
  naturezaConta: string;
  tipoConta: string;
  
  // Dados do Titular (PF) ou Operador da Conta (PJ)
  titular: DadosTitular;
  
  // Dados Institucionais (apenas PJ)
  instituicao: DadosInstitucionais;
  
  // Responsável Legal (apenas PJ)
  responsavelLegal: ResponsavelLegal;
  
  // Endereços
  enderecoResidencial: Endereco;
  enderecoAlternativo: Endereco;
  enderecoInstitucional: Endereco;
  enderecoInstitucionalAlternativo: Endereco;
  enderecoEntrega: string;
  
  // Contato Institucional (PJ)
  contatoInstitucional: {
    telefonePrincipal: string;
    telefoneSecundario: string;
    whatsapp: string;
    email: string;
    confirmarEmail: boolean;
    confirmarWhatsapp: boolean;
  };
  
  // Dados do Titular PJ (operador)
  titularPJ: {
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
  
  // Dados de Acesso
  acesso: DadosAcesso;
  
  // Dados Financeiros
  financeiro: DadosFinanceiros;
  
  // Dados Cartão
  cartao: DadosCartao;
  
  // Vinculados (Conta Vinculada = 1, Conta Compartilhada = 2)
  vinculado1: DadosVinculado;
  vinculado2: DadosVinculado;
  
  // Aceites
  aceites: Aceites;
  
  // Dados específicos do Anunciante
  anunciante: DadosAnunciante;
  
  // Dados específicos do Afiliado
  afiliado: DadosAfiliado;
}

const initialEndereco: Endereco = {
  logradouro: "",
  numero: "",
  complemento: "",
  referencia: "",
  bairro: "",
  cidade: "",
  estado: "",
  pais: "Brasil",
  cep: "",
};

const initialVinculado: DadosVinculado = {
  nomeCompleto: "",
  cpf: "",
  dataNascimento: "",
  genero: "",
  grauRelacionamento: "",
  departamento: "",
  funcao: "",
  telefonePrincipal: "",
  telefoneSecundario: "",
  whatsapp: "",
  email: "",
  acessoAutorizado: false,
  nomeUsuario: "",
  senha: "",
  confirmarSenha: "",
  verificacaoEmail: false,
  verificacaoWhatsapp: false,
};

const initialData: CadastroData = {
  tipoUsuario: "",
  naturezaConta: "",
  tipoConta: "",
  
  titular: {
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    genero: "",
    telefonePrincipal: "",
    telefoneSecundario: "",
    whatsapp: "",
    email: "",
    confirmarEmail: false,
    confirmarWhatsapp: false,
  },
  
  instituicao: {
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    telefoneComercial: "",
    tipoInstituicao: "",
  },
  
  responsavelLegal: {
    nome: "",
    cpf: "",
    dataNascimento: "",
    genero: "",
  },
  
  enderecoResidencial: { ...initialEndereco },
  enderecoAlternativo: { ...initialEndereco },
  enderecoInstitucional: { ...initialEndereco },
  enderecoInstitucionalAlternativo: { ...initialEndereco },
  enderecoEntrega: "residencial",
  
  contatoInstitucional: {
    telefonePrincipal: "",
    telefoneSecundario: "",
    whatsapp: "",
    email: "",
    confirmarEmail: false,
    confirmarWhatsapp: false,
  },
  
  titularPJ: {
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    genero: "",
    departamento: "",
    funcao: "",
    telefonePrincipal: "",
    telefoneAlternativo: "",
    whatsapp: "",
    email: "",
  },
  
  acesso: {
    nomeUsuario: "",
    senha: "",
    confirmarSenha: "",
    verificacaoEmail: false,
    verificacaoWhatsapp: false,
  },
  
  financeiro: {
    nomeTitularBanco: "",
    banco: "",
    agencia: "",
    conta: "",
    tipoChavePix: "",
    chavePix: "",
  },
  
  cartao: {
    ultimosDigitos: "",
    bandeira: "",
    nomeTitular: "",
  },
  
  vinculado1: { ...initialVinculado },
  vinculado2: { ...initialVinculado },
  
  aceites: {
    aceitaTermos: false,
    aceitaPoliticaPrivacidade: false,
    aceitaDados: false,
    aceitaComunicacao: false,
    declaraResponsavelLegal: false,
    declaraResponsavel: false,
    declaraMaior18: false,
  },
  
  anunciante: { ...initialAnunciante },
  afiliado: { ...initialAfiliado },
};

const Cadastro = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CadastroData>(initialData);
  const navigate = useNavigate();

  const updateData = (updates: Partial<CadastroData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    console.log("Cadastro data:", data);
    navigate("/account/dados");
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header */}
      <div
        className="w-full py-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${headerBg})` }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground italic">
            My account <span className="text-2xl not-italic font-normal text-primary-foreground/70">– Central Operacional</span>
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            Home / <span className="font-medium">My account</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-12 px-4">
        {step === 1 && (
          <StepTipoUsuario
            data={data}
            updateData={updateData}
            onNext={nextStep}
          />
        )}
        {step === 2 && (
          <StepNaturezaConta
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 3 && (
          <StepTipoConta
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 4 && (
          <StepFormulario
            data={data}
            updateData={updateData}
            onBack={prevStep}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Cadastro;
