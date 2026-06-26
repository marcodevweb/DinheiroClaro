import React, { useState } from 'react';

// Estrutura básica do usuário
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Para simular segurança simples local
}

interface AuthFormProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
  onClose: () => void;
  onContinueAsGuest?: () => void;
}

export default function AuthForm({ onAuthSuccess, onClose, onContinueAsGuest }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Estados para Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados para Registro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Função auxiliar para carregar usuários do localStorage
  const getStoredUsers = (): User[] => {
    try {
      const usersData = localStorage.getItem('dinheiro_claro_users');
      return usersData ? JSON.parse(usersData) : [];
    } catch (e) {
      return [];
    }
  };

  // Função auxiliar para salvar usuários no localStorage
  const saveStoredUsers = (users: User[]) => {
    try {
      localStorage.setItem('dinheiro_claro_users', JSON.stringify(users));
    } catch (e) {
      console.error('Erro ao salvar usuários offline:', e);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    if (!email || !password) {
      setLoginError('Preencha todos os campos.');
      return;
    }

    const users = getStoredUsers();
    const user = users.find((u) => u.email === email);

    if (!user || user.passwordHash !== password) {
      setLoginError('E-mail ou senha incorretos.');
      return;
    }

    // Login com sucesso
    onAuthSuccess({ name: user.name, email: user.email });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess(false);

    const name = registerName.trim();
    const email = registerEmail.trim().toLowerCase();
    const password = registerPassword;
    const confirmPassword = registerConfirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      setRegisterError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setRegisterError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError('As senhas não coincidem.');
      return;
    }

    const users = getStoredUsers();
    const userExists = users.some((u) => u.email === email);

    if (userExists) {
      setRegisterError('Este e-mail já está cadastrado.');
      return;
    }

    // Criar novo usuário
    const newUser: User = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      passwordHash: password // Salvando de forma simples para simulação de conta offline
    };

    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);

    setRegisterSuccess(true);
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');

    // Muda para o login com mensagem de sucesso
    setTimeout(() => {
      setActiveTab('login');
      setLoginEmail(email);
      setRegisterSuccess(false);
    }, 1500);
  };

  return (
    <div 
      id="auth-modal-wrapper" 
      className="max-w-md w-full bg-[#0e1322] border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Título Principal */}
      <div className="text-center space-y-1 mb-8">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">
          DinheiroClaro
        </h3>
        <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest font-bold">
          Sua Conta Pessoal Offline
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-6 border-b border-slate-800 pb-3">
        <button
          id="tab-login-btn"
          type="button"
          onClick={() => {
            setActiveTab('login');
            setLoginError('');
            setRegisterError('');
          }}
          className={`py-2 text-xs font-bold uppercase tracking-wider transition-all text-center cursor-pointer border-b-2 ${
            activeTab === 'login'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Entrar
        </button>
        <button
          id="tab-register-btn"
          type="button"
          onClick={() => {
            setActiveTab('register');
            setLoginError('');
            setRegisterError('');
          }}
          className={`py-2 text-xs font-bold uppercase tracking-wider transition-all text-center cursor-pointer border-b-2 ${
            activeTab === 'register'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Criar Conta
        </button>
      </div>

      {/* Form de Login */}
      {activeTab === 'login' && (
        <form id="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
          {loginError && (
            <div id="login-error-msg" className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-400 text-xs font-semibold text-center">
              {loginError}
            </div>
          )}
          {registerSuccess && (
            <div id="register-success-msg" className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-lg text-emerald-400 text-xs font-semibold text-center">
              Cadastro realizado com sucesso! Redirecionando...
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="seu@email.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              className="block w-full px-3 py-2 border rounded-lg text-sm bg-[#0b0f19] border-slate-800 text-white focus:outline-hidden focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Senha
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="Sua senha"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border rounded-lg text-sm bg-[#0b0f19] border-slate-800 text-white focus:outline-hidden focus:border-emerald-500 font-mono"
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer mt-2"
          >
            Acessar Minhas Finanças
          </button>
        </form>
      )}

      {/* Form de Cadastro */}
      {activeTab === 'register' && (
        <form id="register-form" onSubmit={handleRegisterSubmit} className="space-y-4 font-sans">
          {registerError && (
            <div id="register-error-msg" className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-400 text-xs font-semibold text-center">
              {registerError}
            </div>
          )}

          <div>
            <label htmlFor="register-name" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Nome Completo
            </label>
            <input
              id="register-name"
              type="text"
              placeholder="Ex: João Silva"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
              className="block w-full px-3 py-2 border rounded-lg text-sm bg-[#0b0f19] border-slate-800 text-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              E-mail
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="seu@email.com"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              className="block w-full px-3 py-2 border rounded-lg text-sm bg-[#0b0f19] border-slate-800 text-white focus:outline-hidden focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Senha (mínimo 6 caracteres)
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="Crie uma senha"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border rounded-lg text-sm bg-[#0b0f19] border-slate-800 text-white focus:outline-hidden focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label htmlFor="register-confirm-password" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Confirmar Senha
            </label>
            <input
              id="register-confirm-password"
              type="password"
              placeholder="Repita a senha"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border rounded-lg text-sm bg-[#0b0f19] border-slate-800 text-white focus:outline-hidden focus:border-emerald-500 font-mono"
            />
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer mt-2"
          >
            Cadastrar e Entrar
          </button>
        </form>
      )}

      {/* Opção Alternativa: Continuar como Visitante */}
      {onContinueAsGuest && (
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            id="continue-as-guest-btn"
            onClick={onContinueAsGuest}
            className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Continuar sem cadastro &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
