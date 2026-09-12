import React, { useState, useEffect } from "react";
import { Users, Phone, X, Check, AlertCircle } from "lucide-react";
import { AppLanguage, TrustedContact } from "../types";

interface TrustedContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onCallInitiated?: () => void;
}

export const TrustedContactModal: React.FC<TrustedContactModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isUrdu = language === "ur";

  const [contact, setContact] = useState<TrustedContact>({
    name: "Tariq (Son)",
    phone: "0300-1234567",
    relationship: "Son / بیٹا",
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<TrustedContact>(contact);
  const [confirmCall, setConfirmCall] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("nigehbaan_trusted_contact") || localStorage.getItem("awaazshield_trusted_contact");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContact(parsed);
        setFormData(parsed);
      } catch (e) {}
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setContact(formData);
    localStorage.setItem("nigehbaan_trusted_contact", JSON.stringify(formData));
    setIsEditing(false);
  };

  const executeCall = () => {
    setConfirmCall(false);
    onClose();
    // Open tel: URI for smartphone dialer
    window.location.href = `tel:${contact.phone.replace(/[^0-9+]/g, "")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                {isUrdu ? "بااعتماد رابطہ" : "Trusted Contact"}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {isUrdu ? "مشکوک صورتحال میں فوری مدد کے لیے" : "For urgent advice in suspicious situations"}
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

        {/* Confirmation Modal to avoid accidental dials */}
        {confirmCall ? (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="font-bold text-stone-900 text-base">
                {isUrdu
                  ? `کیا آپ ${contact.name} کو کال ملانا چاہتے ہیں؟`
                  : `Call ${contact.name} now?`}
              </p>
              <p className="text-xs text-stone-600">
                {isUrdu
                  ? "آپ کے فون کا ڈائلر کھلے گا تاکہ آپ تسلی سے بات کر سکیں۔"
                  : "Your phone dialer will open with their saved number."}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmCall(false)}
                className="flex-1 py-3 rounded-xl border border-stone-300 font-bold text-stone-700 text-sm hover:bg-stone-50"
              >
                {isUrdu ? "منسوخ کریں" : "Cancel"}
              </button>
              <button
                id="confirm-call-dial-btn"
                onClick={executeCall}
                className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>{isUrdu ? "ہاں، کال کریں" : "Yes, Call Now"}</span>
              </button>
            </div>
          </div>
        ) : isEditing ? (
          /* Edit Contact Form */
          <form onSubmit={handleSave} className="space-y-3 py-1">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {isUrdu ? "نام:" : "Contact Name:"}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ali"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {isUrdu ? "فون نمبر:" : "Phone Number:"}
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0300-1234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {isUrdu ? "تعلق / رشتہ (اختیاری):" : "Relationship (Optional):"}
              </label>
              <input
                type="text"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                placeholder="e.g. Someone I trust / Family"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-600"
              >
                {isUrdu ? "منسوخ" : "Cancel"}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isUrdu ? "محفوظ کریں" : "Save"}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Normal View & Call Trigger */
          <div className="space-y-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-base text-stone-900">{contact.name}</p>
                <p className="text-sm font-semibold text-emerald-800">{contact.phone}</p>
                <p className="text-xs text-stone-500 mt-0.5">{contact.relationship}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-emerald-800 hover:underline p-1"
              >
                {isUrdu ? "تبدیل کریں" : "Edit"}
              </button>
            </div>

            {/* Huge Call Button (Matches Coral Theme) */}
            <button
              id="initiate-call-trusted-contact-btn"
              onClick={() => setConfirmCall(true)}
              className="w-full py-4 rounded-2xl bg-[#E06D53] hover:bg-[#D45E45] text-white font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
            >
              <Phone className="w-6 h-6 stroke-[2.5]" />
              <span className="font-urdu">{isUrdu ? `کال کریں: ${contact.name}` : `Call ${contact.name}`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
