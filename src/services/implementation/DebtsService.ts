import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import { Dayjs } from 'dayjs';
import { ICRUD } from '../ICRUD';

export type DebtsStatus = 'Pending' | 'Paid' ;

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
export interface DebtsPost {
    description: string;
    amount: string;
    installmentsTotal: string;
    installmentsPaid: string;
    paymentDay: string;
    status: DebtsStatus;
  }

class DebtsService implements ICRUD<DebtsPost, Debts> {

    read(id: string): Promise<Debts | null> {
        throw new Error('Method not implemented.');
    }

    private baseURL = 'http://localhost:3000/api/debts';

    async list({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc'
    }): Promise<Pagination<Debts>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: {
                    page: page + 1, pageSize, orderBy, order
                },
                withCredentials: true
            }
        );
        return response.data as Pagination<Debts>;
    }

    async create(debts: DebtsPost): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/`,
            {
                description: debts.description,
                amount: debts.amount,
                installmentsTotal: debts.installmentsTotal,
                installmentsPaid: debts.installmentsPaid,
                paymentDay: debts.paymentDay,
                status: debts.status,
            },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async update(debts: Debts): Promise<boolean> {
        const response = await axios.patch(
            `${this.baseURL}/${debts.id}`,
            {
                description: debts.description,
                amount: debts.amount,
                installmentsTotal: debts.installmentsTotal,
                installmentsPaid: debts.installmentsPaid,
                paymentDay: debts.paymentDay,
                status: debts.status,
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

export default new DebtsService();

