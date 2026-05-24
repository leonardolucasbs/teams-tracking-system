import type { DashboardSection } from "@/types/component-props";

export const dashboardSections: DashboardSection[] = [
  {
    title: "Agentes",
    description: "Visão geral dos agentes de campo e do status operacional.",
  },
  {
    title: "Localizações",
    description: "Últimos registros de localização sincronizados pelo backend.",
  },
  {
    title: "Monitor de Sync",
    description: "Histórico de execução das sincronizações independentes.",
  },
];
