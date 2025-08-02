export interface Income {
    id: string
    description: string;
    amount: string;
    paymentDay: string;
}

export interface IncomePost extends Omit<Income, 'id'> { }