import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "../helpers/constants";

const fetchUsers = async (params) => {
  const response = await fetch(
    `${API_BASE}/users/?${new URLSearchParams(params).toString()}`
  );

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

export const useUsersQuery = (params) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
  });
};
