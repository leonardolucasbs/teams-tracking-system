import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export function GeofencesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Geofences"
        description="Página base para registros de geofences sincronizadas."
      />
      <EmptyState
        title="A tela de geofences está pronta para implementação"
        message="Tabelas e filtros de geofences serão conectados depois."
      />
    </div>
  );
}
