import {
  Activity,
  ClipboardCheck,
  Home,
  Map,
  MapPinned,
  Radar,
  Route,
} from "lucide-react";
import type { NavigationRoute } from "@/types/navigation";

export const navigationRoutes: NavigationRoute[] = [
  { href: "/", label: "Painel", icon: Home },
  { href: "/agents", label: "Agentes", icon: Activity },
  { href: "/locations", label: "Localizações", icon: MapPinned },
  { href: "/routes", label: "Rotas", icon: Route },
  { href: "/check-ins", label: "Check-ins", icon: ClipboardCheck },
  { href: "/sync", label: "Monitoramento", icon: Radar },
  { href: "/geofences", label: "Área Operacional", icon: Map },
];
