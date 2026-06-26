import React, { useState, useEffect } from 'react';
import { 
  getTransactions, 
  saveTransactions, 
  getCategories, 
  saveCategories 
} from './lib/storage';
import { 
  getMonthlySummary, 
  getExpensesByCategory, 
  getDailyCumulativeTrend 
} from './lib/calculations';
import { exportMonthlyReportPdf } from './lib/exportPdf';
import { Transaction, Category } from './types';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import MonthSelector from './components/MonthSelector';
import AuthForm from './components/AuthForm';

// Sem importação de ícones para garantir layout totalmente minimalista e sem ícones na dashboard
export default function App() {
  // Estado de Navegação / Visualização
  const [activeView, setActiveView] = useState<'landing' | 'app'>('landing');
  const [activeSubView, setActiveSubView] = useState<'dashboard' | 'add' | 'list' | 'guide'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Estado do Usuário Logado (ou null para visitante/guest)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  
  // Controle do modal de Autenticação
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Estado de Lançamentos e Categorias
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [showPrivacyNotice, setShowPrivacyNotice] = useState<boolean>(true);

  // Inicializar dados do localStorage
  useEffect(() => {
    // Definir mês atual (Formato YYYY-MM)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${year}-${month}`);

    // Ler usuário persistido (se houver)
    try {
      const storedUser = localStorage.getItem('dinheiro_claro_current_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Erro ao ler usuário logado do localStorage:', e);
    }
  }, []);

  // Recarregar transações e categorias ao alterar o usuário (logado ou guest)
  useEffect(() => {
    const userEmail = currentUser?.email;
    setTransactions(getTransactions(userEmail));
    setCategories(getCategories(userEmail));
  }, [currentUser]);

  // Adicionar um novo lançamento
  const handleAddTransaction = (newT: Omit<Transaction, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const updated = [...transactions, { ...newT, id }];
    setTransactions(updated);
    saveTransactions(updated, currentUser?.email);
  };

  // Atualizar um lançamento existente
  const handleUpdateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    const updated = transactions.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    setTransactions(updated);
    saveTransactions(updated, currentUser?.email);
  };

  // Excluir um lançamento
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated, currentUser?.email);
  };

  // Criar nova categoria customizada
  const handleAddCategory = (name: string) => {
    const newCat: Category = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    saveCategories(updated, currentUser?.email);
  };

  // Sucesso na autenticação (Cadastro ou Login)
  const handleAuthSuccess = (user: { name: string; email: string }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('dinheiro_claro_current_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setShowAuthModal(false);
    setActiveView('app');
    setActiveSubView('dashboard');
  };

  // Deslogar
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('dinheiro_claro_current_user');
    } catch (e) {
      console.error(e);
    }
    setActiveView('landing');
  };

  // Exportar PDF do mês selecionado
  const handleExportPdf = () => {
    exportMonthlyReportPdf(transactions, currentMonth);
  };

  // Cálculos consolidados para o mês selecionado
  const summary = getMonthlySummary(transactions, currentMonth);
  const expensesByCategory = getExpensesByCategory(transactions, currentMonth);
  const dailyTrend = getDailyCumulativeTrend(transactions, currentMonth);

  return (
    <div id="dinheiroclaro-app" className={`min-h-screen ${activeView === 'landing' ? 'bg-[#0b0f19]' : 'bg-[#fafafa]'} flex flex-col antialiased`}>
      {activeView === 'landing' ? (
        <>
          {/* Cabeçalho de Apresentação */}
          <header id="app-header" className="bg-[#0b0f19] border-b border-slate-800/60 py-4 px-6 sticky top-0 z-40 shadow-xs">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="space-y-0.5 cursor-pointer select-none group" onClick={() => setActiveView('landing')}>
                <h1 className="text-xl font-bold text-white tracking-wider font-sans uppercase group-hover:text-emerald-400 transition-colors">
                  DinheiroClaro
                </h1>
                <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest font-bold">
                  Controle Financeiro Descomplicado
                </p>
              </div>

              {/* Botão de Entrar/Cadastrar sem ícone */}
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                {currentUser ? (
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-medium">Olá, <strong className="text-emerald-400">{currentUser.name}</strong></span>
                    <button
                      onClick={() => {
                        setActiveView('app');
                        setActiveSubView('dashboard');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Painel Geral
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 border border-slate-800 hover:border-emerald-500 hover:text-emerald-400 text-slate-300 rounded-lg transition-all cursor-pointer bg-slate-950/40"
                  >
                    Entrar / Cadastrar
                  </button>
                )}
              </div>
            </div>
          </header>

          <LandingPage onStart={() => {
            if (currentUser) {
              setActiveView('app');
              setActiveSubView('dashboard');
            } else {
              setShowAuthModal(true);
            }
          }} />

          {/* Rodapé da Apresentação */}
          <footer id="app-footer" className="bg-[#0b0f19] border-t border-slate-800/60 py-6 px-6 mt-0">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <div>
                <strong className="text-emerald-400">DinheiroClaro</strong> — Controle Financeiro Prático e Sem Rastro
              </div>
              <div>
                Desenvolvido com foco absoluto em privacidade e facilidade de uso.
              </div>
            </div>
          </footer>
        </>
      ) : (
        /* Estrutura com Painel e Sidebar Retrátil */
        <div className="flex-1 flex flex-col md:flex-row min-h-screen relative">
          {/* Backdrop do menu mobile se estiver aberto */}
          {!sidebarCollapsed && (
            <div 
              className="md:hidden fixed inset-0 bg-black/60 z-40" 
              onClick={() => setSidebarCollapsed(true)}
            />
          )}

          {/* Lateral Esquerda: Sidebar Retrátil (Totalmente sem ícones) */}
          <aside 
            id="app-sidebar" 
            className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 md:h-screen flex flex-col justify-between transition-all duration-300 bg-[#0b0f19] border-r border-slate-800/60 text-slate-300 ${
              sidebarCollapsed 
                ? '-translate-x-full md:translate-x-0 md:w-16' 
                : 'w-64 translate-x-0'
            }`}
          >
            {/* Topo da Sidebar: Identificação / Logo */}
            <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
              {!sidebarCollapsed ? (
                <div className="space-y-0.5">
                  <h1 className="text-sm font-bold text-white tracking-wider uppercase">
                    DinheiroClaro
                  </h1>
                  <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest font-bold">
                    Painel Administrativo
                  </p>
                </div>
              ) : (
                <div className="w-full text-center font-bold text-white text-sm font-mono tracking-widest">
                  DC
                </div>
              )}
              {/* Botão para fechar no Mobile */}
              <button 
                className="md:hidden text-slate-400 hover:text-white font-mono text-xs font-bold uppercase"
                onClick={() => setSidebarCollapsed(true)}
              >
                [ X ]
              </button>
            </div>

            {/* Menu de Navegação da Sidebar (Sem Ícones, apenas tipografia premium) */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
              {[
                { id: 'dashboard', label: 'Painel Geral', compact: 'PAINEL' },
                { id: 'add', label: 'Novo Lançamento', compact: 'NOVO' },
                { id: 'list', label: 'Histórico', compact: 'LISTA' },
                { id: 'guide', label: 'Ajuda', compact: 'AJUDA' }
              ].map((item) => {
                const isActive = activeSubView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSubView(item.id as any);
                      // Auto recolher no mobile após clique
                      if (window.innerWidth < 768) {
                        setSidebarCollapsed(true);
                      }
                    }}
                    className={`w-full text-left rounded-lg transition-all duration-150 py-2.5 px-3 uppercase text-[10px] tracking-wider font-bold cursor-pointer block ${
                      isActive 
                        ? 'bg-slate-900 border-l-2 border-emerald-400 text-emerald-400 font-bold' 
                        : 'hover:bg-slate-900/40 text-slate-400 hover:text-slate-200 font-medium'
                    }`}
                  >
                    {!sidebarCollapsed ? (
                      <span>{item.label}</span>
                    ) : (
                      <span className="block text-center text-[9px] truncate">{item.compact}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Rodapé da Sidebar: Toggles e Ações de Saída */}
            <div className="p-3 border-t border-slate-800/60 space-y-2">
              {/* Botão de Recolher/Expandir (Disponível apenas no Desktop) */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:block w-full text-center py-2 px-3 text-[9px] uppercase tracking-widest font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-900/40 rounded-lg transition-all cursor-pointer"
              >
                {sidebarCollapsed ? 'EXPANDIR >' : '< RECOLHER MENU'}
              </button>

              {/* Botão Voltar para Landing Page */}
              <button
                onClick={() => {
                  setActiveView('landing');
                }}
                className={`w-full text-center py-2 px-3 text-[9px] uppercase tracking-widest font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-900/40 rounded-lg transition-all cursor-pointer block ${
                  sidebarCollapsed ? 'truncate' : ''
                }`}
              >
                {sidebarCollapsed ? 'VOLTAR' : 'VOLTAR AO INÍCIO'}
              </button>

              {currentUser && (
                <button
                  onClick={handleLogout}
                  className={`w-full text-center py-2 px-3 text-[9px] uppercase tracking-widest font-bold text-red-400/80 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all cursor-pointer block ${
                    sidebarCollapsed ? 'truncate' : ''
                  }`}
                >
                  {sidebarCollapsed ? 'SAIR' : 'DESLOGAR DA CONTA'}
                </button>
              )}
            </div>
          </aside>

          {/* Área de Conteúdo à Direita */}
          <div className={`flex-1 flex flex-col min-w-0 transition-colors duration-200 ${
            (activeSubView === 'dashboard' || activeSubView === 'add') ? 'bg-[#0b0f19]' : 'bg-[#fafafa]'
          }`}>
            {/* Header Superior Interno */}
            <header className={`px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs border-b transition-all duration-200 ${
              (activeSubView === 'dashboard' || activeSubView === 'add') 
                ? 'bg-[#0b0f19] border-slate-800/80' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                {/* Botão de Menu para Mobile */}
                <button 
                  onClick={() => setSidebarCollapsed(false)}
                  className={`md:hidden px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                    (activeSubView === 'dashboard' || activeSubView === 'add')
                      ? 'border-slate-800 hover:bg-slate-900/40 text-slate-300'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  MENU
                </button>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${
                  (activeSubView === 'dashboard' || activeSubView === 'add') ? 'text-white' : 'text-gray-700'
                }`}>
                  {activeSubView === 'dashboard' && 'Painel Geral'}
                  {activeSubView === 'add' && 'Adicionar Lançamento'}
                  {activeSubView === 'list' && 'Histórico de Lançamentos'}
                  {activeSubView === 'guide' && 'Guia & Privacidade'}
                </h2>
              </div>

              {/* Status do usuário e ações na dashboard */}
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                {currentUser ? (
                  <div className="flex items-center gap-3">
                    <span className={`hidden md:inline ${
                      (activeSubView === 'dashboard' || activeSubView === 'add') ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Usuário: <strong className="text-emerald-500">{currentUser.name}</strong>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 rounded-lg bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900/20 transition-all cursor-pointer"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className={`hidden md:inline ${
                      (activeSubView === 'dashboard' || activeSubView === 'add') ? 'text-slate-500' : 'text-gray-400'
                    }`}>
                      Modo Visitante
                    </span>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 hover:bg-emerald-950/40 transition-all cursor-pointer"
                    >
                      Cadastrar / Entrar
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* Conteúdo Dinâmico */}
            <main id="app-main-content" className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Painel Informativo sobre Privacidade (Se visível no dashboard) */}
              {showPrivacyNotice && activeSubView === 'dashboard' && (
                <div 
                  id="privacy-notice-panel" 
                  className="bg-[#0e1322] border border-slate-800/80 p-5 rounded-xl shadow-xs relative flex flex-col md:flex-row gap-4 items-start md:items-center animate-in fade-in duration-200"
                >
                  <div className="space-y-1 flex-1">
                    <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Seus dados financeiros não saem daqui</h2>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      O <strong className="text-emerald-400">DinheiroClaro</strong> é offline-first. Não exigimos cadastro, e-mail ou senha. Suas transações e preferências são armazenadas exclusivamente no localStorage do seu navegador. Segurança total e privacidade absoluta.
                    </p>
                  </div>
                  <button
                    id="dismiss-privacy-btn"
                    onClick={() => setShowPrivacyNotice(false)}
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-900/60 px-4 py-2 rounded-lg border border-slate-800 transition-all cursor-pointer text-center"
                  >
                    Entendido
                  </button>
                </div>
              )}

              {/* ABA: PAINEL GERAL (Dashboard) */}
              {activeSubView === 'dashboard' && (
                <div className="space-y-6">
                  <Dashboard 
                    currentMonth={currentMonth}
                    onMonthChange={setCurrentMonth}
                    summary={summary}
                    expensesByCategory={expensesByCategory}
                    dailyTrend={dailyTrend}
                    onExportPdf={handleExportPdf}
                    onNavigateToAdd={() => setActiveSubView('add')}
                  />
                  
                  {/* Visualização Rápida de Lançamentos do Mês */}
                  <div className="mt-8">
                    <TransactionList 
                      transactions={transactions.filter(t => t.date.startsWith(currentMonth))}
                      categories={categories}
                      onUpdateTransaction={handleUpdateTransaction}
                      onDeleteTransaction={handleDeleteTransaction}
                      dark={true}
                    />
                  </div>
                </div>
              )}

              {/* ABA: ADICIONAR LANÇAMENTO (Formulário) */}
              {activeSubView === 'add' && (
                <div className="max-w-xl mx-auto py-4 animate-in fade-in duration-200">
                  <TransactionForm 
                    categories={categories}
                    onAddTransaction={(newT) => {
                      handleAddTransaction(newT);
                      setActiveSubView('dashboard'); // Auto-redireciona para o Painel Geral
                    }}
                    onAddCategory={handleAddCategory}
                    dark={true}
                  />
                </div>
              )}

              {/* ABA: HISTÓRICO COMPLETO */}
              {activeSubView === 'list' && (
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <MonthSelector 
                      currentMonth={currentMonth}
                      onChange={setCurrentMonth}
                    />
                  </div>
                  <TransactionList 
                    transactions={transactions.filter(t => t.date.startsWith(currentMonth))}
                    categories={categories}
                    onUpdateTransaction={handleUpdateTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </div>
              )}

              {/* ABA: AJUDA & PRIVACIDADE */}
              {activeSubView === 'guide' && (
                <div className="max-w-3xl mx-auto space-y-6 py-4">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-2">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Controle Local e Privacidade Absoluta</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      O DinheiroClaro não salva nenhuma informação em servidores externos. Sem cookies de marketing, sem e-mails invasivos e sem logins. Tudo é processado pelo seu navegador em localStorage, garantindo que você possua controle 100% exclusivo sobre seus dados financeiros.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Como funciona o DinheiroClaro?</h3>
                    <ul className="text-xs text-gray-500 space-y-3 list-disc list-inside font-medium leading-relaxed">
                      <li>Use o menu <strong>Novo Lançamento</strong> para adicionar despesas e receitas.</li>
                      <li>Visualize proporções categorizadas e evolução do saldo diário de forma integrada no seu <strong>Painel Geral</strong>.</li>
                      <li>Classifique de forma personalizada criando novas categorias quando quiser.</li>
                      <li>Utilize o botão <strong>Exportar PDF</strong> para gerar relatórios financeiros detalhados do mês, prontos para arquivamento.</li>
                    </ul>
                  </div>
                </div>
              )}
            </main>

            {/* Rodapé Interno Compacto */}
            <footer className={`py-4 px-6 text-center text-[10px] uppercase font-bold tracking-wider transition-all duration-200 ${
              (activeSubView === 'dashboard' || activeSubView === 'add') 
                ? 'bg-[#0b0f19] border-t border-slate-800/50 text-slate-500' 
                : 'bg-white border-t border-gray-200 text-slate-400'
            }`}>
              DinheiroClaro &copy; 2026 — Controle Prático, Inteligente e Livre de Rastreamento
            </footer>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div id="auth-modal-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <AuthForm 
            onAuthSuccess={handleAuthSuccess} 
            onClose={() => setShowAuthModal(false)}
            onContinueAsGuest={() => {
              setShowAuthModal(false);
              setActiveView('app');
              setActiveSubView('dashboard');
            }}
          />
        </div>
      )}
    </div>
  );
}
