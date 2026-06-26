export interface Transaction {
  id: string;
  type: 'income' | 'expense'; // 'income' = receita, 'expense' = despesa
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}
