import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Mic,
  Link as LinkIcon,
  Upload,
  ArrowRight,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { AppLanguage } from "../types";
import { SAMPLE_QUICK_INPUTS } from "../data/demoData";

interface InputSectionProps {
  language: AppLanguage;
  initialTab?: "options" | "image" | "voice" | "url";
  onAnalyze: (payload: {
    type: "image" | "voice" | "text" | "url";
    content?: string;
    imageBase64?: string;
    imageMimeType?: string;
  }) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  language,
  initialTab = "options",
  onAnalyze,
  isAnalyzing,
}) => {
  const isUrdu = language === "ur";
  const [activeTab, setActiveTab] = useState<"options" | "image" | "voice" | "url">(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // State for image upload
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("image/jpeg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for voice recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // State for URL input
  const [urlInput, setUrlInput] = useState<string>("");

  // Handle File / Image Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageSubmit = () => {
    if (!selectedImage) return;
    onAnalyze({
      type: "image",
      imageBase64: selectedImage,
      imageMimeType: imageMime,
      content: "Screenshot of digital message or notification",
    });
  };

  // Handle Voice Recording with Web Speech API
  const startVoiceRecording = () => {
    setIsRecording(true);
    setVoiceError(null);
    setTranscript("");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = isUrdu ? "ur-PK" : "en-US";

        recognition.onresult = (event: any) => {
          let current = "";
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + " ";
          }
          setTranscript(current.trim());
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition error:", e);
          if (e.error === "not-allowed" || e.error === "service-not-allowed") {
            setVoiceError(
              isUrdu
                ? "براؤزر میں مائیکروفون کی اجازت درکار ہے۔ آپ نیچے دیے گئے نمونے پر بھی کلک کر سکتے ہیں۔"
                : "Microphone access blocked. Tap one of the voice samples below."
            );
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.warn("Recognition start error:", err);
        setVoiceError(
          isUrdu
            ? "مائیکروفون شروع نہیں ہو سکا۔ نیچے دیا گیا صوتی نمونہ منتخب کریں۔"
            : "Could not activate microphone. Tap one of the voice scenarios below."
        );
      }
    } else {
      // Direct sample for devices without STT
      setTranscript(
        isUrdu
          ? "مجھے کال آئی ہے کہ میرا بجلی کا بل جمع نہیں ہے اور آج ہی پاور کاٹ دی جائے گی، کیا یہ سچ ہے؟"
          : "I received a phone call claiming my power will be disconnected today unless I pay immediately."
      );
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const handleVoiceSubmit = () => {
    if (!transcript.trim()) return;
    onAnalyze({
      type: "voice",
      content: transcript,
    });
  };

  // Handle URL Submit
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    let targetUrl = urlInput.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    onAnalyze({
      type: "url",
      content: targetUrl,
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Tab Switcher Pills */}
      <div className="flex items-center justify-between p-1.5 bg-stone-200/60 rounded-2xl border border-stone-200">
        <button
          onClick={() => setActiveTab("image")}
          className={`flex-1 py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "image"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Camera className="w-4 h-4 text-amber-600" />
          <span className="font-urdu text-sm sm:text-base">{isUrdu ? "تصویر" : "Photo"}</span>
        </button>

        <button
          onClick={() => setActiveTab("voice")}
          className={`flex-1 py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "voice"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Mic className="w-4 h-4 text-[#6C5CE7]" />
          <span className="font-urdu text-sm sm:text-base">{isUrdu ? "آواز" : "Voice"}</span>
        </button>

        <button
          onClick={() => setActiveTab("url")}
          className={`flex-1 py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "url"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <LinkIcon className="w-4 h-4 text-[#E06D53]" />
          <span className="font-urdu text-sm sm:text-base">{isUrdu ? "لنک" : "Link"}</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="input-file-picker"
      />

      {/* ==================================================== */}
      {/* 📷 TAB 1: IMAGE / PHOTO UPLOAD                       */}
      {/* ==================================================== */}
      {(activeTab === "image" || activeTab === "options") && (
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                  {isUrdu ? (
                    <span className="font-urdu text-base">تصویر دکھائیں</span>
                  ) : (
                    <span>Message Photo</span>
                  )}
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
                  {isUrdu ? "واٹس ایپ، ایس ایم ایس یا بل کی تصویر" : "WhatsApp, SMS, or paper bill photo"}
                </p>
              </div>
            </div>
          </div>

          {selectedImage ? (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden max-h-64 bg-stone-950 flex items-center justify-center border border-stone-200">
                <img
                  src={selectedImage}
                  alt="Message to analyze"
                  className="max-h-64 w-auto object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-300 font-bold text-stone-700 text-xs hover:bg-stone-50 cursor-pointer"
                >
                  {isUrdu ? "دوسری تصویر چنیں" : "Change Photo"}
                </button>
                <button
                  id="submit-image-check-btn"
                  onClick={handleImageSubmit}
                  disabled={isAnalyzing}
                  className="flex-2 py-3 px-4 rounded-xl bg-[#E06D53] hover:bg-[#D45E45] text-white font-black text-sm shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUrdu ? (
                    <span className="font-urdu text-lg">ابھی چیک کریں 🛡️</span>
                  ) : (
                    <span>CHECK NOW 🛡️</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-[#E06D53] rounded-2xl p-6 text-center hover:bg-[#FFF8F6] cursor-pointer transition-colors space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-stone-800 text-sm">
                {isUrdu ? "تصویر منتخب کرنے کے لیے یہاں دبائیں" : "Tap here to choose or snap a photo"}
              </p>
              <p className="text-xs text-stone-500 font-medium">
                {isUrdu ? "کیمرہ، گیلری یا اسکرین شاٹ" : "Camera, gallery, or screenshot"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 🎙️ TAB 2: VOICE RECORDING & SCENARIOS               */}
      {/* ==================================================== */}
      {activeTab === "voice" && (
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                {isUrdu ? (
                  <span className="font-urdu text-base">بول کر بتائیں</span>
                ) : (
                  <span>Voice Note or Call</span>
                )}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
                {isUrdu ? "کال یا میسج کی بات اپنی آواز میں سنائیں" : "Describe the call in your voice"}
              </p>
            </div>
          </div>

          <div className="text-center py-2 space-y-3">
            {/* Big Mic Button */}
            <button
              id="push-to-talk-mic-btn"
              onClick={toggleVoiceRecording}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer ${
                isRecording
                  ? "bg-red-600 text-white shadow-lg ring-8 ring-red-200 animate-pulse scale-105"
                  : "bg-[#6C5CE7] hover:bg-[#5C4BD8] text-white shadow-md ring-4 ring-purple-100 active:scale-95"
              }`}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <Mic className="w-9 h-9 stroke-[2.5]" />
            </button>

            <div>
              <p className="font-black text-stone-900 text-base">
                {isRecording
                  ? isUrdu
                    ? "سُن رہا ہوں... بات مکمل ہونے پر دوبارہ دبائیں"
                    : "Listening... tap button when done"
                  : isUrdu
                  ? "بولنے کے لیے بٹن دبائیں"
                  : "Tap microphone to speak"}
              </p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {isRecording
                  ? isUrdu ? "آپ کی بات نیچے لکھی جا رہی ہے" : "Live speech transcribed below"
                  : isUrdu ? "فون کال یا میسج کی بات بتائیں" : "Speak naturally in Urdu or English"}
              </p>
            </div>

            {voiceError && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-xs text-amber-900 text-left">
                {voiceError}
              </div>
            )}

            {/* Transcript text */}
            {transcript && (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 text-left space-y-1">
                <p className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">
                  {isUrdu ? "آپ کی بات:" : "What you said:"}
                </p>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full text-sm font-medium text-stone-800 bg-transparent resize-none focus:outline-hidden"
                  rows={2}
                />
              </div>
            )}

            {transcript && (
              <button
                id="submit-voice-check-btn"
                onClick={handleVoiceSubmit}
                disabled={isAnalyzing}
                className="w-full py-3.5 rounded-xl bg-[#E06D53] hover:bg-[#D45E45] text-white font-black text-sm shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {isUrdu ? (
                  <span className="font-urdu text-lg">اس کی جانچ کریں 🛡️</span>
                ) : (
                  <span>CHECK THIS NOW 🛡️</span>
                )}
              </button>
            )}

            {/* Quick 1-tap voice scenarios */}
            <div className="pt-2 border-t border-stone-100 text-left space-y-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                {isUrdu ? "یا کال کا فوری نمونہ منتخب کریں:" : "Or tap a sample call scenario:"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setTranscript(
                      isUrdu
                        ? "مجھے کال آئی ہے کہ میرا بجلی کا بل جمع نہیں ہے اور آج شام بجلی کاٹ دی جائے گی، فوری پیسے بھیجیں۔"
                        : "Someone called claiming my electricity bill is unpaid and power will be cut tonight unless I pay right now."
                    );
                  }}
                  className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800 text-left transition-colors cursor-pointer"
                >
                  ⚡ {isUrdu ? "بجلی بل منقطع کرنے کی کال" : "Power Disconnection Call"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTranscript(
                      isUrdu
                        ? "بینک کا نام لے کر کال آئی ہے اور اکاؤنٹ بحال رکھنے کے لیے میرا خفیہ او ٹی پی مانگ رہے ہیں۔"
                        : "A caller claiming to be my bank manager asked for my private OTP code to unblock my card."
                    );
                  }}
                  className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800 text-left transition-colors cursor-pointer"
                >
                  🏦 {isUrdu ? "بینک او ٹی پی مانگنے کی کال" : "Bank OTP Scam Call"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 🔗 TAB 3: URL LINK CHECK                             */}
      {/* ==================================================== */}
      {activeTab === "url" && (
        <form
          onSubmit={handleUrlSubmit}
          className="bg-white border border-stone-200 rounded-3xl p-5 shadow-2xs space-y-3.5"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFEFEA] text-[#E06D53] flex items-center justify-center">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                {isUrdu ? (
                  <span className="font-urdu text-base">لنک چیک کریں</span>
                ) : (
                  <span>Check Link</span>
                )}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
                {isUrdu ? "ویب سائٹ کا ایڈریس درج کریں" : "Inspect web address safety"}
              </p>
            </div>
          </div>

          <input
            id="suspicious-url-input"
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="e.g. wapda-billpay.xyz or jazzcash-rewards.top"
            className="w-full px-4 py-3 text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E06D53]"
            autoFocus
          />

          {/* Quick link examples */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              {isUrdu ? "ٹیسٹ کے لیے نمونہ لنک منتخب کریں:" : "Tap a sample link to test:"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setUrlInput("https://www.google.com")}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
              >
                ✅ {isUrdu ? "google.com (محفوظ)" : "google.com (Safe)"}
              </button>
              <button
                type="button"
                onClick={() => setUrlInput("http://wapda-billpay.xyz")}
                className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-bold hover:bg-red-100 cursor-pointer"
              >
                🛑 {isUrdu ? "wapda-billpay.xyz (جعلی بل)" : "wapda-billpay.xyz (Fake Bill)"}
              </button>
              <button
                type="button"
                onClick={() => setUrlInput("http://jazzcash-rewards.top/claim")}
                className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-bold hover:bg-red-100 cursor-pointer"
              >
                🛑 {isUrdu ? "jazzcash-rewards.top (فراڈ)" : "jazzcash-rewards.top (Phishing)"}
              </button>
            </div>
          </div>

          <button
            id="submit-url-check-btn"
            type="submit"
            disabled={!urlInput.trim() || isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-[#E06D53] hover:bg-[#D45E45] text-white font-black text-sm shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isUrdu ? (
              <span className="font-urdu text-lg">لنک چیک کریں 🛡️</span>
            ) : (
              <span>CHECK LINK NOW 🛡️</span>
            )}
          </button>
        </form>
      )}

      {/* Quick 1-Tap Sample Scenarios for Testing */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-urdu text-sm sm:text-base">{isUrdu ? "یا ایک کلک سے نمونہ میسج ٹیسٹ کریں:" : "Or test a sample message:"}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {SAMPLE_QUICK_INPUTS.map((sample) => (
            <button
              key={sample.id}
              id={`quick-sample-${sample.id}`}
              onClick={() => {
                onAnalyze({
                  type: "text",
                  content: sample.content,
                });
              }}
              className="text-left p-3.5 sm:p-4 rounded-2xl border border-stone-200 bg-white hover:border-[#E06D53] hover:shadow-md transition-all text-xs sm:text-sm font-bold text-stone-800 cursor-pointer flex flex-col justify-between"
            >
              <span className="font-urdu text-sm sm:text-base leading-snug">
                {isUrdu ? sample.labelUr : sample.labelEn}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
