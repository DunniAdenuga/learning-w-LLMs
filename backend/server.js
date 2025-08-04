require("dotenv").config({ path: __dirname + "/.env" });
console.log("Loaded API Key:", process.env.OPENAI_API_KEY);

const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("js-yaml");
const mongoose = require("mongoose");

const systemPrompt = require("./prompts/systemPrompt");
const StudySession = require("./models/StudySession");
const ChatLog = require("./models/ChatLog");
const sessionRoutes = require('./routes/sessionRoutes');


const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use("/session", sessionRoutes);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ai_edu_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// Load OpenAPI spec
const openapiSpec = yaml.load(fs.readFileSync(__dirname + "/openapi.yaml", "utf8"));
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

    // Log request
    console.log("User sent:", message);
    console.log("User stage:", stage);
    console.log("Session ID:", sessionId);

    // Find or create StudySession
    let session = await StudySession.findOne({ _id: sessionId });
    if (!session) {
      session = new StudySession({ _id: sessionId });
      await session.save();
    }

    // Save user message
 const userLog = new ChatLog({
  sessionId: session._id,
  message,
  isUser: true,
  type: "text",
  topic: "Algebra",
  stage,
  aiModel: "gpt-4o-mini"
});
await userLog.save();


    // Load previous chat history from database
    const history = await ChatLog.find({ sessionId: session._id }).sort("timestamp");

    // Format messages for OpenAI API
    const messages = [{ role: "system", content: systemPrompt(message, stage).content }];
    history.forEach(entry => {
      messages.push({
        role: entry.isUser ? "user" : "assistant",
        content: entry.message
      });
    });

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = response.choices[0].message.content.trim();

    // Save assistant reply
    const assistantLog = new ChatLog({
      sessionId: session._id,
      message: reply,
      isUser: false,
    });
    await assistantLog.save();

    res.json({ reply });

  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "OpenAI API request failed. Check logs for details." });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API Docs at http://localhost:${PORT}/api-docs`);
});
