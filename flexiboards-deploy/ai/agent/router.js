// backend/ai/agent/router.js
import express from "express";
import { aiAssistant } from "./llm.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const result = await aiAssistant(message);
    res.json(result);
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI assistant failed" });
  }
});

export default router;

