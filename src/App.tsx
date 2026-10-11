import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomeView } from "./components/HomeView";
import { InputSection } from "./components/InputSection";
import { AnalyzingLoader } from "./components/AnalyzingLoader";
import { VerdictScreen } from "./components/VerdictScreen";
import { BottomNav, NavTab } from "./components/BottomNav";
import { TrustedContactModal } from "./components/TrustedContactModal";
import { BlockReportModal } from "./components/BlockReportModal";
import { ScamLibraryModal } from "./components/ScamLibraryModal";
import { TechnicalDetailsModal } from "./components/TechnicalDetailsModal";
import { AnalysisResult, AppLanguage, RiskLevel } from "./types";
import { getDemoScenario } from "./data/demoData";
import { audioController } from "./utils/audio";
import { ArrowLeft } from "lucide-react";

type AppView = "home" | "input" | "analyzing" | "verdict";

export default function App() {
  const [language, setLanguage] = useState<AppLanguage>("ur");
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [initialInputTab, setInitialInputTab] = useState<"image" | "voice" | "url">("image");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeDemoLevel, setActiveDemoLevel] = useState<RiskLevel | null>(null);

  // Health and API key detection
  const [apiHealth, setApiHealth] = useState<{ checked: boolean; hasApiKey: boolean; message?: string }>({
    checked: false,
    hasApiKey: true,
  });

  // Check health and GEMINI_API_KEY status on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setApiHealth({
          checked: true,
          hasApiKey: data.hasApiKey ?? false,
          message: data.message,
        });
      })
      .catch((err) => {
        console.warn("Could not reach /api/health:", err);
        setApiHealth({
          checked: true,
          hasApiKey: false,
          message: "API server unreachable. Verify Vercel deployment.",
        });
      });
  }, []);

  // Modal states
  const [isTrustedContactOpen, setIsTrustedContactOpen] = useState<boolean>(false);
  const [isBlockGuideOpen, setIsBlockGuideOpen] = useState<boolean>(false);
  const [isScamLibraryOpen, setIsScamLibraryOpen] = useState<boolean>(false);
  const [isTechDetailsOpen, setIsTechDetailsOpen] = useState<boolean>(false);

  const isUrdu = language === "ur";

  // Derive active bottom nav tab
  const activeNavTab: NavTab = currentView === "home" ? "home" : currentView === "input" ? "check" : "home";

  // Handle bottom nav tab clicks
  const handleNavTabChange = (tab: NavTab) => {
    if (tab === "home") {
      handleResetToHome();
    } else if (tab === "check") {
      setCurrentView("input");
    } else if (tab === "family") {
      setIsTrustedContactOpen(true);
    } else if (tab === "scams") {
      setIsScamLibraryOpen(true);
    }
  };

  // Handle language change with demo syncing
  const handleLanguageChange = (newLang: AppLanguage) => {
    setLanguage(newLang);
    if (activeDemoLevel && analysisResult?.isDemo) {
      setAnalysisResult(getDemoScenario(activeDemoLevel, newLang));
    }
  };

  // Handle Demo Mode selection from judge header
  const handleDemoSelect = (level: RiskLevel) => {
    setActiveDemoLevel(level);
    setCurrentView("analyzing");

    setTimeout(() => {
      const scenario = getDemoScenario(level, language);
      setAnalysisResult(scenario);
      setCurrentView("verdict");
      audioController.playRiskChime(level);
    }, 800);
  };

  // Handle real input analysis
  const handleAnalyze = async (payload: {
    type: "image" | "voice" | "text" | "url";
    content?: string;
    imageBase64?: string;
    imageMimeType?: string;
  }) => {
    setActiveDemoLevel(null);
    setCurrentView("analyzing");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          language,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || `API error (${response.status})`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
      setCurrentView("verdict");
      audioController.playRiskChime(data.risk_level);
    } catch (err: any) {
      console.warn("API request encountered error, using resilient fallback:", err);
      const isMissingKey = !apiHealth.hasApiKey;
      // Fallback: If network issue or server error, provide emergency safety analysis
      const fallbackResult: AnalysisResult = {
        risk_level: "caution",
        risk_score: 0.5,
        language,
        summary: isUrdu
          ? "ہم فی الحال مکمل جانچ نہیں کر سکے۔ براہ کرم اپنے کسی بااعتماد فرد سے مشورہ لیں۔"
          : isMissingKey
          ? "Notice: GEMINI_API_KEY is not configured on Vercel. Please add GEMINI_API_KEY to your Vercel Project Settings."
          : "Could not reach analysis server. Please check your network and verify with someone you trust.",
        signals: [
          {
            type: "unusual_request",
            label: isUrdu ? "سرور کا رابطہ نہیں ہو سکا" : "Analysis Service Offline",
            explanation: isUrdu
              ? "میسج کا معائنہ کرنے کے لیے لائیو سرور تک رسائی حاصل نہیں ہو سکی۔ احتیاط برتیں۔"
              : `Serverless error: ${err?.message || "Endpoint unreachable"}. Make sure GEMINI_API_KEY is set in Vercel.`,
          },
        ],
        recommended_actions: [
          isUrdu ? "پیسے ہرگز نہ بھیجیں۔" : "Do not send money.",
          isUrdu ? "کسی بااعتماد فرد سے پوچھیں۔" : "Ask someone you trust.",
        ],
        audio_script: isUrdu
          ? "اس وقت ہم مکمل جانچ نہیں کر سکے۔ کسی بھی صورت میں پیسے نہ بھیجیں اور پہلے اپنے کسی بااعتماد فرد سے پوچھیں۔"
          : "We could not fully check this right now. Do not send any money and consult someone you trust first.",
        uncertainty: "high",
        technical_details: {
          modelUsed: "Offline Safety Engine (Vercel Serverless / Key Check)",
          apiKeyConfigured: false,
          isLiveAI: false,
        },
      };

      setAnalysisResult(fallbackResult);
      setCurrentView("verdict");
      audioController.playRiskChime("caution");
    }
  };

  const handleResetToHome = () => {
    audioController.stop();
    setAnalysisResult(null);
    setActiveDemoLevel(null);
    setCurrentView("home");
  };

  // Quick photo upload trigger directly from Home screen
  const handleAnalyzeImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        handleAnalyze({
          type: "image",
          imageBase64: reader.result,
          imageMimeType: file.type || "image/jpeg",
          content: "Screenshot of digital message or notification",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      id="nigehbaan-app"
      className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-stone-900 selection:bg-amber-200"
    >
      {/* Universal Header with Brand, Language and Judge Demo Controls */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenTrustedContact={() => setIsTrustedContactOpen(true)}
        onOpenScamLibrary={() => setIsScamLibraryOpen(true)}
        onDemoSelect={handleDemoSelect}
        activeDemoLevel={activeDemoLevel}
        onResetToHome={handleResetToHome}
      />

      {/* Vercel Environment Configuration Notice if GEMINI_API_KEY is missing */}
      {apiHealth.checked && !apiHealth.hasApiKey && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-2">
          <span>⚠️</span>
          <span>
            {isUrdu
              ? "ورسیل (Vercel) پر لائیو AI کے لیے GEMINI_API_KEY شامل کریں۔ فی الحال خودکار حفاظتی قوانین فعال ہیں۔"
              : "GEMINI_API_KEY is missing in Vercel Environment Variables. Add it to Project Settings to activate live Gemini AI."}
          </span>
        </div>
      )}

      {/* Main Responsive Canvas (Optimized for both Mobile & Laptop/Desktop presentation) */}
      <main className="flex-1 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col justify-start">
        {/* ==================================================== */}
        {/* VIEW 1: HOME VIEW (Screen 2 from user reference)    */}
        {/* ==================================================== */}
        {currentView === "home" && (
          <HomeView
            language={language}
            onOpenCheck={(tab) => {
              if (tab) setInitialInputTab(tab);
              setCurrentView("input");
            }}
            onOpenFamily={() => setIsTrustedContactOpen(true)}
            onAnalyzeImageFile={handleAnalyzeImageFile}
          />
        )}

        {/* ==================================================== */}
        {/* VIEW 2: CHECK INPUT VIEW                             */}
        {/* ==================================================== */}
        {currentView === "input" && (
          <div className="space-y-4 pb-20 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView("home")}
                className="flex items-center gap-1.5 text-stone-700 hover:text-stone-950 font-extrabold text-sm py-1.5 px-2.5 rounded-xl hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{isUrdu ? "واپس جائیں" : "Back"}</span>
              </button>
              <h2 className="text-base font-black text-stone-900">
                {isUrdu ? "میسج کی جانچ" : "Check Message"}
              </h2>
              <div className="w-16" />
            </div>

            <InputSection
              language={language}
              initialTab={initialInputTab}
              onAnalyze={handleAnalyze}
              isAnalyzing={false}
            />
          </div>
        )}

        {/* ==================================================== */}
        {/* VIEW 3: ANALYZING STATE LOADER                       */}
        {/* ==================================================== */}
        {currentView === "analyzing" && (
          <div className="pb-20">
            <AnalyzingLoader language={language} />
          </div>
        )}

        {/* ==================================================== */}
        {/* VIEW 4: VERDICT SCREEN (Screen 1 Safe, Screen 3 Danger) */}
        {/* ==================================================== */}
        {currentView === "verdict" && analysisResult && (
          <VerdictScreen
            result={analysisResult}
            language={language}
            onAskTrustedContact={() => setIsTrustedContactOpen(true)}
            onOpenBlockGuide={() => setIsBlockGuideOpen(true)}
            onOpenTechnicalDetails={() => setIsTechDetailsOpen(true)}
            onCheckAnother={handleResetToHome}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar (Screen 2: Home, Check, Family, Scams) */}
      <BottomNav
        activeTab={activeNavTab}
        onTabChange={handleNavTabChange}
        language={language}
      />

      {/* Modals */}
      <TrustedContactModal
        isOpen={isTrustedContactOpen}
        onClose={() => setIsTrustedContactOpen(false)}
        language={language}
      />

      <BlockReportModal
        isOpen={isBlockGuideOpen}
        onClose={() => setIsBlockGuideOpen(false)}
        language={language}
      />

      <ScamLibraryModal
        isOpen={isScamLibraryOpen}
        onClose={() => setIsScamLibraryOpen(false)}
        language={language}
      />

      <TechnicalDetailsModal
        isOpen={isTechDetailsOpen}
        onClose={() => setIsTechDetailsOpen(false)}
        result={analysisResult}
      />
    </div>
  );
}
