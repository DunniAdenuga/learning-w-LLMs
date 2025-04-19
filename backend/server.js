require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("js-yaml");
const systemPrompt = require("./prompts/systemPrompt");
const app = express();

// In-memory conversation history store
const conversationHistory = {};

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Load OpenAPI spec
const openapiSpec = yaml.load(fs.readFileSync("./openapi.yaml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API Key is missing. Check .env file.");
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat Handling
app.post("/chat", async (req, res) => {
  try {
    const { message, stage = 1, sessionId = "default" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Keep track of user messages
    console.log("User sent:", message);
    console.log("User stage:", stage);
    console.log("Session ID:", sessionId);

    // Initialize conversation if not present
    if (!conversationHistory[sessionId]) {
      const promptMessage = systemPrompt(message, stage);
      conversationHistory[sessionId] = [{ role: "system", content: promptMessage.content }];
    }

    // Add user message to history
    conversationHistory[sessionId].push({ role: "user", content: message });

    // Make the API call with full conversation history
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversationHistory[sessionId],
    });

    const responseMessage = response.choices[0].message.content.trim();

    // Add assistant reply to history
    conversationHistory[sessionId].push({ role: "assistant", content: responseMessage });   
    res.json({ reply: responseMessage });

  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "OpenAI API request failed. Check logs for details." });
  }
});

// Server is fully running
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Return if the server runs correctly
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API Docs at http://localhost:${PORT}/api-docs`);
});
