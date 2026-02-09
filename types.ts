
export type Language = 'pt' | 'en' | 'es';

export interface PlayerRanking {
  rank: number;
  name: string;
  age: number;
  club: string;
  gamesPlayed: number | string;
  score: number;
  keyStats: string[];
  pros: string;
  cons: string;
  // Novos campos extras para o popup
  marketValue?: string;
  wage?: string;
  preferredFoot?: string;
  personality?: string;
  potential?: string;
  roleMetrics: {
    label: string;
    value: string | number;
  }[];
  comparisonStats: {
    goals: string | number;
    assists: string | number;
    defensive: string | number;
    physical: string | number;
  };
}

export interface AnalysisResult {
  topPlayers: PlayerRanking[];
  analysisSummary: string;
}

export type Position = 
  | 'Goleiro (GK)' 
  | 'Defesas Centrais (DC)' 
  | 'Laterais (DR/DL)' 
  | 'Médios Defensivos (DM)' 
  | 'Médios Centro (MC)' 
  | 'Extremos e Médios Ofensivos (AMR/L/C)' 
  | 'Avançados/Atacantes (ST)';

export type Playstyle = 
  | 'Tradicional' | 'Guarda-redes Líbero'
  | 'Defesa Central' | 'Defesa com Bola' | 'Defesa Descomplicado' | 'Líbero'
  | 'Defesa Lateral' | 'Ala' | 'Ala Completo' | 'Defesa Lateral Invertido' | 'Ala Invertido'
  | 'Trinco' | 'Médio Recuperador de Bolas' | 'Construtor de Jogo Recuado' | 'Pivô Defensivo' | 'Segundo Volante'
  | 'Médio Centro' | 'Médio Área-a-Área' | 'Mezzala' | 'Carrilero'
  | 'Extremo' | 'Avançado Interior' | 'Extremo Invertido' | 'Raumdeuter' | 'Avançado Sombra'
  | 'Ponta de Lança Avançado' | 'Avançado Recuado' | 'Homem Alvo' | 'Falso 9' | 'Avançado Completo';
