import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import { ICRUD } from '../ICRUD';

export interface Income {
    id: string
    description: string;
    amount: string;
    paymentDay: string;
}
export interface IncomePost {
    description: string;
    amount: string;
    paymentDay: string;
}

class IncomeService implements ICRUD<IncomePost, Income> {

    read(id: string): Promise<Income | null> {
        throw new Error('Method not implemented.');
    }

    private baseURL = 'http://localhost:3000/api/income';

    async list({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc'
    }: { page?: number; pageSize?: number, orderBy?: string, order?: string }): Promise<Pagination<Income>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: { page: page + 1, pageSize, orderBy, order
            },
            withCredentials: true
            }
        );
        return response.data as Pagination<Income>;
    }

    async create(income: IncomePost): Promise < boolean > {
    const response = await axios.post(
        `${this.baseURL}/`,
        { description: income.description, amount: income.amount, paymentDay: income.paymentDay },
        { withCredentials: true }
    );
    if(response.data === 'OK') {
    return true;
}
return false;
    }

    async update(income: Income): Promise < boolean > {
    const response = await axios.patch(
        `${this.baseURL}/${income.id}`,
        { description: income.description, amount: income.amount, paymentDay: income.paymentDay },
        { withCredentials: true }
    );
    if(response.data === 'OK') {
    return true;
}
return false;
    }

    async delete (id: string): Promise < boolean > {
    const response = await axios.delete(
        `${this.baseURL}/${id}`,
        { withCredentials: true }
    );
    if(response.data === 'OK') {
    return true;
}
return false;
    }

}

export default new IncomeService();

