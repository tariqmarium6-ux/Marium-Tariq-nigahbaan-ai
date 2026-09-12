import React from "react";
import { Cpu, X, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { AnalysisResult } from "../types";

interface TechnicalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
}

export const TechnicalDetailsModal: React.FC<TechnicalDetailsModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-stone-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-stone-900">
                  Technical Architecture
                </h2>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  Judges Info
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Under the hood: AI Pipeline & Risk Heuristics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical Metrics */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Configured Model
            </span>
            <span className="text-sm font-black text-stone-800 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              gemini-3.8-flash
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Internal Risk Score
            </span>
            <span
              className={`text-sm font-black mt-0.5 block ${
                result.risk_level === "danger"
                  ? "text-red-600"
                  : result.risk_level === "caution"
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {(result.risk_score * 100).toFixed(1)}% ({result.risk_level.toUpperCase()})
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Language Output
            </span>
            <span className="text-sm font-black text-stone-800 uppercase mt-0.5 block">
              {result.language} (Bilingual Voice)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Uncertainty Level
            </span>
            <span className="text-sm font-black text-stone-800 uppercase mt-0.5 block">
              {result.uncertainty}
            </span>
          </div>
        </div>

        {/* Architecture Philosophy Note */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
          <p className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Zero-Text Cognitive Load Enforcement
          </p>
          <p className="text-xs text-emerald-900 leading-relaxed font-medium">
            Nigehbaan deliberately conceals numerical probabilities and raw LLM parameters from
            elderly users. Complex multimodal signals are distilled into three universal states
            (Green/Yellow/Red) paired with natural speech.
          </p>
        </div>

        {/* Detected Signals Dump */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Active Signal Detectors ({result.signals.length})
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {result.signals.map((s, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-stone-100 text-xs font-mono text-stone-700 flex justify-between"
              >
                <span className="font-bold">{s.type}</span>
                <span className="text-stone-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-sm"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
