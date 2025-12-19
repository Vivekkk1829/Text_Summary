const Summary = require("../models/Summary");
const { summariseTextWithGemini } = require("../services/gemini-service.js");
const crypto = require("crypto");

const MAX_CHARS = 3000;
const CHUNK_SIZE = 2000;
const MAX_SUMMARY_WORDS = 120;
const MAX_SUMMARY_CHARS = 800;

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateInputHash(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function chunkText(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

async function summarizeChunkWithRetry(prompt, chunkIndex) {
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      return await summariseTextWithGemini(prompt);
    } catch (err) {
      attempt++;
      if (attempt > MAX_RETRIES) {
        throw new Error(`Chunk ${chunkIndex} failed after retries`);
      }
      await delay(RETRY_DELAY_MS);
    }
  }
}

const summariseText = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    // 1️⃣ Input validation
    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    // 2️⃣ Idempotency
    const inputHash = generateInputHash(text);
    const existingSummary = await Summary.findOne({ userId, inputHash });

    if (existingSummary) {
      return res.json({
        success: true,
        summary: existingSummary.summary,
        cached: true,
      });
    }

    let finalSummary = "";
    let strategy = "single-pass";
    let chunksCount = 1;

    // 3️⃣ Fast path
    if (text.length <= MAX_CHARS) {
      finalSummary = await summariseTextWithGemini(text);
    } 
    // 4️⃣ Chunked summarization
    else {
      strategy = "hierarchical";
      const chunks = chunkText(text, CHUNK_SIZE);
      chunksCount = chunks.length;

      let rollingSummary = "";

      for (let i = 0; i < chunks.length; i++) {
        const prompt = `You are maintaining a running summary.

Rules:
- Maximum ${MAX_SUMMARY_WORDS} words
- Preserve important facts and relationships
- Remove redundancy

Previous summary:
${rollingSummary || "None"}

New text:
${chunks[i]}

Update the summary.`;

        rollingSummary = await summarizeChunkWithRetry(prompt, i);

        if (rollingSummary.length > MAX_SUMMARY_CHARS) {
          rollingSummary = await summariseTextWithGemini(
            `Compress the following summary to under ${MAX_SUMMARY_WORDS} words:\n\n${rollingSummary}`
          );
        }
      }

      finalSummary = rollingSummary;
    }

    // 5️⃣ Store in MongoDB
    const savedSummary = await Summary.create({
      userId,
      inputHash,
      summary: finalSummary,
      strategy,
      chunks: chunksCount,
    });



    return res.json({
      success: true,
      summary: finalSummary,
    });
  } catch (error) {
    console.error("Summarization Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Summarization failed",
    });
  }
};

module.exports = { summariseText };
