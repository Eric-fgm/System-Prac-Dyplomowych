import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "../helpers/constants";

const fetchTheses = async (params) => {
  const response = await fetch(
    `${API_BASE}/theses?${new URLSearchParams({
      page: 1,
      ...params,
    }).toString()}`
  );

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

const fetchSingleThesis = async (id) => {
  const response = await fetch(`${API_BASE}/theses/${id}`);

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

const fetchThesesCategories = async () => {
  const response = await fetch(`${API_BASE}/theses/categories`);

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

const createThesis = async (thesis) => {
  const response = await fetch(`${API_BASE}/theses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thesis),
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

const changeThesisStatus = async (id, action) => {
  const response = await fetch(`${API_BASE}/theses/${id}/status/${action}`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }
};

const removeThesis = async (id) => {
  const response = await fetch(`${API_BASE}/theses/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }
};

const reserveThesis = async (id, body) => {
  const response = await fetch(`${API_BASE}/theses/${id}/assign`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }
};

export const useThesesQuery = (params) => {
  return useQuery({
    queryKey: ["theses", params],
    queryFn: () => fetchTheses(params),
  });
};

export const useSingleThesisQuery = (id, options) => {
  return useQuery({
    queryKey: ["theses", id],
    queryFn: () => fetchSingleThesis(id),
    ...options,
  });
};

export const useThesesCategoriesQuery = () => {
  return useQuery({
    queryKey: ["theses-categories"],
    queryFn: fetchThesesCategories,
  });
};

export const useThesisCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createThesis,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["theses"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: ["theses-categories"] });
    },
  });
};

export const useThesisRemoveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeThesis,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["theses"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: ["theses-categories"] });
    },
  });
};

export const useThesisReservationMutation = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => reserveThesis(id, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["theses"],
        refetchType: "all",
      });
    },
  });
};

export const useThesisActionMutation = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action) => changeThesisStatus(id, action),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["theses"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: ["supervisor-assignees"] });
    },
  });
};
