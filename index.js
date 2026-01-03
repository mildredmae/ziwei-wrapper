import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Main endpoint
app.get("/api/ziwei", async (req, res) => {
  try {
    const { year, month, day, hour, gender } = req.query;

    if (!year || !month || !day || hour === undefined || !gender) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const sex = gender.toLowerCase() === "male" ? 1 : 0;

    const url = `https://api.jisuapi.com/ziwei/ziwei?appkey=${process.env.JISU_KEY}&year=${year}&month=${month}&day=${day}&hour=${hour}&sex=${sex}`;

    const response = await fetch(url);
    const data = await response.json();

    // If JisuAPI returned data successfully
    if (data.status === 0 && data.result) {
      const translation = {
        "命宫": "Life Palace",
        "兄弟宫": "Siblings Palace",
        "夫妻宫": "Marriage Palace",
        "子女宫": "Children Palace",
        "财帛宫": "Wealth Palace",
        "疾厄宫": "Health Palace",
        "迁移宫": "Travel Palace",
        "仆役宫": "Friends Palace",
        "官禄宫": "Career Palace",
        "田宅宫": "Property Palace",
        "福德宫": "Fortune Palace",
        "父母宫": "Parents Palace"
      };

      const palaces = (data.result.palaces || []).map(p => ({
        name: translation[p.name] || p.name,
        majorStars: p.major_stars || [],
        minorStars: p.minor_stars || [],
      }));

      return res.json({ palaces });
    }

    res.status(500).json({ error: "Invalid response from JisuAPI", details: data });
  } catch (err) {
    console.error("🔥 Error fetching Ziwei chart:", err);
    res.status(500).json({ error: "Ziwei chart fetch failed." });
  }
});

// Health check route
app.get("/", (_, res) =>
  res.send("🪶 Ziwei Dou Shu Wrapper alive — use /api/ziwei")
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✨ Ziwei Wrapper running on port ${PORT}`));
