import { AnalysisResult, ScamLibraryItem } from "../types";

export const DEMO_SCENARIOS_UR: Record<string, AnalysisResult> = {
  danger: {
    risk_level: "danger",
    risk_score: 0.96,
    language: "ur",
    isDemo: true,
    demoTitle: "⚡ جعلی بجلی بل کٹوتی میسج",
    summary: "فوراً رک جائیں۔ یہ میسج ایک خطرناک فراڈ ہے!",
    signals: [
      {
        type: "urgency",
        label: "شدید جلدی اور دباؤ",
        explanation: "وہ چند گھنٹوں میں بجلی کاٹنے کی دھمکی دے کر آپ کو گھبراہٹ میں مبتلا کر رہے ہیں۔",
      },
      {
        type: "financial_request",
        label: "پیسوں کا فوری مطالبہ",
        explanation: "بجلی بحال رکھنے کے لیے فوری نامعلوم اکاؤنٹ میں رقم بھیجنے کو کہا جا رہا ہے۔",
      },
      {
        type: "suspicious_url",
        label: "مشکوک ویب سائٹ لنک",
        explanation: "میسج کا لنک 'wapda-billpay.xyz' بجلی کمپنی کی اصلی سرکاری ویب سائٹ نہیں ہے۔",
      },
    ],
    recommended_actions: [
      "پیسے ہرگز نہ بھیجیں۔",
      "اس لنک پر کلک نہ کریں۔",
      "اپنے کسی بااعتماد فرد کو دکھائیں یا بجلی کے بل پر درج دفتری نمبر پر کال کریں۔",
    ],
    audio_script:
      "سُنیں۔ فوراً رک جائیں۔ یہ میسج ایک فراڈ ہے۔ آپ سے فوراً بجلی کٹنے کی دھمکی دے کر پیسے مانگے جا رہے ہیں۔ نہ پیسے بھیجیں اور نہ اس لنک پر کلک کریں۔ اپنے کسی بااعتماد فرد سے بات کریں۔",
    audio_script_en:
      "Stop right now. Do not send money. This message is a dangerous scam. They are threatening to disconnect your electricity to panic you into paying. Do not click the link, and verify with someone you trust.",
    audio_script_ur:
      "سُنیں۔ فوراً رک جائیں۔ یہ میسج ایک فراڈ ہے۔ آپ سے فوراً بجلی کٹنے کی دھمکی دے کر پیسے مانگے جا رہے ہیں۔ نہ پیسے بھیجیں اور نہ اس لنک پر کلک کریں۔ اپنے کسی بااعتماد فرد سے بات کریں۔",
    audio_script_ur_roman:
      "Sunein! Foran ruk jayein. Yeh message ek khatarnaak fraud hai. Aap se bijli katne ka dar dikha kar paise maange ja rahe hain. Na paise bhejein aur na is link par click karein. Kisi baa-aetemaad fard se baat karein.",
    uncertainty: "low",
    technical_details: {
      modelUsed: "gemini-3.8-flash (Flagship Demo)",
      inputType: "SMS Screenshot / Text",
      timestamp: new Date().toISOString(),
      uncertainty: "low (High confidence scam pattern)",
    },
  },
  caution: {
    risk_level: "caution",
    risk_score: 0.58,
    language: "ur",
    isDemo: true,
    demoTitle: "📦 غیر تصدیق شدہ پارسل میسج",
    summary: "احتیاط کریں۔ اس لنک پر کلک کرنے سے پہلے تسلی کر لیں۔",
    signals: [
      {
        type: "suspicious_url",
        label: "غیر تصدیق شدہ لنک",
        explanation: "لنک کسی نجی یا غیر سرکاری ایڈریس پر لے جا رہا ہے جو مشکوک ہو سکتا ہے۔",
      },
      {
        type: "unusual_request",
        label: "پتہ تبدیل کرنے کی درخواست",
        explanation: "اگر آپ نے کوئی پارسل نہیں منگوایا تو یہ آپ کا ڈیٹا حاصل کرنے کی کوشش ہو سکتی ہے۔",
      },
    ],
    recommended_actions: [
      "کوئی بھی ذاتی معلومات درج نہ کریں۔",
      "اگر آپ پارسل کا انتظار نہیں کر رہے تو اسے نظر انداز کریں۔",
      "اپنے کسی بھروسے مند شخص سے مشورہ لیں۔",
    ],
    audio_script:
      "دھیان دیں۔ اس پارسل میسج میں کچھ غیر معمولی علامات ہیں۔ اگر آپ نے کوئی چیز نہیں منگوائی تو لنک نہ کھولیں۔ پہلے اپنے کسی جاننے والے سے پوچھ لیں۔",
    audio_script_en:
      "Be careful. Something about this parcel delivery message looks unusual. Do not open the link if you were not expecting a package. Check with someone you trust first.",
    audio_script_ur:
      "دھیان دیں۔ اس پارسل میسج میں کچھ غیر معمولی علامات ہیں۔ اگر آپ نے کوئی چیز نہیں منگوائی تو لنک نہ کھولیں۔ پہلے اپنے کسی جاننے والے سے پوچھ لیں۔",
    audio_script_ur_roman:
      "Dehaan dein. Is parcel message mein kuch ghair-mamooli nishaaniyaan hain. Agar aap ne koi cheez nahi mangwaayi to link na kholein. Pehle kisi jaan-pehchaan wale se pooch lein.",
    uncertainty: "medium",
    technical_details: {
      modelUsed: "gemini-3.8-flash (Demo Mode)",
      inputType: "Delivery SMS",
      timestamp: new Date().toISOString(),
      uncertainty: "medium (Incomplete sender details)",
    },
  },
  safe: {
    risk_level: "safe",
    risk_score: 0.08,
    language: "ur",
    isDemo: true,
    demoTitle: "👨‍👩‍👧 گھریلو عام میسج",
    summary: "یہ محفوظ معلوم ہوتا ہے۔ کوئی واضح خطرہ نہیں ملا۔",
    signals: [
      {
        type: "other",
        label: "کوئی مالی مطالبہ نہیں",
        explanation: "اس میں نہ رقم کا کوئی مطالبہ ہے اور نہ ہی کوئی خفیہ معلومات مانگی گئی ہیں۔",
      },
      {
        type: "other",
        label: "کوئی خطرناک لنک نہیں",
        explanation: "پیغام میں کوئی مشکوک یا دھوکہ دہی والا لنک شامل نہیں ہے۔",
      },
    ],
    recommended_actions: [
      "آپ معمول کے مطابق بات چیت جاری رکھ سکتے ہیں۔",
      "یاد رکھیں: کبھی بھی اپنا پن کوڈ یا او ٹی پی کسی سے شیئر نہ کریں۔",
    ],
    audio_script:
      "یہ پیغام محفوظ معلوم ہوتا ہے۔ اس میں کسی دھوکے یا فراڈ کا کوئی اشارہ نہیں ملا۔ آپ اطمینان سے بات جاری رکھ سکتے ہیں۔",
    audio_script_en:
      "This looks safe based on the available information. No obvious scam signs were found. You can proceed normally.",
    audio_script_ur:
      "یہ پیغام محفوظ معلوم ہوتا ہے۔ اس میں کسی دھوکے یا فراڈ کا کوئی اشارہ نہیں ملا۔ آپ اطمینان سے بات جاری رکھ سکتے ہیں۔",
    audio_script_ur_roman:
      "Yeh message mehfooz maloom hota hai. Is mein kisi dhokay ya fraud ka koi ishara nahi mila. Aap itminaan se baat jari rakh sakte hain.",
    uncertainty: "low",
    technical_details: {
      modelUsed: "gemini-3.8-flash (Demo Mode)",
      inputType: "Chat message",
      timestamp: new Date().toISOString(),
      uncertainty: "low",
    },
  },
};

export const DEMO_SCENARIOS_EN: Record<string, AnalysisResult> = {
  danger: {
    risk_level: "danger",
    risk_score: 0.96,
    language: "en",
    isDemo: true,
    demoTitle: "⚡ Fake Electricity Bill Disconnection",
    summary: "Stop immediately. This message appears to be a dangerous scam!",
    signals: [
      {
        type: "urgency",
        label: "Urgency and Pressure",
        explanation: "They are threatening immediate power disconnection to force a rushed payment.",
      },
      {
        type: "financial_request",
        label: "Immediate Payment Demand",
        explanation: "You are being asked to transfer money urgently to an unverified private account.",
      },
      {
        type: "suspicious_url",
        label: "Suspicious Website Link",
        explanation: "The link 'wapda-billpay.xyz' is not the official electricity provider website.",
      },
    ],
    recommended_actions: [
      "Do not send any money.",
      "Do not tap or click the link.",
      "Verify by calling the official phone number printed on your physical electricity bill.",
    ],
    audio_script:
      "Stop right now. Do not send money. This message is a dangerous scam. They are threatening to disconnect your electricity to panic you into paying. Do not click the link, and verify with someone you trust.",
    audio_script_en:
      "Stop right now. Do not send money. This message is a dangerous scam. They are threatening to disconnect your electricity to panic you into paying. Do not click the link, and verify with someone you trust.",
    audio_script_ur:
      "سُنیں۔ فوراً رک جائیں۔ یہ میسج ایک فراڈ ہے۔ آپ سے فوراً بجلی کٹنے کی دھمکی دے کر پیسے مانگے جا رہے ہیں۔ نہ پیسے بھیجیں اور نہ اس لنک پر کلک کریں۔ اپنے کسی بااعتماد فرد سے بات کریں۔",
    audio_script_ur_roman:
      "Sunein! Foran ruk jayein. Yeh message ek khatarnaak fraud hai. Aap se bijli katne ka dar dikha kar paise maange ja rahe hain. Na paise bhejein aur na is link par click karein. Kisi baa-aetemaad fard se baat karein.",
    uncertainty: "low",
    technical_details: {
      modelUsed: "gemini-3.8-flash (Flagship Demo)",
      inputType: "SMS Screenshot / Text",
      timestamp: new Date().toISOString(),
      uncertainty: "low (High confidence scam pattern)",
    },
  },
  caution: {
    risk_level: "caution",
    risk_score: 0.58,
    language: "en",
    isDemo: true,
    demoTitle: "📦 Unverified Parcel Address Notice",
    summary: "Be careful. Please verify before clicking or taking any action.",
    signals: [
      {
        type: "suspicious_url",
        label: "Unverified Link",
        explanation: "The web address leads to an unofficial destination that may be unsafe.",
      },
      {
        type: "unusual_request",
        label: "Unexpected Address Check",
        explanation: "If you did not order a package, this request may be an attempt to harvest personal data.",
      },
    ],
    recommended_actions: [
      "Do not enter passwords, PINs, or card details.",
      "Ignore the message if you are not expecting a delivery.",
      "Ask someone you trust to help you verify it.",
    ],
    audio_script:
      "Be careful. Something about this parcel delivery message looks unusual. Do not open the link if you were not expecting a package. Check with someone you trust first.",
    audio_script_en:
      "Be careful. Something about this parcel delivery message looks unusual. Do not open the link if you were not expecting a package. Check with someone you trust first.",
    audio_script_ur:
      "دھیان دیں۔ اس پارسل میسج میں کچھ غیر معمولی علامات ہیں۔ اگر آپ نے کوئی چیز نہیں منگوائی تو لنک نہ کھولیں۔ پہلے اپنے کسی جاننے والے سے پوچھ لیں۔",
    audio_script_ur_roman:
      "Dehaan dein. Is parcel message mein kuch ghair-mamooli nishaaniyaan hain. Agar aap ne koi cheez nahi mangwaayi to link na kholein. Pehle kisi jaan-pehchaan wale se pooch lein.",
    uncertainty: "medium",
    technical_details: {
      modelUsed: "gemini-3.8-flash (Demo Mode)",
      inputType: "Delivery SMS",
      timestamp: new Date().toISOString(),
      uncertainty: "medium (Incomplete sender details)",
    },
  },
  safe: {
    risk_level: "safe",
    risk_score: 0.08,
    language: "en",
    isDemo: true,
    demoTitle: "👨‍👩‍👧 Genuine Family Message",
    summary: "This message looks safe based on the available information.",
    signals: [
      {
        type: "other",
        label: "No Financial Demands",
        explanation: "No requests for money, transfers, or banking details were found.",
      },
      {
        type: "other",
        label: "No Suspicious Links",
        explanation: "No deceptive or harmful URLs were detected in the message.",
      },
    ],
    recommended_actions: [
      "You can safely proceed with your conversation.",
      "Reminder: Never share your OTP or ATM PIN with anyone.",
    ],
    audio_script:
      "This looks safe based on the available information. No obvious scam signs were found. You can proceed normally.",
    audio_script_en:
      "This looks safe based on the available information. No obvious scam signs were found. You can proceed normally.",
    audio_script_ur:
      "یہ پیغام محفوظ معلوم ہوتا ہے۔ اس میں کسی دھوکے یا فراڈ کا کوئی اشارہ نہیں ملا۔ آپ اطمینان سے بات جاری رکھ سکتے ہیں۔",
    audio_script_ur_roman:
      "Yeh message mehfooz maloom hota hai. Is mein kisi dhokay ya fraud ka koi ishara nahi mila. Aap itminaan se baat jari rakh sakte hain.",
    uncertainty: "low",
    technical_details: {
      modelUsed: "gemini-3.8-flash (Demo Mode)",
      inputType: "Chat message",
      timestamp: new Date().toISOString(),
      uncertainty: "low",
    },
  },
};

export const getDemoScenario = (level: string, language: "ur" | "en" = "ur"): AnalysisResult => {
  const dataset = language === "en" ? DEMO_SCENARIOS_EN : DEMO_SCENARIOS_UR;
  return dataset[level] || dataset["danger"];
};

export const DEMO_SCENARIOS = DEMO_SCENARIOS_UR;

export const SAMPLE_QUICK_INPUTS = [
  {
    id: "electricity",
    labelEn: "⚡ Fake Electricity Bill",
    labelUr: "⚡ جعلی بجلی کا بل",
    type: "text",
    content:
      "URGENT NOTICE: Dear Customer, your electricity connection will be disconnected tonight at 9:30 PM due to unpaid bill. Immediately pay Rs. 4,850 via online link http://wapda-billpay.xyz to avoid immediate shutdown. Officer WhatsApp: 0304-9821345",
  },
  {
    id: "bank_kyc",
    labelEn: "🏦 Fake Bank OTP / KYC",
    labelUr: "🏦 جعلی بینک تصدیق میسج",
    type: "text",
    content:
      "HBL Alert: Your bank account has been temporarily blocked for biometric verification. Send your 4-digit secret OTP immediately or your account will be frozen permanently. Call State Bank Helpline: 0312-9988771",
  },
  {
    id: "lottery",
    labelEn: "🎁 Fake Prize / Lottery",
    labelUr: "🎁 جعلی انعامی قرعہ اندازی",
    type: "text",
    content:
      "Mubarak ho! Aap ka naam BISP Lucky Draw mein 50,000 rupay inaam ke liye nikal aya hai. Inaam ki raqam hasil karne ke liye foran Rs. 2,500 tax registration fee is Easypaisa number par transfer karein.",
  },
  {
    id: "safe_family",
    labelEn: "👨‍👩‍👧 Normal Family Text",
    labelUr: "👨‍👩‍👧 گھریلو عام میسج",
    type: "text",
    content:
      "Assalam-o-Alaikum Ami, I have reached home safely from office. Don't worry, see you tomorrow morning!",
  },
];

export const SCAM_LIBRARY_ITEMS: ScamLibraryItem[] = [
  {
    id: "scam-electricity",
    title: "Fake Electricity Bill Disconnection",
    titleUr: "بجلی کاٹنے کا جعلی میسج",
    category: "Utility Scams",
    categoryUr: "یوٹیلیٹی فراڈ",
    iconName: "Zap",
    description:
      "Scammers threaten that your power will be cut tonight unless you transfer money immediately to an unknown account or click a fake link.",
    descriptionUr:
      "دھوکہ باز دھمکی دیتے ہیں کہ آج رات آپ کی بجلی کاٹ دی جائے گی، جب تک کہ آپ فوراً دیے گئے نمبر پر پیسے نہ بھیجیں۔",
    audioScriptEn:
      "Beware of fake electricity bill messages. Official electric companies never ask for urgent payments through personal WhatsApp numbers or suspicious links. Always check your printed bill.",
    audioScriptUr:
      "بجلی کے جعلی میسجز سے ہوشیار رہیں۔ بجلی کا سرکاری ادارہ کبھی واٹس ایپ یا نجی نمبروں پر فوراً پیسے نہیں مانگتا۔ صرف اپنے اصلی بل پر درج بینک میں ادائیگی کریں۔",
    typicalSignals: ["Urgency within hours", "Personal WhatsApp number", "Fake website link"],
    typicalSignalsUr: ["چند گھنٹوں میں کٹوتی کی دھمکی", "نجی واٹس ایپ نمبر", "جعلی ویب سائٹ کا لنک"],
  },
  {
    id: "scam-parcel",
    title: "Fake Parcel / Courier Delivery",
    titleUr: "پارسل اور کوریئر کے جعلی میسج",
    category: "Delivery Scams",
    categoryUr: "ڈیلیوری فراڈ",
    iconName: "Package",
    description:
      "You receive an SMS saying a delivery failed due to wrong address, asking you to click a link and pay a small fee.",
    descriptionUr:
      "میسج آتا ہے کہ آپ کا پارسل پتہ غلط ہونے کی وجہ سے رک گیا ہے، اور ایڈریس درست کرنے کے لیے لنک کھول کر فیس ادا کریں۔",
    audioScriptEn:
      "Courier scams trick you into entering your bank card numbers to pay a tiny fee. If you did not order anything, ignore it completely.",
    audioScriptUr:
      "کوریئر فراڈ میں آپ سے چھوٹی سی فیس کے بہانے بینک کارڈ کا ڈیٹا چرایا جاتا ہے۔ اگر آپ نے کوئی آرڈر نہیں دیا تو لنک ہرگز نہ کھولیں۔",
    typicalSignals: ["Unsolicited package", "Card detail request", "Urgent address update"],
    typicalSignalsUr: ["بلا طلب پارسل", "بینک کارڈ مانگنا", "پتہ درست کرنے کی جلدی"],
  },
  {
    id: "scam-bank",
    title: "Fake Bank KYC / Account Block",
    titleUr: "بینک اکاؤنٹ بند ہونے کا خوف",
    category: "Financial Scams",
    categoryUr: "مالی فراڈ",
    iconName: "Landmark",
    description:
      "They claim your account or debit card is suspended and demand your secret OTP, PIN, or CNIC to unblock it.",
    descriptionUr:
      "کہا جاتا ہے کہ آپ کا بینک اکاؤنٹ یا اے ٹی ایم کارڈ بند ہو گیا ہے، اور بحال کرنے کے لیے فوراً او ٹی پی یا پن کوڈ بتائیں۔",
    audioScriptEn:
      "Your bank will never call or SMS you asking for your secret OTP or ATM PIN. Anyone asking for these numbers is a fraudster.",
    audioScriptUr:
      "یاد رکھیں، آپ کا بینک کبھی بھی آپ سے خفیہ پن کوڈ یا فون پر آنے والا او ٹی پی نہیں مانگتا۔ جو بھی مانگے وہ دھوکہ باز ہے۔",
    typicalSignals: ["Threat of account freeze", "Demand for OTP or PIN", "Fake bank officer call"],
    typicalSignalsUr: ["اکاؤنٹ بلاک کی دھمکی", "او ٹی پی یا پن کا مطالبہ", "جعلی بینکر بن کر کال"],
  },
  {
    id: "scam-job",
    title: "Fake Work-From-Home / Video Tasks",
    titleUr: "گھر بیٹھے نوکری کا جھانسا",
    category: "Employment Scams",
    categoryUr: "ملازمت کا فراڈ",
    iconName: "Briefcase",
    description:
      "Offers thousands of rupees daily just for liking YouTube videos or Google reviews, then demands deposit fees to withdraw earnings.",
    descriptionUr:
      "یوٹیوب ویڈیوز لائیک کر کے روزانہ ہزاروں کمانے کا لالچ دیا جاتا ہے، پھر رقم نکلوانے کے بہانے ڈپازٹ فیس مانگی جاتی ہے۔",
    audioScriptEn:
      "Real jobs never ask you to pay money or deposit registration fees upfront. Be careful with easy-money schemes on Telegram or WhatsApp.",
    audioScriptUr:
      "کوئی بھی اصلی کمپنی نوکری دینے کے لیے آپ سے رجسٹریشن یا سیکیورٹی فیس نہیں مانگتی۔ ایسے پیغامات سے دور رہیں۔",
    typicalSignals: ["Unrealistic easy earnings", "Advance deposit fee", "Conducted only on Telegram"],
    typicalSignalsUr: ["آسان کمائی کا جھانسا", "پہلے فیس جمع کروانے کی شرط", "صرف ٹیلی گرام پر رابطہ"],
  },
  {
    id: "scam-family",
    title: "Urgent Family Emergency Impersonation",
    titleUr: "کسی عزیز کی جھوٹی ایمرجنسی",
    category: "Impersonation",
    categoryUr: "شناخت چوری",
    iconName: "PhoneCall",
    description:
      "A stranger calls or texts claiming to be a child, relative, or police officer stating your loved one is in trouble and needs money.",
    descriptionUr:
      "کوئی انجان شخص خود کو آپ کا بیٹا، بھائی یا پولیس والا بتا کر کہتا ہے کہ آپ کا عزیز مشکل میں ہے، فوراً پیسے بھیجیں۔",
    audioScriptEn:
      "If anyone claims a loved one is in hospital or trouble and needs money, always hang up and call their regular saved number directly.",
    audioScriptUr:
      "اگر کوئی کال کر کے کہے کہ آپ کا کوئی عزیز حادثے یا مشکل میں ہے، تو گھبرائیں نہیں۔ فون کاٹ کر اپنے عزیز کے پرانے محفوظ نمبر پر رابطہ کریں۔",
    typicalSignals: ["Severe emotional panic", "Urgent money transfer", "Voice sounds distorted"],
    typicalSignalsUr: ["جذباتی خوف اور گھبراہٹ", "فوری رقم ٹرانسفر کا مطالبہ", "غیر معمولی کال"],
  },
];
