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

export type DebtsStatus = "Pending" | "Paid";

export interface DebtsPost extends Omit<Debts, "id"> { }

