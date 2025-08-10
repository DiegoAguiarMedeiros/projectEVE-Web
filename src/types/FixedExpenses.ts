export interface FixedExpenses {
    id: string;
    envelopeId: string;
    description: string;
    amount: string;
    paymentDay: string;
}

export interface FixedExpensesPost extends Omit<FixedExpenses, "id"> { }