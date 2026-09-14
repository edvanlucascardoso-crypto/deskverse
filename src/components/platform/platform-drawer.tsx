"use client";

import { Building2, Check, ChevronRight, CircleUserRound, Plus, ShieldCheck, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { can, denyReason, type WorkspaceRole } from "@/lib/permissions/rbac";
import { addWorkspaceMemberInputSchema, createWorkspaceInputSchema, type AddWorkspaceMemberInput, type CreateWorkspaceInput } from "@/features/workspace/workspace-contracts";

type WorkspaceOption = { id: string; name: string; organizationName: string; memberCount: number; role: WorkspaceRole; updatedAt?: string };
type Member = { id: string; userId: string; name: string; email: string; role: WorkspaceRole };

const demoWorkspaces: WorkspaceOption[] = [{ id: "workspace-demo", name: "Estúdio Aurora", organizationName: "Estúdio Aurora", memberCount: 3, role: "OWNER", updatedAt: "agora" }];
const demoMembers: Member[] = [{ id: "member-demo-you", userId: "current-user", name: "Você", email: "demonstração local", role: "OWNER" }, { id: "member-demo-marina", userId: "social", name: "Marina Social", email: "Agente de mídias sociais", role: "MEMBER" }];

type PlatformDrawerProps = { open: boolean; setOpen: (open: boolean) => void; activeWorkspaceId: string; onWorkspaceChange: (workspaceId: string) => void; role: WorkspaceRole; workspaceName: string };

async function readResponse(response: Response) {
  return response.json().catch(() => ({})) as Promise<{ message?: string; workspaces?: WorkspaceOption[]; members?: Member[]; member?: Member; workspace?: WorkspaceOption }>;
}

export function PlatformDrawer({ open, setOpen, activeWorkspaceId, onWorkspaceChange, role, workspaceName }: PlatformDrawerProps) {
  const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>(demoWorkspaces);
  const [members, setMembers] = useState<Member[]>(demoMembers);
  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const createForm = useForm<CreateWorkspaceInput>({ resolver: zodResolver(createWorkspaceInputSchema), defaultValues: { name: "" } });
  const memberForm = useForm<AddWorkspaceMemberInput>({ resolver: zodResolver(addWorkspaceMemberInputSchema), defaultValues: { email: "", role: "MEMBER" } });
  const currentWorkspace = useMemo(() => workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0], [activeWorkspaceId, workspaces]);
  const canManageMembers = can(role, "member:manage");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void Promise.resolve().then(() => { if (!cancelled) { setLoading(true); setError(null); } return fetch("/api/workspaces"); }).then(async (response) => {
      const body = await readResponse(response);
      if (cancelled) return;
      if (response.ok && body.workspaces?.length) { setWorkspaces(body.workspaces); onWorkspaceChange(body.workspaces[0].id); setFeedback("Workspaces sincronizados"); }
      else if (response.status !== 401) setError(body.message ?? "Não foi possível carregar os workspaces.");
      else setFeedback("Modo demonstração local: alterações ficam neste dispositivo.");
    }).catch(() => { if (!cancelled) { setError("A conexão falhou; o último workspace continua disponível."); setWorkspaces((current) => current.length ? current : demoWorkspaces); } }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [onWorkspaceChange, open]);

  useEffect(() => {
    if (!open || !currentWorkspace) return;
    let cancelled = false;
    void Promise.resolve().then(() => { if (!cancelled) setMembersLoading(true); return fetch(`/api/workspaces/${currentWorkspace.id}/members`); }).then(async (response) => {
      const body = await readResponse(response);
      if (cancelled) return;
      if (response.ok && body.members) setMembers(body.members);
      else if (response.status !== 401) setError(body.message ?? "Não foi possível carregar as pessoas.");
    }).catch(() => undefined).finally(() => { if (!cancelled) setMembersLoading(false); });
    return () => { cancelled = true; };
  }, [currentWorkspace, open]);

  const create = createForm.handleSubmit(async (values) => {
    setFeedback(null);
    const response = await fetch("/api/workspaces", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const body = await readResponse(response);
    if (response.ok && body.workspace) {
      setWorkspaces((current) => [...current, body.workspace as WorkspaceOption]);
      onWorkspaceChange((body.workspace as WorkspaceOption).id);
      createForm.reset();
      setShowCreate(false);
      setFeedback("Workspace criado e selecionado.");
      return;
    }
    if (response.status === 401 && activeWorkspaceId === "workspace-demo") {
      const demo = { id: `workspace-local-${workspaces.length + 1}`, name: values.name, organizationName: "Organização local", memberCount: 1, role: "OWNER" as const, updatedAt: "agora" };
      setWorkspaces((current) => [...current, demo]);
      onWorkspaceChange(demo.id);
      createForm.reset();
      setShowCreate(false);
      setFeedback("Workspace local criado neste dispositivo.");
      return;
    }
    setFeedback(body.message ?? "Não foi possível criar o workspace.");
  });

  const addMember = memberForm.handleSubmit(async (values) => {
    setFeedback(null);
    const response = await fetch(`/api/workspaces/${currentWorkspace?.id ?? activeWorkspaceId}/members`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const body = await readResponse(response);
    if (response.ok && body.member) {
      setMembers((current) => [...current, body.member as Member]);
      memberForm.reset({ email: "", role: "MEMBER" });
      setShowMemberForm(false);
      setFeedback("Pessoa adicionada e evento auditado.");
      return;
    }
    if (response.status === 401 && activeWorkspaceId === "workspace-demo") {
      const localMember = { id: `member-local-${members.length + 1}`, userId: `local-${members.length + 1}`, name: values.email.split("@")[0] || "Novo integrante", email: values.email, role: values.role };
      setMembers((current) => [...current, localMember]);
      memberForm.reset({ email: "", role: "MEMBER" });
      setShowMemberForm(false);
      setFeedback("Pessoa adicionada no modo local.");
      return;
    }
    setFeedback(body.message ?? "Não foi possível adicionar essa pessoa.");
  });

  return <Drawer open={open} onOpenChange={setOpen}><DrawerContent scrollable className="platform-drawer"><DrawerHeader><DrawerDescription><Building2 size={14} /> Conta · plataforma</DrawerDescription><DrawerTitle>Espaços e pessoas</DrawerTitle></DrawerHeader><div className="platform-drawer-intro"><p>Escolha o workspace que alimenta o canvas e confira quem pode acompanhar o trabalho.</p><span className="role-pill"><ShieldCheck size={14} /> Seu papel: {role}</span></div>{loading && <div className="platform-state loading">Carregando workspaces…</div>}{error && <div className="platform-state error" role="alert">{error}<button className="text-button" type="button" onClick={() => setError(null)}>Continuar com o último estado</button></div>}<section className="platform-drawer-section"><div className="platform-section-heading"><div><p className="eyebrow">WORKSPACES</p><h2>{currentWorkspace?.name ?? workspaceName}</h2></div><button className="secondary-button compact-button" type="button" onClick={() => setShowCreate((current) => !current)}><Plus size={15} /> Novo</button></div>{showCreate && <form className="platform-inline-form" onSubmit={create}><label>Nome do workspace<input {...createForm.register("name")} placeholder="Ex.: Operação de conteúdo" aria-invalid={Boolean(createForm.formState.errors.name)} />{createForm.formState.errors.name && <small>{createForm.formState.errors.name.message}</small>}</label><div className="inline-actions"><button className="secondary-button" type="button" onClick={() => setShowCreate(false)}>Cancelar</button><button className="primary-button" type="submit" disabled={createForm.formState.isSubmitting}>{createForm.formState.isSubmitting ? "Criando…" : "Criar workspace"}</button></div></form>}<div className="workspace-option-list">{workspaces.length ? workspaces.map((workspace) => <button key={workspace.id} type="button" className={`workspace-option ${workspace.id === activeWorkspaceId ? "active" : ""}`} onClick={() => onWorkspaceChange(workspace.id)}><span className="platform-icon"><Building2 size={17} /></span><span><strong>{workspace.name}</strong><small>{workspace.organizationName} · {workspace.memberCount} {workspace.memberCount === 1 ? "pessoa" : "pessoas"}</small></span>{workspace.id === activeWorkspaceId ? <Check size={16} /> : <ChevronRight size={16} />}</button>) : <div className="platform-state empty">Nenhum workspace disponível.</div>}</div></section><section className="platform-drawer-section"><div className="platform-section-heading"><div><p className="eyebrow">INTEGRANTES</p><h2><UsersRound size={17} /> {members.length} pessoas</h2></div><button className="secondary-button compact-button" type="button" onClick={() => setShowMemberForm((current) => !current)} disabled={!canManageMembers} title={denyReason(role, "member:manage") ?? "Adicionar pessoa"}><Plus size={15} /> Adicionar</button></div>{!canManageMembers && <p className="permission-note"><ShieldCheck size={15} /> {denyReason(role, "member:manage")}</p>}{showMemberForm && canManageMembers && <form className="platform-inline-form" onSubmit={addMember}><label>E-mail da pessoa<input {...memberForm.register("email")} type="email" placeholder="colega@empresa.com" aria-invalid={Boolean(memberForm.formState.errors.email)} />{memberForm.formState.errors.email && <small>{memberForm.formState.errors.email.message}</small>}</label><label>Papel<select {...memberForm.register("role")}><option value="MEMBER">Membro</option><option value="ADMIN">Admin</option><option value="VIEWER">Leitor</option></select></label><div className="inline-actions"><button className="secondary-button" type="button" onClick={() => setShowMemberForm(false)}>Cancelar</button><button className="primary-button" type="submit" disabled={memberForm.formState.isSubmitting}>{memberForm.formState.isSubmitting ? "Adicionando…" : "Adicionar pessoa"}</button></div></form>}{membersLoading ? <div className="platform-state loading">Carregando integrantes…</div> : <div className="member-list">{members.map((member) => <div className="member-row" key={member.id}><span className="member-avatar"><CircleUserRound size={16} /></span><span><strong>{member.name}</strong><small>{member.email}</small></span><span className="member-role">{member.role}</span></div>)}</div>}</section>{feedback && <p className="form-feedback" role="status">{feedback}</p>}<p className="platform-drawer-footnote">Permissões são avaliadas no servidor por workspace. Ações de alteração registram origem, estado e próximo passo.</p></DrawerContent></Drawer>;
}
