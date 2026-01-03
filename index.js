// 🪶 Ziwei Wrapper — Local, Jisu-Free Edition
import express from "express";

const app = express();
app.use(express.json());

// 12 Zi Wei palaces in English
const PALACES = [
  "Life Palace",
  "Siblings Palace",
  "Marriage Palace",
  "Children Palace",
  "Wealth Palace",
  "Health Palace",
  "Travel Palace",
  "Friends Palace",
  "Career Palace",
  "Property Palace",
  "Fortune Palace",
  "Parents Palace",
];

// Basic placeholder star data — you can later replace this
// with real calculated results from a Zi Wei or BaZi engine
const STAR_LIBRARY = {
  major: [
    "Zi Wei", "Tian Ji", "Tai Yang", "Wu Qu", "Tian Tong",
    "Lian Zhen", "Tian Fu", "Tai Yin", "Tan Lang", "Ju Men",
    "Tian Xiang", "Tian Liang", "Qi Sha", "Po Jun"
  ],
  minor: [
    "Tian Kui", "Tian Yue", "Zuo Fu", "You Bi", "Wen Chang",
    "Wen Qu", "Huo Xing", "Ling Xing", "Tian Ma"
  ]
};

// Helper to pseudo-randomly assign stars for mock data
function assignStars(seed = 0) {
  const pseudoRandom = (n) => Math.abs(Math.sin(seed + n)) % 1;
  return PALACES.map((name, i) => {
    const major = STAR_LIBRARY.major
      .filter((_, idx) => pseudoRandom(i * 10 + idx) > 0.85);
    const minor = STAR_LIBRARY.minor
      .filter((_, idx) => pseudoRandom(i * 100 + idx) > 0.92);
    return { name, majorStars: major, minorStars: minor };
  });
}

// Main Zi Wei endpoint
app.get("/api/ziwei", (req, res) => {
  try {
    const { year, month, day, hour, gender } = req.query;

    if (!year || !month || !day || hour === undefined || !gender) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // For now we just create a deterministic seed from birth data
    const seed =
      parseInt(year) * 10000 +
      parseInt(month) * 100 +
      parseInt(day) +
      (gender.toLowerCase() === "male" ? 1 : 2) * parseInt(hour);

    const palaces = assignStars(seed);

    res.json({
      meta: {
        system: "Zi Wei Dou Shu (local mock)",
        note: "Replace this logic with true Zi Wei calculations later",
        birthData: { year, month, day, hour, gender },
      },
      palaces,
    });
  } catch (err) {
    console.error("🔥 Error generating Ziwei chart:", err);
    res.status(500).json({ error: "Ziwei chart generation failed." });
  }
});

// Health check
app.get("/", (_, res) =>
  res.send("🪶 Ziwei Dou Shu Wrapper alive — use /api/ziwei?year=YYYY&month=M&day=D&hour=H&gender=male")
);

// Render / local hosting
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✨ Ziwei Wrapper running on port ${PORT}`));
