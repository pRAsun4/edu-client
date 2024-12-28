// src/features/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
  reviewsVisible: false,
  sidebarVisible: false,
  activeClass: sessionStorage.getItem("activeClass") || 0,
  activeButton: null,
  darkModeActivate: localStorage.getItem("darkMode") === "true",
  reviewFormData: "",
  reviewLocationData: "",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setReviewsVisible: (state, action) => {
      state.reviewsVisible = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    toggleSidebar: (state) => {
      state.sidebarVisible = !state.sidebarVisible;
    },
    setActiveClass: (state, action) => {
      state.activeClass = action.payload;
      sessionStorage.setItem("activeClass", action.payload);
    },
    setActiveButton: (state, action) => {
      state.activeButton = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkModeActivate = !state.darkModeActivate;
      localStorage.setItem("darkMode", state.darkModeActivate);
    },
    setReviewFormData: (state, action) => {
      state.reviewFormData = action.payload; // Set the form data
    },
    clearReviewFormData: (state) => {
      state.reviewFormData = null; // Clear the form data
    },
    setReviewLocationData: (state, action) => {
      state.reviewLocationData = action.payload;
    },
    clearReviewLocationData: (state) => {
      state.reviewLocationData = null;
    },
  },
});

export const {
  setUser,
  clearUser,
  setReviewsVisible,
  toggleSidebar,
  setActiveClass,
  setActiveButton,
  toggleDarkMode,
  setReviewFormData,
  clearReviewFormData,
  setReviewLocationData,
  clearReviewLocationData,
} = appSlice.actions;
export default appSlice.reducer;
