import { AxiosError } from "axios";
import { httpClient } from "@/services/http-client";
import type {
  AgentFormValues,
  AgentResponse,
} from "@/features/agents/types/agent-types";

export async function findAgents() {
  try {
    const response = await httpClient.get<AgentResponse[]>("/api/agents");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }

    throw error;
  }
}

export async function createAgent(values: AgentFormValues) {
  const response = await httpClient.post<AgentResponse>(
    "/api/agents",
    toAgentPayload(values),
  );
  return response.data;
}

export async function updateAgent(id: string, values: AgentFormValues) {
  const response = await httpClient.put<AgentResponse>(
    `/api/agents/${id}`,
    toAgentPayload(values),
  );
  return response.data;
}

export async function deactivateAgent(id: string) {
  const response = await httpClient.patch<AgentResponse>(
    `/api/agents/${id}/deactivate`,
  );
  return response.data;
}

function toAgentPayload(values: AgentFormValues) {
  return {
    ...values,
    email: values.email?.trim() || null,
  };
}
