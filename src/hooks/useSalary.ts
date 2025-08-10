import { useEffect, useState } from "react";
import { StorageService } from "src/services/implementation/StorageService";

export function useSalary() {
  const [salary, setSalary] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = StorageService.get<number>("salary");
    setSalary(saved);
    setLoading(false);
  }, []);

  const updateSalary = (value: number) => {
    StorageService.set("salary", value);
    setSalary(value);
  };

  const clearSalary = () => {
    StorageService.remove("salary");
    setSalary(null);
  };

  return {
    salary,
    loading,
    updateSalary,
    clearSalary,
  };
}