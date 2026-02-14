export interface Debts {
    id: string;
    envelopeId?: string;
    description: string;
    amount: string;
    installmentsTotal: string;
    installmentsPaid: string;
    paymentDay: string;
    status: DebtsStatus;
}

export type DebtsStatus = "debt.status.pending" | "debt.status.paid" | "debt.status.overdue";

export interface DebtsPost extends Omit<Debts, "id"> { }

