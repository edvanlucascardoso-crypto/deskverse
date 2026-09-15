"use client";

import { ClipboardList, FileCheck2, Flag, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { createOfficeRunResolver } from "@/zod/resolvers/office";
import type { CreateOfficeRunInput } from "@/types/office";

type NewOfficeRunDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate: (input: CreateOfficeRunInput) => void;
};

const defaults: CreateOfficeRunInput = { title: "", objective: "", delivery: "", notes: "" };

export function NewOfficeRunDrawer({ open, setOpen, onCreate }: NewOfficeRunDrawerProps) {
  const form = useForm<CreateOfficeRunInput>({ resolver: createOfficeRunResolver, defaultValues: defaults });
  const submit = form.handleSubmit((values) => {
    onCreate({ ...values, notes: values.notes ?? "" });
    form.reset(defaults);
    setOpen(false);
  });

  return <Drawer open={open} nested autoFocus={false} onOpenChange={(next) => { setOpen(next); if (!next) form.reset(defaults); }}>
    <DrawerContent scrollable className="office-new-run-drawer">
      <DrawerHeader>
        <DrawerDescription><Plus size={14} /> Novo pedido</DrawerDescription>
        <DrawerTitle>O que precisa ser feito?</DrawerTitle>
      </DrawerHeader>

      <div className="office-new-run-intro">
        <p>Conte o resultado que você espera. O pedido fica salvo no escritório para os agentes trabalharem e pedirem decisões quando necessário.</p>
      </div>

      <form className="office-run-form" onSubmit={submit} noValidate>
        <label className="office-form-field" htmlFor="office-run-title"><span><ClipboardList size={15} /> Nome do pedido</span><input id="office-run-title" {...form.register("title")} placeholder="Ex.: Campanha de lançamento" aria-invalid={Boolean(form.formState.errors.title)} aria-describedby={form.formState.errors.title ? "office-run-title-error" : undefined} />{form.formState.errors.title && <small id="office-run-title-error">{form.formState.errors.title.message}</small>}</label>
        <label className="office-form-field" htmlFor="office-run-objective"><span><Flag size={15} /> Objetivo</span><textarea id="office-run-objective" {...form.register("objective")} rows={4} placeholder="Ex.: Preparar uma publicação para apresentar o novo serviço aos clientes." aria-invalid={Boolean(form.formState.errors.objective)} aria-describedby={form.formState.errors.objective ? "office-run-objective-error" : undefined} />{form.formState.errors.objective && <small id="office-run-objective-error">{form.formState.errors.objective.message}</small>}</label>
        <label className="office-form-field" htmlFor="office-run-delivery"><span><FileCheck2 size={15} /> Como saberemos que está pronto?</span><input id="office-run-delivery" {...form.register("delivery")} placeholder="Ex.: Texto revisado e arte pronta para aprovação" aria-invalid={Boolean(form.formState.errors.delivery)} aria-describedby={form.formState.errors.delivery ? "office-run-delivery-error" : undefined} />{form.formState.errors.delivery && <small id="office-run-delivery-error">{form.formState.errors.delivery.message}</small>}</label>
        <label className="office-form-field" htmlFor="office-run-notes"><span>Contexto adicional <em>opcional</em></span><textarea id="office-run-notes" {...form.register("notes")} rows={4} placeholder="Público, prazo, referências ou restrições que os agentes devem conhecer." aria-invalid={Boolean(form.formState.errors.notes)} aria-describedby={form.formState.errors.notes ? "office-run-notes-error" : undefined} />{form.formState.errors.notes && <small id="office-run-notes-error">{form.formState.errors.notes.message}</small>}</label>
        <div className="office-run-form-actions"><button className="secondary-button" type="button" onClick={() => setOpen(false)}><X size={15} /> Cancelar</button><button className="primary-button" type="submit" disabled={form.formState.isSubmitting}><Plus size={15} /> Criar pedido</button></div>
      </form>
    </DrawerContent>
  </Drawer>;
}
