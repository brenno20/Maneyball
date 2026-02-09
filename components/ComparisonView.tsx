
import React from 'react';
import { PlayerRanking } from '../types';
import { X, Trophy, Target, Shield, Activity, Star } from 'lucide-react';

interface ComparisonViewProps {
  players: PlayerRanking[];
  onClose: () => void;
  labels: any;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ players, onClose, labels }) => {
  // Common categories for any position
  const commonCategories = [
    { label: labels.score, key: 'score', isNumeric: true },
    { label: labels.games, key: 'gamesPlayed', isNumeric: true },
    { label: labels.goals, key: 'goals', subKey: 'comparisonStats' },
    { label: labels.assists, key: 'assists', subKey: 'comparisonStats' },
    { label: `${labels.defense} (1-20)`, key: 'defensive', subKey: 'comparisonStats', isNumeric: true },
    { label: `${labels.physical} (1-20)`, key: 'physical', subKey: 'comparisonStats', isNumeric: true },
  ];

  // Tactical Role Attributes (dynamically extracted from the first player's roleMetrics)
  const tacticalAttributes = players[0]?.roleMetrics.map((m, idx) => ({
    label: `${m.label} (1-20)`,
    index: idx
  })) || [];

  const getValue = (player: PlayerRanking, category: any) => {
    if (category.subKey) {
      return (player as any)[category.subKey][category.key];
    }
    return (player as any)[category.key];
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          {labels.compareTitle}
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-800/30">
              <th className="px-6 py-8 border-r border-slate-800 w-1/4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{labels.attributes}</span>
              </th>
              {players.map(p => (
                <th key={p.name} className="px-6 py-8 text-center min-w-[200px]">
                  <div className="text-lg font-black text-white truncate px-2">{p.name}</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">
                    {p.age} {labels.ageSuffix} • {p.club || '---'}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {/* Common Stats Section */}
            <tr className="bg-slate-900/50">
              <td colSpan={players.length + 1} className="px-6 py-2 bg-slate-800/20 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                Geral
              </td>
            </tr>
            {commonCategories.map((cat, idx) => (
              <tr key={cat.label} className="hover:bg-slate-800/10">
                <td className="px-6 py-5 font-bold text-slate-400 border-r border-slate-800 text-sm">
                  {cat.label}
                </td>
                {players.map(p => {
                  const val = getValue(p, cat);
                  return (
                    <td key={p.name} className="px-6 py-5 text-center">
                      <span className={`text-xl font-black mono ${
                        cat.isNumeric && Number(val) >= 15 ? 'text-green-400' : 
                        cat.isNumeric && Number(val) >= 10 ? 'text-yellow-400' : 'text-slate-200'
                      }`}>
                        {typeof val === 'number' ? val.toFixed(0) : val}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Tactical Stats Section */}
            <tr className="bg-slate-900/50">
              <td colSpan={players.length + 1} className="px-6 py-2 bg-slate-800/20 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                Métricas Táticas da Função
              </td>
            </tr>
            {tacticalAttributes.map((attr, idx) => (
              <tr key={attr.label} className="hover:bg-slate-800/10">
                <td className="px-6 py-5 font-bold text-slate-400 border-r border-slate-800 text-sm">
                  {attr.label}
                </td>
                {players.map(p => {
                  const metric = p.roleMetrics[attr.index];
                  const val = metric?.value || 0;
                  return (
                    <td key={p.name} className="px-6 py-5 text-center">
                      <div className={`
                        inline-flex w-10 h-10 rounded-lg items-center justify-center font-black text-lg border
                        ${Number(val) >= 15 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                          Number(val) >= 10 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 
                          'bg-slate-800 border-slate-700 text-slate-300'}
                      `}>
                        {val}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonView;
