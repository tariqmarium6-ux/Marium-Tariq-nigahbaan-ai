import React from "react";
import { Shield } from "lucide-react";
import { AppLanguage } from "../types";

interface AnalyzingLoaderProps {
  language: AppLanguage;
}

export const AnalyzingLoader: React.FC<AnalyzingLoaderProps> = ({ language }) => {
  const isUrdu = language === "ur";

  return (
    <div
      id="analyzing-state-container"
      className="w-full flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-300"
    >
      {/* Gentle pulsing radar shield */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-36 h-36 rounded-full bg-emerald-100 animate-ping opacity-40"></div>
        <div className="absolute w-28 h-28 rounded-full bg-emerald-200 animate-pulse opacity-60"></div>
        <div className="relative w-24 h-24 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xl">
          <Shield className="w-12 h-12 stroke-[2.2]" />
        </div>
      </div>

      {/* Main simple non-technical message */}
      <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-2">
        {isUrdu ? "ہم اس کی جانچ کر رہے ہیں..." : "Checking this for you..."}
      </h2>

      {/* Spoken / Reassuring Urdu & English text */}
      <p className="text-base sm:text-lg font-medium text-stone-600 max-w-sm">
        {isUrdu
          ? "تھوڑا انتظار کریں۔ آواز شیلڈ آپ کی حفاظت کے لیے جائزہ لے رہا ہے۔"
          : "Please hold on a moment. AwaazShield is checking this content to keep you safe."}
      </p>

      {/* Calming progress indicator */}
      <div className="w-48 h-1.5 bg-stone-200 rounded-full overflow-hidden mt-6">
        <div className="h-full bg-emerald-600 rounded-full animate-[pulse_1.5s_infinite]"></div>
      </div>
    </div>
  );
};
