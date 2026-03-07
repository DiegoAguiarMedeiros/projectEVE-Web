import { api } from "src/api/client";
import { Pagination } from "src/types/Pagination";
import { ProcessedIncomesPlayload, ProcessedIncomesResponse, ProcessedIncomesMonthResponse, ProcessedIncomes, ProcessedIncomesTotal } from "src/types/ProcessedIncomes";
import { GetAllParams } from "src/types/types";

export const process = (data: ProcessedIncomesPlayload) =>
    api.post<ProcessedIncomesResponse>("/processed-incomes", data);

export const processAll = (data: { month: number; year: number }) =>
    api.post<void>("/processed-incomes/process-all", data);

export const deleteProcessedIncome = (id: string) =>
    api.delete<void>(`/processed-incomes/${id}`);

export const deleteAllProcessedIncomes = (ids: string[]) =>
    api.delete<void>(`/processed-incomes/delete-all`, { data: { ids } });

export const processedIncomesMonth = () =>
    api.get<ProcessedIncomesMonthResponse>("/processed-incomes/months");

export const processedIncomes = (year: number, month: number, params?: GetAllParams) =>
    api.get<Pagination<ProcessedIncomes>>(`/processed-incomes/${year}/${month}`, { params });;

export const updateProcessedIncomes = (data: ProcessedIncomes) =>
    api.put<ProcessedIncomes>(`/processed-incomes/${data.id}`, data);

export const getTotalProcessedIncomes = (year: number, month: number) =>
    api.get<ProcessedIncomesTotal>(`/processed-incomes/total/${year}/${month}`);

export const deleteProcessedIncomesByMonth = (year: number, month: number) =>
    api.delete<void>(`/processed-incomes/${year}/${month}`);