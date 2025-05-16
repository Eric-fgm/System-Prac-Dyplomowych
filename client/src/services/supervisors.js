import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "../helpers/constants";

const fetchSupervisors = async (params) => {
  const response = await fetch(
    `${API_BASE}/supervisors/?${new URLSearchParams({
      page: 1,
      ...params,
    }).toString()}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

const fetchSupervisorsSpecializations = async () => {
  const response = await fetch(`${API_BASE}/supervisors/specializations`);

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
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["supervisors"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["users"],
          refetchType: "all",
        }),
      ]);
    },
  });
};

export const useRemoveSupervisorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeSupervisor,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["supervisors"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["users"],
          refetchType: "all",
        }),
      ]);
    },
  });
};

export const useSupervisorsQuery = (params) => {
  return useQuery({
    queryKey: ["supervisors", params],
    queryFn: () => fetchSupervisors(params),
  });
};

export const useSupervisorsSpecializationsQuery = () => {
  return useQuery({
    queryKey: ["supervisors-specializations"],
    queryFn: fetchSupervisorsSpecializations,
  });
};
