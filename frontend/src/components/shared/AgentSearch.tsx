import { Button } from "@/components/ui/Button";
import type { AgentSearchProps } from "@/types/agent-search-types";

export function AgentSearch({
  searchText,
  selectedAgent,
  matchingAgents,
  isLoading,
  onSearchTextChange,
  onSelectAgent,
  onClear,
}: AgentSearchProps) {
  return (
    <div className="space-y-2 text-sm">
      <label className="font-medium text-foreground" htmlFor="agent-search">
        Buscar agente
      </label>
      <div className="flex flex-col gap-2 md:max-w-xl md:flex-row">
        <input
          id="agent-search"
          value={searchText}
          onChange={(event) => onSearchTextChange(event.target.value)}
          placeholder="Digite o nome do agente"
          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
        />
        <Button type="button" variant="outline" onClick={onClear}>
          Limpar
        </Button>
      </div>

      {selectedAgent ? (
        <p className="text-sm text-muted-foreground">
          Agente selecionado:{" "}
          <span className="font-medium text-foreground">
            {selectedAgent.name}
          </span>
        </p>
      ) : null}

      {!selectedAgent && searchText.trim() ? (
        <div className="max-w-xl rounded-md border border-border bg-white shadow-sm">
          {isLoading ? (
            <p className="px-3 py-2 text-muted-foreground">
              Carregando agentes...
            </p>
          ) : null}

          {!isLoading && matchingAgents.length === 0 ? (
            <p className="px-3 py-2 text-muted-foreground">
              Nenhum agente encontrado.
            </p>
          ) : null}

          {!isLoading && matchingAgents.length > 0 ? (
            <ul className="divide-y divide-border">
              {matchingAgents.map((agent) => (
                <li key={agent.id}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-foreground hover:bg-muted"
                    onClick={() => onSelectAgent(agent)}
                  >
                    {agent.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
