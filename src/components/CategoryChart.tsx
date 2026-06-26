import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '../lib/calculations';

interface CategoryChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

// Cores executivas, modernas e vibrantes para fundo escuro
const COLORS = [
  '#10b981', // Emerald 500
  '#6366f1', // Indigo 500
  '#06b6d4', // Cyan 500
  '#a855f7', // Purple 500
  '#f97316', // Orange 500
  '#f43f5e', // Rose 500
  '#f59e0b', // Amber 500
  '#94a3b8', // Slate 400
];

export default function CategoryChart({ data }: CategoryChartProps) {
  const hasData = data && data.length > 0;

  // Customizar o Tooltip do Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-[#0b0f19] p-3 border border-slate-800 rounded-lg shadow-xl text-[10px] space-y-1 font-sans">
          <p className="font-extrabold text-slate-300 uppercase tracking-wider">{item.name}</p>
          <p className="text-slate-400 font-bold">
            Valor: <span className="font-mono text-white">{formatCurrency(item.value)}</span>
          </p>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px]">
            Proporção: <span className="font-mono text-emerald-400">{item.payload.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="category-chart-card" className="bg-[#0e1322] p-6 rounded-xl border border-slate-800/80 shadow-xs flex flex-col h-full min-h-[380px] hover:border-slate-700 transition-all duration-200">
      <div className="mb-6 pb-4 border-b border-slate-800/50">
        <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Gastos por Categoria</h3>
        <p className="text-xs font-bold text-white mt-0.5">Distribuição percentual das despesas</p>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0e1322" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 space-y-2">
            <p className="text-sm text-slate-400 font-medium">Nenhum gasto registrado</p>
            <p className="text-[9px] text-slate-500 max-w-[200px] mx-auto uppercase tracking-wider leading-relaxed font-bold">
              Adicione despesas neste período para visualizar a distribuição.
            </p>
          </div>
        )}

        {hasData && (
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest">Despesas</span>
            <span className="text-base font-bold text-white font-mono mt-0.5">
              {formatCurrency(data.reduce((acc, curr) => acc + curr.value, 0))}
            </span>
          </div>
        )}
      </div>

      {hasData && (
        <div id="category-chart-legend" className="mt-6 pt-4 border-t border-slate-800/50 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] uppercase font-bold tracking-wider">
          {data.slice(0, 6).map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 truncate">
              <span 
                className="w-2.5 h-2.5 rounded-xs shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-slate-300 truncate font-semibold">{item.name}</span>
              <span className="text-slate-500 font-mono ml-auto font-bold">{item.percentage.toFixed(0)}%</span>
            </div>
          ))}
          {data.length > 6 && (
            <div className="col-span-2 text-center text-[8px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">
              + {data.length - 6} outras categorias
            </div>
          )}
        </div>
      )}
    </div>
  );
}
