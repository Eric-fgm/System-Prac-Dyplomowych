import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Przykładowe dane o pracach dyplomowych
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
];

// Funkcja do pobierania prac dyplomowych z backendu
const fetchTheses = async ({ page }) => {
  try {
    const response = await axios.get(`http://localhost:8000/theses?page=${page}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Błąd serwera: ${error.response.status} - ${error.response.data.detail}`);
    } else if (error.request) {
      throw new Error("Brak odpowiedzi z serwera");
    } else {
      throw new Error(`Błąd podczas tworzenia zapytania: ${error.message}`);
    }
  }
};

const reserveThesis = async (id) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/theses/${id}/reserve`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Błąd serwera: ${error.response.status} - ${error.response.data.detail}`);
    } else if (error.request) {
      // Brak odpowiedzi z serwera
      throw new Error("Brak odpowiedzi z serwera");
    } else {
      // Błąd w czasie konfiguracji zapytania
      throw new Error(`Błąd podczas tworzenia zapytania: ${error.message}`);
    }
  }
};


// Hook do pobierania prac dyplomowych
export const useThesesQuery = (params) => {
  const { data, ...restQuery } = useQuery({
    queryKey: ["theses", params],
    queryFn: () => fetchTheses(params),
  });

  return {
    theses: data ?? theses,  // Jeśli dane są dostępne, zwróć je, jeśli nie - zwróć dane przykładowe
    ...restQuery,
  };
};

// Hook do rezerwowania pracy dyplomowej
export const useThesisReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reserveThesis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theses"] });
    },
  });
};
