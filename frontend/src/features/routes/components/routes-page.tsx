import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export function RoutesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rotas"
        description="Página base para os resumos de rota do dia."
      />
      <EmptyState
        title="A tela de rotas está pronta para implementação"
        message="Os resumos de rota e as visualizações de distância serão adicionados depois."
      />
    </div>
  );
}
