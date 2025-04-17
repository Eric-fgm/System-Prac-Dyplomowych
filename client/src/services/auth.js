import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const login = async (credentials) => {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

const fetchMe = async () => {
  const response = await fetch("http://localhost:3000/api/auth/me");

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth/me"] });
      navigate("/");
    },
  });
};

export const useAuthQuery = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, ...restQuery } = useQuery({
    queryKey: ["auth/me"],
    queryFn: fetchMe,
    onError: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      navigate("/login");
    },
  });

  return {
    user: data,
    ...restQuery,
  };
};
