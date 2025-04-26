import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { API_BASE } from "../helpers/constants";

const login = async ({ email, ...credentials }) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    body: new URLSearchParams({ username: email, ...credentials }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }
};

const logout = async () => {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }
};

const fetchMe = async () => {
  const response = await fetch(`${API_BASE}/users/me`, {
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

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      queryClient.clear();
      navigate("/");
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      navigate("/login");
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
      queryClient.clear();
      navigate("/login");
    },
  });

  return {
    user: data,
    ...restQuery,
  };
};
