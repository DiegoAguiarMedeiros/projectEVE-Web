export interface CreditCards {
    id: string;
    name: string;
    flag: Flags;
    active: boolean;
    userId: string;
}

export interface CreditCardsPost extends Omit<CreditCards, "id" | "active" | "userId"> { }

export type Flags = "Visa" |
    "Mastercard" |
    "American Express" |
    "Discover" |
    "Diners Club" |
    "JCB" |
    "Elo" |
    "Hipercard";

export const allFlags: Flags[] = ["Visa",
    "Mastercard",
    "American Express",
    "Discover",
    "Diners Club",
    "JCB",
    "Elo",
    "Hipercard"]