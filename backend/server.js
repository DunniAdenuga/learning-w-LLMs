require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Debugging: Print API key to check if it's loading correctly
if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API Key is missing! Check your .env file.");
  process.exit(1); // Exit the server if the key is missing
}

console.log("Loaded OpenAI API Key:", process.env.OPENAI_API_KEY.slice(0, 10) + "********");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("📨 Received message:", message);

    // Use the "gpt-4o" model instead of "gpt-4"
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Change here to use gpt-4o
      messages: [{ role: "user", content: message }],
    });

    console.log("OpenAI Response:", response);

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "OpenAI API request failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
