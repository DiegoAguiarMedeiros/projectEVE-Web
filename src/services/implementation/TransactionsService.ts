import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import { Dayjs } from 'dayjs';
import { ICRUD } from '../ICRUD';
import { Envelope } from './EnvelopesService';

export type TransactionStatus = 'Pending' | 'Paid';

export type TransactionsStatus = 'Pending' | 'Completed';

export const allTransactionsStatus: TransactionsStatus[] = ['Pending', 'Completed']

export type PaymentMethod = 'CreditCard' | 'DebitCard' | 'Cash' | 'BankTransfer' | 'Pix';

export const allPaymentMethod: PaymentMethod[] = ['CreditCard', 'DebitCard', 'Cash', 'BankTransfer', 'Pix']

export type TransactionsType = 'Credit' | 'Debit';

export const allTransactionsType: TransactionsType[] = ['Credit', 'Debit']

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
export interface TransactionsPost {
    creditCardId?: string;
    envelopeId: string;
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
    envelopeId:string;
    year: number;
    month: number;
}

class TransactionsService implements ICRUD<TransactionsPost, Transactions> {

    read(id: string): Promise<Transactions | null> {
        throw new Error('Method not implemented.');
    }

    private baseURL = 'http://localhost:3000/api/transactions';

    async list({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc'
    }): Promise<Pagination<Transactions>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: {
                    page, pageSize, orderBy, order
                },
                withCredentials: true
            }
        );
        return response.data as Pagination<Transactions>;
    }
    
    async listByEnvelope({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc',
        envelopeId,
        month,
        year
    }:TransactionListByEnvelope): Promise<Pagination<Transactions>> {

        const response = await axios.get(
            `${this.baseURL}/envelope/${year}/${month}/${envelopeId}`,
            {
                params: {
                    page, pageSize, orderBy, order
                },
                withCredentials: true
            }
        );
        return response.data as Pagination<Transactions>;
    }

    async create(data: TransactionsPost): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/`,
            {
                creditCardId: data.creditCardId,
                envelopeId: data.envelopeId,
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

    async update(data: Transactions): Promise<boolean> {
        const response = await axios.put(
            `${this.baseURL}/${data.id}`,
            {
                creditCardId: data.creditCardId,
                envelopeId: data.envelopeId,
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

export default new TransactionsService();

