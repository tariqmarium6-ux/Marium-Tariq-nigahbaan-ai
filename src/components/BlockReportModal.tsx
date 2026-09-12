import React from "react";
import { Ban, MoreVertical, MessageSquare, ShieldAlert, X } from "lucide-react";
import { AppLanguage } from "../types";

interface BlockReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
}

export const BlockReportModal: React.FC<BlockReportModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isUrdu = language === "ur";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-stone-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Ban className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                {isUrdu ? "نمبر بلاک اور رپورٹ کرنے کا طریقہ" : "How to Block & Report"}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {isUrdu ? "دھوکہ باز کو مزید میسج کرنے سے روکیں" : "Stop the scammer from contacting you"}
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

        {/* Visual 4-Step Zero-Text Flow */}
        <div className="space-y-3">
          {/* Step 1 */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="w-12 h-12 rounded-xl bg-stone-200 text-stone-800 font-black text-lg flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                {isUrdu ? "مرحلہ 1" : "STEP 1"}
              </span>
              <p className="font-extrabold text-stone-900 text-sm">
                {isUrdu ? "میسج کھولیں" : "OPEN MESSAGE"}
              </p>
              <p className="text-xs text-stone-500">
                {isUrdu ? "واٹس ایپ یا ایس ایم ایس چیٹ پر جائیں" : "Go to the suspicious conversation"}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="w-12 h-12 rounded-xl bg-stone-200 text-stone-800 font-black text-lg flex items-center justify-center shrink-0">
              <MoreVertical className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                {isUrdu ? "مرحلہ 2" : "STEP 2"}
              </span>
              <p className="font-extrabold text-stone-900 text-sm">
                {isUrdu ? "اوپر کونے میں 3 نقطوں (⋮) پر دبائیں" : "TAP THE THREE DOTS (⋮)"}
              </p>
              <p className="text-xs text-stone-500">
                {isUrdu ? "اوپری دائیں کونے میں مینو کھولیں" : "Top right corner of the chat"}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 font-black text-lg flex items-center justify-center shrink-0">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700">
                {isUrdu ? "مرحلہ 3" : "STEP 3"}
              </span>
              <p className="font-extrabold text-stone-900 text-sm">
                {isUrdu ? "بلاک (BLOCK) منتخب کریں" : "TAP BLOCK"}
              </p>
              <p className="text-xs text-stone-500">
                {isUrdu ? "تاکہ وہ آپ کو کال یا میسج نہ کر سکے" : "Prevents any incoming calls or messages"}
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-black text-lg flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                {isUrdu ? "مرحلہ 4" : "STEP 4"}
              </span>
              <p className="font-extrabold text-stone-900 text-sm">
                {isUrdu ? "رپورٹ (REPORT AS SCAM) پر ٹک کریں" : "CHECK 'REPORT AS SCAM'"}
              </p>
              <p className="text-xs text-stone-500">
                {isUrdu ? "تاکہ دوسرے بزرگ اور افراد بھی محفوظ رہیں" : "Protects other community members"}
              </p>
            </div>
          </div>
        </div>

        {/* Clear Truthful Disclaimer */}
        <div className="p-3 bg-stone-100 rounded-xl text-center text-xs text-stone-600">
          {isUrdu
            ? "وضاحت: آواز شیلڈ آپ کے فون میں بغیر اجازت مداخلت نہیں کرتا۔ یہ طریقہ کار آپ خود فون میں باآسانی اپنا سکتے ہیں۔"
            : "Note: AwaazShield provides visual guidance so you are safely in control. We do not secretly modify or delete your phone messages."}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-sm"
        >
          {isUrdu ? "سمجھ آ گیا (بند کریں)" : "Understood (Close Guide)"}
        </button>
      </div>
    </div>
  );
};
