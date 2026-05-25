 "use client";

import { TablePagination } from "@/components/shared/TablePagination";
import { AgentActions } from "@/features/agents/components/AgentActions";
import { AgentStatusBadge } from "@/features/agents/components/AgentStatusBadge";
import { agentRoleLabels } from "@/features/agents/constants/agent-constants";
import type { AgentsTableProps } from "@/features/agents/types/agent-types";
import { formatAgentDate } from "@/features/agents/utils/agent-utils";
import { usePagination } from "@/hooks/usePagination";

export function AgentsTable({
  agents,
  onEdit,
  onDeactivate,
  isDeactivating,
}: AgentsTableProps) {
  const pagination = usePagination(agents);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Função</th>
              <th className="px-4 py-3 font-medium">Equipe</th>
              <th className="px-4 py-3 font-medium">Telefone</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Ativo</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Bateria</th>
              <th className="px-4 py-3 font-medium">Último sinal</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pagination.paginatedItems.map((agent) => (
              <tr key={agent.id} className="text-foreground">
                <td className="px-4 py-3 font-mono text-xs">{agent.id}</td>
                <td className="px-4 py-3 font-medium">{agent.name}</td>
                <td className="px-4 py-3">
                  {agentRoleLabels[agent.normalizedRole]}
                </td>
                <td className="px-4 py-3">{agent.team}</td>
                <td className="px-4 py-3">{agent.phone}</td>
                <td className="px-4 py-3">{agent.email || "Não informado"}</td>
                <td className="px-4 py-3">{agent.active ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">
                  <AgentStatusBadge status={agent.status} />
                </td>
                <td className="px-4 py-3">{agent.battery}%</td>
                <td className="px-4 py-3">
                  {formatAgentDate(agent.lastSeen)}
                </td>
                <td className="px-4 py-3">
                  <AgentActions
                    agent={agent}
                    onEdit={onEdit}
                    onDeactivate={onDeactivate}
                    isDeactivating={isDeactivating}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        startItem={pagination.startItem}
        endItem={pagination.endItem}
        onPageChange={pagination.setPage}
      />
    </div>
  );
}
