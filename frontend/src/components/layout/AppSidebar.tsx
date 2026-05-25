"use client";

import { usePathname } from "next/navigation";
import { NavLink } from "@/components/layout/NavLink";
import { navigationRoutes } from "@/constants/routes";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Principal">
      {navigationRoutes.map((route) => (
        <NavLink
          key={route.href}
          {...route}
          isActive={
            route.href === "/"
              ? pathname === "/"
              : pathname.startsWith(route.href)
          }
        />
      ))}
    </nav>
  );
}
