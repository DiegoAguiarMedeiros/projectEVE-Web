import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import { ICRUD } from '../ICRUD';

export interface CreditCards {
    id: string;
    name: string;
    flag: Flags;
    active: boolean;
    userId: string;
}
export interface CreditCardsPost {
    name: string;
    flag: Flags;
    active?: boolean;
    userId?: string;
}

export type Flags = 'Visa' |
    'Mastercard' |
    'American Express' |
    'Discover' |
    'Diners Club' |
    'JCB' |
    'Elo' |
    'Hipercard';

export const allFlags: Flags[] = ['Visa',
    'Mastercard',
    'American Express',
    'Discover',
    'Diners Club',
    'JCB',
    'Elo',
    'Hipercard']

class CreditCardsService implements ICRUD<CreditCardsPost, CreditCards> {
    private baseURL = 'http://localhost:3000/api/credit-cards';

    read(id: string): Promise<CreditCards | null> {
        throw new Error('Method not implemented.');
    }

    async list({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc'
    }: { page?: number; pageSize?: number, orderBy?: string, order?: string }): Promise<Pagination<CreditCards>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: { page, pageSize, orderBy, order },
                withCredentials: true
            }
        );
        return response.data as Pagination<CreditCards>;
    }

    async create(item: CreditCardsPost): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/`,
            { name: item.name, flag: item.flag },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async update(item: CreditCards): Promise<boolean> {
        const response = await axios.patch(
            `${this.baseURL}/${item.id}`,
            { name: item.name, flag: item.flag },
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

export default new CreditCardsService();

