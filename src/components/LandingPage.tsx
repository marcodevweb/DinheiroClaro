import React, { useState, useEffect, useRef } from 'react';
import { Shield, TrendingUp, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [mouseGradientStyle, setMouseGradientStyle] = useState({
    left: '0px',
    top: '0px',
    opacity: 0,
  });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const floatingElementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const animateWords = () => {
      const wordElements = document.querySelectorAll('.word-animate');
      wordElements.forEach(word => {
        const delay = parseInt(word.getAttribute('data-delay') || '0') || 0;
        setTimeout(() => {
          if (word) (word as HTMLElement).style.animation = 'word-appear 0.8s ease-out forwards';
        }, delay);
      });
    };
    const timeoutId = setTimeout(animateWords, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseGradientStyle({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        opacity: 1,
      });
    };
    const handleMouseLeave = () => {
      setMouseGradientStyle(prev => ({ ...prev, opacity: 0 }));
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1000);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  
  useEffect(() => {
    const wordElements = document.querySelectorAll('.word-animate');
    const handleMouseEnter = (e: Event) => { 
      if (e.target) (e.target as HTMLElement).style.textShadow = '0 0 20px rgba(16, 185, 129, 0.4)'; 
    };
    const handleMouseLeave = (e: Event) => { 
      if (e.target) (e.target as HTMLElement).style.textShadow = 'none'; 
    };
    wordElements.forEach(word => {
      word.addEventListener('mouseenter', handleMouseEnter);
      word.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => {
      wordElements.forEach(word => {
        if (word) {
          word.removeEventListener('mouseenter', handleMouseEnter);
          word.removeEventListener('mouseleave', handleMouseLeave);
        }
      });
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.floating-element-animate');
    floatingElementsRef.current = Array.from(elements) as HTMLDivElement[];
    
    // Auto-trigger if already scrolled or simply on mount for ambient activity
    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);
        floatingElementsRef.current.forEach((el, index) => {
          setTimeout(() => {
            if (el) {
              el.style.animationPlayState = 'running';
              el.style.opacity = ''; 
            }
          }, (parseFloat(el.style.animationDelay || "0") * 1000) + index * 100);
        });
      }
    };
    
    // Trigger on first scroll or small timeout
    window.addEventListener('scroll', handleScroll);
    const triggerTimeout = setTimeout(handleScroll, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(triggerTimeout);
    };
  }, [scrolled]);

  const pageStyles = `
    #mouse-gradient-react {
      position: fixed;
      pointer-events: none;
      border-radius: 9999px;
      background-image: radial-gradient(circle, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.03), transparent 70%);
      transform: translate(-50%, -50%);
      will-change: left, top, opacity;
      transition: left 100ms cubic-bezier(0.25, 1, 0.5, 1), top 100ms cubic-bezier(0.25, 1, 0.5, 1), opacity 300ms ease-out;
      z-index: 15;
    }
    @keyframes word-appear { 
      0% { opacity: 0; transform: translateY(20px) scale(0.92); filter: blur(8px); } 
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
    }
    @keyframes grid-draw { 
      0% { stroke-dashoffset: 1000; opacity: 0; } 
      50% { opacity: 0.15; } 
      100% { stroke-dashoffset: 0; opacity: 0.1; } 
    }
    @keyframes pulse-glow { 
      0%, 100% { opacity: 0.1; transform: scale(1); } 
      50% { opacity: 0.25; transform: scale(1.15); } 
    }
    .word-animate { display: inline-block; opacity: 0; margin: 0 0.12em; transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .word-animate:hover { color: #34d399; transform: translateY(-3px) scale(1.02); }
    .grid-line { stroke: #10b981; stroke-width: 0.5; opacity: 0; stroke-dasharray: 4 6; stroke-dashoffset: 1000; animation: grid-draw 2.5s ease-out forwards; }
    .detail-dot { fill: #10b981; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
    .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(16, 185, 129, 0.15); opacity: 0; animation: word-appear 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .text-decoration-animate { position: relative; }
    .text-decoration-animate::after { content: ''; position: absolute; bottom: -8px; left: 0; width: 0; height: 1px; background: linear-gradient(90deg, transparent, #10b981, transparent); animation: underline-grow 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 1.8s; }
    @keyframes underline-grow { to { width: 100%; } }
    .floating-element-animate { position: absolute; width: 3px; height: 3px; background: #34d399; border-radius: 50%; opacity: 0.15; animation: float 6s ease-in-out infinite; }
    @keyframes float { 
      0%, 100% { transform: translateY(0) translateX(0); opacity: 0.15; } 
      50% { transform: translateY(-20px) translateX(8px); opacity: 0.4; } 
    }
    .ripple-effect { position: fixed; width: 6px; height: 6px; background: rgba(52, 211, 153, 0.4); border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; animation: ripple-expansion 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; z-index: 9999; }
    @keyframes ripple-expansion {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
      100% { transform: translate(-50%, -50%) scale(12); opacity: 0; }
    }
  `;

  return (
    <div id="landing-page-container" className="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      <style>{pageStyles}</style>

      {/* Hero Section */}
      <section id="hero-section" className="relative py-28 px-6 overflow-hidden bg-gradient-to-b from-slate-950 via-[#0a0e17] to-[#0c1220] border-b border-slate-800/40 min-h-[90vh] flex flex-col justify-center">
        
        {/* Animated Background Svg */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="gridReactDarkResponsive" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(16, 185, 129, 0.03)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridReactDarkResponsive)" />
          <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.4s' }} />
          <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '0.8s' }} />
          <line x1="15%" y1="0" x2="15%" y2="100%" className="grid-line" style={{ animationDelay: '1.2s' }} />
          <line x1="85%" y1="0" x2="85%" y2="100%" className="grid-line" style={{ animationDelay: '1.6s' }} />
          <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.0s', opacity: '0.04' }} />
          <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '2.4s', opacity: '0.04' }} />
          <circle cx="15%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '2.5s' }} />
          <circle cx="85%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '2.7s' }} />
          <circle cx="15%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '2.9s' }} />
          <circle cx="85%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.1s' }} />
          <circle cx="50%" cy="50%" r="1.5" className="detail-dot" style={{ animationDelay: '3.5s' }} />
        </svg>

        {/* Floating Elements */}
        <div className="floating-element-animate" style={{ top: '25%', left: '12%', animationDelay: '0.5s' }}></div>
        <div className="floating-element-animate" style={{ top: '65%', left: '88%', animationDelay: '1.2s' }}></div>
        <div className="floating-element-animate" style={{ top: '38%', left: '8%', animationDelay: '1.8s' }}></div>
        <div className="floating-element-animate" style={{ top: '78%', left: '92%', animationDelay: '2.4s' }}></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
          
          <div className="text-center max-w-4xl mx-auto relative px-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight leading-tight tracking-tight text-white text-decoration-animate">
              <div className="mb-4 sm:mb-6">
                <span className="word-animate text-emerald-400 font-normal" data-delay="600">Dinheiro</span>
                <span className="word-animate text-slate-100 font-light" data-delay="750">Claro</span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-light text-slate-300 leading-relaxed tracking-wide max-w-2xl mx-auto mt-4 space-y-1">
                <div>
                  <span className="word-animate" data-delay="1100">Seu</span>
                  <span className="word-animate" data-delay="1250">orçamento</span>
                  <span className="word-animate" data-delay="1400">mensal</span>
                  <span className="word-animate" data-delay="1550">simplificado,</span>
                </div>
                <div>
                  <span className="word-animate font-medium text-white" data-delay="1700">absolutamente</span>
                  <span className="word-animate font-medium text-white" data-delay="1850">seguro</span>
                  <span className="word-animate" data-delay="2000">e</span>
                  <span className="word-animate text-emerald-400 font-normal" data-delay="2150">privado.</span>
                </div>
              </div>
            </h1>
            <div className="absolute -left-4 sm:-left-12 top-1/2 transform -translate-y-1/2 w-4 sm:w-8 h-px bg-emerald-500/30 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '2.6s' }}></div>
            <div className="absolute -right-4 sm:-right-12 top-1/2 transform -translate-y-1/2 w-4 sm:w-8 h-px bg-emerald-500/30 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '2.8s' }}></div>
          </div>

          <div className="text-center z-20 space-y-6">
            <div className="mb-6 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mx-auto"></div>
            <h2 className="text-[10px] sm:text-xs font-mono font-light text-slate-400 uppercase tracking-[0.2em] mb-6 block">
              <span className="word-animate" data-delay="2300">Sem</span>
              <span className="word-animate font-medium text-emerald-400" data-delay="2450">contas,</span>
              <span className="word-animate" data-delay="2600">sem</span>
              <span className="word-animate font-medium text-emerald-400" data-delay="2750">cookies,</span>
              <span className="word-animate" data-delay="2900">sem</span>
              <span className="word-animate font-medium text-emerald-400" data-delay="3050">rastros.</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto sm:max-w-none opacity-0" style={{ animation: 'word-appear 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards', animationDelay: '3.3s' }}>
              <button
                id="start-now-hero-btn"
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 group border border-emerald-500 active:scale-95"
              >
                Começar a Usar Agora
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#features-section"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center border border-slate-800/80 cursor-pointer backdrop-blur-xs active:scale-95"
              >
                Conhecer Recursos
              </a>
            </div>

            <div className="mt-8 flex justify-center space-x-3 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '3.8s' }}>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-40 animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-60 animate-pulse delay-75"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-40 animate-pulse delay-150"></div>
            </div>
          </div>
        </div>

        {/* Mouse Light Aura (Interactive) */}
        <div 
          id="mouse-gradient-react"
          className="w-64 h-64 blur-2xl sm:w-96 sm:h-96 sm:blur-3xl"
          style={{
            left: mouseGradientStyle.left,
            top: mouseGradientStyle.top,
            opacity: mouseGradientStyle.opacity,
          }}
        ></div>

        {/* Dynamic Ripples */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple-effect"
            style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
          ></div>
        ))}
      </section>

      {/* Diferenciais / Benefícios */}
      <section id="features-section" className="py-24 px-6 max-w-7xl mx-auto w-full relative z-20">
        <div className="text-center space-y-4 mb-16">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Diferenciais do Sistema</h3>
          <h4 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">O que torna o DinheiroClaro único?</h4>
          <p className="text-sm text-slate-400 max-w-lg mx-auto font-medium">
            Velocidade extrema e privacidade inabalável para monitorar suas finanças mensais de forma descomplicada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-slate-950/40 p-8 rounded-2xl border border-slate-800/60 hover:border-emerald-500/30 transition-all hover:bg-slate-900/30 group duration-300 flex flex-col justify-between h-full space-y-8 backdrop-blur-xs">
            <div className="space-y-4">
              <h5 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Privacidade Sem Rastreio</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Sem cadastros, e-mails, senhas ou cookies de marketing. Seus lançamentos e preferências são gravados unicamente no seu navegador (localStorage). Segurança absoluta por design.
              </p>
            </div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              LocalStorage Offline
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-950/40 p-8 rounded-2xl border border-slate-800/60 hover:border-emerald-500/30 transition-all hover:bg-slate-900/30 group duration-300 flex flex-col justify-between h-full space-y-8 backdrop-blur-xs">
            <div className="space-y-4">
              <h5 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Visualizações Inteligentes</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Acompanhe despesas por categorias em um gráfico de rosca interativo e monitore a tendência acumulada do seu saldo diário através de gráficos lineares fluidos e modernos.
              </p>
            </div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Resumos Mensais Dinâmicos
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-950/40 p-8 rounded-2xl border border-slate-800/60 hover:border-emerald-500/30 transition-all hover:bg-slate-900/30 group duration-300 flex flex-col justify-between h-full space-y-8 backdrop-blur-xs">
            <div className="space-y-4">
              <h5 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Relatórios Profissionais</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Gere e exporte relatórios financeiros completos do período selecionado em PDF com gráficos, totais e a lista cronológica. Perfeito para guardar, auditar ou compartilhar.
              </p>
            </div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Impressão em 1-clique
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - How It Works Section */}
      <section id="how-it-works" className="relative bg-slate-950/30 py-24 px-6 border-y border-slate-800/40 z-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Fluxo do Sistema</h3>
            <h4 className="text-3xl font-bold text-white tracking-tight">Simplicidade extrema em 3 passos</h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto font-medium">
              Não há barreiras para começar. O controle financeiro que você sempre quis, direto ao ponto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="space-y-4 text-center relative group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/40 border border-emerald-800/30 flex items-center justify-center mx-auto text-emerald-400 font-bold text-lg shadow-sm group-hover:border-emerald-500/40 group-hover:bg-emerald-950/80 transition-all duration-300">
                01
              </div>
              <h5 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">Abra o Painel</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-xs mx-auto">
                Basta um clique para entrar diretamente no gerenciador. Sem formulários longos ou confirmação por e-mail.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center relative group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/40 border border-emerald-800/30 flex items-center justify-center mx-auto text-emerald-400 font-bold text-lg shadow-sm group-hover:border-emerald-500/40 group-hover:bg-emerald-950/80 transition-all duration-300">
                02
              </div>
              <h5 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">Registre os Lançamentos</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-xs mx-auto">
                Ligue receitas e despesas a categorias. Se precisar, adicione categorias customizadas diretamente no momento do lançamento.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center relative group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/40 border border-emerald-800/30 flex items-center justify-center mx-auto text-emerald-400 font-bold text-lg shadow-sm group-hover:border-emerald-500/40 group-hover:bg-emerald-950/80 transition-all duration-300">
                03
              </div>
              <h5 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">Monitore e Analise</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-xs mx-auto">
                Visualize seus totais consolidados, explore a evolução do saldo mensal e exporte relatórios PDF em segundos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chamada para Ação Final */}
      <section id="cta-section" className="py-24 px-6 text-center max-w-4xl mx-auto space-y-8 relative z-20">
        <h4 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">O controle total de suas finanças na ponta dos seus dedos</h4>
        <p className="text-sm sm:text-base text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          Experimente uma ferramenta ultrarrápida, limpa, livre de propagandas ou taxas extras. O DinheiroClaro foi construído exclusivamente para quem valoriza praticidade e privacidade absoluta.
        </p>
        <div className="pt-4">
          <button
            id="cta-bottom-btn"
            onClick={onStart}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer inline-flex items-center gap-2 border border-emerald-500 active:scale-95"
          >
            Acessar Meu Painel Agora
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
