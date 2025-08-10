import { api } from "src/api/client";
import {
  EnvelopesPost,
  Envelopes,
} from "src/types/Envelopes";
import { GetAllParams } from "src/types/types";
import { Pagination } from "src/types/Pagination";

export const createEnvelopes = (data: EnvelopesPost) =>
  api.post<Envelopes>("/envelopes", data);



export const listWithAmount = (year:number,month:number) =>
  api.get<Envelopes[]>(`/envelopes/${year}/${month}`);

export const listEnvelopes = () =>
  api.get<Envelopes[]>("/envelopes");

export const getEnvelopes = (id: string) =>
  api.get<Envelopes>(`/envelopes/${id}`);

export const updateEnvelopes = (data: Envelopes) =>
  api.put<Envelopes>(`/envelopes/${data.id}`, data);

export const deleteEnvelopes = (id: string) =>
  api.delete<void>(`/envelopes/${id}`);
