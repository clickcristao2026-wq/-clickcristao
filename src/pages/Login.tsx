import { FormEvent, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import headerBg from "@/assets/header-bg.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_HOME_ROUTE } from "@/types/auth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(identifier, senha);

    setIsSubmitting(false);

    if (!result.ok || !result.user) {
      setError(result.error ?? "Não foi possível entrar.");
      return;
    }

    navigate(from ?? ROLE_HOME_ROUTE[result.user.role], { replace: true });
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div
        className="w-full py-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${headerBg})` }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground italic">
            Click Cristão <span className="text-2xl not-italic font-normal text-primary-foreground/70">– Área de Login</span>
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            Home / <span className="font-medium">Login</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground text-center mb-2">Entrar na minha conta</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="identifier">E-mail ou nome de usuário</Label>
                  <Input
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="mt-2"
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Informe sua senha"
                    className="mt-2"
                    autoComplete="current-password"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive font-medium">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || !identifier || !senha}
                  className="w-full font-semibold text-white"
                  style={{ backgroundColor: "#2035F2" }}
                >
                  {isSubmitting ? "Entrando..." : "ENTRAR"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground pt-2">
                Ainda não tem conta?{" "}
                <Link to="/cadastro" className="font-medium underline" style={{ color: "#0A20E7" }}>
                  Cadastre-se
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">Ainda não tem uma conta admin?</h3>
              <p className="text-xs text-muted-foreground">
                Contas administrativas (acesso a todos os painéis internos) são criadas por outro admin em{" "}
                <span className="font-mono">RH → Cadastro de Cooperador</span>. A primeira conta admin precisa ser
                promovida direto no banco — veja a coluna <span className="font-mono">role</span> na tabela{" "}
                <span className="font-mono">profiles</span> no Supabase.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
