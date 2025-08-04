const express = require('express');
const router = express.Router();
const StudySession = require('../models/StudySession');
const ChatLog = require('../models/ChatLog');
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/summary", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const session = await StudySession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const messages = await ChatLog.find({ sessionId }).sort("timestamp");

    if (messages.length === 0) {
      return res.status(400).json({ error: "No messages found for session" });
    }

    const formattedMessages = messages.map(m => {
      return `${m.isUser ? "User" : "AI"}: ${m.message}`;
    }).join("\n");

    const summaryPrompt = `Summarize the following study session in 2-3 sentences:\n\n${formattedMessages}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an educational assistant that summarizes learning sessions." },
        { role: "user", content: summaryPrompt }
      ]
    });

    const summary = response.choices[0].message.content.trim();

    session.sessionSummary = summary;
    session.endTime = new Date();
    session.isComplete = true;
    await session.save();

    res.json({
      sessionId: session._id,
      summary
    });

  } catch (error) {
    console.error("Summary route error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate session summary" });
  }
});

module.exports = router;
