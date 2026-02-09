
import React, { useState, useMemo } from 'react';
import { analyzePlayers } from './services/gemini';
import { AnalysisResult, PlayerRanking, Language } from './types';
import PlayerTable from './components/PlayerTable';
import ComparisonView from './components/ComparisonView';
import { 
  FileUp, 
  Search, 
  LayoutDashboard, 
  TrendingUp, 
  Loader2,
  ChevronDown,
  Info,
  Layers,
  Languages,
  Activity
} from 'lucide-react';

const TRANSLATIONS = {
  pt: {
    title: "MANEYBALL",
    subtitle: "FM Analista Pro",
    params: "Parâmetros Táticos",
    uploadLabel: "Arquivo de Exportação (.html / .csv)",
    uploadReady: "Pronto para análise",
    uploadPlaceholder: "Upload exportação do FM",
    uploadSub: "HTML, CSV ou TXT",
    posLabel: "Posição",
    roleLabel: "Função Tática (Papel)",
    btnAnalyze: "Encontrar Melhores Jogadores (Top 20)",
    btnAnalyzing: "Analisando Atributos...",
    helpTitle: "Como Exportar do FM",
    help1: "Vá até o seu plantel no Football Manager.",
    help2: "Pressione Ctrl+P (Win) ou Cmd+P (Mac).",
    help3: "Selecione 'Página Web' e salve.",
    help4: "Carregue o arquivo aqui.",
    noAnalysis: "Sem Análise Disponível",
    noAnalysisDesc: "Faça o upload e selecione uma função para gerar o ranking de 20 jogadores.",
    loadingTitle: "Escaneando Atributos...",
    loadingDesc: "O olheiro está processando o top 20 da sua lista.",
    scoutReport: "Relatório do Olheiro",
    compareBtn: "Comparar Agora",
    clear: "Limpar",
    selected: "Selecionados",
    rankingTitle: "RANKING TOP 20",
    ageSuffix: "anos",
    table: {
      player: "Jogador",
      games: "Jogos",
      score: "Nota",
      metrics: "Atributos Chave",
      scout: "Análise Scout",
      action: "Ação",
      compareAction: "Add",
      marketValue: "Valor de Mercado",
      wage: "Salário Mensal",
      foot: "Pé Preferido",
      personality: "Personalidade",
      potential: "Potencial",
      goals: "Gols",
      assists: "Assist.",
      defense: "Defesa",
      physical: "Físico",
      scoutSummary: "Sumário do Scout"
    },
    comparison: {
      compareTitle: "Comparação Lado a Lado",
      attributes: "Atributos"
    },
    positions: {
      gk: 'Goleiro (GK)',
      dc: 'Defesas Centrais (DC)',
      drdl: 'Laterais (DR/DL)',
      dm: 'Médios Defensivos (DM)',
      mc: 'Médios Centro (MC)',
      amr: 'Extremos / Médios Ofensivos',
      st: 'Avançados / Atacantes'
    },
    roles: {
      'Tradicional': 'Tradicional',
      'Guarda-redes Líbero': 'Guarda-redes Líbero',
      'Defesa Central': 'Defesa Central',
      'Defesa com Bola': 'Defesa com Bola',
      'Defesa Descomplicado': 'Defesa Descomplicado',
      'Líbero': 'Líbero',
      'Defesa Lateral': 'Defesa Lateral',
      'Ala': 'Ala',
      'Ala Completo': 'Ala Completo',
      'Defesa Lateral Invertido': 'Defesa Lateral Invertido',
      'Ala Invertido': 'Ala Invertido',
      'Trinco': 'Trinco',
      'Médio Recuperador de Bolas': 'Médio Recuperador de Bolas',
      'Construtor de Jogo Recuado': 'Construtor de Jogo Recuado',
      'Pivô Defensivo': 'Pivô Defensivo',
      'Segundo Volante': 'Segundo Volante',
      'Médio Centro': 'Médio Centro',
      'Médio Área-a-Área': 'Médio Área-a-Área',
      'Mezzala': 'Mezzala',
      'Carrilero': 'Carrilero',
      'Extremo': 'Extremo',
      'Avançado Interior': 'Avançado Interior',
      'Extremo Invertido': 'Extremo Invertido',
      'Raumdeuter': 'Raumdeuter',
      'Avançado Sombra': 'Avançado Sombra',
      'Ponta de Lança Avançado': 'Ponta de Lança Avançado',
      'Avançado Recuado': 'Avançado Recuado',
      'Homem Alvo': 'Homem Alvo',
      'Falso 9': 'Falso 9',
      'Avançado Completo': 'Avançado Completo'
    }
  },
  en: {
    title: "MANEYBALL",
    subtitle: "FM Analyst Pro",
    params: "Tactical Parameters",
    uploadLabel: "Export File (.html / .csv)",
    uploadReady: "Ready for analysis",
    uploadPlaceholder: "Upload FM Export",
    uploadSub: "HTML, CSV or TXT",
    posLabel: "Position",
    roleLabel: "Tactical Role",
    btnAnalyze: "Find Best Players (Top 20)",
    btnAnalyzing: "Analyzing Attributes...",
    helpTitle: "How to Export from FM",
    help1: "Go to your squad in FM.",
    help2: "Press Ctrl+P (Win) or Cmd+P (Mac).",
    help3: "Select 'Web Page' and save.",
    help4: "Upload the file here.",
    noAnalysis: "No Analysis Available",
    noAnalysisDesc: "Upload your file and select a role to generate Top 20 rankings.",
    loadingTitle: "Scanning Attributes...",
    loadingDesc: "The scout is processing the top 20 players in your list.",
    scoutReport: "Scout Report",
    compareBtn: "Compare Now",
    clear: "Clear",
    selected: "Selected",
    rankingTitle: "TOP 20 RANKING",
    ageSuffix: "years",
    table: {
      player: "Player",
      games: "Games",
      score: "Score",
      metrics: "Key Metrics",
      scout: "Scout Analysis",
      action: "Action",
      compareAction: "Add",
      marketValue: "Market Value",
      wage: "Monthly Wage",
      foot: "Preferred Foot",
      personality: "Personality",
      potential: "Potential",
      goals: "Goals",
      assists: "Assists",
      defense: "Defense",
      physical: "Physical",
      scoutSummary: "Scout Summary"
    },
    comparison: {
      compareTitle: "Side-by-Side Comparison",
      attributes: "Attributes"
    },
    positions: {
      gk: 'Goalkeeper (GK)',
      dc: 'Central Defenders (DC)',
      drdl: 'Full Backs (DR/DL)',
      dm: 'Defensive Midfielders (DM)',
      mc: 'Central Midfielders (MC)',
      amr: 'Wingers / Attacking Mids',
      st: 'Strikers / Forwards'
    },
    roles: {
      'Tradicional': 'Traditional',
      'Guarda-redes Líbero': 'Sweeper Keeper',
      'Defesa Central': 'Central Defender',
      'Defesa com Bola': 'Ball Playing Defender',
      'Defesa Descomplicado': 'No-Nonsense Center Back',
      'Líbero': 'Libero',
      'Defesa Lateral': 'Full Back',
      'Ala': 'Wing Back',
      'Ala Completo': 'Complete Wing Back',
      'Defesa Lateral Invertido': 'Inverted Full Back',
      'Ala Invertido': 'Inverted Wing Back',
      'Trinco': 'Anchor Man',
      'Médio Recuperador de Bolas': 'Ball Winning Midfielder',
      'Construtor de Jogo Recuado': 'Deep Lying Playmaker',
      'Pivô Defensivo': 'Defensive Center Mid',
      'Segundo Volante': 'Segundo Volante',
      'Médio Centro': 'Central Midfielder',
      'Médio Área-a-Área': 'Box-to-Box Midfielder',
      'Mezzala': 'Mezzala',
      'Carrilero': 'Carrilero',
      'Extremo': 'Winger',
      'Avançado Interior': 'Inside Forward',
      'Extremo Invertido': 'Inverted Winger',
      'Raumdeuter': 'Raumdeuter',
      'Avançado Sombra': 'Shadow Striker',
      'Ponta de Lança Avançado': 'Advanced Forward',
      'Avançado Recuado': 'Deep Lying Forward',
      'Homem Alvo': 'Target Man',
      'Falso 9': 'False 9',
      'Avançado Completo': 'Complete Forward'
    }
  },
  es: {
    title: "MANEYBALL",
    subtitle: "Analista FM Pro",
    params: "Parámetros Tácticos",
    uploadLabel: "Archivo de Exportación (.html / .csv)",
    uploadReady: "Listo para el análisis",
    uploadPlaceholder: "Subir exportación de FM",
    uploadSub: "HTML, CSV o TXT",
    posLabel: "Position",
    roleLabel: "Rol Táctico",
    btnAnalyze: "Buscar Mejores (Top 20)",
    btnAnalyzing: "Analizando Atributos...",
    helpTitle: "Cómo Exportar desde FM",
    help1: "Ve a tu plantilla en FM.",
    help2: "Presiona Ctrl+P (Win) ou Cmd+P (Mac).",
    help3: "Selecciona 'Página Web' y guarda.",
    help4: "Sube el archivo aquí.",
    noAnalysis: "Sin Análisis Disponible",
    noAnalysisDesc: "Sube tu archivo y selecciona un rol para generar el Top 20.",
    loadingTitle: "Escaneando Atributos...",
    loadingDesc: "El ojeador está procesando os 20 melhores jogadores.",
    scoutReport: "Informe del Ojeador",
    compareBtn: "Comparar Ahora",
    clear: "Limpar",
    selected: "Selecionados",
    rankingTitle: "RANKING TOP 20",
    ageSuffix: "años",
    table: {
      player: "Jugador",
      games: "Partidos",
      score: "Nota",
      metrics: "Métricas Clave",
      scout: "Análisis del Ojeador",
      action: "Acción",
      compareAction: "Add",
      marketValue: "Valor de Mercado",
      wage: "Salario Mensual",
      foot: "Pie Preferido",
      personality: "Personalidad",
      potential: "Potencial",
      goals: "Goles",
      assists: "Asist.",
      defense: "Defensa",
      physical: "Físico",
      scoutSummary: "Resumen del Scout"
    },
    comparison: {
      compareTitle: "Comparación Detallada",
      attributes: "Atributos"
    },
    positions: {
      gk: 'Portero (GK)',
      dc: 'Defensas Centrales (DC)',
      drdl: 'Laterais (DR/DL)',
      dm: 'Medios Defensivos (DM)',
      mc: 'Medios Centros (MC)',
      amr: 'Extremos / Medios Ofensivos',
      st: 'Delanteros / Atacantes'
    },
    roles: {
      'Tradicional': 'Tradicional',
      'Guarda-redes Líbero': 'Portero de Cierre',
      'Defesa Central': 'Defensa Central',
      'Defesa com Bola': 'Defensa con Toque',
      'Defesa Descomplicado': 'Defensa sin Concesiones',
      'Líbero': 'Líbero',
      'Defesa Lateral': 'Lateral',
      'Ala': 'Carrilero',
      'Ala Completo': 'Carrilero Completo',
      'Defesa Lateral Invertido': 'Lateral Inverso',
      'Ala Invertido': 'Carrilero Inverso',
      'Trinco': 'Pivote',
      'Médio Recuperador de Bolas': 'Centrocampista de Cierre',
      'Construtor de Jogo Recuado': 'Organizador en el Corto',
      'Pivô Defensivo': 'Pivote Defensivo',
      'Segundo Volante': 'Segundo Volante',
      'Médio Centro': 'Centrocampista',
      'Médio Área-a-Área': 'Centrocampista Todoterreno',
      'Mezzala': 'Mezzala',
      'Carrilero': 'Carrilero Interior',
      'Extremo': 'Extremo',
      'Avançado Interior': 'Delantero Interior',
      'Extremo Invertido': 'Extremo Inverso',
      'Raumdeuter': 'Raumdeuter',
      'Avançado Sombra': 'Delantero Sorpresa',
      'Ponta de Lança Avançado': 'Delantero Avanzado',
      'Avançado Recuado': 'Delantero de Apoyo',
      'Homem Alvo': 'Hombre Objetivo',
      'Falso 9': 'Falso 9',
      'Avançado Completo': 'Delantero Completo'
    }
  }
};

const INTERNAL_STYLES_MAP: Record<string, string[]> = {
  'gk': ['Tradicional', 'Guarda-redes Líbero'],
  'dc': ['Defesa Central', 'Defesa com Bola', 'Defesa Descomplicado', 'Líbero'],
  'drdl': ['Defesa Lateral', 'Ala', 'Ala Completo', 'Defesa Lateral Invertido', 'Ala Invertido'],
  'dm': ['Trinco', 'Médio Recuperador de Bolas', 'Construtor de Jogo Recuado', 'Pivô Defensivo', 'Segundo Volante'],
  'mc': ['Médio Centro', 'Médio Área-a-Área', 'Mezzala', 'Carrilero'],
  'amr': ['Extremo', 'Avançado Interior', 'Extremo Invertido', 'Raumdeuter', 'Avançado Sombra'],
  'st': ['Ponta de Lança Avançado', 'Avançado Recuado', 'Homem Alvo', 'Falso 9', 'Avançado Completo']
};

export default function App() {
  const [lang, setLang] = useState<Language>('pt');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [posKey, setPosKey] = useState<string>('st');
  const [roleKey, setRoleKey] = useState<string>('Ponta de Lança Avançado');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerRanking[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const t = TRANSLATIONS[lang];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => setFileContent(event.target?.result as string);
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!fileContent) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setSelectedPlayers([]);
    setShowComparison(false);
    
    const posLabel = (t.positions as any)[posKey];
    const roleLabel = (t.roles as any)[roleKey];

    try {
      const analysis = await analyzePlayers(fileContent, posLabel, roleLabel, lang);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-[#0a0f1e]">
      <header className="border-b border-slate-800 bg-[#0f172a]/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
              <TrendingUp className="text-slate-900 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">{t.title}</h1>
              <p className="text-[10px] text-green-500 font-bold tracking-widest uppercase mt-1">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-800/80 rounded-xl px-4 py-2 gap-3 border border-slate-700 shadow-inner">
              <Languages className="w-4 h-4 text-slate-400" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer outline-none"
              >
                <option value="pt" className="bg-slate-900 text-white">Português</option>
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="es" className="bg-slate-900 text-white">Español</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white uppercase tracking-tight">
                <LayoutDashboard className="w-5 h-5 text-green-500" />
                {t.params}
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.uploadLabel}</label>
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${fileName ? 'border-green-500 bg-green-500/5' : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'}`}>
                    <div className="text-center px-4">
                      <FileUp className={`w-8 h-8 mb-2 mx-auto ${fileName ? 'text-green-500' : 'text-slate-600'}`} />
                      <p className={`text-sm font-bold truncate w-full ${fileName ? 'text-green-400' : 'text-slate-400'}`}>{fileName || t.uploadPlaceholder}</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">{fileName ? t.uploadReady : t.uploadSub}</p>
                    </div>
                    <input type="file" className="hidden" accept=".csv,.html,.txt" onChange={handleFileUpload} />
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.posLabel}</label>
                    <div className="relative">
                      <select 
                        value={posKey} 
                        onChange={(e) => { 
                          setPosKey(e.target.value); 
                          const nextRole = INTERNAL_STYLES_MAP[e.target.value][0];
                          setRoleKey(nextRole); 
                        }} 
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50 text-white font-bold"
                      >
                        {Object.keys(t.positions).map(key => (
                          <option key={key} value={key}>{(t.positions as any)[key]}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.roleLabel}</label>
                    <div className="relative">
                      <select 
                        value={roleKey} 
                        onChange={(e) => setRoleKey(e.target.value)} 
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50 text-white font-bold"
                      >
                        {INTERNAL_STYLES_MAP[posKey].map(s => (
                          <option key={s} value={s}>{(t.roles as any)[s] || s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !fileContent} 
                  className={`w-full py-4 px-6 rounded-xl font-black flex items-center justify-center transition-all shadow-xl uppercase tracking-widest text-sm text-center leading-tight ${isAnalyzing || !fileContent ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-slate-900 shadow-green-500/20 active:scale-95'}`}
                >
                  <div className="flex items-center gap-3">
                    {isAnalyzing ? (
                      <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                    ) : (
                      <Search className="w-5 h-5 shrink-0" />
                    )}
                    <span className="block">{isAnalyzing ? t.btnAnalyzing : t.btnAnalyze}</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
                <h3 className="text-xs font-black text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <Info className="w-4 h-4 text-green-500" />
                  {t.helpTitle}
                </h3>
                <ol className="text-[11px] text-slate-500 space-y-3 list-decimal list-inside leading-relaxed font-medium">
                  <li>{t.help1}</li>
                  <li>{t.help2}</li>
                  <li>{t.help3}</li>
                  <li>{t.help4}</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-8">
            {showComparison && selectedPlayers.length > 0 ? (
              <ComparisonView players={selectedPlayers} onClose={() => setShowComparison(false)} labels={{...t.comparison, ...t.table}} />
            ) : null}

            {!result && !isAnalyzing && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-900/10 rounded-3xl border-2 border-dashed border-slate-800 p-12 text-center">
                <LayoutDashboard className="w-16 h-16 text-slate-800 mb-6" />
                <h3 className="text-2xl font-bold text-slate-600 mb-2">{t.noAnalysis}</h3>
                <p className="text-slate-700 max-w-md font-medium">{t.noAnalysisDesc}</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-900/20 rounded-3xl border border-slate-800 p-12 text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                  <Activity className="absolute inset-0 m-auto w-8 h-8 text-green-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{t.loadingTitle}</h3>
                <p className="text-slate-500 font-medium">{t.loadingDesc}</p>
              </div>
            )}

            {result && !showComparison && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-end justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{t.rankingTitle}</h2>
                    <p className="text-green-500 font-black text-sm tracking-widest mt-1">
                      {(t.roles as any)[roleKey] || roleKey} — {(t.positions as any)[posKey]}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 font-black uppercase mb-1">Engine Status</span>
                    <div className="bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Moneyball Verified</span>
                    </div>
                  </div>
                </div>

                <PlayerTable 
                  players={result.topPlayers} 
                  selectedNames={selectedPlayers.map(p => p.name)} 
                  onToggleSelection={(p) => {
                    setSelectedPlayers(prev => {
                      const isAlreadySelected = prev.find(x => x.name === p.name);
                      if (isAlreadySelected) return prev.filter(x => x.name !== p.name);
                      if (prev.length >= 3) return prev;
                      return [...prev, p];
                    });
                  }} 
                  labels={{...t.table, ageSuffix: t.ageSuffix}} 
                />

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-4 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-32 h-32" />
                  </div>
                  <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    {t.scoutReport}
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-medium italic text-lg border-l-4 border-green-500/30 pl-6 py-2">
                    "{result.analysisSummary}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedPlayers.length > 0 && !showComparison && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-12 duration-500">
          <div className="bg-[#0f172a]/95 backdrop-blur-2xl border border-slate-700 px-8 py-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-8 ring-1 ring-white/10">
            <div className="flex -space-x-4">
              {selectedPlayers.map((p, i) => (
                <div key={p.name} style={{ zIndex: 10 - i }} className="w-11 h-11 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-black text-green-400 shadow-xl">
                  {p.name.charAt(0)}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-black text-sm leading-none uppercase tracking-tighter">{selectedPlayers.length} {t.selected}</p>
              <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-widest">Compare Pool</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowComparison(true)} 
                disabled={selectedPlayers.length < 2} 
                className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 uppercase tracking-widest transition-all ${selectedPlayers.length >= 2 ? 'bg-green-600 text-slate-900 hover:bg-green-500 shadow-lg shadow-green-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
              >
                <Layers className="w-4 h-4" />
                {t.compareBtn}
              </button>
              <button onClick={() => setSelectedPlayers([])} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest px-2 transition-colors">{t.clear}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
