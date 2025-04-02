require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("js-yaml");
const stagesConfig = require("./stages");
const conversations = {}; // Store conversation history

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Load OpenAPI spec
const openapiSpec = yaml.load(fs.readFileSync("./openapi.yaml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Check if API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API Key is missing! Check your .env file.");
  process.exit(1);
}

console.log("Loaded OpenAI API Key:", process.env.OPENAI_API_KEY.slice(0, 10) + "********");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to analyze message and determine stage
const analyzeStage = async (message) => {
  const prompt = {
    role: "system",
    content: `Based on the following message, determine the learner's stage in their understanding of time complexity. Return just the stage name (e.g., 'stage1') or 'neutral' if it's not related to learning. Message: "${message}"`,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [prompt],
  });

  const stage = response.choices[0].message.content.trim();
  return stage || "neutral";
};

// Start conversation flow
app.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || !userId) {
      return res.status(400).json({ error: "Message and userId are required" });
    }

    console.log(`User ${userId} sent:`, message);

    // Initialize user conversation history if not exists
    if (!conversations[userId]) {
      conversations[userId] = [];
    }

    // Store latest 10 messages
    if (conversations[userId].length >= 10) {
      conversations[userId].shift(); // Remove oldest message
    }
    conversations[userId].push({ role: "user", content: message });

    // Analyze if message requires stage assessment
    const learnerStage = await analyzeStage(message);
    
    let responseMessage = "";
    if (learnerStage !== "neutral" && stagesConfig.stages[learnerStage]) {
      const stageData = stagesConfig.stages[learnerStage];

      const stagePrompt = {
        role: "system",
        content: `The learner is at ${stageData.name}. Their current knowledge is: ${stageData.description}. Suggested question: ${stageData.prompts[0]}`,
      };

      conversations[userId].push(stagePrompt); // Add context

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: conversations[userId],
      });

      responseMessage = response.choices[0].message.content;
    } else {
      // Regular chat if no stage assessment needed
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: conversations[userId],
      });

      responseMessage = response.choices[0].message.content;
    }

    // Store assistant response in memory
    conversations[userId].push({ role: "assistant", content: responseMessage });

    console.log(`Reply to ${userId}:`, responseMessage);
    res.json({ reply: responseMessage });

  } catch (error) {
    console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "OpenAI API request failed. Check logs for details." });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
