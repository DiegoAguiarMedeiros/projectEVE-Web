


export interface ProcessedIncomes {
  id: string;
  description: string,
  month: string,
  year: string,
  day: string,
  totalIncomeProcessed: string,
  isSplitted: boolean
  envelope?: string
}

export interface ProcessedIncomesPlayload extends Omit<ProcessedIncomes, "id"> { }
export interface ProcessedIncomesResponse {
  month: number,
  year: number,
  day: number,
  totalIncomeProcessed: number,
  isSplitted: boolean
  envelope?: string
}

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export interface ProcessedIncomesMonthResponse {
  [year: number]: Month[];
};