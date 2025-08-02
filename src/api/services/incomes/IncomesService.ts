import { api } from "src/api/client";
import {
  IncomePost,
  Income,
} from "src/types/Incomes";
import { GetAllParams } from "src/types/types";
import { Pagination } from "src/types/Pagination";

export const createIncome = (data: IncomePost) =>
  api.post<Income>("/incomes", data);



export const listIncomes = (params?: GetAllParams) =>
  api.get<Pagination<Income>>("/incomes", { params });

export const getIncome = (id: string) =>
  api.get<Income>(`/incomes/${id}`);

export const updateIncome = (data: Income) =>
  api.put<Income>(`/incomes/${data.id}`, data);

export const deleteIncome = (id: string) =>
  api.delete<void>(`/incomes/${id}`);
