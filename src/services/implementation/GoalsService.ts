import axios from 'axios';
import { Pagination } from 'src/types/Pagination';
import dayjs, { Dayjs } from 'dayjs';
import { ICRUD } from '../ICRUD';
import { Envelope } from './EnvelopesService';



export interface Goals {
    id: string;
    description: string;
    amount: string;
    amountTotal: string;
    percentage: string;
    deadline: string;
    monthYear: boolean
}
export interface GoalsPost extends Omit<Goals, 'id'> { }

class GoalsServiceService implements ICRUD<GoalsPost, Goals> {

    read(id: string): Promise<Goals | null> {
        throw new Error('Method not implemented.');
    }

    private baseURL = 'http://localhost:3000/api/goals';


    calcularDataFutura(deadline: string, monthYear: boolean): Dayjs {
        const quantidade = Number(deadline);
        if (Number.isNaN(quantidade) || quantidade <= 0) {
            throw new Error("Prazo inválido");
        }

        return monthYear
            ? dayjs().add(quantidade, 'month')
            : dayjs().add(quantidade, 'year');
    }

    async list({
        page = 1,
        pageSize = 10,
        orderBy = 'createdAt',
        order = 'desc'
    }): Promise<Pagination<Goals>> {

        const response = await axios.get(
            `${this.baseURL}/`,
            {
                params: {
                    page, pageSize, orderBy, order
                },
                withCredentials: true
            }
        );
        return response.data as Pagination<Goals>;
    }

    async create(goals: GoalsPost): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/`,
            {
                description: goals.description,
                amount: goals.amount,
                amountTotal: goals.amountTotal,
                percentage: goals.percentage,
                deadline: this.calcularDataFutura(goals.deadline, goals.monthYear),
            },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async update(goals: Goals): Promise<boolean> {
        const response = await axios.patch(
            `${this.baseURL}/${goals.id}`,
            {
                description: goals.description,
                amount: goals.amount,
                amountTotal: goals.amountTotal,
                percentage: goals.percentage,
                deadline: this.calcularDataFutura(goals.deadline, goals.monthYear),
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

export default new GoalsServiceService();

