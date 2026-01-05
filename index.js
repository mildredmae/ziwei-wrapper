// 🪶 Ziwei Wrapper — Real Zi Wei (iztro-backed)
import express from "express";
import { astro } from "iztro";

const app = express();
app.use(express.json());

/**
 * Convert 0–23 hour to iztro "timeIndex".
 * iztro expects a Chinese hour index; docs show indices tied to the 12 double-hours.
 * We map hour to 12 two-hour blocks starting at 23:00 (Rat hour).
 *
 * hour: 23,0 -> 0 (Rat)
 * hour: 1,2  -> 1 (Ox)
 * ...
 * hour: 21,22 -> 11 (Pig)
 */
function hourToTimeIndex(hour) {
  const h = ((hour % 24) + 24) % 24;
  return Math.floor(((h + 1) % 24) / 2);
}

function requireInt(name, value) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) {
    throw new Error(`${name} must be an integer`);
  }
  return n;
}

function normalizeGender(genderRaw) {
  const g = String(genderRaw || "").trim().toLowerCase();
  if (g !== "male" && g !== "female") {
    throw new Error("gender must be 'male' or 'female'");
  }
  return g;
}

// Main Zi Wei endpoint (real calculation)
app.get("/api/ziwei", (req, res) => {
  try {
    const { year, month, day, hour, gender } = req.query;

    if (!year || !month || !day || hour === undefined || !gender) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const y = requireInt("year", year);
    const m = requireInt("month", month);
    const d = requireInt("day", day);
    const h = requireInt("hour", hour);
    const g = normalizeGender(gender);

    if (m < 1 || m > 12) throw new Error("month must be 1–12");
    if (d < 1 || d > 31) throw new Error("day must be 1–31");
    if (h < 0 || h > 23) throw new Error("hour must be 0–23");

    const solarDate = `${y}-${m}-${d}`;
    const timeIndex = hourToTimeIndex(h);

    // Real Zi Wei Dou Shu astrolabe (solar calendar)
    const astrolabe = astro.astrolabeBySolarDate(solarDate, timeIndex, g);

    // astrolabe.palaces entries contain star objects; we surface only star names
    const palaces = (astrolabe?.palaces || []).map((p) => ({
      name: p?.name ?? "",
      majorStars: Array.isArray(p?.majorStars) ? p.majorStars.map((s) => s?.name).filter(Boolean) : [],
      minorStars: Array.isArray(p?.minorStars) ? p.minorStars.map((s) => s?.name).filter(Boolean) : [],
    }));

    return res.json({
      meta: {
        system: "Zi Wei Dou Shu (iztro)",
        note: "Computed via iztro astrolabeBySolarDate (solar calendar).",
        birthData: {
          year: String(year),
          month: String(month),
          day: String(day),
          hour: String(hour),
          gender: String(gender),
        },
      },
      palaces,
    });
  } catch (err) {
    console.error("🔥 Error generating Ziwei chart:", err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
});

// Health check
app.get("/", (_, res) =>
  res.send("🪶 Ziwei Dou Shu Wrapper alive — use /api/ziwei?year=YYYY&month=M&day=D&hour=H&gender=male")
);

// Render / local hosting
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✨ Ziwei Wrapper running on port ${PORT}`));
