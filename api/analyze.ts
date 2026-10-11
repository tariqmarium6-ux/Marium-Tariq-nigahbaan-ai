import { performAnalysis } from "./_lib/analysisCore";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Please use POST." });
  }

  try {
    const rawBody = req.body;
    const body = typeof rawBody === "string" ? JSON.parse(rawBody) : (rawBody || {});

    if (!body.type) {
      return res.status(400).json({ error: "Input 'type' is required (image, voice, text, or url)." });
    }

    const result = await performAnalysis(body);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Vercel Serverless Function /api/analyze error:", error);
    return res.status(500).json({
      error: "Analysis error",
      message: error?.message || "Internal server error occurred during analysis.",
    });
  }
}
