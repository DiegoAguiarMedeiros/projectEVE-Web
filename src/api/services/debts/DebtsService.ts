import { api } from "src/api/client";
import {
  DebtsPost,
  Debts,
} from "src/types/Debts";
import { GetAllParams } from "src/types/types";
import { Pagination } from "src/types/Pagination";

export const createDebts = (data: DebtsPost) =>
  api.post<Debts>("/debts", data);

export const listDebts = (params?: GetAllParams) =>
  api.get<Pagination<Debts>>("/debts", { params });

export const getDebts = (id: string) =>
  api.get<Debts>(`/debts/${id}`);

export const updateDebts = (data: Debts) =>
  api.put<Debts>(`/debts/${data.id}`, data);

export const deleteDebts = (id: string) =>
  api.delete<void>(`/debts/${id}`);
