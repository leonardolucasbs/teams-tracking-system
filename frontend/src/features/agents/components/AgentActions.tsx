import { Button } from "@/components/ui/Button";
import type { AgentActionsProps } from "@/features/agents/types/agent-types";

export function AgentActions({
  agent,
  onEdit,
  onDeactivate,
  isDeactivating,
}: AgentActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => onEdit(agent)}>
        Editar
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDeactivate(agent)}
        disabled={!agent.active || isDeactivating}
      >
        Desativar
      </Button>
    </div>
  );
}
