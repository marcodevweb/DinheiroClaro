import React, { useState } from 'react';
import { Category, Transaction } from '../types';

interface TransactionFormProps {
  categories: Category[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onAddCategory: (newCategoryName: string) => void;
  dark?: boolean;
}

export default function TransactionForm({ 
  categories, 
  onAddTransaction, 
  onAddCategory,
  dark = false
}: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Gerenciamento de criação de categoria customizada
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [categoryError, setCategoryError] = useState<string>('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) {
      setCategoryError('O nome não pode ser vazio.');
      return;
    }

    // Verificar se já existe
    const exists = categories.some(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setCategoryError('Esta categoria já existe.');
      return;
    }

    onAddCategory(name);
    setCategory(name); // Auto-seleciona a nova categoria criada
    setNewCategoryName('');
    setIsCreatingCategory(false);
    setCategoryError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(',', '.'));
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Por favor, insira um valor válido maior que zero.');
      return;
    }

    if (!category) {
      alert('Por favor, selecione uma categoria.');
      return;
    }

    onAddTransaction({
      type,
      amount: numericAmount,
      category,
      description: description.trim(),
      date
    });

    // Limpar campos
    setAmount('');
    setDescription('');
    // Manter a data e categoria para facilitar lançamentos recorrentes
  };

  return (
    <div 
      id="transaction-form-card" 
      className={`p-6 rounded-xl border shadow-xs h-full flex flex-col gap-4 transition-all duration-200 ${
        dark 
          ? 'bg-[#0e1322] border-slate-800/80 hover:border-slate-700' 
          : 'bg-white border-gray-150 hover:border-slate-300'
      }`}
    >
      <h3 className={`text-sm font-bold uppercase tracking-wider ${dark ? 'text-white' : 'text-gray-700'}`}>
        Novo Lançamento
      </h3>

      {/* Tipo de Lançamento (Abas com design geométrico limpo) */}
      <div className="grid grid-cols-2 gap-2">
        <button
          id="toggle-expense-btn"
          type="button"
          onClick={() => setType('expense')}
          className={`py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all text-center border cursor-pointer ${
            type === 'expense'
              ? dark
                ? 'bg-red-950/40 border-red-900/50 text-red-400 font-bold'
                : 'bg-red-50 border-red-200 text-red-600 font-bold'
              : dark
                ? 'bg-[#0b0f19] border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-white border-gray-150 text-gray-400 hover:text-gray-600'
          }`}
        >
          Despesa
        </button>
        <button
          id="toggle-income-btn"
          type="button"
          onClick={() => setType('income')}
          className={`py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all text-center border cursor-pointer ${
            type === 'income'
              ? dark
                ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400 font-bold'
                : 'bg-emerald-50 border-emerald-200 text-emerald-600 font-bold'
              : dark
                ? 'bg-[#0b0f19] border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-white border-gray-150 text-gray-400 hover:text-gray-600'
          }`}
        >
          Receita
        </button>
      </div>

      <form id="add-transaction-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Valor */}
        <div>
          <label htmlFor="amount-input" className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
            Valor
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={`text-sm font-mono font-medium ${dark ? 'text-slate-500' : 'text-gray-400'}`}>R$</span>
            </div>
            <input
              id="amount-input"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9,.]/g, ''))}
              required
              className={`block w-full pl-9 pr-3 py-2 border rounded-lg text-sm font-mono transition-all duration-150 focus:ring-2 focus:ring-emerald-500/10 ${
                dark 
                  ? 'bg-[#0b0f19] border-slate-800 text-white focus:bg-[#0b0f19] focus:border-emerald-500' 
                  : 'bg-gray-50 border-gray-150 text-slate-800 focus:bg-white focus:border-emerald-500'
              }`}
            />
          </div>
        </div>

        {/* Data */}
        <div>
          <label htmlFor="date-input" className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
            Data
          </label>
          <div className="relative rounded-lg">
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={`block w-full px-3 py-2 border rounded-lg text-sm transition-all duration-150 focus:ring-2 focus:ring-emerald-500/10 ${
                dark 
                  ? 'bg-[#0b0f19] border-slate-800 text-white focus:bg-[#0b0f19] focus:border-emerald-500' 
                  : 'bg-gray-50 border-gray-200 text-slate-800 focus:bg-white focus:border-emerald-500'
              }`}
            />
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="category-select" className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
            Categoria
          </label>
          <div className="relative rounded-lg">
            <select
              id="category-select"
              value={category}
              onChange={(e) => {
                if (e.target.value === 'NEW_CATEGORY') {
                  setIsCreatingCategory(true);
                } else {
                  setCategory(e.target.value);
                }
              }}
              required
              className={`block w-full px-3 py-2 border rounded-lg text-sm transition-all duration-150 cursor-pointer focus:ring-2 focus:ring-emerald-500/10 ${
                dark 
                  ? 'bg-[#0b0f19] border-slate-800 text-white focus:bg-[#0b0f19] focus:border-emerald-500' 
                  : 'bg-gray-50 border-gray-150 text-slate-800 focus:bg-white focus:border-emerald-500'
              }`}
            >
              <option value="" disabled className={dark ? 'bg-[#0e1322] text-slate-400' : ''}>Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name} className={dark ? 'bg-[#0e1322] text-white' : ''}>
                  {cat.name}
                </option>
              ))}
              <option value="NEW_CATEGORY" className={`font-bold ${dark ? 'bg-[#0e1322] text-emerald-400' : 'text-emerald-600'}`}>
                + Criar Nova Categoria
              </option>
            </select>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description-input" className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
            Descrição
          </label>
          <div className="relative rounded-lg">
            <input
              id="description-input"
              type="text"
              placeholder="Ex: Supermercado, Aluguel, Uber..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`block w-full px-3 py-2 border rounded-lg text-sm transition-all duration-150 focus:ring-2 focus:ring-emerald-500/10 ${
                dark 
                  ? 'bg-[#0b0f19] border-slate-800 text-white focus:bg-[#0b0f19] focus:border-emerald-500' 
                  : 'bg-gray-50 border-gray-200 text-slate-800 focus:bg-white focus:border-emerald-500'
              }`}
            />
          </div>
        </div>

        <button
          id="submit-transaction-btn"
          type="submit"
          className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-white shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            type === 'expense' 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          Adicionar Lançamento
        </button>
      </form>

      {/* Popover / Form inline para criar nova categoria */}
      {isCreatingCategory && (
        <div id="new-category-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`p-5 rounded-xl border shadow-xl max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
            dark 
              ? 'bg-[#0e1322] border-slate-800 text-white' 
              : 'bg-white border-gray-150 text-gray-800'
          }`}>
            <div>
              <h4 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Criar Nova Categoria</h4>
              <p className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Crie uma categoria personalizada para classificar seus lançamentos.</p>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <input
                  id="new-category-input"
                  type="text"
                  placeholder="Nome da categoria (Ex: Academia)"
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    if (categoryError) setCategoryError('');
                  }}
                  autoFocus
                  className={`block w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-emerald-500/20 ${
                    dark 
                      ? 'bg-[#0b0f19] border-slate-800 text-white focus:border-emerald-500' 
                      : 'bg-white border-gray-200 text-slate-800 focus:border-emerald-500'
                  }`}
                />
                {categoryError && (
                  <p id="category-error-text" className="text-xs text-red-400 mt-1">{categoryError}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  id="cancel-category-btn"
                  type="button"
                  onClick={() => {
                    setIsCreatingCategory(false);
                    setNewCategoryName('');
                    setCategoryError('');
                  }}
                  className={`px-3 py-2 rounded-lg border font-medium cursor-pointer transition-colors ${
                    dark 
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80' 
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  id="save-category-btn"
                  type="submit"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold cursor-pointer transition-colors"
                >
                  Criar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
