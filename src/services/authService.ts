import axios from 'axios';

interface User {
    id: number;
    username: string;
}

class AuthService {
    private baseURL = 'http://192.168.70.6:3000/api';

    // Faz login e salva estado localmente
    async login(email: string, password: string): Promise<void> {
        console.log("login")
        const response = await axios.post(
            `${this.baseURL}/auth/login`,
            { email, password },
            { withCredentials: true }
        );
        console.log("login response",response)
        // Salva informações do usuário localmente
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    async registration(name: string, email: string, password: string): Promise<boolean> {
        const response = await axios.post(
            `${this.baseURL}/auth`,
            { name, email, password },
            { withCredentials: true }
        );
        console.log("registration response",response)
        if (response.data === 'OK') {
            this.login(email, password)
            return true;
        }
        return false;
    }

    // Faz logout e limpa estado local
    async logout(): Promise<void> {
        await axios.post(`${this.baseURL}/auth/logout`, {}, { withCredentials: true });
        localStorage.removeItem('user');
    }

    // Verifica autenticação de forma assíncrona
    async checkAuth(): Promise<boolean> {
        try {
            await axios.get(`${this.baseURL}/user/me`, { withCredentials: true });
            return true;
        } catch {
            return false;
        }
    }

    // Verifica autenticação de forma síncrona
    checkAuthSync(): boolean {
        const user = localStorage.getItem('user');
        return !!user; // Retorna true se o usuário estiver salvo
    }

    // Obtém os dados do usuário salvos localmente
    getUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

export default new AuthService();

