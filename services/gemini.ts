
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Language } from "../types";

const langMap = {
  pt: "Português Brasileiro",
  en: "English",
  es: "Español"
};

export const analyzePlayers = async (
  fileContent: string,
  positionLabel: string,
  styleLabel: string,
  language: Language = 'pt'
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are an elite Football Manager recruitment analyst (Moneyball Scout).
    Analyze the raw data and find the TOP 20 players for the position: ${positionLabel} and role: ${styleLabel}.

    MANDATORY TRANSLATION AND DATA DIRECTIVES:
    Every single string in the JSON output MUST be in ${langMap[language]}.
    
    1. ATTRIBUTES (roleMetrics): 
       Provide EXACTLY 5 items in the 'roleMetrics' array representing the most critical tactical stats for the role ${styleLabel}.
       Translate technical labels (e.g., 'Tackling' -> 'Desarme', 'Finishing' -> 'Finalização', 'Work Rate' -> 'Índice de Trabalho', 'Pace' -> 'Velocidade', 'Heading' -> 'Cabeceamento', 'Passing' -> 'Passe', 'Marking' -> 'Marcação', 'Vision' -> 'Visão', 'Agility' -> 'Agilidade', 'Composure' -> 'Compostura').
    2. SCOUT REPORT (pros & cons): 
       Translate the tactical analysis completely to ${langMap[language]}. Do not leave any English terms.
    3. PERSONALITY: 
       Translate personalities (e.g., 'Professional' -> 'Profissional', 'Driven' -> 'Determinado', 'Ambitious' -> 'Ambicioso', 'Balanced' -> 'Equilibrado').
    4. PREFERRED FOOT: 
       Translate foot (e.g., 'Right' -> 'Direito', 'Left' -> 'Esquerdo', 'Either' -> 'Ambos').
    5. WAGE: 
       The user wants MONTHLY wage. If the data is weekly, multiply by 4. If it's yearly, divide by 12. Format it nicely with currency if possible, but the string must be in ${langMap[language]}.
    6. SUMMARY: 
       Provide 'analysisSummary' as a detailed tactical report in ${langMap[language]}.
    7. COMPARISON STATS:
       Provide goals, assists, a defensive score (0-20), and a physical score (0-20). Translate any categorical values if they are strings.
  `;

  const prompt = `
    Target Position: ${positionLabel}
    Style/Role: ${styleLabel}
    Target Language: ${langMap[language]}
    
    INSTRUCTIONS:
    - Rank the top 20 players.
    - For each player, provide exactly 5 key technical attributes relevant to their role in 'roleMetrics'.
    - Convert wages to monthly values.
    - Translate EVERYTHING to ${langMap[language]}. 
    - Specially translate "Years/Anos/Años" logic into the pros/cons and summaries.
    
    RAW DATA:
    ${fileContent.slice(0, 50000)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topPlayers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rank: { type: Type.NUMBER },
                name: { type: Type.STRING },
                age: { type: Type.NUMBER },
                club: { type: Type.STRING },
                gamesPlayed: { type: Type.NUMBER },
                score: { type: Type.NUMBER },
                marketValue: { type: Type.STRING },
                wage: { type: Type.STRING },
                preferredFoot: { type: Type.STRING },
                personality: { type: Type.STRING },
                potential: { type: Type.STRING },
                keyStats: { type: Type.ARRAY, items: { type: Type.STRING } },
                roleMetrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.NUMBER },
                    },
                    required: ["label", "value"],
                  },
                },
                pros: { type: Type.STRING },
                cons: { type: Type.STRING },
                comparisonStats: {
                  type: Type.OBJECT,
                  properties: {
                    goals: { type: Type.STRING },
                    assists: { type: Type.STRING },
                    defensive: { type: Type.NUMBER },
                    physical: { type: Type.NUMBER },
                  },
                  required: ["goals", "assists", "defensive", "physical"],
                }
              },
              required: ["rank", "name", "score", "gamesPlayed", "keyStats", "roleMetrics", "pros", "cons", "comparisonStats", "preferredFoot", "personality"],
            },
          },
          analysisSummary: { type: Type.STRING },
        },
        required: ["topPlayers", "analysisSummary"],
      },
      thinkingConfig: { thinkingBudget: 4000 }
    },
  });

  try {
    const text = response.text.trim();
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("AI Response Parse Error:", error);
    throw new Error("Falha ao analisar dados. Verifique o formato do arquivo exportado.");
  }
};
