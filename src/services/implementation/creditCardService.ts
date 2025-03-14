import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import { ICRUD } from '../ICRUD';

export interface CreditCard {
    id: string;
    name: string;
    flag: string;
    active: boolean;
    userId: string;
  }
export interface CreditCardPost {
    name: string;
    flag: string;
    active?: boolean;
    userId?: string;
  }

class CreditCardService implements ICRUD<CreditCardPost,CreditCard> {
    private baseURL = 'http://localhost:3000/api/credit-cards';

    read(id: string): Promise<CreditCard | null> {
        throw new Error('Method not implemented.');
    }

    async list({
        page = 1,
        pageSize = 10,
    }: { page?: number; pageSize?: number }): Promise<Pagination<CreditCard>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: { page: page + 1, pageSize },
                withCredentials: true
            }
        );
        return response.data as Pagination<CreditCard>;
    }

    async create(item: CreditCardPost): Promise<boolean> {
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

    async update(item: CreditCard): Promise<boolean> {
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

export default new CreditCardService();

