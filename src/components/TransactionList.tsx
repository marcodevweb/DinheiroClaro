import React, { useState } from 'react';
import { Transaction, Category } from '../types';
import { formatCurrency } from '../lib/calculations';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onUpdateTransaction: (id: string, updated: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
  dark?: boolean;
}

export default function TransactionList({
  transactions,
  categories,
  onUpdateTransaction,
  onDeleteTransaction,
  dark = false
}: TransactionListProps) {
  // Filtros internos (busca por descrição/categoria e tipo)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Estado para edição inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');
  const [editType, setEditType] = useState<'income' | 'expense'>('expense');
  const [editAmount, setEditAmount] = useState<string>('');

  // Ativar edição para uma transação específica
  const startEditing = (t: Transaction) => {
    setEditingId(t.id);
    setEditDate(t.date);
    setEditDescription(t.description);
    setEditCategory(t.category);
    setEditType(t.type);
    setEditAmount(String(t.amount));
  };

  // Cancelar a edição
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Salvar a edição realizada
  const saveEditing = (id: string) => {
    const numericAmount = parseFloat(editAmount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Por favor, insira um valor válido maior que zero.');
      return;
    }

    onUpdateTransaction(id, {
      date: editDate,
      description: editDescription.trim(),
      category: editCategory,
      type: editType,
      amount: numericAmount
    });
    setEditingId(null);
  };

  // Filtragem e Ordenação
  const filtered = transactions
    .filter(t => {
      const matchesSearch = 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = a.date.localeCompare(b.date);
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div 
      id="transaction-list-card" 
      className={`rounded-xl border shadow-xs overflow-hidden flex flex-col h-full transition-all duration-200 ${
        dark 
          ? 'bg-[#0e1322] border-slate-800/80 hover:border-slate-700' 
          : 'bg-white border-gray-150 hover:border-slate-300'
      }`}
    >
      {/* Barra de Filtros / Busca */}
      <div className={`p-4 border-b space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4 ${
        dark ? 'border-slate-800/60 bg-[#0e1322]' : 'border-gray-150 bg-gray-50/30'
      }`}>
        <div>
          <h3 className={`text-[10px] font-extrabold uppercase tracking-widest ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
            Histórico do Período
          </h3>
          <p className={`text-xs font-bold mt-0.5 ${dark ? 'text-white' : 'text-slate-800'}`}>
            Listagem de todas as movimentações
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-xl justify-end">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <input
              id="search-transactions-input"
              type="text"
              placeholder="Buscar descrição ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-1.5 border rounded-lg text-xs transition-all duration-150 focus:ring-2 focus:ring-emerald-500/10 ${
                dark 
                  ? 'bg-[#0b0f19] border-slate-800 text-white focus:bg-[#0b0f19] focus:border-emerald-500' 
                  : 'bg-gray-50 border-gray-150 text-slate-800 focus:bg-white focus:border-emerald-500'
              }`}
            />
          </div>

          {/* Filtro de Tipo */}
          <select
            id="filter-type-select"
            value={typeFilter}
            onChange={(e: any) => setTypeFilter(e.target.value)}
            className={`border rounded-lg py-1.5 px-3 text-xs cursor-pointer transition-all duration-150 font-bold uppercase tracking-wider text-[10px] focus:ring-2 focus:ring-emerald-500/10 ${
              dark 
                ? 'bg-[#0b0f19] border-slate-800 text-slate-300 focus:bg-[#0b0f19] focus:border-emerald-500' 
                : 'bg-gray-50 border-gray-150 text-slate-600 focus:bg-white focus:border-emerald-500'
            }`}
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Apenas Receitas</option>
            <option value="expense">Apenas Despesas</option>
          </select>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="flex-1 overflow-auto max-h-[480px]">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <p className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
              Nenhum lançamento encontrado
            </p>
            <p className={`text-xs max-w-sm mx-auto ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
              {searchTerm || typeFilter !== 'all' 
                ? 'Tente ajustar os termos de busca ou filtros selecionados.' 
                : 'Insira um novo lançamento no painel lateral para começar a gerenciar.'}
            </p>
          </div>
        ) : (
          <>
            {/* Versão Desktop (Tabela) */}
            <table id="transactions-table-desktop" className="hidden md:table w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b text-[9px] font-bold uppercase tracking-widest select-none ${
                  dark 
                    ? 'border-slate-800/80 bg-[#0b0f19]/60 text-slate-400' 
                    : 'border-gray-200 bg-gray-50/30 text-gray-400'
                }`}>
                  <th className={`py-3 px-4 cursor-pointer transition-colors ${dark ? 'hover:text-white' : 'hover:text-gray-600'}`} onClick={() => toggleSort('date')}>
                    <div className="flex items-center gap-1">
                      Data <span className={`text-[10px] font-normal ${dark ? 'text-slate-500' : 'text-gray-400'}`}>↕</span>
                    </div>
                  </th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className={`py-3 px-4 text-right cursor-pointer transition-colors ${dark ? 'hover:text-white' : 'hover:text-gray-600'}`} onClick={() => toggleSort('amount')}>
                    <div className="flex items-center justify-end gap-1">
                      Valor <span className={`text-[10px] font-normal ${dark ? 'text-slate-500' : 'text-gray-400'}`}>↕</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dark ? 'divide-slate-800/50' : 'divide-gray-200'}`}>
                {filtered.map((t) => {
                  const isEditing = editingId === t.id;
                  const [yVal, mVal, dVal] = t.date.split('-');
                  const formattedDate = `${dVal}/${mVal}/${yVal}`;

                  if (isEditing) {
                    return (
                      <tr key={t.id} className={dark ? 'bg-[#0b0f19]/80' : 'bg-gray-50/70'}>
                        {/* Data */}
                        <td className="py-2.5 px-4">
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className={`border rounded-md px-2 py-1 w-full text-xs font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 ${
                              dark ? 'bg-[#0b0f19] border-slate-800 text-white' : 'bg-white border-gray-200'
                            }`}
                          />
                        </td>
                        {/* Descrição */}
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className={`border rounded-md px-2 py-1 w-full text-xs focus:border-emerald-500 ${
                              dark ? 'bg-[#0b0f19] border-slate-800 text-white' : 'bg-white border-gray-200'
                            }`}
                          />
                        </td>
                        {/* Categoria */}
                        <td className="py-2.5 px-4">
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className={`border rounded-md px-2 py-1 w-full text-xs focus:border-emerald-500 ${
                              dark ? 'bg-[#0b0f19] border-slate-800 text-white' : 'bg-white border-gray-200'
                            }`}
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </td>
                        {/* Tipo */}
                        <td className="py-2.5 px-4">
                          <select
                            value={editType}
                            onChange={(e: any) => setEditType(e.target.value)}
                            className={`border rounded-md px-2 py-1 w-full text-xs focus:border-emerald-500 ${
                              dark ? 'bg-[#0b0f19] border-slate-800 text-white' : 'bg-white border-gray-200'
                            }`}
                          >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                          </select>
                        </td>
                        {/* Valor */}
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className={`border rounded-md px-2 py-1 w-full text-xs font-mono text-right focus:border-emerald-500 ${
                              dark ? 'bg-[#0b0f19] border-slate-800 text-white text-right' : 'bg-white border-gray-200 text-right'
                            }`}
                          />
                        </td>
                        {/* Ações */}
                        <td className="py-2.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              id={`save-edit-btn-${t.id}`}
                              onClick={() => saveEditing(t.id)}
                              className={`px-2 py-1 rounded font-bold text-[9px] uppercase tracking-wider cursor-pointer ${
                                dark 
                                  ? 'bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/50' 
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                              }`}
                              title="Confirmar"
                            >
                              Salvar
                            </button>
                            <button
                              id={`cancel-edit-btn-${t.id}`}
                              onClick={cancelEditing}
                              className={`px-2 py-1 rounded font-bold text-[9px] uppercase tracking-wider cursor-pointer ${
                                dark 
                                  ? 'bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-900/50' 
                                  : 'bg-red-50 hover:bg-red-100 text-red-600'
                              }`}
                              title="Cancelar"
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={t.id} className={`transition-colors group ${dark ? 'hover:bg-slate-900/40' : 'hover:bg-gray-50/50'}`}>
                      {/* Data */}
                      <td className={`py-3 px-4 font-mono ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{formattedDate}</td>
                      {/* Descrição */}
                      <td className={`py-3 px-4 font-semibold ${dark ? 'text-slate-200' : 'text-gray-800'}`}>
                        {t.description || <span className={`${dark ? 'text-slate-600' : 'text-gray-400'} italic`}>Sem descrição</span>}
                      </td>
                      {/* Categoria */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                          dark 
                            ? 'bg-[#0b0f19] border-slate-800 text-slate-400' 
                            : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}>
                          {t.category}
                        </span>
                      </td>
                      {/* Tipo */}
                      <td className="py-3 px-4">
                        {t.type === 'income' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                            Receita
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-400 font-bold text-[10px] uppercase tracking-wider">
                            Despesa
                          </span>
                        )}
                      </td>
                      {/* Valor */}
                      <td className={`py-3 px-4 text-right font-bold font-mono text-xs ${
                        t.type === 'income' 
                          ? (dark ? 'text-emerald-400' : 'text-emerald-600') 
                          : (dark ? 'text-red-400' : 'text-red-600')
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      {/* Ações */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button
                            id={`edit-btn-${t.id}`}
                            onClick={() => startEditing(t)}
                            className={`text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:underline ${
                              dark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
                            }`}
                            title="Editar"
                          >
                            Editar
                          </button>
                          <button
                            id={`delete-btn-${t.id}`}
                            onClick={() => {
                              if (confirm('Deseja realmente excluir este lançamento?')) {
                                onDeleteTransaction(t.id);
                              }
                            }}
                            className={`text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:underline ${
                              dark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
                            }`}
                            title="Excluir"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Versão Mobile (Lista de Cards Compactos) */}
            <div id="transactions-list-mobile" className={`md:hidden divide-y ${dark ? 'divide-slate-800/50' : 'divide-gray-200'}`}>
              {filtered.map((t) => {
                const isEditing = editingId === t.id;
                const [yVal, mVal, dVal] = t.date.split('-');
                const formattedDate = `${dVal}/${mVal}/${yVal}`;

                if (isEditing) {
                  return (
                    <div key={t.id} className={`p-4 space-y-3 ${dark ? 'bg-[#0b0f19]/80' : 'bg-gray-50/70'}`}>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>DATA</label>
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className={`border rounded-md px-2 py-1.5 w-full text-xs font-mono ${
                              dark ? 'bg-[#0b0f19] border-slate-800 text-white' : 'border-gray-200 bg-white'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>VALOR</label>
                          <input
                            type="text"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className={`border rounded-md px-2 py-1.5 w-full text-xs font-mono ${
                              dark ? 'bg-[#0b0f19] border-slate-800 text-white text-right' : 'border-gray-200 bg-white'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>DESCRIÇÃO</label>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className={`border rounded-md px-2 py-1.5 w-full text-xs ${
                            dark ? 'bg-[#0b0f19] border-slate-800 text-white' : 'border-gray-200 bg-white'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>CATEGORIA</label>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className={`border rounded-md px-2 py-1.5 w-full text-xs ${
                              dark ? 'bg-[#0b0f19] border-slate-800 text-white' : 'border-gray-200 bg-white'
                            }`}
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>TIPO</label>
                          <select
                            value={editType}
                            onChange={(e: any) => setEditType(e.target.value)}
                            className={`border rounded-md px-2 py-1.5 w-full text-xs ${
                              dark ? 'bg-[#0b0f19] border-slate-800 text-white' : 'border-gray-200 bg-white'
                            }`}
                          >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          id={`cancel-mobile-edit-${t.id}`}
                          onClick={cancelEditing}
                          className={`px-3 py-1.5 border rounded-lg text-[10px] uppercase tracking-wider font-bold cursor-pointer ${
                            dark 
                              ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          Cancelar
                        </button>
                        <button
                          id={`save-mobile-edit-${t.id}`}
                          onClick={() => saveEditing(t.id)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] uppercase tracking-wider font-bold cursor-pointer hover:bg-emerald-700"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={t.id} className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                    dark ? 'hover:bg-slate-900/20' : 'hover:bg-gray-50/30'
                  }`}>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          t.type === 'income' ? 'bg-emerald-400' : 'bg-red-400'
                        }`} />
                        <span className={`text-[10px] font-mono font-medium ${dark ? 'text-slate-500' : 'text-gray-400'}`}>{formattedDate}</span>
                        <span className={`inline-block px-1.5 py-0.2 text-[9px] rounded font-bold uppercase tracking-wider truncate max-w-[100px] border ${
                          dark 
                            ? 'bg-[#0b0f19] border-slate-800 text-slate-400' 
                            : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}>
                          {t.category}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold truncate ${dark ? 'text-slate-200' : 'text-gray-800'}`}>
                        {t.description || <span className={`${dark ? 'text-slate-600' : 'text-gray-400'} italic font-normal`}>Sem descrição</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-xs font-bold font-mono ${
                          t.type === 'income' 
                            ? (dark ? 'text-emerald-400' : 'text-emerald-600') 
                            : (dark ? 'text-red-400' : 'text-red-600')
                        }`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          id={`edit-mobile-btn-${t.id}`}
                          onClick={() => startEditing(t)}
                          className={`text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                            dark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Editar
                        </button>
                        <button
                          id={`delete-mobile-btn-${t.id}`}
                          onClick={() => {
                            if (confirm('Deseja realmente excluir este lançamento?')) {
                              onDeleteTransaction(t.id);
                            }
                          }}
                          className={`text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                            dark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
                          }`}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
