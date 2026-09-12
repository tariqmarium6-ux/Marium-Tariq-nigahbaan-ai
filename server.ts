import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing with 10MB limit for screenshots
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    service: "Nigehbaan AI Core",
  });
});

// High-definition natural Urdu and English speech generation endpoint
app.get("/api/tts", async (req, res) => {
  try {
    const text = (req.query.text as string) || "";
    const lang = (req.query.lang as string) === "en" ? "en" : "ur";

    if (!text.trim()) {
      return res.status(400).send("Text parameter is required");
    }

    // Truncate to spoken length (first 400 characters)
    const cleanText = text.trim().slice(0, 400);
    const encoded = encodeURIComponent(cleanText);
    const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encoded}`;

    const upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).send("Upstream voice service error");
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length.toString(),
      "Cache-Control": "public, max-age=86400",
      "Accept-Ranges": "bytes",
    });

    return res.send(audioBuffer);
  } catch (err: any) {
    console.error("TTS endpoint error:", err?.message || err);
    return res.status(500).send("TTS generation failed");
  }
});

// Primary Scam & Deception Analysis Endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { type, content, imageBase64, imageMimeType, language = "ur" } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Analysis type is required" });
    }

    const ai = getGeminiClient();

    // If no Gemini API key is configured, provide fallback heuristic analysis
    if (!ai) {
      const fallbackResult = generateHeuristicAnalysis(type, content, language);
      return res.json(fallbackResult);
    }

    const systemInstruction = `You are the core AI intelligence of Nigehbaan ("Soch Lo, Phir Bharosa Karo"), an AI-powered digital safety assistant designed for elderly, non-technical, low-digital-literacy, and low-literacy internet users.
Your goal is to answer: "Can this person safely trust, click, respond to, pay, share, or act on this?"

Follow ZERO-TEXT COGNITIVE LOAD:
1. Verdict must be one of:
   - "safe" (No obvious high-risk scam or deception signals detected)
   - "caution" (Unusual, suspicious, incomplete, or unverifiable signals)
   - "danger" (Strong evidence or multiple signals of scam, impersonation, phishing, urgency, financial fraud)
2. Explain the "WHY" with 2-4 concrete, human-understandable signals (e.g., Urgency/Pressure, Money request, Suspicious link, Impersonation, OTP/Credential request).
3. Provide 2-3 safe next steps (e.g. "Do not send money", "Do not open the link", "Ask someone you trust").
4. Provide short, spoken natural audio scripts:
   - One in conversational everyday Urdu (or Roman Urdu): e.g., "Suno. Yeh message risky hai. Aap se foran paise bhejne ko kaha ja raha hai. Is link par click na karein aur paise na bhejein."
   - One in plain simple English: e.g., "Stop. This message is dangerous. They are rushing you to send money through a suspicious link. Do not pay and do not click the link."
   Audio scripts MUST be short (15-25 seconds spoken), calm, direct, and free of technical jargon.
5. NEVER say something is "100% safe" or "definitely genuine".
6. Return purely valid JSON according to the schema.`;

    const promptText = `Analyze this digital input for digital safety risks:
Input Type: ${type}
User Description or Text Content: ${content || "(None provided directly)"}
Preferred Language for primary audio script: ${language}

Evaluation Guidelines:
- If Input Type is 'url': Inspect the domain and link carefully. If it is a known legitimate service (e.g. google.com, wikipedia.org, youtube.com, gov.pk, official banking portals), classify as SAFE with advice not to share secrets. If it is an obvious phishing / fake clone / suspicious TLD or shortened link pretending to be a bank, utility, or prize, classify as DANGER. If unknown or unverifiable without more context, classify as CAUTION.
- If content has urgency, payment demands, threats of disconnection, or asks for passwords/PIN/OTP, classify as DANGER.

Provide risk analysis adhering strictly to the JSON schema.`;

    const contents: any = [];

    if (type === "image" && imageBase64) {
      // Strip data url prefix if present
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

    // gemini-flash-latest and gemini-3.1-flash-lite offer instantaneous response and immunity to temporary 3.8-flash demand spikes
    const candidateModels = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
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
                  description: "2-3 short, direct protective actions (e.g. 'Do not send money', 'Do not click the link')",
                },
                audio_script: {
                  type: Type.STRING,
                  description: "Spoken natural explanation in preferred language (Urdu or English) for text-to-speech",
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
                  description: "Spoken natural explanation in Roman Urdu (English letters) so all TTS engines can pronounce it",
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
          break; // Successfully generated
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Upstream status for ${modelCandidate} (${err?.status || err?.code || "temporary spike"}): trying next candidate model...`);
        // Short pause before trying alternate model
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("All model candidates temporarily unavailable");
    }

    const text = response.text;
    const parsed = JSON.parse(text);

    // Attach technical details for hackathon inspection
    const enriched = {
      ...parsed,
      technical_details: {
        modelUsed: modelUsed || "gemini-3.8-flash",
        inputType: type,
        timestamp: new Date().toISOString(),
        uncertainty: parsed.uncertainty || "low",
      },
    };

    return res.json(enriched);
  } catch (err: any) {
    console.warn("AI generation temporarily offline or high demand; applying safe deterministic safety heuristics:", err?.message || err);
    // Provide a resilient fallback so the user is never stuck
    const fallback = generateHeuristicAnalysis(
      req.body?.type || "text",
      req.body?.content || "",
      req.body?.language || "ur"
    );
    return res.json(fallback);
  }
});

// Heuristic fallback generator when API is offline or encountered rate limits
function generateHeuristicAnalysis(type: string, content: string = "", language: string = "ur") {
  const lower = (content || "").toLowerCase();
  const isUrdu = language === "ur" || /[\u0600-\u06FF]/.test(content);

  // Check for common scam triggers
  const urgencyTriggers = ["urgent", "immediately", "disconnect", "suspended", "today", "foran", "24 hours", "bijli", "electricity", "bill", "block", "emergency", "jail", "police"];
  const moneyTriggers = ["pay", "money", "rs", "pkr", "transfer", "bank", "card", "deposit", "fee", "prize", "cash", "account", "paise", "bhejein"];
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
      summary: isUrdu ? "فوراً رک جائیں۔ یہ میسج خطرناک فراڈ لگتا ہے۔" : "STOP. This message appears to be a dangerous scam.",
      signals: [
        ...(hasUrgency ? [{ type: "urgency", label: "شدید جلدی (Pressure)", explanation: isUrdu ? "وہ آپ پر فوراً قدم اٹھانے کا دباؤ ڈال رہے ہیں۔" : "They are trying to rush you into making a fast decision." }] : []),
        ...(hasMoney ? [{ type: "financial_request", label: "پیسوں کا مطالبہ (Money Request)", explanation: isUrdu ? "آپ سے فوراً پیسے ٹرانسفر کرنے کا کہا جا رہا ہے۔" : "They are asking you to send money immediately." }] : []),
        ...(hasLink ? [{ type: "suspicious_url", label: "مشکوک لنک (Suspicious Link)", explanation: isUrdu ? "یہ لنک کسی مستند ادارے یا ویب سائٹ سے میچ نہیں کرتا۔" : "The link does not match the official organization." }] : []),
        ...(hasCredentials ? [{ type: "credential_request", label: "خفیہ کوڈ کا مطالبہ (OTP/PIN)", explanation: isUrdu ? "آپ سے اپنا خفیہ کوڈ مانگا جا رہا ہے۔" : "They are trying to obtain your private PIN or OTP." }] : []),
      ],
      recommended_actions: isUrdu
        ? ["پیسے ہرگز نہ بھیجیں۔", "اس لنک پر کلک نہ کریں۔", "اپنے کسی بااعتماد فرد یا ادارے سے تصدیق کریں۔"]
        : ["Do not send money.", "Do not click the link.", "Ask someone you trust or verify through official channels."],
      audio_script: isUrdu
        ? "سُنیں۔ فوراً رک جائیں۔ یہ میسج ایک فراڈ لگتا ہے۔ آپ سے جلدی پیسے مانگے جا رہے ہیں۔ نہ پیسے بھیجیں اور نہ لنک پر کلک کریں۔ اپنے کسی بااعتماد فرد سے بات کریں۔"
        : "Listen. Stop right now. This message appears to be a dangerous scam. They are rushing you to pay money through an unverified link. Do not pay and do not click.",
      audio_script_en: "Stop right now. This message appears to be a dangerous scam. They are rushing you to send money through a suspicious link. Do not pay and do not click.",
      audio_script_ur: "سُنیں۔ فوراً رک جائیں۔ یہ میسج ایک فراڈ لگتا ہے۔ آپ سے جلدی پیسے مانگے جا رہے ہیں۔ نہ پیسے بھیجیں اور نہ لنک پر کلک کریں۔",
      audio_script_ur_roman: "Suno. Foran ruk jayen. Yeh message khatarnak lagta hai. Paise hargiz na bhejein aur link par click na karein.",
      uncertainty: "low",
      technical_details: {
        modelUsed: "AwaazShield Safety Heuristics & Analysis",
        inputType: type,
        timestamp: new Date().toISOString(),
        uncertainty: "low",
      },
    };
  }

  // Check if URL is a recognized, reputable domain
  const isReputableDomain =
    type === "url" &&
    /(\bgoogle\.com|\byoutube\.com|\bwikipedia\.org|\bgov\.pk|\bedu|\bgithub\.com|\bapple\.com|\bmicrosoft\.com|\bbbc\.com)\b/i.test(content);

  if (type === "url" && isReputableDomain && count === 0) {
    return {
      risk_level: "safe",
      risk_score: 0.08,
      language: isUrdu ? "ur" : "en",
      summary: isUrdu ? "یہ ایک مستند اور معروف ویب سائٹ ہے۔ بظاہر محفوظ ہے۔" : "This is a recognized, authentic website and appears safe.",
      signals: [
        {
          type: "other",
          label: isUrdu ? "معروف ڈومین" : "Verified Domain",
          explanation: isUrdu ? "یہ ایک جانی پہچانی اور مستند ویب سائٹ ہے۔" : "This web address belongs to a recognized, legitimate organization.",
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
        modelUsed: "AwaazShield Safety Heuristics & Analysis",
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
      summary: isUrdu ? "احتیاط کریں۔ اس میں کچھ غیر معمولی علامات ہیں۔" : "Check before you act. Something about this looks unusual.",
      signals: [
        {
          type: "unusual_request",
          label: "غیر تصدیق شدہ بات (Unverified Request)",
          explanation: isUrdu ? "میسج میں ایسی باتیں ہیں جن کی پہلے آزادانہ تصدیق ضروری ہے۔" : "The message contains claims that require independent verification.",
        },
        {
          type: "suspicious_url",
          label: "لنک کی احتیاط (Check Links)",
          explanation: isUrdu ? "کوئی بھی ذاتی معلومات دینے سے پہلے کسی اپنے سے پوچھیں۔" : "Check with someone you trust before entering any details.",
        },
      ],
      recommended_actions: isUrdu
        ? ["کوئی بھی قدم اٹھانے سے پہلے تصدیق کریں۔", "کسی بااعتماد دوست یا رشتے دار سے مشورہ کریں۔"]
        : ["Verify through an official phone number.", "Ask someone you trust before taking any action."],
      audio_script: isUrdu
        ? "احتیاط کی ضرورت ہے۔ اس میسج میں کچھ باتیں غیر معمولی ہیں۔ جلدی میں کوئی فیصلہ نہ کریں اور پہلے کسی بھروسے مند شخص سے پوچھیں۔"
        : "Be careful. Something about this message looks unusual. Take your time and check with someone you trust before doing anything.",
      audio_script_en: "Be careful. Something about this message looks unusual. Take your time and check with someone you trust before doing anything.",
      audio_script_ur: "احتیاط کی ضرورت ہے۔ اس میسج میں کچھ باتیں غیر معمولی ہیں۔ جلدی میں کوئی فیصلہ نہ کریں اور پہلے کسی بھروسے مند شخص سے پوچھیں۔",
      audio_script_ur_roman: "Ahtiyat karein. Is message mein ajeeb baatein hain. Faisla lene se pehle kisi bharosemand shakhs se mashwara karein.",
      uncertainty: "medium",
      technical_details: {
        modelUsed: "AwaazShield Safety Heuristics & Analysis",
        inputType: type,
        timestamp: new Date().toISOString(),
        uncertainty: "medium",
      },
    };
  }

  // Safe verdict
  return {
    risk_level: "safe",
    risk_score: 0.12,
    language: isUrdu ? "ur" : "en",
    summary: isUrdu ? "یہ محفوظ معلوم ہوتا ہے۔ کوئی واضح خطرہ نہیں ملا۔" : "Looks safe. No obvious scam signs were found.",
    signals: [
      {
        type: "other",
        label: "کوئی دباؤ نہیں (No Urgency)",
        explanation: isUrdu ? "آپ پر جلدی پیسے دینے یا خفیہ کوڈ بتانے کا کوئی دباؤ نہیں ہے۔" : "There is no pressure to send money or reveal private secrets.",
      },
    ],
    recommended_actions: isUrdu
      ? ["آپ معمول کے مطابق آگے بڑھ سکتے ہیں۔", "یاد رکھیں: کبھی بھی اپنا پن کوڈ یا او ٹی پی کسی کو نہ بتائیں۔"]
      : ["You can continue normally.", "Remember: Never share your PIN or OTP with anyone."],
    audio_script: isUrdu
      ? "یہ میسج محفوظ معلوم ہوتا ہے۔ اس میں کسی دھوکے یا فراڈ کی نشانی نہیں ملی۔ آپ اطمینان سے جاری رکھ سکتے ہیں۔"
      : "This looks safe based on the available information. No obvious scam indicators were detected. You may proceed normally.",
    audio_script_en: "This looks safe based on the available information. No obvious scam indicators were detected. You may proceed normally.",
    audio_script_ur: "یہ میسج محفوظ معلوم ہوتا ہے۔ اس میں کسی دھوکے یا فراڈ کی نشانی نہیں ملی۔ آپ اطمینان سے جاری رکھ سکتے ہیں۔",
    uncertainty: "low",
    technical_details: {
      modelUsed: "AwaazShield Safety Heuristics & Analysis",
      inputType: type,
      timestamp: new Date().toISOString(),
      uncertainty: "low",
    },
  };
}

// Start server with Vite in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AwaazShield Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
