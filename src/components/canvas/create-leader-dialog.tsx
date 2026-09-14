"use client";

import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Cloud,
  Code2,
  CreditCard,
  Database,
  FileText,
  Flag,
  Folder,
  Headphones,
  HeartHandshake,
  Image,
  LayoutGrid,
  Lightbulb,
  LineChart,
  LockKeyhole,
  Mail,
  Megaphone,
  MessageCircle,
  Mic,
  Palette,
  PenLine,
  Phone,
  PieChart,
  Plus,
  Receipt,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Target,
  UserPlus,
  UserRound,
  Users,
  Video,
  WalletCards,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import type { CapabilityPreference, Seniority } from "./agent-data";

type CreateLeaderDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (leader: { name: string; role: string; icon: LucideIcon; capabilities: CapabilityPreference[] }) => void;
};

const levels: Seniority[] = ["Júnior", "Pleno", "Sênior", "Especialista"];
const iconOptions: Array<{ label: string; Icon: LucideIcon }> = [
  { label: "Bot", Icon: Bot },
  { label: "Mensagem", Icon: MessageCircle },
  { label: "Painel", Icon: LayoutGrid },
  { label: "Briefcase", Icon: Briefcase },
  { label: "Checklist", Icon: ClipboardList },
  { label: "Atendimento", Icon: Headphones },
  { label: "Relacionamento", Icon: HeartHandshake },
  { label: "Agenda", Icon: CalendarDays },
  { label: "Recibo", Icon: Receipt },
  { label: "Vendas", Icon: ShoppingCart },
  { label: "Pessoa", Icon: UserRound },
  { label: "Fluxo", Icon: Workflow },
  { label: "Ideias", Icon: Lightbulb },
  { label: "Marketing", Icon: Megaphone },
  { label: "Busca", Icon: Search },
  { label: "Escrita", Icon: PenLine },
  { label: "Design", Icon: Palette },
  { label: "Imagem", Icon: Image },
  { label: "Vídeo", Icon: Video },
  { label: "Câmera", Icon: Camera },
  { label: "Áudio", Icon: Mic },
  { label: "E-mail", Icon: Mail },
  { label: "Telefone", Icon: Phone },
  { label: "Documento", Icon: FileText },
  { label: "Pasta", Icon: Folder },
  { label: "Barras", Icon: BarChart3 },
  { label: "Tendência", Icon: LineChart },
  { label: "Distribuição", Icon: PieChart },
  { label: "Meta", Icon: Target },
  { label: "Lançamento", Icon: Rocket },
  { label: "Prioridade", Icon: Flag },
  { label: "Concluído", Icon: CheckCircle2 },
  { label: "Ajuda", Icon: CircleHelp },
  { label: "Configurações", Icon: Settings2 },
  { label: "Equipe", Icon: Users },
  { label: "Adicionar pessoa", Icon: UserPlus },
  { label: "Empresa", Icon: Building2 },
  { label: "Loja", Icon: Store },
  { label: "Carteira", Icon: WalletCards },
  { label: "Cartão", Icon: CreditCard },
  { label: "Código", Icon: Code2 },
  { label: "Dados", Icon: Database },
  { label: "Nuvem", Icon: Cloud },
  { label: "Privacidade", Icon: LockKeyhole },
  { label: "Segurança", Icon: ShieldCheck },
  { label: "Inspiração", Icon: Sparkles },
  { label: "Energia", Icon: Zap },
  { label: "Inteligência", Icon: Brain },
  { label: "Aprendizado", Icon: BookOpen },
];

export function CreateLeaderDialog({ open, onClose, onCreate }: CreateLeaderDialogProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [icon, setIcon] = useState<LucideIcon>(Bot);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [capability, setCapability] = useState("");
  const [seniority, setSeniority] = useState<Seniority>("Pleno");
  const [capabilities, setCapabilities] = useState<CapabilityPreference[]>([]);
  if (!open) return null;
  const addCapability = () => {
    const label = capability.trim();
    if (!label || capabilities.some((item) => item.capability.toLowerCase() === label.toLowerCase())) return;
    setCapabilities((current) => [...current, { capability: label, seniority }]);
    setCapability("");
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !role.trim()) return;
    onCreate({ name: name.trim(), role: role.trim(), icon, capabilities });
    setName("");
    setRole("");
    setIcon(Bot);
    setIconPickerOpen(false);
    setCapability("");
    setCapabilities([]);
  };
  const SelectedIcon = icon;
  return <div className="leader-dialog-backdrop" role="presentation" onMouseDown={onClose}>
    <form className="leader-dialog" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()} aria-label="Criar líder">
      <button type="button" className="close-panel" onClick={onClose} aria-label="Fechar criação"><X size={19} /></button>
      <p className="eyebrow">NOVO LÍDER</p>
      <h2>Monte seu agente</h2>
      <p>Defina o líder e as capacidades de apoio personalizadas que ele poderá acionar.</p>
      <label>Nome do líder<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Clara Comercial" /></label>
      <label>Função<input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Ex.: Vendas" /></label>
      <fieldset className="leader-icon-field">
        <legend>Ícone do líder</legend>
        <button type="button" className="leader-icon-trigger" onClick={() => setIconPickerOpen(true)} aria-haspopup="dialog" aria-label="Escolher ícone do líder" title="Escolher ícone do líder"><SelectedIcon size={28} strokeWidth={1.5} /></button>
      </fieldset>
      <div className="leader-capability-form">
        <label>Agente de apoio<input value={capability} onChange={(event) => setCapability(event.target.value)} placeholder="Ex.: Qualificação" /></label>
        <label>Nível<select value={seniority} onChange={(event) => setSeniority(event.target.value as Seniority)}>{levels.map((level) => <option key={level}>{level}</option>)}</select></label>
        <button type="button" className="secondary-button" onClick={addCapability}><Plus size={15} /> Adicionar</button>
      </div>
      {capabilities.length > 0 && <div className="leader-capabilities">{capabilities.map((item) => <span key={item.capability}>{item.capability}<small>{item.seniority}</small><button type="button" aria-label={`Remover ${item.capability}`} onClick={() => setCapabilities((current) => current.filter((candidate) => candidate.capability !== item.capability))}>×</button></span>)}</div>}
      <button className="primary-button full-width" type="submit">Criar líder</button>
      {iconPickerOpen && <div className="icon-picker-backdrop" role="dialog" aria-modal="true" aria-labelledby="icon-picker-title" onMouseDown={(event) => { if (event.currentTarget === event.target) setIconPickerOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape") setIconPickerOpen(false); }}>
        <div className="icon-picker-modal" onMouseDown={(event) => event.stopPropagation()}>
          <div className="icon-picker-header"><div><p className="eyebrow">ÍCONES LUCIDE</p><h3 id="icon-picker-title">Escolha um ícone</h3></div><button type="button" className="close-panel" onClick={() => setIconPickerOpen(false)} aria-label="Fechar seleção de ícone"><X size={18} /></button></div>
          <div className="leader-icon-picker" role="radiogroup" aria-label="Ícones disponíveis">{iconOptions.map(({ label, Icon }) => <button key={label} type="button" className={`leader-icon-option${icon === Icon ? " active" : ""}`} onClick={() => { setIcon(Icon); setIconPickerOpen(false); }} role="radio" aria-checked={icon === Icon} aria-label={`Ícone ${label}`} title={label}><Icon size={22} strokeWidth={1.5} /></button>)}</div>
        </div>
      </div>}
    </form>
  </div>;
}
