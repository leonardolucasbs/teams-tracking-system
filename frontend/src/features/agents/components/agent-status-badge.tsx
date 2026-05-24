import { agentStatusLabels } from "@/features/agents/constants/agent.constants";
import type { AgentStatusBadgeProps } from "@/features/agents/types/agent.types";
import { getAgentStatusBadgeClassName } from "@/features/agents/utils/agent.utils";

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  return (
    <span className={getAgentStatusBadgeClassName(status)}>
      {agentStatusLabels[status]}
    </span>
  );
}
