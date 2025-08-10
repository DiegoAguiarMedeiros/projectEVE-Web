import { api } from "src/api/client";
import {
  GoalsPost,
  Goals,
} from "src/types/Goals";
import { GetAllParams } from "src/types/types";
import { Pagination } from "src/types/Pagination";

export const createGoals = (data: GoalsPost) =>
  api.post<Goals>("/goals", data);

export const listGoals = (params?: GetAllParams) =>
  api.get<Pagination<Goals>>("/goals", { params });

export const getGoals = (id: string) =>
  api.get<Goals>(`/goals/${id}`);

export const updateGoals = (data: Goals) =>
  api.put<Goals>(`/goals/${data.id}`, data);

export const deleteGoals = (id: string) =>
  api.delete<void>(`/goals/${id}`);
