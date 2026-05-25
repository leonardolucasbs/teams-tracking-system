import {
  Activity,
  ClipboardCheck,
  Map,
  MapPinned,
  Radar,
  Route,
} from "lucide-react";
import type {
  QuickNavigationItem,
  SyncStatus,
  SyncType,
} from "@/features/dashboard/types/dashboard-types";

export const quickNavigationItems: QuickNavigationItem[] = [
  {
    href: "/agents",
    title: "Agentes",
    description: "Gerencie os agentes de campo.",
    icon: Activity,
  },
  {
    href: "/locations",
    title: "Localizações",
    description: "Acompanhe posições sincronizadas.",
    icon: MapPinned,
  },
  {
    href: "/routes",
    title: "Rotas",
    description: "Consulte rotas do dia.",
    icon: Route,
  },
  {
    href: "/check-ins",
    title: "Check-ins",
    description: "Veja registros e eventos de campo.",
    icon: ClipboardCheck,
  },
  {
    href: "/sync",
    title: "Monitoramento",
    description: "Acompanhe execuções de sincronização.",
    icon: Radar,
  },
  {
    href: "/geofences",
    title: "Área Operacional",
    description: "Consulte áreas sincronizadas.",
    icon: Map,
  },
];

export const syncStatusLabels: Record<SyncStatus, string> = {
  RUNNING: "Em execução",
  SUCCESS: "Sucesso",
  FAILED: "Falha",
  PARTIAL: "Parcial",
};

export const syncTypeLabels: Record<SyncType, string> = {
  AGENTS: "Agentes",
  LOCATIONS: "Localizações",
  CHECK_INS: "Check-ins",
  GEOFENCES: "Área Operacional",
  ALL: "Todos",
};
