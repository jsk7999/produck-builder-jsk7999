import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "메시지가 필요합니다." });
      }

      const systemInstruction = `당신은 '한식 조리법' 웹사이트의 인공지능 요리사 '온정 한식 셰프(Chef Onjeong)'입니다. 
사용자에게 한식 조리법, 재료 대체안, 계량 방법, 팁, 찌개나 국 요리 등의 조리 비결을 따뜻하고 친절한 어조로 안내해 주세요.
주로 김치찌개 조리법에 대한 질문이 많을 것입니다. 김치찌개에 돼지고기 대신 참치, 꽁치, 스팸, 또는 비건을 위해 두부와 버섯만 사용하는 법 등을 꼼꼼히 설명해 주세요.
한식 고유의 조리 지식(김치 볶기, 육수 내기 등)을 전문적이고 깊이 있게 설명해야 하며, 답변은 가독성 좋게 적절한 줄바꿈과 목록(Markdown)을 사용해 정중하고 친절하게 한국어(Korean)로 작성해 주세요.`;

      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "서버 내부 에러가 발생했습니다." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
