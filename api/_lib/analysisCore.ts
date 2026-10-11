import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from "../../src/types";

let geminiClient: GoogleGenAI | null = null;
let currentKeyCached = "";

export function getApiKey(): { key: string; varName: string } | null {
  const envCandidates = [
    { name: "GEMINI_API_KEY", val: process.env.GEMINI_API_KEY },
    { name: "GOOGLE_API_KEY", val: process.env.GOOGLE_API_KEY },
    { name: "VITE_GEMINI_API_KEY", val: process.env.VITE_GEMINI_API_KEY },
    { name: "VITE_GOOGLE_API_KEY", val: process.env.VITE_GOOGLE_API_KEY },
    { name: "NEXT_PUBLIC_GEMINI_API_KEY", val: process.env.NEXT_PUBLIC_GEMINI_API_KEY },
    { name: "API_KEY", val: process.env.API_KEY },
  ];

  for (const candidate of envCandidates) {
    if (candidate.val && candidate.val.trim().length > 0) {
      const cleaned = candidate.val.trim().replace(/^["']|["']$/g, "").trim();
      if (cleaned.length > 5) {
        return { key: cleaned, varName: candidate.name };
      }
    }
  }
  return null;
}

export function getGeminiClient(): GoogleGenAI | null {
  const keyInfo = getApiKey();
  if (!keyInfo) {
    return null;
  }
  if (!geminiClient || currentKeyCached !== keyInfo.key) {
    geminiClient = new GoogleGenAI({
      apiKey: keyInfo.key,
    });
    currentKeyCached = keyInfo.key;
  }
  return geminiClient;
}

export interface AnalysisInput {
  type: "image" | "voice" | "text" | "url";
  content?: string;
  imageBase64?: string;
  imageMimeType?: string;
  language?: "ur" | "en";
}

export async function performAnalysis(input: AnalysisInput): Promise<AnalysisResult> {
  const { type, content, imageBase64, imageMimeType, language = "ur" } = input;
  const isUrdu = language === "ur" || /[\u0600-\u06FF]/.test(content || "");

  const ai = getGeminiClient();

  // If no Gemini API key is configured on the host (e.g. Vercel environment variables missing)
  if (!ai) {
    console.warn("GEMINI_API_KEY is not set. Falling back to deterministic safety heuristics.");
    const fallbackResult = generateHeuristicAnalysis(type, content || "", language);
    return {
      ...fallbackResult,
      technical_details: {
        ...fallbackResult.technical_details,
        modelUsed: "Heuristic Rules (GEMINI_API_KEY not set on server)",
        apiKeyConfigured: false,
        isLiveAI: false,
      },
    };
  }

  const systemInstruction = `You are the core AI intelligence of AwaazShield ("Soch Lo, Phir Bharosa Karo"), an AI-powered digital safety assistant designed for elderly, non-technical, low-digital-literacy, and low-literacy internet users.
Your goal is to answer: "Can this person safely trust, click, respond to, pay, share, or act on this?"

Follow ZERO-TEXT COGNITIVE LOAD:
1. Verdict must be one of:
   - "safe" (No obvious high-risk scam or deception signals detected)
   - "caution" (Unusual, suspicious, incomplete, or unverifiable signals)
   - "danger" (Strong evidence or multiple signals of scam, impersonation, phishing, urgency, financial fraud)
2. Explain the "WHY" with 2-4 concrete, human-understandable signals (e.g., Urgency/Pressure, Money request, Suspicious link, Impersonation, OTP/Credential request).
3. Provide 2-3 safe next steps (e.g. "Do not send money", "Do not open the link", "Ask someone you trust").
4. Provide short, spoken natural audio scripts:
   - One in conversational everyday Urdu: e.g., "سُنیں۔ یہ میسج خطرناک ہے۔ آپ سے فوراً پیسے مانگے جا رہے ہیں۔ نہ پیسے بھیجیں اور نہ لنک پر کلک کریں۔"
   - One in plain simple English: e.g., "Stop. This message is dangerous. They are rushing you to send money through a suspicious link. Do not pay and do not click the link."
   - One in Roman Urdu (English letters): e.g., "Suno. Yeh message risky hai. Foran paise bhejne se bachein aur link par click na karein."
   Audio scripts MUST be short (15-25 seconds spoken), calm, direct, and free of technical jargon.
5. NEVER say something is "100% safe" or "definitely genuine".
6. Return purely valid JSON according to the schema.`;

  const promptText = `Analyze this digital input for digital safety risks:
Input Type: ${type}
User Description or Text Content: ${content || "(None provided directly - examine image/audio)"}
Preferred Language for primary audio script: ${language}

Evaluation Guidelines:
- If Input Type is 'url': Inspect the domain and link carefully. If it is a known legitimate service (e.g. google.com, wikipedia.org, youtube.com, gov.pk, official banking portals), classify as SAFE with advice not to share secrets. If it is an obvious phishing / fake clone / suspicious TLD or shortened link pretending to be a bank, utility, or prize, classify as DANGER. If unknown or unverifiable without more context, classify as CAUTION.
- If content has urgency, payment demands, threats of disconnection, or asks for passwords/PIN/OTP, classify as DANGER.

Provide risk analysis adhering strictly to the JSON schema.`;

  const contents: any = [];

  if (type === "image" && imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    contents.push({
      parts: [
        {
          inlineData: {
            mimeType: imageMimeType || "image/jpeg",
            data: cleanBase64,
          },
        },
        { text: promptText },
      ],
    });
  } else {
    contents.push({
      parts: [{ text: promptText }],
    });
  }

  // Model cascade: Fast, universally available, high-quota models first
  const candidateModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let response: any = null;
  let modelUsed = "";
  let lastError: any = null;

  for (const modelCandidate of candidateModels) {
    try {
      response = await ai.models.generateContent({
        model: modelCandidate,
        contents,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              risk_level: {
                type: Type.STRING,
                description: "Must be 'safe', 'caution', or 'danger'",
              },
              risk_score: {
                type: Type.NUMBER,
                description: "Float from 0.0 (safest) to 1.0 (most dangerous)",
              },
              language: {
                type: Type.STRING,
                description: "Primary detected language: 'ur', 'en', or 'roman_urdu'",
              },
              summary: {
                type: Type.STRING,
                description: "One short, extremely simple sentence for the user",
              },
              signals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: {
                      type: Type.STRING,
                      description: "urgency | financial_request | credential_request | suspicious_url | impersonation | emotional_manipulation | unusual_request | other",
                    },
                    label: {
                      type: Type.STRING,
                      description: "Short 2-3 word label (e.g. 'Pressure', 'Money Request', 'Suspicious Link')",
                    },
                    explanation: {
                      type: Type.STRING,
                      description: "Simple one-sentence explanation for ordinary person",
                    },
                  },
                  required: ["type", "label", "explanation"],
                },
              },
              recommended_actions: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "2-3 short, direct protective actions",
              },
              audio_script: {
                type: Type.STRING,
                description: "Spoken natural explanation in preferred language",
              },
              audio_script_en: {
                type: Type.STRING,
                description: "Spoken natural explanation in English",
              },
              audio_script_ur: {
                type: Type.STRING,
                description: "Spoken natural explanation in Urdu script",
              },
              audio_script_ur_roman: {
                type: Type.STRING,
                description: "Spoken natural explanation in Roman Urdu",
              },
              uncertainty: {
                type: Type.STRING,
                description: "low | medium | high",
              },
            },
            required: [
              "risk_level",
              "risk_score",
              "summary",
              "signals",
              "recommended_actions",
              "audio_script",
              "uncertainty",
            ],
          },
        },
      });

      if (response && response.text) {
        modelUsed = modelCandidate;
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Upstream call for ${modelCandidate} failed:`, err?.message || err);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  if (!response || !response.text) {
    const errorMsg = lastError?.message || String(lastError || "All models returned empty response");
    console.warn("All candidate models failed. Falling back to heuristic rules:", errorMsg);
    const fallback = generateHeuristicAnalysis(type, content || "", language);
    return {
      ...fallback,
      technical_details: {
        ...fallback.technical_details,
        modelUsed: "Offline Heuristics (AI Model Error)",
        fallbackReason: errorMsg,
        apiKeyConfigured: Boolean(getApiKey()),
        isLiveAI: false,
      },
    };
  }

  const parsed = JSON.parse(response.text);

  return {
    ...parsed,
    technical_details: {
      modelUsed: modelUsed || "gemini-3.8-flash",
      inputType: type,
      timestamp: new Date().toISOString(),
      uncertainty: parsed.uncertainty || "low",
      apiKeyConfigured: true,
      isLiveAI: true,
    },
  };
}

export function generateHeuristicAnalysis(
  type: string,
  content: string = "",
  language: string = "ur"
): AnalysisResult {
  const lower = (content || "").toLowerCase();
  const isUrdu = language === "ur" || /[\u0600-\u06FF]/.test(content);

  const urgencyTriggers = [
    "urgent",
    "immediately",
    "disconnect",
    "suspended",
    "today",
    "foran",
    "24 hours",
    "bijli",
    "electricity",
    "bill",
    "block",
    "emergency",
    "jail",
    "police",
  ];
  const moneyTriggers = [
    "pay",
    "money",
    "rs",
    "pkr",
    "transfer",
    "bank",
    "card",
    "deposit",
    "fee",
    "prize",
    "cash",
    "account",
    "paise",
    "bhejein",
  ];
  const linkTriggers = ["http", "bit.ly", "tinyurl", "link", "click", "apk", ".xyz", ".top", ".club"];
  const credentialTriggers = ["otp", "pin", "password", "code", "verify", "cnic", "login"];

  const hasUrgency = urgencyTriggers.some((t) => lower.includes(t));
  const hasMoney = moneyTriggers.some((t) => lower.includes(t));
  const hasLink = linkTriggers.some((t) => lower.includes(t));
  const hasCredentials = credentialTriggers.some((t) => lower.includes(t));

  const count = (hasUrgency ? 1 : 0) + (hasMoney ? 1 : 0) + (hasLink ? 1 : 0) + (hasCredentials ? 1 : 0);

  if (count >= 2 || (hasMoney && hasUrgency) || (hasLink && hasUrgency)) {
    return {
      risk_level: "danger",
      risk_score: 0.92,
      language: isUrdu ? "ur" : "en",
      summary: isUrdu
        ? "فوراً رک جائیں۔ یہ میسج خطرناک فراڈ لگتا ہے۔"
        : "STOP. This message appears to be a dangerous scam.",
      signals: [
        ...(hasUrgency
          ? [
              {
                type: "urgency",
                label: isUrdu ? "شدید جلدی" : "High Pressure",
                explanation: isUrdu
                  ? "وہ آپ پر فوراً قدم اٹھانے کا دباؤ ڈال رہے ہیں۔"
                  : "They are trying to rush you into making a fast decision.",
              },
            ]
          : []),
        ...(hasMoney
          ? [
              {
                type: "financial_request",
                label: isUrdu ? "پیسوں کا مطالبہ" : "Money Request",
                explanation: isUrdu
                  ? "آپ سے فوراً پیسے ٹرانسفر کرنے کا کہا جا رہا ہے۔"
                  : "They are asking you to send money immediately.",
              },
            ]
          : []),
        ...(hasLink
          ? [
              {
                type: "suspicious_url",
                label: isUrdu ? "مشکوک لنک" : "Suspicious Link",
                explanation: isUrdu
                  ? "یہ لنک کسی مستند ادارے یا ویب سائٹ سے میچ نہیں کرتا۔"
                  : "The link does not match the official organization.",
              },
            ]
          : []),
        ...(hasCredentials
          ? [
              {
                type: "credential_request",
                label: isUrdu ? "خفیہ کوڈ کا مطالبہ" : "OTP / Credential Request",
                explanation: isUrdu
                  ? "آپ سے اپنا خفیہ کوڈ مانگا جا رہا ہے۔"
                  : "They are trying to obtain your private PIN or OTP.",
              },
            ]
          : []),
      ],
      recommended_actions: isUrdu
        ? ["پیسے ہرگز نہ بھیجیں۔", "اس لنک پر کلک نہ کریں۔", "اپنے کسی بااعتماد فرد یا ادارے سے تصدیق کریں۔"]
        : ["Do not send money.", "Do not click the link.", "Ask someone you trust or verify through official channels."],
      audio_script: isUrdu
        ? "سُنیں۔ فوراً رک جائیں۔ یہ میسج ایک فراڈ لگتا ہے۔ آپ سے جلدی پیسے مانگے جا رہے ہیں۔ نہ پیسے بھیجیں اور نہ لنک پر کلک کریں۔ اپنے کسی بااعتماد فرد سے بات کریں۔"
        : "Listen. Stop right now. This message appears to be a dangerous scam. They are rushing you to pay money through an unverified link. Do not pay and do not click.",
      audio_script_en:
        "Stop right now. This message appears to be a dangerous scam. They are rushing you to send money through a suspicious link. Do not pay and do not click.",
      audio_script_ur:
        "سُنیں۔ فوراً رک جائیں۔ یہ میسج ایک فراڈ لگتا ہے۔ آپ سے جلدی پیسے مانگے جا رہے ہیں۔ نہ پیسے بھیجیں اور نہ لنک پر کلک کریں۔",
      audio_script_ur_roman:
        "Suno. Foran ruk jayen. Yeh message khatarnak lagta hai. Paise hargiz na bhejein aur link par click na karein.",
      uncertainty: "low",
      technical_details: {
        modelUsed: "AwaazShield Safety Heuristics Engine",
        inputType: type,
        timestamp: new Date().toISOString(),
        uncertainty: "low",
      },
    };
  }

  const isReputableDomain =
    type === "url" &&
    /(\bgoogle\.com|\byoutube\.com|\bwikipedia\.org|\bgov\.pk|\bedu|\bgithub\.com|\bapple\.com|\bmicrosoft\.com|\bbbc\.com)\b/i.test(
      content
    );

  if (type === "url" && isReputableDomain && count === 0) {
    return {
      risk_level: "safe",
      risk_score: 0.08,
      language: isUrdu ? "ur" : "en",
      summary: isUrdu
        ? "یہ ایک مستند اور معروف ویب سائٹ ہے۔ بظاہر محفوظ ہے۔"
        : "This is a recognized, authentic website and appears safe.",
      signals: [
        {
          type: "other",
          label: isUrdu ? "معروف ڈومین" : "Verified Domain",
          explanation: isUrdu
            ? "یہ ایک جانی پہچانی اور مستند ویب سائٹ ہے۔"
            : "This web address belongs to a recognized, legitimate organization.",
        },
      ],
      recommended_actions: isUrdu
        ? ["آپ اس ویب سائٹ کو کھول سکتے ہیں۔", "کسی بھی ویب سائٹ پر اپنے خفیہ بینک پاس ورڈ نہ دیں۔"]
        : ["You can safely open this link.", "Never share passwords or banking PINs on unknown forms."],
      audio_script: isUrdu
        ? "یہ لنک ایک جانی پہچانی اور مستند ویب سائٹ کا ہے اور محفوظ معلوم ہوتا ہے۔"
        : "This link belongs to a recognized legitimate website and appears safe to visit.",
      audio_script_en: "This link belongs to a recognized legitimate website and appears safe to visit.",
      audio_script_ur: "یہ لنک ایک جانی پہچانی اور مستند ویب سائٹ کا ہے اور محفوظ معلوم ہوتا ہے۔",
      audio_script_ur_roman: "Yeh link ek mashhoor aur mustanad website ka hai aur mehfooz lagta hai.",
      uncertainty: "low",
      technical_details: {
        modelUsed: "AwaazShield Safety Heuristics Engine",
        inputType: type,
        timestamp: new Date().toISOString(),
        uncertainty: "low",
      },
    };
  }

  if (count === 1 || type === "url") {
    return {
      risk_level: "caution",
      risk_score: 0.55,
      language: isUrdu ? "ur" : "en",
      summary: isUrdu
        ? "احتیاط کریں۔ اس میں کچھ غیر معمولی علامات ہیں۔"
        : "Check before you act. Something about this looks unusual.",
      signals: [
        {
          type: "unusual_request",
          label: isUrdu ? "غیر تصدیق شدہ بات" : "Unverified Request",
          explanation: isUrdu
            ? "میسج میں ایسی باتیں ہیں جن کی پہلے آزادانہ تصدیق ضروری ہے۔"
            : "The message contains claims that require independent verification.",
        },
        {
          type: "suspicious_url",
          label: isUrdu ? "لنک کی احتیاط" : "Check Links",
          explanation: isUrdu
            ? "کوئی بھی ذاتی معلومات دینے سے پہلے کسی اپنے سے پوچھیں۔"
            : "Check with someone you trust before entering any details.",
        },
      ],
      recommended_actions: isUrdu
        ? ["کوئی بھی قدم اٹھانے سے پہلے تصدیق کریں۔", "کسی بااعتماد دوست یا رشتے دار سے مشورہ کریں۔"]
        : ["Verify through an official phone number.", "Ask someone you trust before taking any action."],
      audio_script: isUrdu
        ? "احتیاط کی ضرورت ہے۔ اس میسج میں کچھ باتیں غیر معمولی ہیں۔ جلدی میں کوئی فیصلہ نہ کریں اور پہلے کسی بھروسے مند شخص سے پوچھیں۔"
        : "Be careful. Something about this message looks unusual. Take your time and check with someone you trust before doing anything.",
      audio_script_en:
        "Be careful. Something about this message looks unusual. Take your time and check with someone you trust before doing anything.",
      audio_script_ur:
        "احتیاط کی ضرورت ہے۔ اس میسج میں کچھ باتیں غیر معمولی ہیں۔ جلدی میں کوئی فیصلہ نہ کریں اور پہلے کسی بھروسے مند شخص سے پوچھیں۔",
      audio_script_ur_roman:
        "Ahtiyat karein. Is message mein ajeeb baatein hain. Faisla lene se pehle kisi bharosemand shakhs se mashwara karein.",
      uncertainty: "medium",
      technical_details: {
        modelUsed: "AwaazShield Safety Heuristics Engine",
        inputType: type,
        timestamp: new Date().toISOString(),
        uncertainty: "medium",
      },
    };
  }

  return {
    risk_level: "safe",
    risk_score: 0.12,
    language: isUrdu ? "ur" : "en",
    summary: isUrdu
      ? "یہ محفوظ معلوم ہوتا ہے۔ کوئی واضح خطرہ نہیں ملا۔"
      : "Looks safe. No obvious scam signs were found.",
    signals: [
      {
        type: "other",
        label: isUrdu ? "کوئی دباؤ نہیں" : "No Urgency",
        explanation: isUrdu
          ? "آپ پر جلدی پیسے دینے یا خفیہ کوڈ بتانے کا کوئی دباؤ نہیں ہے۔"
          : "There is no pressure to send money or reveal private secrets.",
      },
    ],
    recommended_actions: isUrdu
      ? ["آپ معمول کے مطابق آگے بڑھ سکتے ہیں۔", "یاد رکھیں: کبھی بھی اپنا پن کوڈ یا او ٹی پی کسی کو نہ بتائیں۔"]
      : ["You can continue normally.", "Remember: Never share your PIN or OTP with anyone."],
    audio_script: isUrdu
      ? "یہ میسج محفوظ معلوم ہوتا ہے۔ اس میں کسی دھوکے یا فراڈ کی نشانی نہیں ملی۔ آپ اطمینان سے جاری رکھ سکتے ہیں۔"
      : "This looks safe based on the available information. No obvious scam indicators were detected. You may proceed normally.",
    audio_script_en:
      "This looks safe based on the available information. No obvious scam indicators were detected. You may proceed normally.",
    audio_script_ur:
      "یہ میسج محفوظ معلوم ہوتا ہے۔ اس میں کسی دھوکے یا فراڈ کی نشانی نہیں ملی۔ آپ اطمینان سے جاری رکھ سکتے ہیں۔",
    audio_script_ur_roman:
      "Yeh message mehfooz lagta hai. Is mein dhokay ki koi nishani nahi mili.",
    uncertainty: "low",
    technical_details: {
      modelUsed: "AwaazShield Safety Heuristics Engine",
      inputType: type,
      timestamp: new Date().toISOString(),
      uncertainty: "low",
    },
  };
}
