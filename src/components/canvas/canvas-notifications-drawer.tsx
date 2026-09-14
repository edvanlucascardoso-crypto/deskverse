import { Bell } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { Activity } from "./agent-data";

type CanvasNotificationsDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activities: Activity[];
  notice: string;
  onOpenActivity: (activity: Activity) => void;
};

export function CanvasNotificationsDrawer({ open, setOpen, activities, notice, onOpenActivity }: CanvasNotificationsDrawerProps) {
  return <Drawer open={open} onOpenChange={setOpen}><DrawerContent scrollable className="notifications-drawer"><DrawerHeader><DrawerDescription><Bell size={14} /> Central de notificações</DrawerDescription><DrawerTitle>Notificações</DrawerTitle></DrawerHeader><div className="drawer-workspace-context"><p className="eyebrow">ATUALIZAÇÕES DO ESPAÇO</p><h2>Atividade recente</h2><p>Acompanhe as ações e abra o contexto de cada atualização.</p></div><div className="sheet-section activity-sheet-section"><div className="activity-item"><i style={{ background: "var(--primary)" }} /><p>{notice}<small>agora · Dados locais</small></p></div>{activities.map((activity) => <button className="activity-item activity-action" key={activity.id} type="button" onClick={() => onOpenActivity(activity)}><i style={{ background: activity.tone }} /><p>{activity.text}<small>{activity.time} · {activity.origin}</small><em>{activity.impact} · {activity.relatedLabel}</em></p></button>)}</div></DrawerContent></Drawer>;
}
