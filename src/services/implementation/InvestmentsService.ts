import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import { ICRUD } from '../ICRUD';

export type InvestmentsType = 'fixed_income' | 'variable_income' | 'real_estate' | 'crypto' | 'other';

export type InvestmentsStatus = 'active' | 'closed' | 'redeemed';

export interface Investments {
    id: string;
    description: string;
    type: InvestmentsType | null;
    amount: string;
    profitability: string;
    applicationDate: string;
    maturityDate: string;
    status: InvestmentsStatus;
}
export interface InvestmentsPost {
    description: string;
    type: InvestmentsType | null;
    amount: string;
    profitability: string;
    applicationDate: string;
    maturityDate: string;
    status: InvestmentsStatus;
}

class InvestmentsService implements ICRUD<InvestmentsPost, Investments> {

    read(id: string): Promise<Investments | null> {
        throw new Error('Method not implemented.');
    }

    private baseURL = 'http://localhost:3000/api/investments';

    async list({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc'
    }): Promise<Pagination<Investments>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: {
                    page: page + 1, pageSize, orderBy, order
                },
                withCredentials: true
            }
        );
        return response.data as Pagination<Investments>;
    }

    async create(investments: InvestmentsPost): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/`,
            {
                description: investments.description,
                amount: investments.amount,
                type: investments.type,
                profitability: investments.profitability,
                applicationDate: investments.applicationDate,
                maturityDate: investments.maturityDate,
                status: investments.status,
            },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async update(investments: Investments): Promise<boolean> {
        const response = await axios.patch(
            `${this.baseURL}/${investments.id}`,
            {
                description: investments.description,
                amount: investments.amount,
                type: investments.type,
                profitability: investments.profitability,
                applicationDate: investments.applicationDate,
                maturityDate: investments.maturityDate,
                status: investments.status,
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

export default new InvestmentsService();

