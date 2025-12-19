const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function summariseTextWithGemini(text){
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ role: 'user', parts: [{ text: `Summarize this text concisely: ${text}` }] }]
    });

    return response.text;
}

module.exports = { summariseTextWithGemini };