"use client";

import { Activity, Bell, Menu, MessageCircle, Plus, Search, WandSparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { Agent } from "./agent-data";

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function matchesSearch(value: string, query: string) {
  const valueTerms = normalizeSearchText(value).split(" ").filter(Boolean);
  const queryTerms = query.split(" ").filter(Boolean);

  return queryTerms.every((queryTerm) => valueTerms.some((valueTerm) => valueTerm.startsWith(queryTerm)));
}

function searchScore(agent: Agent, query: string) {
  const normalizedName = normalizeSearchText(agent.name);
  if (normalizedName === query) return 0;
  if (normalizedName.startsWith(query)) return 1;
  if (normalizedName.split(" ").some((term) => term.startsWith(query))) return 2;
  if (normalizeSearchText(agent.role).split(" ").some((term) => term.startsWith(query))) return 3;
  return 4;
}

type CanvasNavbarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  workspaceName: string;
  agents: Agent[];
  onSelectAgent: (id: string) => void;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onOpenConversations: () => void;
  onAddLeader: () => void;
  onOpenAnimationTests: () => void;
  onOpenOfficeControls: () => void;
  notificationActive: boolean;
};

export function CanvasNavbar({ query, onQueryChange, workspaceName, agents, onSelectAgent, onOpenMenu, onOpenNotifications, onOpenConversations, onAddLeader, onOpenAnimationTests, onOpenOfficeControls, notificationActive }: CanvasNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const normalizedQuery = normalizeSearchText(query);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return agents;
    return agents
      .filter((agent) => [agent.name, agent.role, agent.detail].some((field) => matchesSearch(field, normalizedQuery)))
      .sort((first, second) => searchScore(first, normalizedQuery) - searchScore(second, normalizedQuery));
  }, [agents, normalizedQuery]);

  useEffect(() => {
    resultsRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [normalizedQuery]);

  return <nav className="canvas-navbar" aria-label="Ações do canvas"><button className="mobile-menu-trigger icon-button" onClick={onOpenMenu} aria-label="Abrir menu" title="Abrir menu"><Menu size={20} /></button><div className="canvas-navbar-brand" aria-label={`Deskverse · ${workspaceName}`}><span className="drawer-brand-mark">D</span><span><strong>deskverse</strong><small>{workspaceName}</small></span></div><div className="canvas-navbar-actions"><button className={"canvas-icon-button notification-button" + (notificationActive ? " is-notifying" : "")} onClick={onOpenNotifications} aria-label="Abrir notificações" title="Abrir notificações"><Bell size={17} /><i /></button><button className="canvas-icon-button" onClick={onOpenConversations} aria-label="Abrir conversas" title="Abrir conversas"><MessageCircle size={17} /></button><button className="canvas-icon-button" onClick={onOpenOfficeControls} aria-label="Acompanhar pedidos" title="Acompanhar pedidos"><Activity size={17} /></button><button className="canvas-icon-button" onClick={() => setSearchOpen(true)} aria-label="Buscar agentes" title="Buscar agentes" aria-expanded={searchOpen}><Search size={17} /></button><button className="canvas-icon-button" onClick={onAddLeader} aria-label="Adicionar líder" title="Adicionar líder"><Plus size={18} /></button><button className="canvas-communication-button" onClick={onOpenAnimationTests} aria-label="Testar animações" title="Testar animações"><WandSparkles size={17} /></button></div><Drawer open={searchOpen} onOpenChange={setSearchOpen}><DrawerContent scrollable className="agent-search-drawer"><DrawerHeader><DrawerDescription><Search size={14} /> Busca de agentes</DrawerDescription><DrawerTitle>Buscar agentes</DrawerTitle></DrawerHeader><div className="agent-search-field"><Search size={18} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Nome, função ou atividade" aria-label="Buscar agentes por nome, função ou atividade" /></div><div ref={resultsRef} className="agent-search-results" role="listbox" aria-label="Agentes encontrados">{searchResults.length ? searchResults.map((agent) => { const Icon = agent.icon; return <button key={agent.id} type="button" className="agent-search-result" onClick={() => { onSelectAgent(agent.id); setSearchOpen(false); }}><span className="agent-search-result-icon" style={{ color: agent.color }}><Icon size={19} strokeWidth={1.5} /></span><span><strong>{agent.name}</strong><small>{agent.role}</small></span></button>; }) : <p className="agent-search-empty">Nenhum agente encontrado.</p>}</div></DrawerContent></Drawer></nav>;
}
