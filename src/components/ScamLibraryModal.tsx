import React, { useState } from "react";
import {
  Zap,
  Package,
  Landmark,
  Briefcase,
  PhoneCall,
  Volume2,
  X,
  Play,
  Square,
} from "lucide-react";
import { SCAM_LIBRARY_ITEMS } from "../data/demoData";
import { AppLanguage, ScamLibraryItem } from "../types";
import { audioController } from "../utils/audio";

interface ScamLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
}

export const ScamLibraryModal: React.FC<ScamLibraryModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isUrdu = language === "ur";
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case "Zap":
        return <Zap className="w-6 h-6 text-amber-500" />;
      case "Package":
        return <Package className="w-6 h-6 text-blue-500" />;
      case "Landmark":
        return <Landmark className="w-6 h-6 text-emerald-600" />;
      case "Briefcase":
        return <Briefcase className="w-6 h-6 text-indigo-500" />;
      default:
        return <PhoneCall className="w-6 h-6 text-red-500" />;
    }
  };

  const handlePlayAudio = (item: ScamLibraryItem) => {
    if (playingId === item.id) {
      audioController.stop();
      setPlayingId(null);
      return;
    }

    setPlayingId(item.id);
    const textToSpeak = isUrdu ? item.audioScriptUr : item.audioScriptEn;
    audioController.speak(
      textToSpeak,
      isUrdu ? "ur" : "en",
      () => setPlayingId(item.id),
      () => setPlayingId(null),
      () => setPlayingId(null)
    );
  };

  const handleClose = () => {
    audioController.stop();
    setPlayingId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-stone-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                {isUrdu ? "عام فراڈ کی آواز لائبریری" : "Audio Scam Library"}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {isUrdu ? "سنیں اور اپنے آپ کو دھوکے سے بچائیں" : "Listen and learn to recognize common scams"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list of scams */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {SCAM_LIBRARY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-300 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white rounded-xl shadow-2xs">
                    {getIcon(item.iconName)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                      {isUrdu ? item.titleUr : item.title}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Audio Listen Button */}
                <button
                  onClick={() => handlePlayAudio(item)}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer ${
                    playingId === item.id
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white"
                  }`}
                  aria-label={playingId === item.id ? "Stop audio" : "Listen audio"}
                >
                  {playingId === item.id ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>{isUrdu ? "روکیں" : "Stop"}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isUrdu ? "سنیں" : "Listen"}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                {isUrdu ? item.descriptionUr : item.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.typicalSignals.map((sig, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[11px] font-semibold bg-white border border-stone-200 text-stone-700 px-2 py-0.5 rounded-md"
                  >
                    • {sig}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-sm"
        >
          {isUrdu ? "بند کریں" : "Close Library"}
        </button>
      </div>
    </div>
  );
};
