export type RiskLevel = "safe" | "caution" | "danger";

export type AppLanguage = "en" | "ur";

export interface AnalysisSignal {
  type: string;
  label: string;
  explanation: string;
}

export interface AnalysisResult {
  risk_level: RiskLevel;
  risk_score: number;
  language: string;
  summary: string;
  signals: AnalysisSignal[];
  recommended_actions: string[];
  audio_script: string;
  audio_script_en?: string;
  audio_script_ur?: string;
  audio_script_ur_roman?: string;
  uncertainty: "low" | "medium" | "high";
  isDemo?: boolean;
  demoTitle?: string;
  technical_details?: {
    modelUsed?: string;
    inputType?: string;
    timestamp?: string;
    uncertainty?: string;
  };
}

export interface TrustedContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface ScamLibraryItem {
  id: string;
  title: string;
  titleUr: string;
  category: string;
  categoryUr?: string;
  iconName: string;
  description: string;
  descriptionUr: string;
  audioScriptEn: string;
  audioScriptUr: string;
  typicalSignals: string[];
  typicalSignalsUr?: string[];
}
