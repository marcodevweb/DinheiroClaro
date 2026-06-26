import React from 'react';
import SummaryCard from './SummaryCard';
import CategoryChart from './CategoryChart';
import BalanceChart from './BalanceChart';
import MonthSelector from './MonthSelector';

interface DashboardProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  summary: {
    income: number;
    expense: number;
    balance: number;
  };
  expensesByCategory: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  dailyTrend: Array<{
    day: number;
    dateLabel: string;
    'Saldo Acumulado': number;
    'Resultado do Dia': number;
  }>;
  onExportPdf: () => void;
  onNavigateToAdd: () => void;
}

export default function Dashboard({
  currentMonth,
  onMonthChange,
  summary,
  expensesByCategory,
  dailyTrend,
  onExportPdf,
  onNavigateToAdd
}: DashboardProps) {
  return (
    <div id="dashboard-wrapper" className="space-y-6">
      {/* Topo com Seletor de Mês, Botão de Novo Lançamento e Exportação */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <MonthSelector 
            currentMonth={currentMonth} 
            onChange={onMonthChange} 
            dark={true}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 self-stretch lg:self-auto">
          <button
            id="go-to-add-transaction-btn"
            onClick={onNavigateToAdd}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-slate-800/80 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xs transition-all cursor-pointer whitespace-nowrap border border-slate-800"
          >
            + Novo Lançamento
          </button>

          <button
            id="export-pdf-btn"
            onClick={onExportPdf}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-xs transition-all cursor-pointer whitespace-nowrap border border-emerald-700"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <SummaryCard 
        income={summary.income} 
        expense={summary.expense} 
        balance={summary.balance} 
      />

      {/* Gráficos em Grid */}
      <div id="charts-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CategoryChart data={expensesByCategory} />
        <BalanceChart data={dailyTrend} />
      </div>
    </div>
  );
}
