import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavLinkProps } from "@/types/component-props";

export function NavLink({ href, label, icon: Icon, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors",
        isActive
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-white text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
