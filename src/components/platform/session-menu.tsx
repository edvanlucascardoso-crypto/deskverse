"use client";

import { LogIn, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "VC";
}

export function SessionMenu() {
  const session = authClient.useSession();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const user = session.data?.user;

  if (session.isPending) return <div className="session-menu session-menu-loading" aria-live="polite">Verificando sessão…</div>;

  if (!user) {
    return <div className="session-menu session-menu-empty"><div className="session-identity"><span className="session-avatar"><UserRound size={15} /></span><span><strong>Demonstração local</strong><small>Nenhuma sessão ativa</small></span></div><Link className="secondary-button compact-button" href="/login"><LogIn size={14} /> Entrar</Link></div>;
  }

  const signOut = async () => {
    setSigningOut(true);
    const result = await authClient.signOut();
    if (result.error) {
      setSigningOut(false);
      return;
    }
    router.push("/login");
  };

  return <div className="session-menu"><div className="session-identity"><span className="session-avatar">{initials(user.name)}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></div><button className="secondary-button compact-button session-logout" type="button" onClick={signOut} disabled={signingOut}><LogOut size={14} /> {signingOut ? "Saindo…" : "Sair"}</button></div>;
}
