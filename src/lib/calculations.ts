import { Transaction } from '../types';

/**
 * Filtra transações pelo mês selecionado (formato "YYYY-MM")
 */
export function filterTransactionsByMonth(transactions: Transaction[], monthStr: string): Transaction[] {
  return transactions.filter(t => t.date.startsWith(monthStr));
}

/**
 * Calcula o resumo do mês: Total de Receitas, Total de Despesas e Saldo
 */
export function getMonthlySummary(transactions: Transaction[], monthStr: string) {
  const filtered = filterTransactionsByMonth(transactions, monthStr);
  
  let income = 0;
  let expense = 0;
  
  filtered.forEach(t => {
    if (t.type === 'income') {
      income += t.amount;
    } else {
      expense += t.amount;
    }
  });
  
  return {
    income,
    expense,
    balance: income - expense
  };
}

/**
 * Agrupa os gastos (ou despesas) por categoria para o gráfico de pizza
 */
export function getExpensesByCategory(transactions: Transaction[], monthStr: string) {
  const filtered = filterTransactionsByMonth(transactions, monthStr)
    .filter(t => t.type === 'expense');
  
  const groups: { [category: string]: number } = {};
  let totalExpense = 0;
  
  filtered.forEach(t => {
    groups[t.category] = (groups[t.category] || 0) + t.amount;
    totalExpense += t.amount;
  });
  
  return Object.keys(groups).map(category => {
    const value = groups[category];
    return {
      name: category,
      value,
      percentage: totalExpense > 0 ? (value / totalExpense) * 100 : 0
    };
  }).sort((a, b) => b.value - a.value);
}

/**
 * Calcula o saldo acumulado ao longo dos dias do mês selecionado
 * para o gráfico de linha.
 */
export function getDailyCumulativeTrend(transactions: Transaction[], monthStr: string) {
  const filtered = filterTransactionsByMonth(transactions, monthStr);
  
  // Obter o número de dias no mês selecionado
  const [year, month] = monthStr.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Agrupar transações por dia do mês
  const dailyNet: { [day: number]: number } = {};
  for (let d = 1; d <= daysInMonth; d++) {
    dailyNet[d] = 0;
  }
  
  filtered.forEach(t => {
    const day = new Date(t.date + 'T00:00:00').getDate();
    const amount = t.type === 'income' ? t.amount : -t.amount;
    if (dailyNet[day] !== undefined) {
      dailyNet[day] += amount;
    }
  });
  
  const data = [];
  let cumulativeBalance = 0;
  
  for (let d = 1; d <= daysInMonth; d++) {
    cumulativeBalance += dailyNet[d];
    data.push({
      day: d,
      dateLabel: `${d}/${month}`,
      'Saldo Acumulado': cumulativeBalance,
      'Resultado do Dia': dailyNet[d]
    });
  }
  
  return data;
}

/**
 * Formata valores numéricos para a moeda brasileira (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
