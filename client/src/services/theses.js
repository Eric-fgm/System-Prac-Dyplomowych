import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "../helpers/constants";

const theses = [
  {
    id: "1",
    title: "The Impact of Artificial Intelligence on Modern Healthcare Systems",
    author: "Dr. Sarah Johnson",
    status: "Zaakceptowany",
    department: "Informatyka",
    year: 2024,
    abstract:
      "This thesis explores how AI technologies are transforming healthcare delivery, patient outcomes, and medical research. Through case studies and data analysis, it examines both the benefits and challenges of AI integration in clinical settings.",
    tags: ["Artificial Intelligence", "Healthcare", "Technology"],
    createdAt: "17.04.2025",
  },
  {
    id: "2",
    title:
      "Sustainable Urban Planning: Balancing Growth and Environmental Conservation",
    author: "Prof. Michael Chen",
    status: "Wolny",
    year: 2025,
    department: "Informatyka",
    abstract:
      "An analysis of sustainable urban development strategies that balance population growth demands with environmental conservation. The research presents new frameworks for city planners to minimize ecological footprints while supporting economic development.",
    tags: ["Urban Planning", "Sustainability", "Environment"],
    createdAt: "17.04.2025",
  },
  {
    id: "3",
    title:
      "Sustainable Urban Planning: Balancing Growth and Environmental Conservation",
    author: "Prof. Michael Chen",
    status: "Wolny",
    year: 2025,
    department: "Informatyka",
    abstract:
      "An analysis of sustainable urban development strategies that balance population growth demands with environmental conservation. The research presents new frameworks for city planners to minimize ecological footprints while supporting economic development.",
    tags: ["Urban Planning", "Sustainability", "Environment"],
    createdAt: "17.04.2025",
  },
];

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
    theses: data ?? theses,
    ...restQuery,
  };
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
