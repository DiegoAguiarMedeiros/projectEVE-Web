import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import { Dayjs } from 'dayjs';
import { ICRUD } from '../ICRUD';
import { Envelope } from './EnvelopeService';



export interface FixedExpense {
    id: string;
    envelope: Envelope;
    description: string;
    amount: string;
    paymentDay: string;
}
export interface FixedExpensePost {
    envelope: Envelope;
    description: string;
    amount: string;
    paymentDay: string;
}

class FixedExpenseService implements ICRUD<FixedExpensePost, FixedExpense> {

    read(id: string): Promise<FixedExpense | null> {
        throw new Error('Method not implemented.');
    }

    private baseURL = 'http://localhost:3000/api/fixed-expense';

    async list({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc'
    }): Promise<Pagination<FixedExpense>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: {
                    page: page + 1, pageSize, orderBy, order
                },
                withCredentials: true
            }
        );
        return response.data as Pagination<FixedExpense>;
    }

    async create(FixedExpense: FixedExpensePost): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/`,
            {
                description: FixedExpense.description,
                amount: FixedExpense.amount,
                envelope: FixedExpense.envelope,
                paymentDay: FixedExpense.paymentDay,
            },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async update(FixedExpense: FixedExpense): Promise<boolean> {
        const response = await axios.patch(
            `${this.baseURL}/${FixedExpense.id}`,
            {
                description: FixedExpense.description,
                amount: FixedExpense.amount,
                envelope: FixedExpense.envelope,
                paymentDay: FixedExpense.paymentDay,
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

export default new FixedExpenseService();

