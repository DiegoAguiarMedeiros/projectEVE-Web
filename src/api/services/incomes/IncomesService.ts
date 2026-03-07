import { api } from "src/api/client";
import {
  IncomesPost,
  Incomes,
  IncomesTotal,
} from "src/types/Incomes";
import { GetAllParams } from "src/types/types";
import { Pagination } from "src/types/Pagination";

export const createIncomes = (data: IncomesPost) =>
  api.post<Incomes>("/incomes", data);



export const listTotalIncomes = () =>
  api.get<IncomesTotal>("/incomes/total");

export const listIncomes = (params?: GetAllParams) =>
  api.get<Pagination<Incomes>>("/incomes", { params });

export const getIncomes = (id: string) =>
  api.get<Incomes>(`/incomes/${id}`);

export const updateIncomes = (data: Incomes) =>
  api.patch<Incomes>(`/incomes/${data.id}`, data);

export const deleteIncomes = (id: string) =>
  api.delete<void>(`/incomes/${id}`);

export const deleteAllIncomes = (ids: string[]) =>
  api.delete<void>(`/incomes/delete-all`, { data: { ids } });
