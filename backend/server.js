require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("js-yaml");
const stagesConfig = require("./stages");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Load OpenAPI spec
const openapiSpec = yaml.load(fs.readFileSync("./openapi.yaml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API Key is missing! Check your .env file.");
  process.exit(1);
}

console.log("Loaded OpenAI API Key:", process.env.OPENAI_API_KEY.slice(0, 10) + "********");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to determine learner's stage
const analyzeStage = async (message) => {
  const systemPrompt = {
    role: "system",
    content: `Based on the following message, determine the learner's stage in their understanding of time complexity. Return just the stage name (e.g., 'stage1') or 'neutral' if it's not related to learning. Message: "${message}"`,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [systemPrompt],
  });

  const stage = response.choices[0].message.content.trim();
  return stage || "neutral";
};

// Handle chat
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("User sent:", message);

    // Check for greetings first
    const greetings = ["hi", "hello", "hey", "howdy", "greetings"];
    if (greetings.includes(message.toLowerCase())) {
      return res.json({ reply: "Hey! I'm a time complexity tutor. How can I help you?" });
    }

    const learnerStage = await analyzeStage(message);
    let responseMessage = "";

    const userPrompt = { role: "user", content: message };

    if (learnerStage !== "neutral" && stagesConfig.stages[learnerStage]) {
      const stageData = stagesConfig.stages[learnerStage];

      const stagePrompt = {
        role: "system",
        content: `The learner is at ${stageData.name}. Their current knowledge is: ${stageData.description}. Suggested question: ${stageData.prompts[0]}`,
      };

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [stagePrompt, userPrompt],
      });

      responseMessage = response.choices[0].message.content;
    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [userPrompt],
      });

      responseMessage = response.choices[0].message.content;
    }

    console.log("Reply:", responseMessage);
    res.json({ reply: responseMessage });

  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
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
