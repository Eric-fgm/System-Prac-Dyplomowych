import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginFailure, loginSuccess } from "../store/authSlice.js";
import axios from "axios";

const login = async (credentials) => {
  const formData = new URLSearchParams();
  formData.append("username", credentials.email);  // Tutaj używamy 'username' bo backend to oczekuje
  formData.append("password", credentials.password);

  const response = await axios.post("http://localhost:8000/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",  // Nagłówek dla form-urlencoded
    },
  });

  return response.data;  // Zwracamy odpowiedź z backendu
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
    onError: (error) => {
      console.error(error);
    },
  });
};

const fetchMe = async () => {
  try {
    const response = await axios.get("http://localhost:8000/auth/me");
    return response.data;  // Zwracamy dane użytkownika
  } catch (error) {
    throw new Error("Wystąpił błąd: " + error.response.data.detail);
  }
};

export const useAuthQuery = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, ...restQuery } = useQuery({
    queryKey: ["auth/me"],
    queryFn: fetchMe,
    onSuccess: (data) => {
      dispatch(loginSuccess({ role: data.role })); // Zapisz rolę z backendu
    },
    onError: async () => {
      dispatch(loginFailure());
      await queryClient.cancelQueries();
      queryClient.clear();
      navigate("/login");  // Jeśli użytkownik nie jest zalogowany, przekierowanie na stronę logowania
    },
  });

  return {
    user: data,
    ...restQuery,
  };
};
