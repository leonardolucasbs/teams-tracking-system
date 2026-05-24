import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export function SyncPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitor de Sync"
        description="Página base para histórico e status das sincronizações."
      />
      <EmptyState
        title="A tela de monitoramento está pronta para implementação"
        message="Histórico de execução e cards de status dos schedulers serão adicionados depois."
      />
    </div>
  );
}
