"use client";

import { Check, ClipboardList, FileCheck2, Flag, ListFilter, Plus, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import type { Agent } from "@/components/canvas/agent-data";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { createOfficeRunResolver } from "@/zod/resolvers/office";
import { createOfficeRunInputSchema } from "@/zod/schemas/office";
import type { CreateOfficeRunInput } from "@/types/office";

type NewOfficeRunDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate: (input: CreateOfficeRunInput) => void;
  leaders: Agent[];
};

const parameterOptions = [
  { id: "audience", label: "Público prioritário", detail: "Quem precisa receber ou usar o resultado" },
  { id: "channel", label: "Canal de publicação", detail: "Onde o material será usado" },
  { id: "tone", label: "Tom da comunicação", detail: "Como a mensagem deve soar" },
  { id: "deadline", label: "Prazo ou janela", detail: "Quando o trabalho precisa estar pronto" },
  { id: "format", label: "Formato da entrega", detail: "Texto, plano, arquivo ou pacote" },
  { id: "reference", label: "Referências existentes", detail: "Materiais, links ou exemplos para consultar" },
  { id: "restriction", label: "Restrições importantes", detail: "O que deve ser evitado ou preservado" },
  { id: "priority", label: "Prioridade do pedido", detail: "O que não pode ficar para depois" },
] as const;

const completionOptions = [
  "Texto revisado e pronto para aprovação",
  "Plano com próximos passos claros",
  "Relatório com recomendações acionáveis",
  "Arquivo final disponível para consulta",
  "Pacote completo pronto para entrega",
] as const;

const defaultCompletion = completionOptions[0];
type CreateOfficeRunFormValues = z.input<typeof createOfficeRunInputSchema>;

export function NewOfficeRunDrawer({ open, setOpen, onCreate, leaders }: NewOfficeRunDrawerProps) {
  const leaderOptions = useMemo(() => leaders.filter((agent) => agent.kind === "leader"), [leaders]);
  const defaultLeader = leaderOptions.find((leader) => leader.id === "social") ?? leaderOptions[0];
  const defaults: CreateOfficeRunInput = { title: "", objective: "", leaderId: defaultLeader?.id ?? "social", leaderName: defaultLeader?.name ?? "Marina Social", parameters: "", delivery: defaultCompletion, notes: "" };
  const form = useForm<CreateOfficeRunFormValues, unknown, CreateOfficeRunInput>({ resolver: createOfficeRunResolver, defaultValues: defaults });
  const [selectedLeaderId, setSelectedLeaderId] = useState(defaults.leaderId);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [deliveryValue, setDeliveryValue] = useState<string>(defaultCompletion);
  const deliveryField = form.register("delivery");

  const resetForm = () => {
    form.reset(defaults);
    setSelectedLeaderId(defaults.leaderId);
    setSelectedParameters([]);
    setDeliveryValue(defaultCompletion);
  };

  const submit = form.handleSubmit((values) => {
    const selectedParameterLabels = parameterOptions.filter((option) => selectedParameters.includes(option.id)).map((option) => option.label);
    const parameters = [...selectedParameterLabels, values.parameters?.trim() ?? ""].filter(Boolean).join(" · ");
    const selectedLeader = leaderOptions.find((leader) => leader.id === selectedLeaderId);
    onCreate({ ...values, leaderId: selectedLeaderId, leaderName: selectedLeader?.name ?? values.leaderName, parameters, notes: values.notes ?? "" });
    resetForm();
    setOpen(false);
  });

  return <Drawer open={open} nested autoFocus={false} onOpenChange={(next) => { setOpen(next); if (!next) resetForm(); }}>
    <DrawerContent scrollable className="office-new-run-drawer">
      <DrawerHeader>
        <DrawerDescription><Plus size={14} /> Novo pedido</DrawerDescription>
        <DrawerTitle>O que precisa ser feito?</DrawerTitle>
      </DrawerHeader>

      <div className="office-new-run-intro">
        <p>Escolha quem lidera o trabalho, ajuste os parâmetros e confirme como você reconhecerá a conclusão.</p>
      </div>

      <form className="office-run-form" onSubmit={submit} noValidate>
        <input type="hidden" {...form.register("leaderId")} />
        <input type="hidden" {...form.register("leaderName")} />
        <label className="office-form-field" htmlFor="office-run-title"><span><ClipboardList size={15} /> Nome do pedido</span><input id="office-run-title" {...form.register("title")} placeholder="Ex.: Campanha de lançamento" aria-invalid={Boolean(form.formState.errors.title)} aria-describedby={form.formState.errors.title ? "office-run-title-error" : undefined} />{form.formState.errors.title && <small id="office-run-title-error">{form.formState.errors.title.message}</small>}</label>
        <fieldset className="office-choice-fieldset">
          <legend><UserRound size={15} /> Agente líder</legend>
          <p className="office-choice-hint">Esse agente acompanha o pedido e coordena as próximas etapas.</p>
          <div className="office-choice-list office-leader-list" role="radiogroup" aria-label="Agente líder do pedido">
            {leaderOptions.map((leader) => { const Icon = leader.icon; const selected = leader.id === selectedLeaderId; return <button key={leader.id} className={`office-choice${selected ? " active" : ""}`} type="button" role="radio" aria-checked={selected} onClick={() => { setSelectedLeaderId(leader.id); form.setValue("leaderId", leader.id, { shouldDirty: true, shouldValidate: true }); form.setValue("leaderName", leader.name, { shouldDirty: true }); }}>
              <span className="office-choice-icon" style={{ color: leader.color }}><Icon size={18} strokeWidth={1.5} /></span>
              <span className="office-choice-copy"><strong>{leader.name}</strong><small>{leader.role} · {leader.seniority}</small></span>
              {selected && <Check size={16} aria-hidden="true" />}
            </button>; })}
          </div>
          {form.formState.errors.leaderId && <small className="office-choice-error">{form.formState.errors.leaderId.message}</small>}
        </fieldset>
        <label className="office-form-field" htmlFor="office-run-objective"><span><Flag size={15} /> Objetivo</span><textarea id="office-run-objective" {...form.register("objective")} rows={4} placeholder="Ex.: Preparar uma publicação para apresentar o novo serviço aos clientes." aria-invalid={Boolean(form.formState.errors.objective)} aria-describedby={form.formState.errors.objective ? "office-run-objective-error" : undefined} />{form.formState.errors.objective && <small id="office-run-objective-error">{form.formState.errors.objective.message}</small>}</label>
        <fieldset className="office-choice-fieldset">
          <legend><ListFilter size={15} /> Parâmetros do pedido <em>opcional</em></legend>
          <p className="office-choice-hint">Selecione o que já está definido ou escreva os detalhes por extenso.</p>
          <div className="office-choice-list office-parameter-list" role="group" aria-label="Parâmetros pré-definidos">
            {parameterOptions.map((option) => { const selected = selectedParameters.includes(option.id); return <button key={option.id} className={`office-choice${selected ? " active" : ""}`} type="button" role="checkbox" aria-checked={selected} onClick={() => setSelectedParameters((current) => selected ? current.filter((id) => id !== option.id) : [...current, option.id])}>
              <span className="office-choice-copy"><strong>{option.label}</strong><small>{option.detail}</small></span>
              {selected && <Check size={16} aria-hidden="true" />}
            </button>; })}
          </div>
          <label className="office-form-field" htmlFor="office-run-parameters"><span>Outros parâmetros <em>opcional</em></span><textarea id="office-run-parameters" {...form.register("parameters")} rows={3} placeholder="Ex.: usar os dados da última campanha e evitar promessas de prazo." aria-invalid={Boolean(form.formState.errors.parameters)} aria-describedby={form.formState.errors.parameters ? "office-run-parameters-error" : undefined} />{form.formState.errors.parameters && <small id="office-run-parameters-error">{form.formState.errors.parameters.message}</small>}</label>
        </fieldset>
        <fieldset className="office-choice-fieldset">
          <legend><FileCheck2 size={15} /> Como saberemos que está pronto?</legend>
          <p className="office-choice-hint">Escolha uma conclusão sugerida ou edite o texto abaixo.</p>
          <div className="office-choice-list office-completion-list" role="radiogroup" aria-label="Conclusão pré-definida">
            {completionOptions.map((option) => { const selected = deliveryValue === option; return <button key={option} className={`office-choice${selected ? " active" : ""}`} type="button" role="radio" aria-checked={selected} onClick={() => { setDeliveryValue(option); form.setValue("delivery", option, { shouldDirty: true, shouldValidate: true }); }}><span className="office-choice-copy"><strong>{option}</strong></span>{selected && <Check size={16} aria-hidden="true" />}</button>; })}
          </div>
          <label className="office-form-field" htmlFor="office-run-delivery"><span>Como saberemos que está pronto?</span><textarea id="office-run-delivery" {...deliveryField} value={deliveryValue} onChange={(event) => { deliveryField.onChange(event); setDeliveryValue(event.target.value); }} rows={3} placeholder="Ex.: Texto revisado e arte pronta para aprovação" aria-invalid={Boolean(form.formState.errors.delivery)} aria-describedby={form.formState.errors.delivery ? "office-run-delivery-error" : undefined} />{form.formState.errors.delivery && <small id="office-run-delivery-error">{form.formState.errors.delivery.message}</small>}</label>
        </fieldset>
        <label className="office-form-field" htmlFor="office-run-notes"><span>Contexto adicional <em>opcional</em></span><textarea id="office-run-notes" {...form.register("notes")} rows={4} placeholder="Público, prazo, referências ou restrições que os agentes devem conhecer." aria-invalid={Boolean(form.formState.errors.notes)} aria-describedby={form.formState.errors.notes ? "office-run-notes-error" : undefined} />{form.formState.errors.notes && <small id="office-run-notes-error">{form.formState.errors.notes.message}</small>}</label>
        <div className="office-run-form-actions"><button className="secondary-button" type="button" onClick={() => setOpen(false)}><X size={15} /> Cancelar</button><button className="primary-button" type="submit" disabled={form.formState.isSubmitting}><Plus size={15} /> Criar pedido</button></div>
      </form>
    </DrawerContent>
  </Drawer>;
}
