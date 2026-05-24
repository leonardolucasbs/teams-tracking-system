import { PageHeader } from "@/components/shared/page-header";
import { dashboardSections } from "@/features/dashboard/constants/dashboard-sections";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Base do frontend para o desafio de rastreamento de equipes."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {dashboardSections.map((section) => (
          <section
            key={section.title}
            className="rounded-lg border border-border bg-white p-5"
          >
            <h3 className="text-base font-semibold text-foreground">
              {section.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {section.description}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
