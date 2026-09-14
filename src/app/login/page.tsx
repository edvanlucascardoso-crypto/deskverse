"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, KeyRound, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const authFormSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(80, "Use no máximo 80 caracteres."),
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(8, "Use pelo menos 8 caracteres.").max(128, "Use no máximo 128 caracteres."),
});

type AuthForm = z.infer<typeof authFormSchema>;
type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ kind: "error" | "success"; message: string } | null>(null);
  const form = useForm<AuthForm>({ resolver: zodResolver(authFormSchema), defaultValues: { name: "", email: "", password: "" } });

  const getReturnTo = () => {
    const candidate = new URLSearchParams(window.location.search).get("returnTo");
    return candidate?.startsWith("/") ? candidate : "/workspace";
  };

  const submit = form.handleSubmit(async (values) => {
    setFeedback(null);
    const returnTo = getReturnTo();
    const result = mode === "signin"
      ? await authClient.signIn.email({ email: values.email, password: values.password, callbackURL: returnTo })
      : await authClient.signUp.email({ name: values.name, email: values.email, password: values.password, callbackURL: returnTo });
    if (result.error) {
      setFeedback({ kind: "error", message: result.error.message || "Não foi possível concluir a autenticação." });
      return;
    }
    setFeedback({ kind: "success", message: mode === "signin" ? "Sessão iniciada. Abrindo seu workspace…" : "Conta criada. Abrindo seu workspace…" });
    router.push(returnTo);
  });

  const demo = () => router.push("/workspace?demo=1");

  return <main className="auth-shell"><section className="auth-card" aria-labelledby="auth-title"><div className="auth-brand"><span className="drawer-brand-mark">D</span><span>deskverse</span></div><p className="eyebrow">WORKSPACE VISUAL</p><h1 id="auth-title">{mode === "signin" ? "Voltar ao seu espaço" : "Criar seu espaço"}</h1><p className="auth-intro">Acompanhe agentes, decisões e entregas em um canvas que mantém o contexto visível.</p><div className="auth-mode-tabs" role="tablist" aria-label="Modo de autenticação"><button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "active" : ""} onClick={() => { setMode("signin"); setFeedback(null); }}>Entrar</button><button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setFeedback(null); }}>Criar conta</button></div><form className="auth-form" onSubmit={submit} noValidate>{mode === "signup" && <label>Nome<input {...form.register("name")} placeholder="Como devemos chamar você?" autoComplete="name" aria-invalid={Boolean(form.formState.errors.name)} />{form.formState.errors.name && <small>{form.formState.errors.name.message}</small>}</label>}<label>E-mail<input {...form.register("email")} type="email" placeholder="voce@empresa.com" autoComplete="email" aria-invalid={Boolean(form.formState.errors.email)} />{form.formState.errors.email && <small>{form.formState.errors.email.message}</small>}</label><label>Senha<input {...form.register("password")} type="password" placeholder="Pelo menos 8 caracteres" autoComplete={mode === "signin" ? "current-password" : "new-password"} aria-invalid={Boolean(form.formState.errors.password)} />{form.formState.errors.password && <small>{form.formState.errors.password.message}</small>}</label><button className="primary-button auth-submit" type="submit" disabled={form.formState.isSubmitting}><KeyRound size={17} />{form.formState.isSubmitting ? "Verificando…" : mode === "signin" ? "Entrar no Deskverse" : "Criar conta"}<ArrowRight size={16} /></button></form>{feedback && <p className={`form-feedback ${feedback.kind}`} role="status">{feedback.kind === "success" ? <CheckCircle2 size={16} /> : <UserRound size={16} />}{feedback.message}</p>}<div className="auth-divider"><span>ou</span></div><button className="secondary-button auth-demo-button" type="button" onClick={demo}>Explorar demonstração local</button><p className="auth-footnote">A demonstração não envia dados e serve para conhecer o canvas e o fluxo de escritório.</p></section></main>;
}
