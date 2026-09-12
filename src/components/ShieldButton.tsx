import React from "react";
import { Shield, Mic } from "lucide-react";
import { AppLanguage } from "../types";

interface ShieldButtonProps {
  language: AppLanguage;
  onPress: () => void;
  isRecording?: boolean;
}

export const ShieldButton: React.FC<ShieldButtonProps> = ({
  language,
  onPress,
  isRecording = false,
}) => {
  const isUrdu = language === "ur";

  return (
    <div className="flex flex-col items-center justify-center my-6">
      {/* Huge Accessible Shield Button */}
      <button
        id="main-shield-check-btn"
        onClick={onPress}
        className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 focus:outline-hidden select-none cursor-pointer ${
          isRecording
            ? "bg-red-600 text-white shadow-2xl ring-12 ring-red-200 animate-pulse"
            : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl hover:shadow-2xl ring-8 ring-emerald-100 hover:ring-emerald-200"
        }`}
        aria-label={isUrdu ? "چیک کریں - آواز یا میسج سے" : "Check it - Voice or message"}
      >
        {/* Shield Icon or Mic Icon */}
        <div className="relative mb-2">
          {isRecording ? (
            <Mic className="w-16 h-16 sm:w-20 sm:h-20 animate-bounce stroke-[2.2]" />
          ) : (
            <Shield className="w-16 h-16 sm:w-20 sm:h-20 stroke-[2.2]" />
          )}
        </div>

        {/* Primary Action Text */}
        <span className="text-xl sm:text-2xl font-black tracking-tight uppercase">
          {isRecording
            ? isUrdu
              ? "سُن رہا ہوں..."
              : "LISTENING..."
            : isUrdu
            ? "چیک کریں"
            : "CHECK IT"}
        </span>

        {/* Sub-label */}
        <span className="text-xs sm:text-sm font-semibold opacity-90 mt-1 flex items-center gap-1">
          <Mic className="w-3.5 h-3.5 inline" />
          {isUrdu ? "بول کر بتائیں" : "Tap to Speak"}
        </span>
      </button>

      {/* Supporting zero-text cognitive load microcopy */}
      <p className="mt-4 text-xs sm:text-sm font-medium text-stone-500 text-center flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
        {isUrdu ? "کوئی ٹائپنگ کی ضرورت نہیں — بس دکھائیں یا بولیں" : "No typing needed — just show or speak"}
      </p>
    </div>
  );
};
