import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export function CheckInsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Check-ins"
        description="Página base para check-ins manuais e sincronizados."
      />
      <EmptyState
        title="A tela de check-ins está pronta para implementação"
        message="Formulários e histórico de eventos serão conectados na próxima etapa."
      />
    </div>
  );
}
