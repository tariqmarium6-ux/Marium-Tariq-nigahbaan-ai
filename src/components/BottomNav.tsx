import React from "react";
import { Home, ShieldCheck, Users, AlertTriangle } from "lucide-react";
import { AppLanguage } from "../types";

export type NavTab = "home" | "check" | "family" | "scams";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: AppLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const isUrdu = language === "ur";

  const tabs = [
    {
      id: "home" as NavTab,
      labelUr: "ہوم",
      labelEn: "Home",
      icon: Home,
    },
    {
      id: "check" as NavTab,
      labelUr: "چیک کریں",
      labelEn: "Check",
      icon: ShieldCheck,
    },
    {
      id: "family" as NavTab,
      labelUr: "خاندان",
      labelEn: "Family",
      icon: Users,
    },
    {
      id: "scams" as NavTab,
      labelUr: "فراڈ لسٹ",
      labelEn: "Scams",
      icon: AlertTriangle,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-lg py-2 px-4 sm:px-8 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto rounded-t-2xl sm:border-x"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}-btn`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 sm:px-5 rounded-2xl transition-all cursor-pointer min-w-[72px] ${
                isActive
                  ? "text-[#6C5CE7] font-black"
                  : "text-stone-500 hover:text-stone-800 font-medium"
              }`}
            >
              <div
                className={`p-1.5 sm:p-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#6C5CE7]/15 scale-110 shadow-2xs"
                    : "hover:bg-stone-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isActive ? "stroke-[#6C5CE7] stroke-[2.5]" : "stroke-stone-500 stroke-[2]"
                  }`}
                />
              </div>
              <span className="leading-tight mt-1 text-center">
                {isUrdu ? (
                  <span className="font-bold text-sm sm:text-base font-urdu block">
                    {tab.labelUr}
                  </span>
                ) : (
                  <span className="font-bold text-xs sm:text-sm block">
                    {tab.labelEn}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
