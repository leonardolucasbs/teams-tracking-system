import { AxiosError } from "axios";
import { httpClient } from "@/services/http-client";
import type {
  AgentFormValues,
  AgentResponse,
} from "@/features/agents/types/agent-types";
import {
  AGENT_DEFAULT_BATTERY,
  AGENT_DEFAULT_STATUS,
} from "@/features/agents/constants/agent-constants";

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
    toCreateAgentPayload(values),
  );
  return response.data;
}

export async function updateAgent(id: string, values: AgentFormValues) {
  const response = await httpClient.put<AgentResponse>(
    `/api/agents/${id}`,
    toUpdateAgentPayload(values),
  );
  return response.data;
}

export async function deactivateAgent(id: string) {
  const response = await httpClient.patch<AgentResponse>(
    `/api/agents/${id}/deactivate`,
  );
  return response.data;
}

function toCreateAgentPayload(values: AgentFormValues) {
  return {
    name: values.name,
    role: values.role,
    team: values.team,
    phone: values.phone,
    email: values.email?.trim() || "",
    active: values.active,
    battery: AGENT_DEFAULT_BATTERY,
    status: AGENT_DEFAULT_STATUS,
  };
}

function toUpdateAgentPayload(values: AgentFormValues) {
  return {
    name: values.name,
    role: values.role,
    team: values.team,
    phone: values.phone,
    email: values.email?.trim() || "",
    status: "OFFLINE",
    active: values.active,
  };
}
