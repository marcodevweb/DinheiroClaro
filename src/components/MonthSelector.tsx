import React from 'react';

interface MonthSelectorProps {
  currentMonth: string; // "YYYY-MM"
  onChange: (monthStr: string) => void;
  dark?: boolean;
}

export default function MonthSelector({ currentMonth, onChange, dark = false }: MonthSelectorProps) {
  const [yearStr, monthStr] = currentMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  // Nomes dos meses em português
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePreviousMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth === 0) {
      newMonth = 12;
      newYear = year - 1;
    }
    const formattedMonth = String(newMonth).padStart(2, '0');
    onChange(`${newYear}-${formattedMonth}`);
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth === 13) {
      newMonth = 1;
      newYear = year + 1;
    }
    const formattedMonth = String(newMonth).padStart(2, '0');
    onChange(`${newYear}-${formattedMonth}`);
  };

  const handleMonthInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange(e.target.value);
    }
  };

  return (
    <div 
      id="month-selector-container" 
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3 rounded-xl border w-full transition-all duration-200 ${
        dark 
          ? 'bg-[#0e1322] border-slate-800/80 shadow-xs' 
          : 'bg-white border-gray-150 shadow-xs'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
          Período de Análise
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          id="prev-month-btn"
          onClick={handlePreviousMonth}
          className={`px-3 py-1.5 rounded-lg transition-all border cursor-pointer font-bold text-xs leading-none ${
            dark 
              ? 'border-slate-800 text-slate-300 hover:bg-slate-900/60' 
              : 'border-gray-150 text-slate-600 hover:bg-gray-50'
          }`}
          title="Mês Anterior"
        >
          &lt;
        </button>

        <div className="relative flex items-center">
          <span className={`text-[11px] font-extrabold uppercase tracking-widest px-4 min-w-[160px] text-center py-2 rounded-lg border transition-colors cursor-pointer ${
            dark 
              ? 'bg-[#0b0f19] border-slate-800 text-white hover:bg-slate-900/40' 
              : 'bg-slate-50 border-gray-150 text-slate-700 hover:bg-slate-100/50'
          }`}>
            {monthNames[month - 1]} / {year}
          </span>
          <input
            id="month-picker-hidden"
            type="month"
            value={currentMonth}
            onChange={handleMonthInput}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>

        <button
          id="next-month-btn"
          onClick={handleNextMonth}
          className={`px-3 py-1.5 rounded-lg transition-all border cursor-pointer font-bold text-xs leading-none ${
            dark 
              ? 'border-slate-800 text-slate-300 hover:bg-slate-900/60' 
              : 'border-gray-150 text-slate-600 hover:bg-gray-50'
          }`}
          title="Próximo Mês"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
