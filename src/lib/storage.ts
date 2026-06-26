import { Transaction, Category } from '../types';

const TRANSACTIONS_KEY = 'dinheiro_claro_transactions';
const CATEGORIES_KEY = 'dinheiro_claro_categories';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'alimentacao', name: 'Alimentação' },
  { id: 'transporte', name: 'Transporte' },
  { id: 'moradia', name: 'Moradia' },
  { id: 'lazer', name: 'Lazer' },
  { id: 'saude', name: 'Saúde' },
  { id: 'salario', name: 'Salário' },
  { id: 'outros', name: 'Outros' }
];

export function getTransactions(userEmail?: string): Transaction[] {
  try {
    const key = userEmail ? `${TRANSACTIONS_KEY}_${userEmail}` : TRANSACTIONS_KEY;
    const data = localStorage.getItem(key);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: any) => ({
      ...item,
      amount: Number(item.amount) || 0,
      date: item.date || new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Erro ao ler transações do localStorage:', error);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[], userEmail?: string): void {
  try {
    const key = userEmail ? `${TRANSACTIONS_KEY}_${userEmail}` : TRANSACTIONS_KEY;
    localStorage.setItem(key, JSON.stringify(transactions));
  } catch (error) {
    console.error('Erro ao salvar transações no localStorage:', error);
  }
}

export function getCategories(userEmail?: string): Category[] {
  try {
    const key = userEmail ? `${CATEGORIES_KEY}_${userEmail}` : CATEGORIES_KEY;
    const data = localStorage.getItem(key);
    if (!data) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CATEGORIES;
    return parsed;
  } catch (error) {
    console.error('Erro ao ler categorias do localStorage:', error);
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[], userEmail?: string): void {
  try {
    const key = userEmail ? `${CATEGORIES_KEY}_${userEmail}` : CATEGORIES_KEY;
    localStorage.setItem(key, JSON.stringify(categories));
  } catch (error) {
    console.error('Erro ao salvar categorias no localStorage:', error);
  }
}
