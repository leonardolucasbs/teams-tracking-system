import { syncStatusLabels } from "@/features/dashboard/constants/dashboard-constants";
import type {
  DashboardData,
  DashboardOverviewItem,
  DashboardServiceData,
  SyncTypeSummaryResponse,
} from "@/features/dashboard/types/dashboard-types";

export function mapDashboardData(data: DashboardServiceData): DashboardData {
  const latestSync = findLatestSync(data.syncSummary.items);

  return {
    overviewItems: buildOverviewItems(data, latestSync),
    latestSync,
    syncItems: data.syncSummary.items,
  };
}

export function isDashboardEmpty(data: DashboardData) {
  return (
    data.overviewItems.every((item) => item.value === "0") &&
    data.syncItems.length === 0
  );
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildOverviewItems(
  data: DashboardServiceData,
  latestSync: SyncTypeSummaryResponse | null,
): DashboardOverviewItem[] {
  const totalAgents = data.agents.length;
  const activeAgents = data.agents.filter((agent) => agent.active).length;
  const latestSyncStatus = latestSync
    ? syncStatusLabels[latestSync.lastStatus]
    : "Sem registro";

  return [
    {
      key: "total-agents",
      label: "Total de agentes",
      value: String(totalAgents),
      description: "Agentes cadastrados no backend.",
    },
    {
      key: "active-agents",
      label: "Agentes ativos",
      value: String(activeAgents),
      description: "Agentes marcados como ativos.",
    },
    {
      key: "total-check-ins",
      label: "Total de check-ins",
      value: String(data.checkIns.length),
      description: "Registros disponíveis localmente.",
    },
    {
      key: "total-geofences",
      label: "Total de geofences",
      value: String(data.geofences.length),
      description: "Geofences sincronizadas.",
    },
    {
      key: "latest-sync-status",
      label: "Última sincronização",
      value: latestSyncStatus,
      description: "Status mais recente registrado.",
    },
  ];
}

function findLatestSync(items: SyncTypeSummaryResponse[]) {
  return items.reduce<SyncTypeSummaryResponse | null>((latest, item) => {
    if (!item.lastStartedAt) {
      return latest;
    }

    if (!latest?.lastStartedAt) {
      return item;
    }

    return new Date(item.lastStartedAt) > new Date(latest.lastStartedAt)
      ? item
      : latest;
  }, null);
}
