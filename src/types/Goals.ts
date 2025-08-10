export interface Goals {
    id: string;
    description: string;
    amount: string;
    amountTotal: string;
    percentage: string;
    deadline: string;
    monthYear: boolean
}

export interface GoalsPost extends Omit<Goals, "id"> { }