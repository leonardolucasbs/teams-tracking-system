import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/services/http-client";

export function useApiHealth() {
  return useQuery({
    queryKey: ["api-health"],
    queryFn: async () => {
      const response = await httpClient.get("/");
      return response.data;
    },
    enabled: false,
  });
}
