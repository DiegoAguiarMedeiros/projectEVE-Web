import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import { Dayjs } from 'dayjs';
import { ICRUD } from '../ICRUD';

export type DebtStatus = 'Pending' | 'Paid' ;

export interface Debt {
    id: string;
    envelopeId?: string;
    description: string;
    amount: string;
    installmentsTotal: string;
    installmentsPaid: string;
    paymentDay: string;
    status: DebtStatus;
  }
export interface DebtPost {
    description: string;
    amount: string;
    installmentsTotal: string;
    installmentsPaid: string;
    paymentDay: string;
    status: DebtStatus;
  }

class DebtService implements ICRUD<DebtPost, Debt> {

    read(id: string): Promise<Debt | null> {
        throw new Error('Method not implemented.');
    }

    private baseURL = 'http://localhost:3000/api/debt';

    async list({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc'
    }): Promise<Pagination<Debt>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: {
                    page: page + 1, pageSize, orderBy, order
                },
                withCredentials: true
            }
        );
        return response.data as Pagination<Debt>;
    }

    async create(debt: DebtPost): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/`,
            {
                description: debt.description,
                amount: debt.amount,
                installmentsTotal: debt.installmentsTotal,
                installmentsPaid: debt.installmentsPaid,
                paymentDay: debt.paymentDay,
                status: debt.status,
            },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async update(debt: Debt): Promise<boolean> {
        const response = await axios.patch(
            `${this.baseURL}/${debt.id}`,
            {
                description: debt.description,
                amount: debt.amount,
                installmentsTotal: debt.installmentsTotal,
                installmentsPaid: debt.installmentsPaid,
                paymentDay: debt.paymentDay,
                status: debt.status,
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

export default new DebtService();

