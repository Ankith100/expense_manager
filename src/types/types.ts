export interface Expense {
    id: string;
    userId: string;
    name: string;
    amount: number;
    category?: string;
    date: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateExpenseInput = Omit<Expense, 'createdAt' | 'updatedAt'>;
export type CreateExpenseData = Omit<CreateExpenseInput, 'userId'>;

