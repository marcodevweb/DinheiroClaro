import React from 'react';
import { formatCurrency } from '../lib/calculations';

interface SummaryCardProps {
  income: number;
  expense: number;
  balance: number;
}

export default function SummaryCard({ income, expense, balance }: SummaryCardProps) {
  const isPositive = balance >= 0;
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
  const expenseRatio = income > 0 ? (expense / income) * 100 : 0;

  return (
    <div id="summary-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card Saldo */}
      <div 
        id="card-balance" 
        className="bg-[#0e1322] p-6 rounded-xl border border-slate-800/80 shadow-xs flex flex-col justify-between hover:border-slate-700 transition-all duration-200"
      >
        <div className="space-y-1.5">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Saldo do Mês</p>
          <p className={`text-3xl font-bold font-sans tracking-tight ${
            isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
          <span className="text-slate-500">Taxa de Poupança</span>
          <span className={isPositive && savingsRate > 0 ? 'text-emerald-400' : 'text-slate-400'}>
            {income > 0 ? `${savingsRate.toFixed(1)}%` : '0.0%'}
          </span>
        </div>
      </div>

      {/* Card Receitas */}
      <div 
        id="card-income" 
        className="bg-[#0e1322] p-6 rounded-xl border border-slate-800/80 shadow-xs flex flex-col justify-between hover:border-slate-700 transition-all duration-200"
      >
        <div className="space-y-1.5">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Receitas Acumuladas</p>
          <p className="text-3xl font-bold font-sans text-emerald-400 tracking-tight">
            +{formatCurrency(income)}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
          <span className="text-slate-500">Status de Entrada</span>
          <span className="text-emerald-400 font-mono">Lançamentos Ativos</span>
        </div>
      </div>

      {/* Card Despesas */}
      <div 
        id="card-expense" 
        className="bg-[#0e1322] p-6 rounded-xl border border-slate-800/80 shadow-xs flex flex-col justify-between hover:border-slate-700 transition-all duration-200"
      >
        <div className="space-y-1.5">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Despesas Totais</p>
          <p className="text-3xl font-bold font-sans text-red-400 tracking-tight">
            -{formatCurrency(expense)}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
          <span className="text-slate-500">Comprometimento de Renda</span>
          <span className={`font-mono ${expenseRatio > 80 ? 'text-red-400' : 'text-slate-400'}`}>
            {income > 0 ? `${expenseRatio.toFixed(1)}%` : '0.0%'}
          </span>
        </div>
      </div>
    </div>
  );
}
