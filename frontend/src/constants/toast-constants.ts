export const TOAST_MESSAGES = {
  defaultError: "Não foi possível concluir a operação.",
  agentCreated: "Agente cadastrado com sucesso.",
  agentUpdated: "Agente atualizado com sucesso.",
  agentDeactivated: "Agente desativado com sucesso.",
  checkInCreated: "Check-in cadastrado com sucesso.",
  checkInSynced: "Sincronização de check-ins feita com sucesso.",
  locationsSynced: "Sincronização de localizações feita com sucesso.",
  geofencesSynced: "Sincronização de áreas operacionais feita com sucesso.",
};

export const TOAST_DURATION_MS = 3000;

export const TOAST_VARIANT_STYLES = {
  success: {
    container: "border-green-200 bg-green-50 text-green-800",
    icon: "text-green-700",
  },
  error: {
    container: "border-red-200 bg-red-50 text-red-800",
    icon: "text-red-700",
  },
};
