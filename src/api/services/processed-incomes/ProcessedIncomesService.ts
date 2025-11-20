import { api } from "src/api/client";
import { Pagination } from "src/types/Pagination";
import { ProcessedIncomesPlayload, ProcessedIncomesResponse, ProcessedIncomesMonthResponse, ProcessedIncomes } from "src/types/ProcessedIncomes";
import { GetAllParams } from "src/types/types";

export const process = (data: ProcessedIncomesPlayload) =>
    api.post<ProcessedIncomesResponse>("/processed-incomes", data);

export const processedIncomesMonth = () =>
    api.get<ProcessedIncomesMonthResponse>("/processed-incomes/months");

export const processedIncomes = (year: number, month: number, params?: GetAllParams) =>
    api.get<Pagination<ProcessedIncomes>>(`/processed-incomes/${year}/${month}`, { params });;

export const updateProcessedIncomes = (data: ProcessedIncomes) =>
    api.put<ProcessedIncomes>(`/processed-incomes/${data.id}`, data);