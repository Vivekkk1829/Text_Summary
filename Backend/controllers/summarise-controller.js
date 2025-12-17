const { GoogleGenAI } = require("@google/genai");

// The new SDK uses a simplified Client-based approach
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const summariseText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "Text is required" });
    }

    // Using Gemini 2.5 Flash for high-speed summarization
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ role: 'user', parts: [{ text: `Summarize this text concisely: ${text}` }] }]
    });

    return res.json({
      success: true,
      summary: response.text
    });

  } catch (error) {
    console.error("Gemini SDK Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Summarization failed. Check if your API key has access to Gemini 2.5/3.0."
    });
  }
};

module.exports = { summariseText };