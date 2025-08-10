
import { Dayjs } from "dayjs";

export type TransactionStatus = "Pending" | "Paid";

export type TransactionsStatus = "Pending" | "Completed";

export const allTransactionsStatus: TransactionsStatus[] = ["Pending", "Completed"]

export type PaymentMethod = "CreditCard" | "DebitCard" | "Cash" | "BankTransfer" | "Pix";

export const allPaymentMethod: PaymentMethod[] = ["CreditCard", "DebitCard", "Cash", "BankTransfer", "Pix"]

export type TransactionsType = "Credit" | "Debit";

export const allTransactionsType: TransactionsType[] = ["Credit", "Debit"]

export interface Transactions {
    id: string;
    creditCardId?: string;
    envelopeId: string;
    description: string;
    amount: string;
    paymentMethod: PaymentMethod;
    date: Dayjs | null;
    type: TransactionsType;
    status: TransactionsStatus;
}


export interface TransactionsPost extends Omit<Transactions, "id"> { }
export interface TransactionsUpdateStatus extends Omit<Transactions,
    "creditCardId" |
    "envelopeId" |
    "description" |
    "amount" |
    "paymentMethod" |
    "date" |
    "type"
> { }

