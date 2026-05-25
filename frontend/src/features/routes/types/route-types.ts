export type RouteStatus =
  | "ONLINE"
  | "PAUSED"
  | "SIGNAL_LOST"
  | "OFFLINE";

export type RoutePoint = {
  locationId: string;
  latitude: number;
  longitude: number;
  currentAddress: string | null;
  accuracy: number | null;
  speed: number | null;
  battery: number | null;
  status: RouteStatus;
  lastSeen: string;
};

export type RouteSummary = {
  agentId: string;
  agentName: string;
  date: string;
  totalPoints: number;
  totalDistanceInKm: number;
  startTime: string | null;
  endTime: string | null;
  points: RoutePoint[];
};

export type RouteSearch = {
  agentId: string;
};

export type RouteAgentSearchProps = {
  agentSearch: AgentSearchState;
};

export type RouteSummaryCardsProps = {
  summary: RouteSummary;
};

export type RoutePointsTableProps = {
  points: RoutePoint[];
};

export type RouteStatusBadgeProps = {
  status: RouteStatus;
};
import type { AgentSearchState } from "@/types/agent-search-types";
