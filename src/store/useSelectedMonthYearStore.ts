import { create } from "zustand";
import { Month } from "src/types/ProcessedIncomes";

interface SelectedMonthYearState {
    month: Month;
    year: number;
    setMonth: (month: Month) => void;
    setYear: (year: number) => void;
}

export const useSelectedMonthYearStore = create<SelectedMonthYearState>((set) => ({

    month:( new Date().getMonth() + 1) as Month,
    year: new Date().getFullYear(),

    setMonth: (month) => set({ month }),
    setYear: (year) => set({ year }),


}));