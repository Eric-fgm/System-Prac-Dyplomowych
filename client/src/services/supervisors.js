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

const removeSupervisor = async (supervisor) => {
  const response = await fetch(`${API_BASE}/supervisors/${supervisor.id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }
};

export const useCreateSupervisorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupervisor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useRemoveSupervisorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeSupervisor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
