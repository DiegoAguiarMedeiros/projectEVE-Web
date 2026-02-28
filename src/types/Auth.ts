export interface LoginPayload {
    email: string;
    password: string;
    locale?: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    locale?: string;
}

export interface AuthResponse {
    id: string;
    name: string;
    email: string;
}