import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CadastroData } from "@/pages/Cadastro";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ROLE_HOME_ROUTE } from "@/types/auth";

import consumidorIcon from "@/assets/icons/consumidor.png";
import vendedorIcon from "@/assets/icons/vendedor.png";
import anuncianteIcon from "@/assets/icons/anunciante.png";
import afiliadoIcon from "@/assets/icons/afiliado.png";
import admIcon from "@/assets/icons/adm.png";
import tipoUsuarioIcon from "@/assets/icons/tipo-usuario.png";
import tipoCooperadorIcon from "@/assets/icons/tipo-cooperador.png";

interface Props {
  data: CadastroData;
  updateData: (updates: Partial<CadastroData>) => void;
  onNext: () => void;
}

const tiposUsuario = [
  {
    id: "consumidor",
    label: "Consumidor",
    description: "Crie sua conta e realize compras de produtos, utilizando todos os nossos serviços exclusivos.",
    icon: consumidorIcon,
  },
  {
    id: "vendedor",
    label: "Vendedor",
    description: "Crie sua conta e aproveite para comercializar produtos e impulsionar suas vendas com facilidade.",
    icon: vendedorIcon,
  },
  {
    id: "anunciante",
    label: "Anunciante",
    description: "Crie sua conta, divulgue seus bens e serviços para mais pessoas, ampliando seu alcance e vendas.",
    icon: anuncianteIcon,
  },
  {
    id: "afiliado",
    label: "Afiliado",
    description: "Crie sua conta e torne-se um revendedor de produtos, passe a lucrar a cada venda, sem precisar de estoque.",
    icon: afiliadoIcon,
  },
];

// Único tipo de conta interna: o Administrador tem acesso a todos os
// painéis da plataforma (RH, ADM, Logística, Financeiro, Comissionado e
// Gerenciamento) — não existem mais contas internas separadas por setor.
const tiposCooperador = [
  {
    id: "admin",
    label: "Administrador",
    description: "Conta com acesso completo a todos os painéis internos da plataforma: RH, Administração Geral, Logística, Financeiro, Comissionado e Gerenciamento.",
    url: "/dashboards",
    icon: admIcon,
  },
];

const textoUsuario = `Ao se cadastrar em nossa plataforma, você terá acesso completo a todos os recursos, produto e benefícios que o Click Cristão proporciona. Basta selecionar os itens desejados, preencher os campos solicitados e em poucos instantes, sua nova conta estará criada. Solicitamos apenas as informações essenciais, para tornar o processo simples e rápido.

Seus dados estarão protegidos conosco, onde serão usados para apoiar sua experiência em toda a plataforma. Não divulgamos ou comercializamos qualquer informação cadastrada ou utilizada em nossos sistemas, conforme descrito em nossa política de privacidade.

Aproveite para navegar com tranquilidade e desfrutar de tudo o que disponibilizamos. Somos gratos por tê-lo conosco, a sua presença torna nossa comunidade ainda mais especial.`;

const textoCooperador = `Ao acessar e realizar o login no sistema interno da plataforma Click Cristão, o cooperador passa a ter acesso a dados, informações, ferramentas operacionais e recursos digitais necessários para o desempenho de suas atividades profissionais dentro da empresa. Essas informações podem incluir, entre outros elementos, dados administrativos, registros operacionais, informações comerciais, cadastros de usuários, dados estratégicos da empresa, relatórios internos e conteúdos relacionados ao funcionamento da plataforma.

Dessa forma, o cooperador compromete-se a utilizar tais informações exclusivamente para fins profissionais, no exercício de suas funções e no interesse institucional do Click Cristão, devendo agir sempre com zelo, responsabilidade, ética e sigilo. Todas as informações acessadas ou manipuladas dentro do sistema, são consideradas confidenciais e de uso restrito da empresa, vedada, em qualquer hipótese, sua divulgação, compartilhamento, reprodução, cópia, distribuição ou utilização para finalidades pessoais ou externas à atividade profissional desempenhada.

O Click Cristão não divulga, comercializa ou compartilha informações internas da empresa ou de seus usuários, sem fundamento legal ou autorização institucional, mantendo o compromisso com a segurança e a proteção de dados utilizados em seus sistemas.

Ao acessar o sistema, o cooperador declara estar ciente e de acordo com os Termos e Condições do Cooperador, comprometendo-se a utilizar as informações e recursos da plataforma de forma responsável, ética e exclusivamente para fins profissionais, responsabilizando-se por qualquer uso indevido, divulgação não autorizada ou prática que possa causar prejuízo à empresa Click Cristão ou a terceiros.`;

const StepTipoUsuario = ({ data, updateData, onNext }: Props) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [leftTab, setLeftTab] = useState<"usuario" | "cooperador">("usuario");
  const [rightTab, setRightTab] = useState<"cadastro" | "login">("cadastro");
  const [infoTab, setInfoTab] = useState<"usuario" | "cooperador">("usuario");
  const [loginData, setLoginData] = useState({ email: "", login: "", senha: "" });
  const [isEntering, setIsEntering] = useState(false);

  const isCooperadorSelected = tiposCooperador.some(t => t.id === data.tipoUsuario);
  const isUsuarioSelected = tiposUsuario.some(t => t.id === data.tipoUsuario);
  const canProceedCadastro = isUsuarioSelected && data.titular.email !== "";

  const handleEntrar = async () => {
    if (!isCooperadorSelected) return;
    const identifier = loginData.login || loginData.email;

    setIsEntering(true);
    const result = await login(identifier, loginData.senha);
    setIsEntering(false);

    if (!result.ok || !result.user) {
      toast({
        title: "Não foi possível entrar",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    navigate(ROLE_HOME_ROUTE[result.user.role]);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Side */}
        <div className="md:border-r md:border-border md:pr-12">
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setLeftTab("usuario")}
            >
              <img
                src={tipoUsuarioIcon}
                alt="Tipo de Usuário"
                className={`w-8 h-8 object-contain transition-opacity ${
                  leftTab === "usuario" ? "opacity-100" : "opacity-40"
                }`}
              />
              <h2
                className={`text-2xl font-bold transition-colors ${
                  leftTab === "usuario" ? "text-foreground" : "text-muted-foreground/50"
                }`}
              >
                TIPO DE USUÁRIO
              </h2>
            </div>
            <span className="text-muted-foreground">–</span>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setLeftTab("cooperador")}
            >
              <img
                src={tipoCooperadorIcon}
                alt="Tipo de Cooperador"
                className={`w-7 h-7 object-contain transition-opacity ${
                  leftTab === "cooperador" ? "opacity-100" : "opacity-40"
                }`}
                style={{ filter: leftTab === "cooperador" ? "invert(20%) sepia(96%) saturate(7471%) hue-rotate(356deg) brightness(95%) contrast(118%)" : undefined }}
              />
              <h2
                className={`text-xl font-bold transition-colors ${
                  leftTab === "cooperador" ? "text-destructive" : "text-destructive/40"
                }`}
              >
                TIPO DE COOPERADOR
              </h2>
            </div>
          </div>

          {leftTab === "usuario" ? (
            <div className="space-y-6">
              {tiposUsuario.map((tipo) => {
                const isSelected = data.tipoUsuario === tipo.id;
                return (
                  <div
                    key={tipo.id}
                    className={`flex items-start gap-4 cursor-pointer p-3 rounded-lg transition-colors ${
                      isSelected ? "bg-[#2035F2]/10" : ""
                    }`}
                    onClick={() => {
                      updateData({ tipoUsuario: tipo.id });
                      setRightTab("cadastro");
                    }}
                  >
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                      <img src={tipo.icon} alt={tipo.label} className="w-12 h-12 object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => {
                            updateData({ tipoUsuario: tipo.id });
                            setRightTab("cadastro");
                          }}
                        />
                        <span className="font-semibold text-foreground">{tipo.label}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{tipo.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {tiposCooperador.map((tipo) => {
                const isSelected = data.tipoUsuario === tipo.id;
                return (
                  <div
                    key={tipo.id}
                    className={`flex items-start gap-4 cursor-pointer p-3 rounded-lg transition-colors ${
                      isSelected ? "bg-[#2035F2]/10" : ""
                    }`}
                    onClick={() => {
                      updateData({ tipoUsuario: tipo.id });
                      setRightTab("login");
                    }}
                  >
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                      <img src={tipo.icon} alt={tipo.label} className="w-12 h-12 object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => {
                            updateData({ tipoUsuario: tipo.id });
                            setRightTab("login");
                          }}
                        />
                        <span className="font-semibold text-destructive">{tipo.label.split(" – ")[0]}</span>
                        {tipo.label.includes(" – ") && (
                          <span className="text-muted-foreground text-sm">– {tipo.label.split(" – ")[1]}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{tipo.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side */}
        <div>
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-8">
            <h2
              className={`text-2xl font-bold cursor-pointer transition-colors ${
                rightTab === "cadastro" ? "text-foreground" : "text-muted-foreground/50"
              }`}
              onClick={() => setRightTab("cadastro")}
            >
              CADASTRE-SE
            </h2>
            <span className="text-muted-foreground">–</span>
            <h2
              className={`text-xl font-bold cursor-pointer transition-colors ${
                rightTab === "login" ? "text-destructive" : "text-destructive/40"
              }`}
              onClick={() => setRightTab("login")}
            >
              ÁREA DE LOGIN
            </h2>
          </div>

          {rightTab === "cadastro" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground">
                  Endereço de e-mail <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={data.titular.email}
                  onChange={(e) => updateData({ titular: { ...data.titular, email: e.target.value } })}
                  className="mt-2 border-2"
                />
              </div>

              {/* Info Tabs */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <h3
                    className={`font-semibold cursor-pointer transition-colors ${
                      infoTab === "usuario" ? "text-foreground" : "text-muted-foreground/50"
                    }`}
                    onClick={() => setInfoTab("usuario")}
                  >
                    Informações para o Usuário
                  </h3>
                  <span className="text-muted-foreground">–</span>
                  <h3
                    className={`font-semibold cursor-pointer transition-colors text-sm ${
                      infoTab === "cooperador" ? "text-destructive" : "text-destructive/40"
                    }`}
                    onClick={() => setInfoTab("cooperador")}
                  >
                    Informações para o Cooperador
                  </h3>
                </div>

                {infoTab === "usuario" ? (
                  <>
                    {textoUsuario.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm mb-3 last:mb-0">
                        {paragraph.includes('política de privacidade') ? (
                          <>
                            {paragraph.split('política de privacidade')[0]}
                            <a
                              href="/politica-de-privacidade"
                              className="underline font-medium"
                              style={{ color: '#0A20E7' }}
                            >
                              política de privacidade
                            </a>
                            {paragraph.split('política de privacidade')[1]}
                          </>
                        ) : paragraph}
                      </p>
                    ))}
                  </>
                ) : (
                  <>
                    {textoCooperador.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm mb-3 last:mb-0">
                        {paragraph.includes('Termos e Condições do Cooperador') ? (
                          <>
                            {paragraph.split('Termos e Condições do Cooperador')[0]}
                            <a
                              href="/termos-cooperador"
                              className="underline font-semibold"
                              style={{ color: '#0A20E7' }}
                            >
                              Termos e Condições do Cooperador
                            </a>
                            {paragraph.split('Termos e Condições do Cooperador')[1]}
                          </>
                        ) : paragraph}
                      </p>
                    ))}
                  </>
                )}
              </div>

              <Button
                onClick={onNext}
                disabled={!canProceedCadastro}
                className="w-full font-semibold text-white"
                style={{ backgroundColor: '#2035F2' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F22C7'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2035F2'}
              >
                CADASTRE-SE
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="login-email" className="text-foreground">
                  Endereço de e-mail <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="mt-2 border-2"
                  placeholder=""
                />
              </div>
              <div>
                <Label htmlFor="login-user" className="text-foreground">
                  Informe o login de acesso
                </Label>
                <Input
                  id="login-user"
                  type="text"
                  value={loginData.login}
                  onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
                  className="mt-2 border-2"
                  placeholder="Informe o login de acesso"
                />
              </div>
              <div>
                <Label htmlFor="login-senha" className="text-foreground">
                  Senha
                </Label>
                <Input
                  id="login-senha"
                  type="password"
                  value={loginData.senha}
                  onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                  className="mt-2 border-2"
                  placeholder="Informe a senha para acessar o sistema"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setRightTab("cadastro")}
                  className="flex-1 font-semibold text-white"
                  style={{ backgroundColor: '#2035F2' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F22C7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2035F2'}
                >
                  CADASTRE-SE
                </Button>
                <Button
                  onClick={handleEntrar}
                  disabled={!isCooperadorSelected || (!loginData.login && !loginData.email) || !loginData.senha || isEntering}
                  className="flex-1 font-semibold text-white"
                  style={{ backgroundColor: '#2035F2' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F22C7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2035F2'}
                >
                  {isEntering ? "Entrando..." : "ENTRAR"}
                </Button>
              </div>

              {/* Info Tabs */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <h3
                    className={`font-semibold cursor-pointer transition-colors ${
                      infoTab === "usuario" ? "text-foreground" : "text-muted-foreground/50"
                    }`}
                    onClick={() => setInfoTab("usuario")}
                  >
                    Informações para o Usuário
                  </h3>
                  <span className="text-muted-foreground">–</span>
                  <h3
                    className={`font-semibold cursor-pointer transition-colors text-sm ${
                      infoTab === "cooperador" ? "text-destructive" : "text-destructive/40"
                    }`}
                    onClick={() => setInfoTab("cooperador")}
                  >
                    Informações para o Cooperador
                  </h3>
                </div>

                {infoTab === "usuario" ? (
                  <>
                    {textoUsuario.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm mb-3 last:mb-0">
                        {paragraph.includes('política de privacidade') ? (
                          <>
                            {paragraph.split('política de privacidade')[0]}
                            <a
                              href="/politica-de-privacidade"
                              className="underline font-medium"
                              style={{ color: '#0A20E7' }}
                            >
                              política de privacidade
                            </a>
                            {paragraph.split('política de privacidade')[1]}
                          </>
                        ) : paragraph}
                      </p>
                    ))}
                  </>
                ) : (
                  <>
                    {textoCooperador.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm mb-3 last:mb-0">
                        {paragraph.includes('Termos e Condições do Cooperador') ? (
                          <>
                            {paragraph.split('Termos e Condições do Cooperador')[0]}
                            <a
                              href="/termos-cooperador"
                              className="underline font-semibold"
                              style={{ color: '#0A20E7' }}
                            >
                              Termos e Condições do Cooperador
                            </a>
                            {paragraph.split('Termos e Condições do Cooperador')[1]}
                          </>
                        ) : paragraph}
                      </p>
                    ))}
                  </>
                )}
              </div>

              <Button
                onClick={handleEntrar}
                disabled={!isCooperadorSelected || (!loginData.login && !loginData.email) || !loginData.senha || isEntering}
                className="w-full font-semibold text-white"
                style={{ backgroundColor: '#2035F2' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F22C7'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2035F2'}
              >
                {isEntering ? "Entrando..." : "ENTRAR"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepTipoUsuario;
