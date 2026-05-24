import { AppSidebar } from "@/components/layout/AppSidebar";
import type { ChildrenProps } from "@/types/component-props";

export function AppShell({ children }: ChildrenProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Sistema de Rastreamento de Equipes
            </p>
            <h1 className="text-xl font-semibold text-foreground">
              Painel operacional
            </h1>
          </div>
          <AppSidebar />
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
