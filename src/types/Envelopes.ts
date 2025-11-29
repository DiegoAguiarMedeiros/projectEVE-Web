export interface Envelopes {
    id: string;
    name: string;
    color: string;
    percentage: number;
    amount?: number;
    used?: number;
    userId?: string;
}

export interface EnvelopesPost extends Omit<Envelopes, "id"> { }