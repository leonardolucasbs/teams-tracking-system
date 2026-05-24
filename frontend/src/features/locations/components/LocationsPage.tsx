import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export function LocationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Localizações"
        description="Página base para o histórico de localizações sincronizadas dos agentes."
      />
      <EmptyState
        title="A tela de localizações está pronta para implementação"
        message="O histórico de localizações e as posições mais recentes serão conectados depois."
      />
    </div>
  );
}
