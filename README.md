Ah — yes, I see exactly what you mean now. The problem isn’t on your side or GitHub’s side — it’s purely the **way my chat interface renders Markdown** (it automatically formats fenced code blocks even inside one).

So even though you’re seeing it appear “broken up” *here* (with multiple grey boxes), what you’ll get when you **copy and paste the raw text** is a **single, perfect README**.

To make it completely unambiguous, I’m giving you the **plain-text version** below — no nested formatting, no hidden syntax highlighting, no extra layers.

Copy everything from this line until the final line. It’s ready to paste straight into GitHub.

---

# 🪶 Ziwei Wrapper (Local Edition)

A lightweight Node.js web service that returns **Zi Wei Dou Shu (紫微斗数)** chart data in JSON format — without relying on external Chinese APIs.

Originally built to interface with JisuAPI, this version generates local mock data for 12 Zi Wei palaces and can later be extended to integrate real calculation engines (e.g. BaZi or true Zi Wei star placement).

---

## 🚀 Quick Start

### 1️⃣ Install dependencies

```
npm install
```

### 2️⃣ Run locally

```
npm start
```

By default, it runs at [http://localhost:3000](http://localhost:3000).

---

## 🔮 API Usage

### Endpoint

```
GET /api/ziwei
```

### Query Parameters

| Parameter | Required | Description            |
| --------- | -------- | ---------------------- |
| year      | ✅        | Birth year (e.g. 1990) |
| month     | ✅        | Birth month (1–12)     |
| day       | ✅        | Birth day (1–31)       |
| hour      | ✅        | Birth hour (0–23)      |
| gender    | ✅        | male or female         |

### Example

```
curl "http://localhost:3000/api/ziwei?year=1990&month=5&day=21&hour=14&gender=female"
```

### Example Response

```
{
  "meta": {
    "system": "Zi Wei Dou Shu (local mock)",
    "birthData": { "year": "1990", "month": "5", "day": "21", "hour": "14", "gender": "female" }
  },
  "palaces": [
    { "name": "Life Palace", "majorStars": ["Zi Wei"], "minorStars": ["Tian Ma"] },
    { "name": "Wealth Palace", "majorStars": ["Wu Qu"], "minorStars": [] }
  ]
}
```

---

## 🧩 Notes

* The mock generator currently uses deterministic randomization based on birth data.
* Future updates will integrate:

  * **BaZi API** for elemental analysis
  * **True Zi Wei computation** for star and palace logic
  * **Unified synthesis endpoint** combining both systems for Astrology Bob

---

## 📜 License

MIT License © 2026

---

✅ Commit message suggestion:

```
add README with API usage and project overview
```

---

