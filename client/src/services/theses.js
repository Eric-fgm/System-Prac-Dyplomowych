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

const createThesis = async (thesis) => {
  const response = await fetch(`${API_BASE}/theses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...thesis, status: "proposed" }),
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

const reserveThesis = async (id, body) => {
  const response = await fetch(`${API_BASE}/theses/${id}/reserve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Wystąpił błąd");
  }

  return await response.json();
};

export const useThesesQuery = (params) => {
  const { data, ...restQuery } = useQuery({
    queryKey: ["theses", params],
    queryFn: () => fetchTheses(params),
  });

  return {
    theses: data,
    ...restQuery,
  };
};

export const useThesisCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createThesis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theses"] });
    },
  });
};

export const useThesisReservationMutation = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => reserveThesis(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theses"] });
    },
  });
};
