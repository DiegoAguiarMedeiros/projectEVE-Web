import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import { Dayjs } from 'dayjs';
import { ICRUD } from '../ICRUD';
import { Envelope } from './EnvelopeService';

export type TransactionStatus = 'Pending' | 'Paid';

export type TransactionsStatus = 'Pending' | 'Completed';

export const allTransactionsStatus: TransactionsStatus[] = ['Pending', 'Completed']

export type PaymentMethod = 'CreditCard' | 'DebitCard' | 'Cash' | 'BankTransfer' | 'Pix';

export const allPaymentMethod: PaymentMethod[] = ['CreditCard', 'DebitCard', 'Cash', 'BankTransfer', 'Pix']

export type TransactionsType = 'Credit' | 'Debit';

export const allTransactionsType: TransactionsType[] = ['Credit', 'Debit']

export interface Transaction {
    id: string;
    creditCardId?: string;
    envelope: Envelope;
    description: string;
    amount: string;
    paymentMethod: PaymentMethod;
    date: Dayjs | null;
    type: TransactionsType;
    status: TransactionsStatus;
}
export interface TransactionPost {
    creditCardId?: string;
    envelope: Envelope;
    description: string;
    amount: string;
    paymentMethod: PaymentMethod;
    date: Dayjs | null;
    type: TransactionsType;
    status: TransactionsStatus;
}

interface TransactionListByEnvelope {
    page: number;
    pageSize: number;
    orderBy: string;
    order: string;
    envelope:string;
}

class TransactionService implements ICRUD<TransactionPost, Transaction> {

    read(id: string): Promise<Transaction | null> {
        throw new Error('Method not implemented.');
    }

    private baseURL = 'http://localhost:3000/api/transaction';

    async list({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc'
    }): Promise<Pagination<Transaction>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: {
                    page: page + 1, pageSize, orderBy, order
                },
                withCredentials: true
            }
        );
        return response.data as Pagination<Transaction>;
    }
    
    async listByEnvelope({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc',
        envelope,
    }:TransactionListByEnvelope): Promise<Pagination<Transaction>> {

        const response = await axios.get(
            `${this.baseURL}/envelope/${envelope}`,
            {
                params: {
                    page: page + 1, pageSize, orderBy, order
                },
                withCredentials: true
            }
        );
        return response.data as Pagination<Transaction>;
    }

    async create(data: TransactionPost): Promise<boolean> {
        console.log("data", data)
        const response = await axios.post(
            `${this.baseURL}/`,
            {
                creditCardId: data.creditCardId,
                envelope: data.envelope,
                description: data.description,
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                date: data.date,
                type: data.type,
                status: data.status,
            },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async update(data: Transaction): Promise<boolean> {
        const response = await axios.put(
            `${this.baseURL}/${data.id}`,
            {
                creditCardId: data.creditCardId,
                envelope: data.envelope,
                description: data.description,
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                date: data.date,
                type: data.type,
                status: data.status,
            },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async updateStatus(id:string,data: TransactionsStatus): Promise<boolean> {
        const response = await axios.patch(
            `${this.baseURL}/${id}/change-status`,
            {
                status: data,
            },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async delete(id: string): Promise<boolean> {
        const response = await axios.delete(
            `${this.baseURL}/${id}`,
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

}

export default new TransactionService();

