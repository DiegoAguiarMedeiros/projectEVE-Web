export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;


export interface ProcessIncomesPayload {
  month:number,
  year: number,
  totalIncomeProcessed: number,
  isSplitted: boolean
}
export interface ProcessIncomesResponse {
  month:number,
  year: number,
  totalIncomeProcessed: number,
  isSplitted: boolean
}

export interface ProcessedIncomesMonthResponse {
  [year: number]: Month[];
};