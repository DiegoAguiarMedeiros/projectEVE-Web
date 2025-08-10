import { api } from "src/api/client";
import {
  FixedExpensesPost,
  FixedExpenses,
} from "src/types/FixedExpenses";
import { GetAllParams } from "src/types/types";
import { Pagination } from "src/types/Pagination";

export const createFixedExpenses = (data: FixedExpensesPost) =>
  api.post<FixedExpenses>("/fixed-expenses", data);

export const listFixedExpenses = (params?: GetAllParams) =>
  api.get<Pagination<FixedExpenses>>("/fixed-expenses", { params });

export const getFixedExpenses = (id: string) =>
  api.get<FixedExpenses>(`/fixed-expenses/${id}`);

export const updateFixedExpenses = (data: FixedExpenses) =>
  api.put<FixedExpenses>(`/fixed-expenses/${data.id}`, data);

export const deleteFixedExpenses = (id: string) =>
  api.delete<void>(`/fixed-expenses/${id}`);
