import { create } from "zustand";
import { Month } from "src/types/ProcessedIncomes";

interface SelectedMonthYearState {
    month: Month;
    year: number;
    nextMonthToProcess: Month;
    nextYearToProcess: number;
    hasMonthProcessed: boolean;
    setMonth: (month: Month) => void;
    setYear: (year: number) => void;
    setNextMonthToProcess: (nextMonthToProcess: Month) => void;
    setNextYearToProcess: (nextYearToProcess: number) => void;
    setHasMonthProcessed: (hasMonthProcessed: boolean) => void;
}

export const SelectedMonthYearStore = create<SelectedMonthYearState>((set) => ({

    month:( new Date().getMonth() + 1) as Month,
    nextMonthToProcess:( new Date().getMonth() + 1) as Month,
    nextYearToProcess: new Date().getFullYear(),
    year: new Date().getFullYear(),
    hasMonthProcessed: false,


    setMonth: (month) => set({ month }),
    setYear: (year) => set({ year }),
    setNextMonthToProcess: (nextMonthToProcess) => set({ nextMonthToProcess }),
    setNextYearToProcess: (nextYearToProcess) => set({ nextYearToProcess }),
    setHasMonthProcessed: (hasMonthProcessed) => set({ hasMonthProcessed }),


}));