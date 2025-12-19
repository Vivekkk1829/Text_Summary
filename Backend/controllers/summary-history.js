const Summary = require("../models/Summary.js");

const getSummaryHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const summaries = await Summary.find({ userId })
      .sort({ createdAt: -1 }) 
      .limit(20) 
      .select("summary strategy chunks createdAt");

    return res.json({
      success: true,
      count: summaries.length,
      summaries,
    });
  } catch (error) {
    console.error("History Fetch Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch summary history",
    });
  }
};

module.exports = { getSummaryHistory };