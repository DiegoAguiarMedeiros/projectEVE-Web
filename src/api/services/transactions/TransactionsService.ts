import { api } from "src/api/client";
import {
  TransactionsPost,
  Transactions,
  TransactionsStatus,
  TransactionsUpdateStatus,
} from "src/types/Transactions";
import { GetAllParams } from "src/types/types";
import { Pagination } from "src/types/Pagination";

export const createTransactions = (data: TransactionsPost) =>
  api.post<Transactions>("/transactions", data);

export const listTransactions = (params?: GetAllParams) =>
  api.get<Pagination<Transactions>>("/transactions", { params });

export const listTransactionsByEnvelope = (envelopeId: string, year: number, month: number, params?: GetAllParams) =>
  api.get<Pagination<Transactions>>(`/transactions/envelope/${year}/${month}/${envelopeId}`, { params });

export const getTransactions = (id: string) =>
  api.get<Transactions>(`/transactions/${id}`);

export const updateTransactions = (data: Transactions) =>
  api.put<Transactions>(`/transactions/${data.id}`, data);

export const updateStatusTransactions = (data: TransactionsUpdateStatus) =>
  api.patch<Transactions>(`/transactions/${data.id}/change-status`, { status: data.status });

export const deleteTransactions = (id: string) =>
  api.delete<void>(`/transactions/${id}`);
