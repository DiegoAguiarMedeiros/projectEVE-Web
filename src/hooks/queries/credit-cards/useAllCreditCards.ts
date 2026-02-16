import { useQuery } from "@tanstack/react-query";
import { listCreditCards } from "src/api/services/credit-cards/CreditCardsService";

export function useAllCreditCards() {
  return useQuery({
    queryKey: ["credit-cards-all"],
    queryFn: () => listCreditCards({ page: 0, pageSize: 100 }).then(res => res.data),
    staleTime: 30000,
  });
}
