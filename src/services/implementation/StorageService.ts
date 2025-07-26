
type StorageKey = 'salary' 
/*
| 'goals' | 'fixedExpenses' | 'transactions';
  goals: 'user_goals',
  fixedExpenses: 'user_fixed_expenses',
  transactions: 'user_transactions',
*/
const STORAGE_KEYS: Record<StorageKey, string> = {
  salary: 'user_salary',
};

export const StorageService = {
  set<T>(key: StorageKey, value: T) {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  },

  get<T>(key: StorageKey): T | null {
    const item = localStorage.getItem(STORAGE_KEYS[key]);
    return item ? JSON.parse(item) as T : null;
  },

  remove(key: StorageKey) {
    localStorage.removeItem(STORAGE_KEYS[key]);
  },

  clearAll() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }
};
