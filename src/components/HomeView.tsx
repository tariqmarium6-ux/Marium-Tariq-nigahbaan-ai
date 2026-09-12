import React, { useRef } from "react";
import {
  Camera,
  Mic,
  Link2,
  Users,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Lock,
} from "lucide-react";
import { AppLanguage } from "../types";

interface HomeViewProps {
  language: AppLanguage;
  onOpenCheck: (initialTab?: "image" | "voice" | "url") => void;
  onOpenFamily: () => void;
  onAnalyzeImageFile: (file: File) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  onOpenCheck,
  onOpenFamily,
  onAnalyzeImageFile,
}) => {
  const isUrdu = language === "ur";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAnalyzeImageFile(file);
    }
  };

  return (
    <div className="w-full space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Hidden file picker for direct photo card tap */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoSelect}
        className="hidden"
        id="home-photo-picker"
      />

      {/* Reassurance Badge: 100% محفوظ • Safe & Private */}
      <div className="flex justify-center pt-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/70 border border-amber-200/80 text-amber-900 text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{isUrdu ? "100% محفوظ اور نجی" : "100% Safe & Private"}</span>
        </div>
      </div>

      {/* Main Heading */}
      <div className="text-center space-y-1.5 px-2">
        {isUrdu ? (
          <>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-urdu">
              کوئی میسج مشکوک ہے؟
            </h1>
            <p className="text-base sm:text-lg text-stone-600 font-medium font-urdu">
              ہم آپ کے لیے فوراً چیک کرتے ہیں
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Suspicious message or call?
            </h1>
            <p className="text-sm sm:text-base text-stone-600 font-medium">
              Let us check it safely for you
            </p>
          </>
        )}
      </div>

      {/* Big Hero Action Button (Screen 2: Coral rounded container) */}
      <button
        id="home-hero-check-now-btn"
        onClick={() => onOpenCheck()}
        className="w-full p-4 sm:p-5 rounded-3xl bg-[#E06D53] hover:bg-[#D65F45] text-white shadow-lg flex items-center justify-between transition-transform active:scale-[0.98] cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <Mic className="w-6 h-6 text-white stroke-[2.5]" />
        </div>
        <div className="text-center flex-1 px-3">
          <div className="text-lg sm:text-xl font-black tracking-wide flex items-center justify-center gap-2">
            {isUrdu ? (
              <span className="font-urdu text-2xl font-black">ابھی چیک کریں</span>
            ) : (
              <span className="tracking-wider">CHECK NOW</span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-white/90 font-medium mt-0.5">
            {isUrdu ? "بول کر بتائیں یا تصویر دکھائیں" : "Tap to talk or show photo"}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
          <ArrowRight className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
      </button>

      {/* Vertical Action Cards List (Matches Screen 2) */}
      <div className="space-y-3 pt-1">
        {/* Card 1: 📷 Show Photo */}
        <button
          id="action-card-photo-btn"
          onClick={() => {
            // Give option to select photo directly or open photo tab
            onOpenCheck("image");
          }}
          className="w-full p-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200/90 shadow-2xs flex items-center justify-between transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div>
                {isUrdu ? (
                  <span className="text-lg font-extrabold text-stone-900 font-urdu block">
                    تصویر دکھائیں
                  </span>
                ) : (
                  <span className="text-base font-black text-stone-800 block">
                    Show Photo
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {isUrdu ? "واٹس ایپ یا ایس ایم ایس اسکرین شاٹ" : "WhatsApp or SMS screenshot"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
        </button>

        {/* Card 2: 🎙️ Tell by Voice */}
        <button
          id="action-card-voice-btn"
          onClick={() => onOpenCheck("voice")}
          className="w-full p-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200/90 shadow-2xs flex items-center justify-between transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mic className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div>
                {isUrdu ? (
                  <span className="text-lg font-extrabold text-stone-900 font-urdu block">
                    بول کر بتائیں
                  </span>
                ) : (
                  <span className="text-base font-black text-stone-800 block">
                    Tell by Voice
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {isUrdu ? "وائس نوٹ یا مشکوک فون کال" : "Voice note or suspicious call"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
        </button>

        {/* Card 3: 🔗 Check Link */}
        <button
          id="action-card-link-btn"
          onClick={() => onOpenCheck("url")}
          className="w-full p-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200/90 shadow-2xs flex items-center justify-between transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEFEA] text-[#E06D53] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Link2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div>
                {isUrdu ? (
                  <span className="text-lg font-extrabold text-stone-900 font-urdu block">
                    لنک چیک کریں
                  </span>
                ) : (
                  <span className="text-base font-black text-stone-800 block">
                    Check Link
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {isUrdu ? "ویب ایڈریس کا تحفظ چیک کریں" : "Inspect web address safety"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
        </button>

        {/* Card 4: 💜 Family / Don't worry card (Screen 2: Soft lavender container + purple button) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F1FD] border border-[#E3DCFA] shadow-2xs space-y-3">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white text-[#6C5CE7] flex items-center justify-center shrink-0 shadow-2xs">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div>
                {isUrdu ? (
                  <span className="text-lg font-extrabold text-stone-900 font-urdu block">
                    پریشان نہ ہوں
                  </span>
                ) : (
                  <span className="text-base font-black text-stone-800 block">
                    Don't worry
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 font-medium mt-1 leading-relaxed">
                {isUrdu
                  ? "کسی بھی وقت اپنے بااعتماد فرد کو کال کریں۔ خاندان آپ کی حفاظت کے لیے موجود ہے۔"
                  : "Call someone you trust anytime. Family is here to help and protect you."}
              </p>
            </div>
          </div>

          {/* Solid Purple Button */}
          <button
            id="home-ask-family-btn"
            onClick={onOpenFamily}
            className="w-full py-3 px-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5C4BD8] text-white font-black text-sm shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            {isUrdu ? (
              <span className="font-urdu text-lg">اپنے خاندان سے پوچھیں</span>
            ) : (
              <span>Ask Family</span>
            )}
          </button>
        </div>
      </div>

      {/* Reassurance Footer with Lock */}
      <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-medium">
        <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span>
          {isUrdu
            ? "کوئی پاس ورڈ، پن کوڈ یا او ٹی پی کبھی نہیں مانگا جاتا۔"
            : "No passwords or bank codes are ever requested."}
        </span>
      </div>
    </div>
  );
};
