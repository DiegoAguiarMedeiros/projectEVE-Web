import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import { Dayjs } from 'dayjs';
import { ICRUD } from '../ICRUD';
import { Envelope } from './EnvelopesService';



export interface FixedExpenses {
    id: string;
    envelopeId: string;
    description: string;
    amount: string;
    paymentDay: string;
}
export interface FixedExpensesPost {
    envelopeId: string;
    description: string;
    amount: string;
    paymentDay: string;
}

class FixedExpensesService implements ICRUD<FixedExpensesPost, FixedExpenses> {

    read(id: string): Promise<FixedExpenses | null> {
        throw new Error('Method not implemented.');
    }

    private baseURL = 'http://localhost:3000/api/fixed-expenses';

    async list({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc'
    }): Promise<Pagination<FixedExpenses>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: {
                    page: page + 1, pageSize, orderBy, order
                },
                withCredentials: true
            }
        );
        return response.data as Pagination<FixedExpenses>;
    }

    async create(FixedExpenses: FixedExpensesPost): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/`,
            {
                description: FixedExpenses.description,
                amount: FixedExpenses.amount,
                envelopeId: FixedExpenses.envelopeId,
                paymentDay: FixedExpenses.paymentDay,
            },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async update(FixedExpenses: FixedExpenses): Promise<boolean> {
        const response = await axios.patch(
            `${this.baseURL}/${FixedExpenses.id}`,
            {
                description: FixedExpenses.description,
                amount: FixedExpenses.amount,
                envelopeId: FixedExpenses.envelopeId,
                paymentDay: FixedExpenses.paymentDay,
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

export default new FixedExpensesService();

