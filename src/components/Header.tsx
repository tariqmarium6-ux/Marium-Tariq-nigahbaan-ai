import React, { useState } from "react";
import { Volume2, VolumeX, User, Sparkles } from "lucide-react";
import { NigehbaanLogo } from "./NigehbaanLogo";
import { AppLanguage, RiskLevel } from "../types";
import { audioController } from "../utils/audio";

interface HeaderProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenTrustedContact: () => void;
  onOpenScamLibrary: () => void;
  onDemoSelect: (level: RiskLevel) => void;
  activeDemoLevel: RiskLevel | null;
  onResetToHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenTrustedContact,
  onDemoSelect,
  activeDemoLevel,
  onResetToHome,
}) => {
  const isUrdu = language === "ur";
  const [isHeaderSpeaking, setIsHeaderSpeaking] = useState<boolean>(false);

  const handleHeaderListen = () => {
    if (isHeaderSpeaking) {
      audioController.stop();
      setIsHeaderSpeaking(false);
      return;
    }

    const textUrdu =
      "خوش آمدید! نگہبان — سوچ لو، پھر بھروسہ کرو۔ آپ کا ڈیجیٹل محافظ۔ کسی بھی مشکوک میسج، فون کال یا لنک کی جانچ کے لیے نیچے چیک بٹن دبائیں۔";
    const textEn =
      "Welcome to Nigehbaan — Soch Lo, Phir Bharosa Karo. Your digital safety guardian. Tap the Check button below to safely inspect any suspicious message, call, or link.";
    const romanUrdu =
      "Khush aamdeed! Nigehbaan — Soch Lo, Phir Bharosa Karo. Aap ka digital muhaafiz. Kisi bhi mashkook message, phone call ya link ki jaanch ke liye neechay Check button dabayein.";

    setIsHeaderSpeaking(true);
    audioController.speak(
      isUrdu ? textUrdu : textEn,
      language,
      romanUrdu,
      () => setIsHeaderSpeaking(true),
      () => setIsHeaderSpeaking(false),
      () => setIsHeaderSpeaking(false)
    );
  };

  return (
    <header className="w-full bg-[#FAF8F5] border-b border-stone-200/80 sticky top-0 z-30 shadow-2xs">
      {/* Hackathon Judge Demo bar: Instant 1-tap testing of the 3 states */}
      <div className="bg-stone-900 text-stone-200 text-xs px-3 sm:px-6 py-2">
        <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold tracking-wider uppercase text-[11px] text-amber-400/90">
              Judge Quick Test Mode:
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              id="demo-danger-btn"
              onClick={() => onDemoSelect("danger")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeDemoLevel === "danger"
                  ? "bg-[#801828] text-white shadow-xs scale-105 ring-2 ring-red-400/50"
                  : "bg-stone-800 text-red-400 hover:bg-stone-700"
              }`}
              title="Flagship Demo: Fake Electricity Bill Disconnection"
            >
              ⚡ DANGER (Flagship)
            </button>
            <button
              id="demo-caution-btn"
              onClick={() => onDemoSelect("caution")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeDemoLevel === "caution"
                  ? "bg-amber-600 text-white shadow-xs scale-105 ring-2 ring-amber-400/50"
                  : "bg-stone-800 text-amber-400 hover:bg-stone-700"
              }`}
            >
              ⚠️ CAUTION
            </button>
            <button
              id="demo-safe-btn"
              onClick={() => onDemoSelect("safe")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeDemoLevel === "safe"
                  ? "bg-emerald-600 text-white shadow-xs scale-105 ring-2 ring-emerald-400/50"
                  : "bg-stone-800 text-emerald-400 hover:bg-stone-700"
              }`}
            >
              ✅ SAFE
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Header Bar with Nigehbaan Brand Logo & Name */}
      <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          id="brand-logo-btn"
          onClick={onResetToHome}
          className="flex items-center gap-2.5 text-left focus:outline-hidden group cursor-pointer"
          aria-label="Nigehbaan Home"
        >
          {/* Custom Crafted Nigehbaan Emblem Logo */}
          <NigehbaanLogo size={42} className="group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              {isUrdu ? (
                <span className="text-2xl font-black tracking-tight text-stone-900 font-urdu">
                  نگہبان
                </span>
              ) : (
                <span className="text-xl font-black tracking-tight text-stone-900">
                  Nigehbaan
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-stone-500 tracking-tight mt-0.5">
              {isUrdu ? "سوچ لو، پھر بھروسہ کرو" : "Think first, then trust"}
            </p>
          </div>
        </button>

        {/* Right Controls: Separate Urdu/English Toggles, Listen Audio Pill, User Avatar */}
        <div className="flex items-center gap-2">
          {/* Dual Toggle Language Switcher */}
          <div className="flex items-center bg-white p-1 rounded-full border border-stone-200 shadow-2xs">
            <button
              id="lang-ur-btn"
              onClick={() => onLanguageChange("ur")}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isUrdu
                  ? "bg-[#6C5CE7] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              اردو
            </button>
            <button
              id="lang-en-btn"
              onClick={() => onLanguageChange("en")}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !isUrdu
                  ? "bg-[#6C5CE7] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              EN
            </button>
          </div>

          {/* Dedicated Header Audio "Listen" Pill Button */}
          <button
            id="header-listen-pill-btn"
            onClick={handleHeaderListen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer border ${
              isHeaderSpeaking
                ? "bg-[#E06D53] text-white border-[#E06D53] animate-pulse"
                : "bg-white text-stone-700 border-stone-200 hover:border-[#E06D53] hover:text-[#E06D53]"
            }`}
            title={isUrdu ? "آواز میں رہنمائی سنیں" : "Listen to audio guidance"}
            aria-label="Listen to safety voice intro"
          >
            {isHeaderSpeaking ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#E06D53]" />
            )}
            <span>{isUrdu ? "سنیں" : "Listen"}</span>
          </button>

          {/* User / Trusted Contact Avatar Button */}
          <button
            id="header-user-avatar-btn"
            onClick={onOpenTrustedContact}
            className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-300 transition-colors cursor-pointer border border-stone-300"
            title={isUrdu ? "بااعتماد رابطہ" : "Trusted Contact"}
            aria-label="Trusted Contact"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
