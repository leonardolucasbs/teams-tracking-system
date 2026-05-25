"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AgentSearch } from "@/components/shared/AgentSearch";
import { Button } from "@/components/ui/Button";
import {
  checkInTypeLabels,
  checkInTypeOptions,
  defaultCheckInFormValues,
} from "@/features/check-ins/constants/check-in-constants";
import { checkInSchema } from "@/features/check-ins/schemas/check-in-schema";
import type {
  CheckInFormProps,
  CheckInFormValues,
  CheckInTextFieldProps,
} from "@/features/check-ins/types/check-in-types";
import { getCheckInRegisterOptions } from "@/features/check-ins/utils/check-in-utils";

export function CheckInForm({
  isOpen,
  isSubmitting,
  agentSearch,
  onClose,
  onSubmit,
}: CheckInFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: defaultCheckInFormValues,
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Criar check-in
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Registre manualmente um evento operacional para um agente.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit((values) => {
            onSubmit(values);
            reset(defaultCheckInFormValues);
            agentSearch.clearSelectedAgent();
          })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <AgentSearch
                searchText={agentSearch.searchText}
                selectedAgent={agentSearch.selectedAgent}
                matchingAgents={agentSearch.matchingAgents}
                isLoading={agentSearch.isLoading}
                onSearchTextChange={agentSearch.setSearchText}
                onSelectAgent={(agent) => {
                  agentSearch.selectAgent(agent);
                  setValue("agentId", agent.id, { shouldValidate: true });
                }}
                onClear={() => {
                  agentSearch.clearSelectedAgent();
                  setValue("agentId", "", { shouldValidate: true });
                }}
              />
              {errors.agentId?.message ? (
                <p className="mt-2 text-xs text-destructive">
                  {errors.agentId.message}
                </p>
              ) : null}
              <input type="hidden" {...register("agentId")} />
            </div>

            <label className="space-y-2 text-sm font-medium text-foreground">
              <span>Tipo</span>
              <select
                {...register("type")}
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
              >
                {checkInTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {checkInTypeLabels[type]}
                  </option>
                ))}
              </select>
              {errors.type?.message ? (
                <p className="text-xs text-destructive">
                  {errors.type.message}
                </p>
              ) : null}
            </label>

            <CheckInTextField
              id="latitude"
              label="Latitude"
              placeholder="-23.5629"
              register={register}
              error={errors.latitude?.message}
              type="number"
            />

            <CheckInTextField
              id="longitude"
              label="Longitude"
              placeholder="-46.6544"
              register={register}
              error={errors.longitude?.message}
              type="number"
            />

            <CheckInTextField
              id="address"
              label="Endereço"
              placeholder="Rua da Consolação, 500"
              register={register}
              error={errors.address?.message}
            />

            <CheckInTextField
              id="accuracy"
              label="Precisão"
              placeholder="12"
              register={register}
              error={errors.accuracy?.message}
              type="number"
            />

            <CheckInTextField
              id="speed"
              label="Velocidade"
              placeholder="0"
              register={register}
              error={errors.speed?.message}
              type="number"
            />

            <CheckInTextField
              id="occurredAt"
              label="Ocorrido em"
              placeholder="24/05/2026 16:45"
              register={register}
              error={errors.occurredAt?.message}
            />
          </div>

          <label className="space-y-2 text-sm font-medium text-foreground">
            <span>Notas</span>
            <textarea
              {...register("notes")}
              placeholder="Observações do check-in"
              className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
            />
          </label>

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

function CheckInTextField({
  id,
  label,
  placeholder,
  register,
  error,
  type = "text",
}: CheckInTextFieldProps) {
  return (
    <label className="space-y-2 text-sm font-medium text-foreground">
      <span>{label}</span>
      <input
        type={type}
        step={type === "number" ? "any" : undefined}
        {...register(id, getCheckInRegisterOptions(id, type))}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </label>
  );
}
