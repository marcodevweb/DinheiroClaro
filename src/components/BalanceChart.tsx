import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatCurrency } from '../lib/calculations';

interface BalanceChartProps {
  data: Array<{
    day: number;
    dateLabel: string;
    'Saldo Acumulado': number;
    'Resultado do Dia': number;
  }>;
}

export default function BalanceChart({ data }: BalanceChartProps) {
  // Encontra os limites mínimo e máximo para ajustar a visualização do gráfico de forma inteligente
  const balances = data.map(d => d['Saldo Acumulado']);
  const minBalance = Math.min(...balances, 0);
  const maxBalance = Math.max(...balances, 0);
  
  // Margem de segurança para o topo/rodapé do gráfico
  const padding = (maxBalance - minBalance) * 0.1 || 100;
  const yDomain = [minBalance - padding, maxBalance + padding];

  // Customizar o Tooltip do Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const balance = payload[0].value;
      const dailyChange = payload[0].payload['Resultado do Dia'];
      const dateLabel = payload[0].payload.dateLabel;

      return (
        <div className="bg-[#0b0f19] p-3 border border-slate-800 rounded-lg shadow-xl text-[10px] space-y-1 font-sans">
          <p className="font-extrabold text-slate-300 uppercase tracking-wider">Dia {dateLabel}</p>
          <p className="text-slate-400 font-bold">
            Saldo Acumulado: <span className={`font-mono font-extrabold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(balance)}
            </span>
          </p>
          <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">
            Resultado do dia: <span className={`font-mono font-bold ${dailyChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {dailyChange > 0 ? '+' : ''}{formatCurrency(dailyChange)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="balance-chart-card" className="bg-[#0e1322] p-6 rounded-xl border border-slate-800/80 shadow-xs flex flex-col h-full min-h-[380px] hover:border-slate-700 transition-all duration-200">
      <div className="mb-6 pb-4 border-b border-slate-800/50">
        <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Evolução do Saldo</h3>
        <p className="text-xs font-bold text-white mt-0.5">Fluxo de saldo acumulado ao longo do mês</p>
      </div>

      <div className="flex-1 min-h-[250px] w-full mt-2">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.08}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#475569" 
              fontSize={9}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={9}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              domain={yDomain}
              tickFormatter={(val) => `R$ ${val}`}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Linha horizontal no zero para marcar desbalanceamento */}
            <ReferenceLine y={0} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />
            
            <Area 
              type="monotone" 
              dataKey="Saldo Acumulado" 
              stroke="#10b981" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
