
export interface Expense {
    id: string;
    userId: string;
    name: string;
    amount: number;
    categoryId: string;
    date : Date
    notes?: string
    createdAt: Date
    updatedAt: Date
}

