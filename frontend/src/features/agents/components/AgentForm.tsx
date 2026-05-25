"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  agentRoleLabels,
  agentRoleOptions,
} from "@/features/agents/constants/agent-constants";
import { agentSchema } from "@/features/agents/schemas/agent-schema";
import type {
  AgentFormProps,
  AgentFormValues,
  AgentTextFieldProps,
} from "@/features/agents/types/agent-types";
import { getAgentFormValues } from "@/features/agents/utils/agent-utils";

export function AgentForm({
  agent,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: AgentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: getAgentFormValues(agent),
  });

  useEffect(() => {
    reset(getAgentFormValues(agent));
  }, [agent, reset]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {agent ? "Editar agente" : "Criar agente"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Preencha os dados operacionais do agente.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <AgentTextField
              id="name"
              label="Nome"
              placeholder="Nome do agente"
              register={register}
              error={errors.name?.message}
            />

            <label className="space-y-2 text-sm font-medium text-foreground">
              <span>Função</span>
              <select
                {...register("role")}
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
              >
                {agentRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {agentRoleLabels[role]}
                  </option>
                ))}
              </select>
              {errors.role?.message ? (
                <p className="text-xs text-destructive">
                  {errors.role.message}
                </p>
              ) : null}
            </label>

            <AgentTextField
              id="team"
              label="Equipe"
              placeholder="Equipe Norte"
              register={register}
              error={errors.team?.message}
            />

            <AgentTextField
              id="phone"
              label="Telefone"
              placeholder="(11)99999-9999"
              register={register}
              error={errors.phone?.message}
            />

            <AgentTextField
              id="email"
              label="E-mail"
              placeholder="agente@email.com"
              register={register}
              error={errors.email?.message}
              type="email"
            />

            <label className="flex items-center gap-2 pt-7 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                {...register("active")}
                className="size-4 rounded border-input"
              />
              Agente ativo
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AgentTextField({
  id,
  label,
  placeholder,
  register,
  error,
  type = "text",
}: AgentTextFieldProps) {
  return (
    <label className="space-y-2 text-sm font-medium text-foreground">
      <span>{label}</span>
      <input
        type={type}
        {...register(id, { valueAsNumber: type === "number" })}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </label>
  );
}
