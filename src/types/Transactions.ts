
import { Dayjs } from "dayjs";

export type TransactionStatus = string;

export type TransactionsStatus =
    | "transaction.status.pending"
    | "transaction.status.completed"
    | "transaction.status.overdue"
    | "transaction.status.cancelled";

export const allTransactionsStatus: TransactionsStatus[] = [
    "transaction.status.pending",
    "transaction.status.completed",
    "transaction.status.overdue",
    "transaction.status.cancelled"
]

export type PaymentMethod =
    | "envelope.transaction.payment_method.CreditCard"
    | "envelope.transaction.payment_method.DebitCard"
    | "envelope.transaction.payment_method.Cash"
    | "envelope.transaction.payment_method.BankTransfer"
    | "envelope.transaction.payment_method.Pix"
    | "envelope.transaction.payment_method.Reallocation"
    | "envelope.transaction.payment_method.Ticket";

export const allPaymentMethod: PaymentMethod[] = [
    "envelope.transaction.payment_method.CreditCard",
    "envelope.transaction.payment_method.DebitCard",
    "envelope.transaction.payment_method.Cash",
    "envelope.transaction.payment_method.BankTransfer",
    "envelope.transaction.payment_method.Pix",
    "envelope.transaction.payment_method.Reallocation",
    "envelope.transaction.payment_method.Ticket"
]

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
    isTranslatable?: boolean;
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

