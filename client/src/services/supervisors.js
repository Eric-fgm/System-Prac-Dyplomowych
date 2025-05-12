import { useQuery } from "@tanstack/react-query";
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
