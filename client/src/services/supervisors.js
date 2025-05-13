import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "../helpers/constants";

const fetchSupervisors = async () => {
  const response = await fetch(`${API_BASE}/supervisors`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

const createSupervisor = async (supervisor) => {
  const response = await fetch(`${API_BASE}/supervisors`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supervisor),
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }
};

export const useSupervisorsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupervisor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
    },
  });
};

export const useSupervisorsQuery = () => {
  const { data = [], ...restQuery } = useQuery({
    queryKey: ["supervisors"],
    queryFn: fetchSupervisors,
  });

  return {
    supervisors: data,
    ...restQuery,
  };
};
