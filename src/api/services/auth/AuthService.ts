import { api } from "src/api/client";
import { LoginPayload, AuthResponse, RegisterPayload } from "src/types/Auth";

export const login = (data: LoginPayload) =>
  api.post<AuthResponse>("/auth/login", data);

export const register = (data: RegisterPayload) =>
  api.post<AuthResponse>("/auth", data);

export const logout = () =>
  api.post("/auth/logout");

export const verifyEmail = (token: string) =>
  api.get("/auth/verify-email", { params: { token } });

export const forgotPassword = (data: { email: string; locale?: string }) =>
  api.post("/auth/forgot-password", data);

export const resetPassword = (data: { token: string; newPassword: string }) =>
  api.post("/auth/reset-password", data);