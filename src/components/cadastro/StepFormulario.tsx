import { CadastroData } from "@/pages/Cadastro";
import { Button } from "@/components/ui/button";
import {
  DadosTitularSection,
  DadosInstitucionaisSection,
  ResponsavelLegalSection,
  EnderecoSection,
  EnderecoEntregaSection,
  DadosAcessoSection,
  DadosFinanceirosSection,
  DadosCartaoSection,
  DadosVinculadoSection,
  AceitesSection,
  ContatoInstitucionalSection,
  TitularPJSection,
} from "./FormSections";
import { DadosAnuncianteSection } from "./AnuncianteFormSections";
import { DadosAfiliadoSection } from "./AfiliadoFormSections";

interface Props {
  data: CadastroData;
  updateData: (updates: Partial<CadastroData>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const StepFormulario = ({ data, updateData, onBack, onSubmit }: Props) => {
  const isPessoaFisica = data.naturezaConta === "pessoa_fisica";
  const isPessoaJuridica = data.naturezaConta === "pessoa_juridica";
  const isContaVinculada = data.tipoConta === "conta_vinculada";
  const isContaCompartilhada = data.tipoConta === "conta_compartilhada";
  
  // Tipos de usuário
  const isConsumidor = data.tipoUsuario === "consumidor";
  const isAnunciante = data.tipoUsuario === "anunciante";
  const isAfiliado = data.tipoUsuario === "afiliado";

  const getButtonText = () => {
    if (isContaVinculada) return "CRIAR CONTA VINCULADA";
    if (isContaCompartilhada) return "CRIAR CONTA COMPARTILHADA";
    return "CRIAR CONTA";
  };

  const canSubmit = () => {
    const aceitesValidos = data.aceites.aceitaTermos && 
                          data.aceites.aceitaDados && 
                          data.aceites.aceitaComunicacao && 
                          data.aceites.declaraResponsavel;
    
    if (isPessoaFisica) {
      const titularValido = data.titular.nomeCompleto && 
                           data.titular.cpf && 
                           data.titular.dataNascimento &&
                           data.titular.email;
      const enderecoValido = data.enderecoResidencial.logradouro && 
                            data.enderecoResidencial.cidade;
      const acessoValido = data.acesso.nomeUsuario && 
                          data.acesso.senha && 
                          data.acesso.senha === data.acesso.confirmarSenha;
      
      // Validação específica do Anunciante
      if (isAnunciante) {
        const anuncianteValido = data.anunciante.categoriaAnuncio && 
                                data.anunciante.descricaoNegocio &&
                                data.anunciante.objetivoAnuncio;
        return titularValido && enderecoValido && acessoValido && aceitesValidos && 
               data.aceites.declaraMaior18 && anuncianteValido;
      }
      
      // Validação específica do Afiliado
      if (isAfiliado) {
        const afiliadoValido = data.afiliado.nichoAtuacao && 
                              data.afiliado.experiencia;
        return titularValido && enderecoValido && acessoValido && aceitesValidos && 
               data.aceites.declaraMaior18 && afiliadoValido;
      }
      
      return titularValido && enderecoValido && acessoValido && aceitesValidos && data.aceites.declaraMaior18;
    }
    
    if (isPessoaJuridica) {
      const instituicaoValida = data.instituicao.razaoSocial && 
                               data.instituicao.cnpj;
      const responsavelValido = data.responsavelLegal.nome && 
                               data.responsavelLegal.cpf;
      const titularPJValido = data.titularPJ.nomeCompleto && 
                             data.titularPJ.cpf;
      const acessoValido = data.acesso.nomeUsuario && 
                          data.acesso.senha && 
                          data.acesso.senha === data.acesso.confirmarSenha;
      
      // Validação específica do Anunciante PJ
      if (isAnunciante) {
        const anuncianteValido = data.anunciante.categoriaAnuncio && 
                                data.anunciante.descricaoNegocio &&
                                data.anunciante.objetivoAnuncio;
        return instituicaoValida && responsavelValido && titularPJValido && acessoValido && 
               aceitesValidos && data.aceites.declaraResponsavelLegal && anuncianteValido;
      }
      
      // Validação específica do Afiliado PJ
      if (isAfiliado) {
        const afiliadoValido = data.afiliado.nichoAtuacao && 
                              data.afiliado.experiencia;
        return instituicaoValida && responsavelValido && titularPJValido && acessoValido && 
               aceitesValidos && data.aceites.declaraResponsavelLegal && afiliadoValido;
      }
      
      return instituicaoValida && responsavelValido && titularPJValido && acessoValido && 
             aceitesValidos && data.aceites.declaraResponsavelLegal;
    }
    
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-foreground mb-8 text-center">CADASTRE-SE</h2>

      <div className="space-y-2">
        {/* ===== SEÇÕES ESPECÍFICAS DO ANUNCIANTE (aparecem primeiro) ===== */}
        {isAnunciante && (
          <DadosAnuncianteSection
            data={data.anunciante}
            onChange={(updates) => updateData({ anunciante: { ...data.anunciante, ...updates } })}
          />
        )}

        {/* ===== SEÇÕES ESPECÍFICAS DO AFILIADO (aparecem primeiro) ===== */}
        {isAfiliado && (
          <DadosAfiliadoSection
            data={data.afiliado}
            onChange={(updates) => updateData({ afiliado: { ...data.afiliado, ...updates } })}
          />
        )}

        {/* ===== PESSOA FÍSICA ===== */}
        {isPessoaFisica && (
          <>
            <DadosTitularSection
              data={data.titular}
              onChange={(updates) => updateData({ titular: { ...data.titular, ...updates } })}
            />

            <EnderecoSection
              title="ENDEREÇO RESIDENCIAL - TITULAR"
              description="Preencha com o endereço onde você reside atualmente."
              data={data.enderecoResidencial}
              onChange={(updates) => updateData({ enderecoResidencial: { ...data.enderecoResidencial, ...updates } })}
              prefix="residencial"
            />

            <EnderecoSection
              title="ENDEREÇO ALTERNATIVO - TITULAR"
              description="Preencha caso tenha outro endereço para entregas."
              data={data.enderecoAlternativo}
              onChange={(updates) => updateData({ enderecoAlternativo: { ...data.enderecoAlternativo, ...updates } })}
              prefix="alternativo"
            />

            <EnderecoEntregaSection
              value={data.enderecoEntrega}
              onChange={(value) => updateData({ enderecoEntrega: value })}
              isPJ={false}
            />

            <DadosAcessoSection
              data={data.acesso}
              onChange={(updates) => updateData({ acesso: { ...data.acesso, ...updates } })}
              title="DADOS DE ACESSO - TITULAR"
            />

            <DadosFinanceirosSection
              data={data.financeiro}
              onChange={(updates) => updateData({ financeiro: { ...data.financeiro, ...updates } })}
              title="DADOS FINANCEIROS - TITULAR"
            />

            {isConsumidor && (
              <DadosCartaoSection
                data={data.cartao}
                onChange={(updates) => updateData({ cartao: { ...data.cartao, ...updates } })}
              />
            )}

            {(isContaVinculada || isContaCompartilhada) && (
              <DadosVinculadoSection
                data={data.vinculado1}
                onChange={(updates) => updateData({ vinculado1: { ...data.vinculado1, ...updates } })}
                title={isContaCompartilhada ? "DADOS DO COMPARTILHADO 1" : "DADOS DO VINCULADO"}
                isPJ={false}
              />
            )}

            {isContaCompartilhada && (
              <DadosVinculadoSection
                data={data.vinculado2}
                onChange={(updates) => updateData({ vinculado2: { ...data.vinculado2, ...updates } })}
                title="DADOS DO COMPARTILHADO 2"
                isPJ={false}
              />
            )}

            <AceitesSection
              data={data.aceites}
              onChange={(updates) => updateData({ aceites: { ...data.aceites, ...updates } })}
              isPJ={false}
            />
          </>
        )}

        {/* ===== PESSOA JURÍDICA ===== */}
        {isPessoaJuridica && (
          <>
            <DadosInstitucionaisSection
              data={data.instituicao}
              onChange={(updates) => updateData({ instituicao: { ...data.instituicao, ...updates } })}
            />

            <ResponsavelLegalSection
              data={data.responsavelLegal}
              onChange={(updates) => updateData({ responsavelLegal: { ...data.responsavelLegal, ...updates } })}
            />

            <EnderecoSection
              title="ENDEREÇO INSTITUCIONAL"
              description="Preencha com o endereço oficial da empresa ou sede institucional."
              data={data.enderecoInstitucional}
              onChange={(updates) => updateData({ enderecoInstitucional: { ...data.enderecoInstitucional, ...updates } })}
              prefix="institucional"
            />

            <EnderecoSection
              title="ENDEREÇO INSTITUCIONAL - ALTERNATIVO"
              description="Cadastre um endereço adicional caso sua empresa receba entregas em outro local."
              data={data.enderecoInstitucionalAlternativo}
              onChange={(updates) => updateData({ enderecoInstitucionalAlternativo: { ...data.enderecoInstitucionalAlternativo, ...updates } })}
              prefix="institucionalAlt"
            />

            <EnderecoEntregaSection
              value={data.enderecoEntrega}
              onChange={(value) => updateData({ enderecoEntrega: value })}
              isPJ={true}
            />

            <ContatoInstitucionalSection
              data={data.contatoInstitucional}
              onChange={(updates) => updateData({ contatoInstitucional: { ...data.contatoInstitucional, ...updates } })}
            />

            <DadosFinanceirosSection
              data={data.financeiro}
              onChange={(updates) => updateData({ financeiro: { ...data.financeiro, ...updates } })}
              title="DADOS FINANCEIROS - INSTITUCIONAL"
            />

            {isConsumidor && (
              <DadosCartaoSection
                data={data.cartao}
                onChange={(updates) => updateData({ cartao: { ...data.cartao, ...updates } })}
              />
            )}

            <TitularPJSection
              data={data.titularPJ}
              onChange={(updates) => updateData({ titularPJ: { ...data.titularPJ, ...updates } })}
            />

            <DadosAcessoSection
              data={data.acesso}
              onChange={(updates) => updateData({ acesso: { ...data.acesso, ...updates } })}
              title="DADOS DE ACESSO - TITULAR"
            />

            {(isContaVinculada || isContaCompartilhada) && (
              <DadosVinculadoSection
                data={data.vinculado1}
                onChange={(updates) => updateData({ vinculado1: { ...data.vinculado1, ...updates } })}
                title={isContaCompartilhada ? "DADOS DO COMPARTILHADO 1" : "DADOS DO VINCULADO"}
                isPJ={true}
              />
            )}

            {isContaCompartilhada && (
              <DadosVinculadoSection
                data={data.vinculado2}
                onChange={(updates) => updateData({ vinculado2: { ...data.vinculado2, ...updates } })}
                title="DADOS DO COMPARTILHADO 2"
                isPJ={true}
              />
            )}

            <AceitesSection
              data={data.aceites}
              onChange={(updates) => updateData({ aceites: { ...data.aceites, ...updates } })}
              isPJ={true}
            />
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4 pt-4">
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
            onClick={onSubmit}
            disabled={!canSubmit()}
            className="text-white px-8"
            style={{ 
              backgroundColor: '#2035F2',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F22C7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2035F2'}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepFormulario;
