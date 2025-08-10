import { create } from "zustand";

interface IncomeState {
  income: number;
  setIncome: (income: number) => void;
}

export const IncomeStore = create<IncomeState>((set) => ({
  income: 0,
  setIncome: (income: number) => set({ income }),
}));
