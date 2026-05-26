import axios from "axios";

import { router } from "expo-router";

import { useAuthStore }
  from "../store/authStore";

export const api =
  axios.create({
    baseURL:
      "http://192.168.29.19:3000",
  });

api.interceptors.request.use(
  (config) => {
    const token =
      useAuthStore.getState()
        .authToken;

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401
    ) {
      useAuthStore.getState().logout();

      router.replace("/");
    }

    return Promise.reject(error);
  }
);
