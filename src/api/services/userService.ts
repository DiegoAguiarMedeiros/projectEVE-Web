import { api } from "../client";
import { User } from "../../types/User";

export const getUsers = () => api.get<User[]>("/users");
export const getUser = () => api.get<User>(`/users/me`);
export const updateUser = (id: string, data: Partial<User>) =>
  api.put<User>(`/users/${id}`, data);