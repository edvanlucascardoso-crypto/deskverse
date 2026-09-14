"use client";

import { ArrowLeft, CheckCircle2, LogOut, ServerCog, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Health = { status: "ready" | "partial" | "local"; services: Array<{ id: string; label: string; configured: boolean; owner: string }>; checkedAt: string };

export function SettingsPage() {
  const session = authClient.useSession();
  const router = useRouter();
  const [health, setHealth] = useState<Health | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/health").then(async (response) => response.ok ? response.json() as Promise<Health> : null).then((value) => { if (!cancelled) setHealth(value); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  const signOut = async () => {
    setFeedback("Encerrando sessão…");
    const result = await authClient.signOut();
    if (result.error) { setFeedback(result.error.message || "Não foi possível encerrar a sessão."); return; }
    router.push("/login");
  };

  return <main className="platform-page"><header className="platform-page-header"><Link className="icon-button" href="/workspace" aria-label="Voltar ao canvas" title="Voltar ao canvas"><ArrowLeft size={18} /></Link><div><p className="eyebrow">CONTA E PLATAFORMA</p><h1>Configurações</h1></div><button className="icon-button" type="button" onClick={signOut} aria-label="Encerrar sessão" title="Encerrar sessão"><LogOut size={17} /></button></header><div className="platform-page-grid"><section className="platform-card"><div className="platform-card-heading"><span className="platform-icon"><UserRound size={18} /></span><div><p className="eyebrow">IDENTIDADE</p><h2>Sua conta</h2></div></div>{session.isPending ? <div className="platform-state loading">Carregando sessão…</div> : session.data?.user ? <div className="identity-row"><div className="avatar-button">{session.data.user.name.slice(0, 2).toUpperCase()}</div><div><strong>{session.data.user.name}</strong><span>{session.data.user.email}</span></div></div> : <div className="platform-state empty">Nenhuma sessão autenticada. Você ainda pode explorar a demonstração local.</div>}{feedback && <p className="form-feedback" role="status">{feedback}</p>}</section><section className="platform-card"><div className="platform-card-heading"><span className="platform-icon"><ServerCog size={18} /></span><div><p className="eyebrow">SERVIÇOS</p><h2>Estado da plataforma</h2></div></div>{health ? <><div className={`health-summary ${health.status}`}><span className="status-dot" />{health.status === "ready" ? "Tudo conectado" : health.status === "partial" ? "Alguns serviços aguardam configuração" : "Modo local ativo"}</div><ul className="service-list">{health.services.map((service) => <li key={service.id}><span><strong>{service.label}</strong><small>{service.owner}</small></span><span className={service.configured ? "service-ready" : "service-pending"}>{service.configured ? <CheckCircle2 size={15} /> : "Pendente"}</span></li>)}</ul></> : <div className="platform-state loading">Verificando serviços…</div>}</section></div></main>;
}
