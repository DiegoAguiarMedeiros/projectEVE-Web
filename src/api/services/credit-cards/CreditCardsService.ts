import { api } from "src/api/client";
import {
  CreditCardsPost,
  CreditCards,
} from "src/types/CreditCards";
import { GetAllParams } from "src/types/types";
import { Pagination } from "src/types/Pagination";

export const createCreditCards = (data: CreditCardsPost) =>
  api.post<CreditCards>("/credit-cards", data);

export const listCreditCards = (params?: GetAllParams) =>
  api.get<Pagination<CreditCards>>("/credit-cards", { params });

export const getCreditCards = (id: string) =>
  api.get<CreditCards>(`/credit-cards/${id}`);

export const updateCreditCards = (data: CreditCards) =>
  api.patch<CreditCards>(`/credit-cards/${data.id}`, data);

export const deleteCreditCards = (id: string) =>
  api.delete<void>(`/credit-cards/${id}`);

export const deleteAllCreditCards = (ids: string[]) =>
  api.delete<void>(`/credit-cards/delete-all`, { data: { ids } });
