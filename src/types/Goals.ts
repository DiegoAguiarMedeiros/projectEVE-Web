export interface Goals {
    id: string;
    description: string;
    amount: string | number;
    amountTotal: string | number;
    percentage: string | number;
    deadline: number;
    monthYear: boolean
}

export interface GoalsPost extends Omit<Goals, "id"> { }
