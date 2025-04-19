// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userRole: "nonLogged", // "professor", "student", "admin", albo "nonLogged"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.userRole = action.payload.role;
    },
    loginFailure: (state) => {
      state.isLoggedIn = false;
      state.userRole = "nonLogged";
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userRole = "nonLogged";
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
