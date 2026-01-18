import { api } from "src/api/client";
import { User } from "src/types/User";

export const getUsers = () => api.get<User[]>("/users");
export const getUser = () => api.get<User>(`/users/me`);
export const updateUser = (id: string, data: Partial<User>) =>
  api.patch<User>(`/users/${id}`, data);
export const updateProfile = (data: { name: string }) => api.put("/users/profile", data);
export const changePassword = (data: any) => api.put("/users/change-password", data);
export const completeRegistration = () => api.post("/users/complete-registration");