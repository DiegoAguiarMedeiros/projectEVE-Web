export interface Incomes {
    id: string
    description: string;
    amount: string;
    paymentDay: string;
}

export interface IncomesTotal {
    total: number
}

export interface IncomesPost extends Omit<Incomes, "id"> { }