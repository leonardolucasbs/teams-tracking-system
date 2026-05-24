import { AppShell } from "@/components/layout/app-shell";
import type { ChildrenProps } from "@/types/component-props";

export default function PrivateLayout({ children }: ChildrenProps) {
  return <AppShell>{children}</AppShell>;
}
