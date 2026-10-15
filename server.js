import express from "express";
import OpenAI from "openai";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "30kb" }));
app.use("/api/", rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Terlalu banyak permintaan. Coba lagi sebentar." }
}));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  if (!API_KEY) {
    return res.status(503).json({ error: "API belum dikonfigurasi. Tambahkan OPENAI_API_KEY di pengaturan environment server." });
  }

  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return res.status(400).json({ error: "Format percakapan tidak valid." });
  }

  const cleanMessages = [];
  for (const item of messages) {
    if (!item || !["user", "assistant"].includes(item.role) ||
        typeof item.content !== "string" || !item.content.trim() ||
        item.content.length > 12000) {
      return res.status(400).json({ error: "Pesan tidak valid atau terlalu panjang." });
    }
    cleanMessages.push({ role: item.role, content: item.content.trim() });
  }

  try {
    const client = new OpenAI({ apiKey: API_KEY });
    const response = await client.responses.create({
      model: MODEL,
      instructions: "Kamu adalah Nova AI, asisten serbaguna yang ramah. Jawab dalam bahasa yang digunakan pengguna, utamakan bahasa Indonesia bila sesuai. Bantu belajar, menulis, coding, menerjemahkan, dan menjelaskan hal dengan jelas. Jika tidak yakin, katakan dengan jujur.",
      input: cleanMessages.map(m => ({
        role: m.role,
        content: [{ type: "input_text", text: m.content }]
      })),
      max_output_tokens: 1200
    });

    const reply = response.output_text?.trim();
    if (!reply) return res.status(502).json({ error: "Model AI tidak mengembalikan teks. Coba lagi." });
    return res.json({ reply });
  } catch (error) {
    console.error("AI request failed:", error?.status || "", error?.message || "Unknown error");
    if (error?.status === 401) return res.status(502).json({ error: "API key ditolak. Periksa API key di server." });
    if (error?.status === 429) return res.status(429).json({ error: "Kuota atau batas permintaan API habis. Periksa billing dan limit penyedia API." });
    return res.status(502).json({ error: "Layanan AI gagal merespons. Periksa model, koneksi, dan pengaturan API." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Nova AI berjalan di port ${PORT}`);
  console.log(`Model: ${MODEL}`);
  console.log(`API key tersedia: ${Boolean(API_KEY)}`);
});
