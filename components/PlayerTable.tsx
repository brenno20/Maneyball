
import React from 'react';
import { PlayerRanking } from '../types';
import { 
  Check, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Star, 
  Target, 
  Shield, 
  DollarSign, 
  Fingerprint, 
  Navigation,
  Sparkles,
  Info
} from 'lucide-react';

interface PlayerTableProps {
  players: PlayerRanking[];
  selectedNames: string[];
  onToggleSelection: (player: PlayerRanking) => void;
  labels: any;
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players, selectedNames, onToggleSelection, labels }) => {
  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl overflow-visible">
      <table className="w-full text-left border-collapse table-auto">
        <thead>
          <tr className="bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
            <th className="px-4 py-4 text-center w-12">Pos</th>
            <th className="px-4 py-4 min-w-[200px]">{labels.player}</th>
            <th className="px-4 py-4 text-center w-20">{labels.games}</th>
            <th className="px-4 py-4 text-center w-24">{labels.score}</th>
            <th className="px-4 py-4 min-w-[350px]">{labels.metrics} (1-20)</th>
            <th className="px-4 py-4">{labels.scout}</th>
            <th className="px-4 py-4 text-center w-24">{labels.action}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {players.map((player) => {
            const isSelected = selectedNames.includes(player.name);
            return (
              <tr key={player.rank} className={`hover:bg-slate-800/30 transition-colors ${isSelected ? 'bg-green-500/5' : ''}`}>
                <td className="px-4 py-5 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                    player.rank === 1 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 
                    player.rank === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/50' :
                    player.rank === 3 ? 'bg-orange-700/20 text-orange-700 border border-orange-700/50' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {player.rank}
                  </span>
                </td>
                <td className="px-4 py-5 relative group">
                  <div className="cursor-help flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-green-400 transition-colors whitespace-nowrap">{player.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                        {player.age} {labels.ageSuffix} • {player.club || '---'}
                      </div>
                    </div>
                    <Info className="w-3 h-3 text-slate-700 group-hover:text-green-500 transition-colors shrink-0" />
                  </div>

                  {/* POPUP DE INFORMAÇÕES (SCOUT CARD PREMIUM) */}
                  <div className="absolute left-0 top-full mt-2 w-80 bg-[#020617] border border-slate-700 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-0 z-[100] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 translate-y-4 group-hover:translate-y-0 backdrop-blur-2xl ring-1 ring-white/5 overflow-hidden">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 border-b border-slate-800">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-black text-xl leading-none tracking-tight">{player.name}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-green-500/10 text-green-400 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-green-500/20">
                              {player.potential || 'A'} {labels.potential}
                            </span>
                            <span className="text-slate-500 text-[9px] font-bold uppercase">{player.club}</span>
                          </div>
                        </div>
                        <div className="bg-green-600 rounded-xl p-2 flex flex-col items-center shadow-lg shadow-green-600/20 min-w-[50px]">
                          <span className="text-slate-900 font-black text-sm leading-none">{player.score.toFixed(0)}</span>
                          <span className="text-[7px] text-slate-900 font-black uppercase leading-none mt-1">{labels.score}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                            <DollarSign className="w-2.5 h-2.5 text-green-500" /> {labels.marketValue}
                          </p>
                          <p className="text-xs font-black text-white">{player.marketValue || '---'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                            <Activity className="w-2.5 h-2.5 text-blue-500" /> {labels.wage}
                          </p>
                          <p className="text-xs font-black text-white">{player.wage || '---'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                        <div className="space-y-1">
                          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                            <Navigation className="w-2.5 h-2.5 text-amber-500" /> {labels.foot}
                          </p>
                          <p className="text-xs font-bold text-slate-300">{player.preferredFoot}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                            <Fingerprint className="w-2.5 h-2.5 text-purple-500" /> {labels.personality}
                          </p>
                          <p className="text-xs font-bold text-slate-300 truncate">{player.personality}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800/50">
                         <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-3 flex items-center gap-1">
                           <Sparkles className="w-2.5 h-2.5 text-green-400" /> FM STATS
                         </p>
                         <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-slate-500 font-bold uppercase">{labels.goals}</span>
                              <span className="text-slate-200 font-black">{player.comparisonStats.goals}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-slate-500 font-bold uppercase">{labels.assists}</span>
                              <span className="text-slate-200 font-black">{player.comparisonStats.assists}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-slate-500 font-bold uppercase">{labels.defense}</span>
                              <span className="text-slate-200 font-black">{player.comparisonStats.defensive}/20</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-slate-500 font-bold uppercase">{labels.physical}</span>
                              <span className="text-slate-200 font-black">{player.comparisonStats.physical}/20</span>
                            </div>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800/50 space-y-2">
                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1 mb-2">
                           <Star className="w-2.5 h-2.5 text-amber-500" /> {labels.scoutSummary}
                         </p>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-300 leading-tight italic">{player.pros}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingDown className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-400 leading-tight italic">{player.cons}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 text-center">
                  <div className="flex flex-col items-center">
                    <Activity className="w-3 h-3 text-slate-500 mb-1" />
                    <span className="text-sm font-bold text-slate-300">{player.gamesPlayed || 0}</span>
                  </div>
                </td>
                <td className="px-4 py-5 text-center">
                  <div className={`text-xl font-black mono ${
                    player.score >= 80 ? 'text-green-400' : player.score >= 65 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {player.score.toFixed(0)}
                  </div>
                </td>
                <td className="px-4 py-5">
                  <div className="flex flex-wrap gap-2">
                    {player.roleMetrics.map((m, i) => (
                      <div key={i} className="flex flex-col items-center min-w-[60px]">
                        <span className="text-[8px] text-slate-500 uppercase font-black tracking-tighter text-center h-3 truncate w-14">
                          {m.label}
                        </span>
                        <div className={`
                          mt-1 w-9 h-9 rounded flex items-center justify-center font-bold text-[12px] border
                          ${Number(m.value) >= 15 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                            Number(m.value) >= 10 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                            'bg-slate-800 border-slate-700 text-slate-300'}
                        `}>
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-5 text-[10px] leading-relaxed">
                  <div className="space-y-2">
                    <div className="flex items-start gap-1.5 text-green-400/90">
                      <TrendingUp className="w-3 e-3 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{player.pros}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-red-400/90">
                      <TrendingDown className="w-3 h-3 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{player.cons}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 text-center">
                  <button 
                    onClick={() => onToggleSelection(player)}
                    className={`
                      px-4 py-2 rounded-lg transition-all text-[10px] font-bold uppercase
                      ${isSelected ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700'}
                    `}
                  >
                    {isSelected ? <Check className="w-4 h-4 mx-auto" /> : labels.compareAction}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
