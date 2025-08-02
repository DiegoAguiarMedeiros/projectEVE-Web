import axios from 'axios';

export interface Envelope {
    id: string;
    name: string;
    color: string;
    percentage: number;
    amount?: number;
    userId: string;
}
export interface EnvelopePost {
    name: string;
}
export interface EnvelopeUpdateFiledDTO extends Omit<
    Envelope, 'balance' | 'is_editable' | 'userId'
> { }

class EnvelopesService {
    private baseURL = 'http://localhost:3000/api/envelopes';

    read(id: string): Promise<Envelope | null> {
        throw new Error('Method not implemented.');
    }

    async list(): Promise<Envelope[]> {
        const response = await axios.get(
            `${this.baseURL}/`,
            {
                withCredentials: true
            }
        );
        return response.data as Envelope[];
    }
    
    async listWithAmount(year:number,month:number): Promise<Envelope[]> {

        const response = await axios.get(
            `${this.baseURL}/${year}/${month}`,
            {
                withCredentials: true
            }
        );
        return response.data as Envelope[];
    }

    async create(item: EnvelopePost): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/`,
            { name: item.name },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    async update(item: EnvelopeUpdateFiledDTO): Promise<boolean> {
        const response = await axios.patch(
            `${this.baseURL}/${item.id}`,
            {
                name: item.name,
                color: item.color,
                percentage: item.percentage,
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

export default new EnvelopesService();

