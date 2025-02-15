import axios from 'axios';

export interface Incomes {
    id:string
    description: string;
    amount: string;
    paymentDay: string;
}
export interface IncomesPost {
    description: string;
    amount: string;
    paymentDay: string;
}

class IncomeService {
    private baseURL = 'http://localhost:3000/api/incomes';

    async getAllIncomes(): Promise<Incomes[]> {
        console.log("getAllIncomes")
        const response = await axios.get(
            `${this.baseURL}/`,
            { withCredentials: true }
        );
        return response.data as Incomes[];
    }
    
    async postIncomes(income:IncomesPost): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/`,
            { description:income.description, amount:income.amount, paymentDay:income.paymentDay },
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }
    async delete(id:string): Promise<boolean> {
        const response = await axios.delete(
            `${this.baseURL}/${id}`,
            { withCredentials: true }
        );
        if (response.data === 'OK') {
            return true;
        }
        return false;
    }

    // // Faz logout e limpa estado local
    // async logout(): Promise<void> {
    //     await axios.post(`${this.baseURL}/auth/logout`, {}, { withCredentials: true });
    //     localStorage.removeItem('user');
    // }

    // // Verifica autenticação de forma assíncrona
    // async checkAuth(): Promise<boolean> {
    //     try {
    //         await axios.get(`${this.baseURL}/user/me`, { withCredentials: true });
    //         return true;
    //     } catch {
    //         return false;
    //     }
    // }

    // // Verifica autenticação de forma síncrona
    // checkAuthSync(): boolean {
    //     const user = localStorage.getItem('user');
    //     return !!user; // Retorna true se o usuário estiver salvo
    // }

    // // Obtém os dados do usuário salvos localmente
    // getUser(): User | null {
    //     const user = localStorage.getItem('user');
    //     return user ? JSON.parse(user) : null;
    // }
}

export default new IncomeService();

