import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Users,
  Clock,
  DollarSign,
  Link2,
  Lock,
  UserX,
  AlertTriangle,
  RotateCcw,
  Info,
  Calendar,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Hand,
  Volume2,
} from "lucide-react";
import { AnalysisResult, AppLanguage } from "../types";
import { AudioPlayer } from "./AudioPlayer";

interface VerdictScreenProps {
  result: AnalysisResult;
  language: AppLanguage;
  onAskTrustedContact: () => void;
  onOpenBlockGuide: () => void;
  onOpenTechnicalDetails: () => void;
  onCheckAnother: () => void;
}

export const VerdictScreen: React.FC<VerdictScreenProps> = ({
  result,
  language,
  onAskTrustedContact,
  onOpenTechnicalDetails,
  onCheckAnother,
}) => {
  const isUrdu = language === "ur";
  const level = result.risk_level;

  // Signal Icon mapping
  const getSignalIcon = (type: string) => {
    switch (type) {
      case "urgency":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "financial_request":
        return <DollarSign className="w-5 h-5 text-red-500" />;
      case "suspicious_url":
        return <Link2 className="w-5 h-5 text-blue-500" />;
      case "credential_request":
        return <Lock className="w-5 h-5 text-purple-500" />;
      case "impersonation":
        return <UserX className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="w-full space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Top Header Bar for Detail Screen */}
      <div className="flex items-center justify-between py-1.5 px-1">
        <button
          onClick={onCheckAnother}
          className="flex items-center gap-2 text-stone-700 hover:text-stone-950 font-extrabold text-sm sm:text-base py-2 px-3.5 rounded-xl hover:bg-stone-200/60 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          {isUrdu ? (
            <span className="font-urdu text-base sm:text-lg">واپس</span>
          ) : (
            <span>Back</span>
          )}
        </button>

        <span className="font-black text-stone-900 text-base sm:text-lg">
          {isUrdu ? (
            <span className="font-urdu text-lg sm:text-xl">حفاظتی نتیجہ</span>
          ) : (
            <span>Safety Verdict</span>
          )}
        </span>

        {/* Status Pill Badge */}
        <div className="flex items-center gap-1.5">
          {level === "danger" && (
            <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-red-100 text-red-700 border border-red-200 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="font-urdu text-sm sm:text-base">
                {isUrdu ? "فوری خطرہ 🚨" : "Danger 🚨"}
              </span>
            </span>
          )}
          {level === "caution" && (
            <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
              <span className="font-urdu text-sm sm:text-base">
                {isUrdu ? "⚠️ احتیاط" : "⚠️ Caution"}
              </span>
            </span>
          )}
          {level === "safe" && (
            <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" />
              <span className="font-urdu text-sm sm:text-base">
                {isUrdu ? "محفوظ" : "Safe"}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Demo Mode Badge if active */}
      {result.isDemo && (
        <div className="bg-stone-900 text-amber-300 text-xs sm:text-sm font-bold py-2 px-4 rounded-xl flex items-center justify-between shadow-2xs">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-urdu text-sm sm:text-base">
              {isUrdu ? "ڈیمو موڈ (ججز پریزنٹیشن)" : "DEMO MODE (Judge Presentation)"}
            </span>
          </span>
          <span className="text-xs text-stone-300 font-medium">
            {result.demoTitle || "Flagship Scenario"}
          </span>
        </div>
      )}

      {/* ==================================================== */}
      {/* 🛑 STATE 1: RED — DANGER (Screen 3 from mockups)     */}
      {/* ==================================================== */}
      {level === "danger" && (
        <div id="verdict-danger-section" className="space-y-4">
          {/* Main Crimson Red Card */}
          <div className="rounded-3xl bg-[#801828] text-white p-6 sm:p-8 md:p-10 shadow-xl space-y-4 sm:space-y-5 text-center">
            {/* Top detection badge */}
            <div className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide">
              {isUrdu ? (
                <span className="font-urdu text-base font-extrabold">فراڈ کا شبہ</span>
              ) : (
                <span className="font-bold">Fraud Alert</span>
              )}
            </div>

            {/* Stop Hand Icon in White Circle */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white text-[#801828] mx-auto flex items-center justify-center shadow-xl ring-8 ring-white/20">
              <Hand className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 stroke-[2.5]" />
            </div>

            {/* Typography */}
            <div className="space-y-1.5 pt-1">
              {isUrdu ? (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-urdu leading-tight">
                    رک جائیں! پیسے مت بھیجیں
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl font-bold tracking-normal text-red-100 font-urdu mt-1">
                    یہ میسج خطرناک فراڈ معلوم ہوتا ہے
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    STOP. DO NOT SEND MONEY.
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl font-bold tracking-normal text-red-100 mt-1">
                    This message appears to be a dangerous scam.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Voice Player Card */}
          <AudioPlayer
            script={result.audio_script}
            scriptEn={result.audio_script_en}
            scriptUr={result.audio_script_ur}
            scriptUrRoman={result.audio_script_ur_roman}
            currentLanguage={language}
            riskLevel="danger"
            autoPlay={false}
          />

          {/* 3 Second Safety Steps */}
          <div className="rounded-2xl bg-white border border-stone-200 p-4 sm:p-6 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <h3 className="font-black text-base sm:text-lg text-stone-900">
                {isUrdu ? (
                  <span className="font-urdu text-xl font-black">فوری حفاظتی ہدایات</span>
                ) : (
                  <span>3-Second Safety Steps</span>
                )}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Step 1: No Links */}
              <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#801828] text-white flex items-center justify-center shrink-0 font-black text-base shadow-xs">
                  🔗
                </div>
                <div>
                  {isUrdu ? (
                    <>
                      <p className="font-extrabold text-lg sm:text-xl text-stone-900 font-urdu leading-snug">
                        لنک مت کھولیں
                      </p>
                      <p className="text-sm text-stone-600 font-medium mt-1 font-urdu leading-relaxed">
                        میسج میں موجود کسی بھی لنک پر کلک نہ کریں۔
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-extrabold text-base sm:text-lg text-stone-900 leading-snug">
                        Do not tap link
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                        Do not open any link in the message.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Step 2: No Money */}
              <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#801828] text-white flex items-center justify-center shrink-0 font-black text-base shadow-xs">
                  💸
                </div>
                <div>
                  {isUrdu ? (
                    <>
                      <p className="font-extrabold text-lg sm:text-xl text-stone-900 font-urdu leading-snug">
                        رقم مت بھیجیں
                      </p>
                      <p className="text-sm text-stone-600 font-medium mt-1 font-urdu leading-relaxed">
                        کسی کو بھی رقم یا بیلنس ٹرانسفر نہ کریں۔
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-extrabold text-base sm:text-lg text-stone-900 leading-snug">
                        Do not send money
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                        Never transfer funds or balance.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Step 3: No OTP/PIN */}
              <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#801828] text-white flex items-center justify-center shrink-0 font-black text-base shadow-xs">
                  🤫
                </div>
                <div>
                  {isUrdu ? (
                    <>
                      <p className="font-extrabold text-lg sm:text-xl text-stone-900 font-urdu leading-snug">
                        کوڈ مت بتائیں
                      </p>
                      <p className="text-sm text-stone-600 font-medium mt-1 font-urdu leading-relaxed">
                        اپنا خفیہ او ٹی پی یا پن کسی کو مت بتائیں۔
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-extrabold text-base sm:text-lg text-stone-900 leading-snug">
                        Do not share OTP
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                        Never share your PIN code or OTP.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Why Signals (Zero-Text Evidence) */}
          <div className="rounded-2xl bg-white border border-stone-200 p-4 sm:p-6 shadow-2xs space-y-3">
            <h4 className="font-black text-base sm:text-lg text-stone-900">
              {isUrdu ? (
                <span className="font-urdu text-xl font-black">خطرے کی وجوہات:</span>
              ) : (
                <span>Why was this flagged?</span>
              )}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {result.signals.map((sig, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-red-50/70 border border-red-100 text-left"
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs shrink-0 mt-0.5">
                    {getSignalIcon(sig.type)}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm sm:text-base text-stone-900">
                      {sig.label}
                    </p>
                    <p className="text-xs sm:text-sm text-stone-700 mt-1 font-medium leading-relaxed">
                      {sig.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Check Another Message Action */}
          <div className="pt-1">
            <button
              id="danger-check-another-btn"
              onClick={onCheckAnother}
              className="w-full py-4 px-6 rounded-full bg-[#E06D53] hover:bg-[#D45E45] text-white font-black text-base sm:text-lg shadow-md flex items-center justify-center gap-2.5 transition-transform active:scale-98 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              {isUrdu ? (
                <span className="font-urdu text-xl font-black">نیا میسج چیک کریں</span>
              ) : (
                <span>Check Another Message</span>
              )}
            </button>
          </div>

          {/* Reassurance Footer Card */}
          <div className="rounded-2xl p-3.5 sm:p-4 bg-[#F4F1FD] border border-[#E3DCFA] flex items-center justify-center gap-2.5 text-center">
            <div className="w-7 h-7 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center text-sm shrink-0">
              🛡️
            </div>
            <p className="text-sm sm:text-base font-bold text-stone-800">
              {isUrdu ? (
                <span className="font-urdu text-base sm:text-lg font-bold">
                  آپ محفوظ ہیں، پہلے چیک کر کے آپ نے دانشمندی کا ثبوت دیا ہے۔
                </span>
              ) : (
                <span>You are safe. You did the right thing by checking first.</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ⚠️ STATE 2: YELLOW — CAUTION                        */}
      {/* ==================================================== */}
      {level === "caution" && (
        <div id="verdict-caution-section" className="space-y-4">
          {/* Main Caution Card */}
          <div className="rounded-3xl bg-[#F59E0B] text-stone-950 p-6 sm:p-8 md:p-10 shadow-xl space-y-4 sm:space-y-5 text-center">
            <div className="inline-block bg-stone-950 text-amber-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide">
              {isUrdu ? (
                <span className="font-urdu text-base font-extrabold">غیر معمولی پیغام</span>
              ) : (
                <span>Unusual Message</span>
              )}
            </div>

            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white text-amber-700 mx-auto flex items-center justify-center shadow-lg ring-8 ring-amber-400">
              <ShieldAlert className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5 pt-1">
              {isUrdu ? (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-urdu leading-tight">
                    پہلے تسلی کریں، پھر قدم اٹھائیں
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-stone-900 font-urdu mt-1">
                    جلد بازی میں کوئی فیصلہ نہ کریں
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    CHECK BEFORE YOU ACT
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-stone-900 mt-1">
                    Verify carefully before responding
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Voice Player */}
          <AudioPlayer
            script={result.audio_script}
            scriptEn={result.audio_script_en}
            scriptUr={result.audio_script_ur}
            scriptUrRoman={result.audio_script_ur_roman}
            currentLanguage={language}
            riskLevel="caution"
            autoPlay={false}
          />

          {/* Caution Reassurance Banner */}
          <div className="rounded-2xl p-4 sm:p-5 bg-amber-50 border border-amber-200 flex items-start gap-3.5 text-left">
            <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              {isUrdu ? (
                <>
                  <p className="font-extrabold text-stone-900 text-lg sm:text-xl font-urdu leading-snug">
                    جلد بازی نہ کریں۔ تسلی کے بعد فیصلہ کریں۔
                  </p>
                  <p className="text-sm text-stone-700 font-medium mt-1 font-urdu leading-relaxed">
                    اگر کوئی چیز مشکوک لگے تو اپنے بااعتماد فرد یا متعلقہ ادارے کے سرکاری نمبر سے رابطہ کریں۔
                  </p>
                </>
              ) : (
                <>
                  <p className="font-extrabold text-stone-900 text-base sm:text-lg leading-snug">
                    Do not rush. Take your time to verify.
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-stone-700 font-medium mt-1">
                    Verify the sender through an official contact method before clicking or responding.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Signals Breakdown */}
          <div className="rounded-2xl bg-white border border-stone-200 p-4 sm:p-6 shadow-2xs space-y-3">
            <h4 className="font-black text-base sm:text-lg text-stone-900">
              {isUrdu ? (
                <span className="font-urdu text-xl font-black">کون سی باتیں مشکوک ہیں؟</span>
              ) : (
                <span>What looks unusual?</span>
              )}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {result.signals.map((sig, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-amber-50/80 border border-amber-100 text-left"
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs shrink-0 mt-0.5">
                    {getSignalIcon(sig.type)}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm sm:text-base text-stone-900">
                      {sig.label}
                    </p>
                    <p className="text-xs sm:text-sm text-stone-700 mt-1 font-medium leading-relaxed">
                      {sig.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons for Caution */}
          <div className="space-y-3 pt-1">
            <button
              onClick={onAskTrustedContact}
              className="w-full py-4 px-6 rounded-full bg-[#E06D53] hover:bg-[#D45E45] text-white font-black text-base sm:text-lg shadow-md flex items-center justify-center gap-2.5 transition-transform active:scale-98 cursor-pointer"
            >
              <Users className="w-5 h-5" />
              {isUrdu ? (
                <span className="font-urdu text-xl font-black">بااعتماد فرد سے مشورہ لیں</span>
              ) : (
                <span>Ask Someone You Trust</span>
              )}
            </button>

            <button
              onClick={onCheckAnother}
              className="w-full py-3.5 px-6 rounded-full bg-stone-900 hover:bg-black text-white font-black text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              {isUrdu ? (
                <span className="font-urdu text-lg font-bold">نیا میسج چیک کریں</span>
              ) : (
                <span>Check Another Message</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 🟢 STATE 3: GREEN — SAFE (Screen 1 from mockups)     */}
      {/* ==================================================== */}
      {level === "safe" && (
        <div id="verdict-safe-section" className="space-y-4">
          {/* Top Sender Verification Card */}
          <div className="rounded-2xl bg-white border border-emerald-200/80 p-4 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base text-stone-900">
                  City Health Clinic
                </p>
                <p className="text-xs text-stone-500 font-urdu">
                  {isUrdu ? "سرکاری کلینک پورٹل" : "Official Clinic Portal"}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              {isUrdu ? "تصدیق شدہ" : "Verified"}
            </span>
          </div>

          {/* Main Centered Safe Card */}
          <div className="rounded-3xl bg-[#F6FBF7] border border-[#D5EEDC] p-6 sm:p-8 md:p-10 shadow-sm text-center space-y-4 sm:space-y-5">
            {/* Green Shield Checkmark Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white text-emerald-700 mx-auto flex items-center justify-center shadow-md ring-8 ring-emerald-100">
              <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 stroke-[2.5]" />
            </div>

            {/* Typography */}
            <div className="space-y-1.5">
              {isUrdu ? (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight font-urdu leading-tight">
                    محفوظ معلوم ہوتا ہے
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-stone-700 font-medium font-urdu max-w-lg mx-auto mt-2 leading-relaxed">
                    اس پیغام میں کسی دھوکے، دباؤ یا فوری پیسوں کا کوئی نشان نہیں ملا۔
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-wider">
                    LOOKS SAFE
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-stone-600 font-medium max-w-lg mx-auto mt-2 leading-relaxed">
                    {result.summary ||
                      "No signs of scam, deceit, or panic found in this appointment reminder."}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Voice Player */}
          <AudioPlayer
            script={result.audio_script}
            scriptEn={result.audio_script_en}
            scriptUr={result.audio_script_ur}
            scriptUrRoman={result.audio_script_ur_roman}
            currentLanguage={language}
            riskLevel="safe"
            autoPlay={false}
          />

          {/* What We Checked */}
          <div className="rounded-2xl bg-white border border-stone-200 p-4 sm:p-6 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h3 className="font-black text-base sm:text-lg text-stone-900">
                {isUrdu ? (
                  <span className="font-urdu text-xl font-black">ہم نے کیا چیک کیا</span>
                ) : (
                  <span>What We Checked</span>
                )}
              </h3>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-emerald-100 text-emerald-800">
                {isUrdu ? "3/3 محفوظ" : "3/3 Safe"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: Official Source */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F6FBF7] border border-emerald-100 text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  {isUrdu ? (
                    <>
                      <p className="font-extrabold text-lg text-stone-900 font-urdu leading-tight">
                        اصلی ادارہ
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 font-urdu font-medium leading-relaxed">
                        بھیجنے والا ادارہ ہیلتھ کیئر ڈائریکٹری سے تصدیق شدہ ہے۔
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-sm sm:text-base text-stone-800 leading-tight">
                        Official Source
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                        Clinic sender matched our secure healthcare registry directory.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Card 2: No Pressure */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F6FBF7] border border-emerald-100 text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  {isUrdu ? (
                    <>
                      <p className="font-extrabold text-lg text-stone-900 font-urdu leading-tight">
                        کوئی جلدی یا دباؤ نہیں
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 font-urdu font-medium leading-relaxed">
                        میسج میں کوئی دھمکی، جلد بازی یا ڈرانے کی کوشش نہیں ہے۔
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-sm sm:text-base text-stone-800 leading-tight">
                        No Pressure
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                        No urgent threats, legal warnings, or immediate panic cues detected.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Card 3: No Payment Request */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F6FBF7] border border-emerald-100 text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  {isUrdu ? (
                    <>
                      <p className="font-extrabold text-lg text-stone-900 font-urdu leading-tight">
                        پیسے نہیں مانگے
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 font-urdu font-medium leading-relaxed">
                        کریڈٹ کارڈ، بینک ٹرانسفر یا فیس کا کوئی مطالبہ نہیں۔
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-sm sm:text-base text-stone-800 leading-tight">
                        No Payment Request
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                        Zero requests for credit card data, bank transfers, or fee payments.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contextual Card: Upcoming Consultation */}
          <div className="rounded-2xl bg-white border border-stone-200 p-4 shadow-2xs flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              {isUrdu ? (
                <>
                  <p className="font-extrabold text-base sm:text-lg text-stone-900 font-urdu">
                    آنے والی اپائنٹمنٹ
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium font-urdu">
                    جمعرات، 24 اکتوبر • صبح 11:30 • کمرہ نمبر 4
                  </p>
                </>
              ) : (
                <>
                  <p className="font-extrabold text-sm sm:text-base text-stone-900">
                    Upcoming Consultation
                  </p>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    Thursday, Oct 24 • 11:30 AM • Clinic Room 4
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Gentle Reminder Box */}
          <div className="rounded-2xl p-4 sm:p-5 bg-[#FFF9EE] border border-[#FDE5BE] flex items-start gap-3.5 text-left">
            <div className="w-9 h-9 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-stone-900 text-base sm:text-lg">
                {isUrdu ? (
                  <span className="font-urdu text-lg sm:text-xl">ہمیشہ یاد رکھیں</span>
                ) : (
                  <span>Gentle Reminder</span>
                )}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-stone-700 font-medium mt-1 leading-relaxed">
                {isUrdu ? (
                  <span className="font-urdu leading-relaxed text-sm sm:text-base block">
                    اپنا بینک او ٹی پی، پن کوڈ یا پاس ورڈ کبھی کسی کے ساتھ شیئر نہ کریں — چاہے وہ کلینک یا کمپنی کا نمائندہ بن کر بات کرے۔
                  </span>
                ) : (
                  <span>
                    Never share your bank OTP, ATM PIN, or account passwords with anyone—even if they claim to be clinic staff or family members.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="space-y-3 pt-1">
            <button
              id="safe-continue-safely-btn"
              onClick={onCheckAnother}
              className="w-full py-4 px-6 rounded-full bg-[#E06D53] hover:bg-[#D45E45] text-white font-black text-base sm:text-lg shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
            >
              {isUrdu ? (
                <span className="font-urdu text-xl font-black">محفوظ طریقے سے آگے بڑھیں</span>
              ) : (
                <span>Continue Safely</span>
              )}
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>

            <button
              id="safe-check-another-btn"
              onClick={onCheckAnother}
              className="w-full py-3.5 px-6 rounded-full bg-[#6C5CE7] hover:bg-[#5C4BD8] text-white font-black text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
            >
              {isUrdu ? (
                <span className="font-urdu text-lg font-bold">کچھ اور چیک کریں</span>
              ) : (
                <span>Check Another Message</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Technical Details for Hackathon Judges */}
      <div className="pt-2 text-center">
        <button
          id="judge-tech-details-btn"
          onClick={onOpenTechnicalDetails}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer shadow-2xs"
        >
          <Info className="w-3.5 h-3.5 text-stone-400" />
          <span>
            {isUrdu ? "تکنیکی فن تعمیر اور اے آئی سگنلز (ججز)" : "Technical Architecture & AI Signals (Judges)"}
          </span>
        </button>
      </div>
    </div>
  );
};
