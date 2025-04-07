require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("js-yaml");
const systemPrompt = require("./prompts/systemPrompt");
const app = express();

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
    const { message, stage = 1 } = req.body; // Stage is passed in the request
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Keep track of user messages
    console.log("User sent:", message);
    console.log("User stage:", stage);

    // Generate the system prompt based on the message and stage
    const promptMessage = systemPrompt(message, stage);

    // Making the OpenAI API call
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: promptMessage.content },
        { role: "user", content: message },
      ],
    });

    const responseMessage = response.choices[0].message.content.trim();
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
