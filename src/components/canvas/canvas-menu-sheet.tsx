import { LayoutGrid, Moon, Settings2, Sun, UsersRound } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { SessionMenu } from "@/components/platform/session-menu";
import type { CanvasState } from "./agent-data";

type CanvasMenuSheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  view: "all" | "active" | "available";
  setView: (view: "all" | "active" | "available") => void;
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  workspaceName: string;
  onOpenPlatform: () => void;
};

export function CanvasMenuSheet({ open, setOpen, view, setView, canvasState, setCanvasState, theme, setTheme, workspaceName, onOpenPlatform }: CanvasMenuSheetProps) {
  return <Drawer open={open} onOpenChange={setOpen}><DrawerContent scrollable className="menu-sheet"><DrawerHeader><DrawerDescription><span className="drawer-brand-mark">D</span><span>deskverse · {workspaceName}</span></DrawerDescription><DrawerTitle>Menu do canvas</DrawerTitle></DrawerHeader><div className="drawer-workspace-context"><p className="eyebrow">ESPAÇO · {workspaceName.toUpperCase()}</p><h2>Canvas de agentes</h2><p>Líderes coordenam objetivos e acionam capacidades de apoio conforme a tarefa.</p></div><div className="drawer-mobile-controls"><div className="drawer-account-actions"><button className="theme-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Alternar tema" title="Alternar tema">{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button><SessionMenu /></div></div><nav className="sheet-nav"><a className="sheet-nav-item active" href="#canvas" onClick={() => setOpen(false)}><LayoutGrid size={18} /> Canvas</a><button className="sheet-nav-item" type="button" onClick={() => { setOpen(false); onOpenPlatform(); }}><UsersRound size={18} /> Espaços e pessoas</button><a className="sheet-nav-item" href="/settings" onClick={() => setOpen(false)}><Settings2 size={18} /> Configurações</a></nav><div className="sheet-section"><p className="eyebrow">VISUALIZAÇÃO</p><div className="sheet-tabs"><button className={view === "all" ? "active" : ""} onClick={() => setView("all")}>Todos</button><button className={view === "active" ? "active" : ""} onClick={() => setView("active")}>Em atividade</button><button className={view === "available" ? "active" : ""} onClick={() => setView("available")}>Disponíveis</button></div></div><div className="sheet-section"><p className="eyebrow">ESTADOS DE FIXTURE</p><div className="sheet-tabs"><button className={canvasState === "success" ? "active" : ""} onClick={() => setCanvasState("success")}>Ativo</button><button className={canvasState === "loading" ? "active" : ""} onClick={() => setCanvasState("loading")}>Carregando</button><button className={canvasState === "empty" ? "active" : ""} onClick={() => setCanvasState("empty")}>Vazio</button><button className={canvasState === "error" ? "active" : ""} onClick={() => setCanvasState("error")}>Falha</button></div></div></DrawerContent></Drawer>;
}
