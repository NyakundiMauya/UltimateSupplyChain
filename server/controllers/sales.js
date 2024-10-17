import OverallStat from "../models/OverallStat.js";

export const getSales = async (req, res) => {
  try {
    const overallStats = await OverallStat.find();
    
    // Ensure there is at least one stat to return
    if (overallStats.length === 0) {
      return res.status(404).json({ message: "No sales data found." });
    }

    res.status(200).json(overallStats[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

