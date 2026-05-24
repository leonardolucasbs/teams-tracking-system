import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export function AgentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Agentes"
        description="Página base para as telas de CRUD de agentes."
      />
      <EmptyState
        title="A tela de agentes está pronta para implementação"
        message="Tabelas, filtros e formulários serão adicionados na próxima etapa."
      />
    </div>
  );
}
