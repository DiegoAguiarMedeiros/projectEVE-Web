import { api } from "../client";
import { ProcessIncomesPayload ,ProcessIncomesResponse, ProcessedIncomesMonthResponse} from "../../types/ProcessedIncomes";

export const process = (data: ProcessIncomesPayload) =>
    api.post<ProcessIncomesResponse>("/processed-incomes", data);

export const processedIncomesMonth = () =>
    api.get<ProcessedIncomesMonthResponse>("/processed-incomes/months");
