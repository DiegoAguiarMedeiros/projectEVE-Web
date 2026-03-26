import dayjs from "dayjs";
import { Transactions } from "src/types/Transactions";
import { Pagination } from "src/types/Pagination";

export const mockTransactions: Transactions[] = [
    {
        id: "mock-1",
        envelopeId: "mock-env",
        description: "Supermercado Extra",
        amount: "238.50",
        paymentMethod: "envelope.transaction.payment_method.DebitCard",
        date: dayjs(),
        type: "Debit",
        status: "transaction.status.completed",
    },
    {
        id: "mock-2",
        envelopeId: "mock-env",
        description: "Freelance Design",
        amount: "850.00",
        paymentMethod: "envelope.transaction.payment_method.Pix",
        date: dayjs(),
        type: "Credit",
        status: "transaction.status.pending",
    },
    {
        id: "mock-3",
        envelopeId: "mock-env",
        description: "Netflix",
        amount: "55.90",
        paymentMethod: "envelope.transaction.payment_method.CreditCard",
        date: dayjs().subtract(1, "day"),
        type: "Debit",
        status: "transaction.status.completed",
    },
    {
        id: "mock-4",
        envelopeId: "mock-env",
        description: "Salário",
        amount: "4500.00",
        paymentMethod: "envelope.transaction.payment_method.BankTransfer",
        date: dayjs().subtract(1, "day"),
        type: "Credit",
        status: "transaction.status.completed",
    },
    {
        id: "mock-5",
        envelopeId: "mock-env",
        description: "Farmácia",
        amount: "89.30",
        paymentMethod: "envelope.transaction.payment_method.Cash",
        date: dayjs().subtract(3, "day"),
        type: "Debit",
        status: "transaction.status.overdue",
    },
    {
        id: "mock-6",
        envelopeId: "mock-env",
        description: "Conta de Luz",
        amount: "142.00",
        paymentMethod: "envelope.transaction.payment_method.Ticket",
        date: dayjs().subtract(3, "day"),
        type: "Debit",
        status: "transaction.status.pending",
    },
];

export const mockPagination: Pagination<Transactions> = {
    currentPage: 0,
    pageSize: 6,
    totalPages: 1,
    totalItems: 6,
    data: mockTransactions,
};

export const mockTable = {
    page: 0,
    order: "desc" as const,
    orderBy: "date",
    rowsPerPage: 10,
    selected: [],
    onSort: () => {},
    onSelectAllRows: () => {},
    onSelectRow: () => {},
    onResetPage: () => {},
    onChangePage: () => {},
    onChangeRowsPerPage: () => {},
};
