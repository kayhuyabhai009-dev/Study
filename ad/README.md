# 🎬 STUDY Ad — 30-Second Master Cut (9:16)

**"भटकना बंद. Day 1 शुरू."** — SSC/Railway aspirants के लिए cinematic motion-graphics ad.

## ▶️ Kaise chalayein

1. Repo root mein server chalao: `python3 -m http.server 8000`
2. Browser mein kholo: `http://localhost:8000/ad/`
3. **▶ MASTER CUT देखो** dabao (🔊 sound on rakhna — sound design ad ka aadha emotion hai)

## 📲 Record karke publish kaise karein

| Step | Kya karna hai |
|---|---|
| 1 | Chrome mein `https://<preview>/ad/` kholo → **F12** → device toolbar → custom **1080×1920** set karo |
| 2 | Screen recorder start (Windows: `Win+G` / macOS: QuickTime / OBS) — sirf stage area crop lo |
| 3 | ▶ Play dabao, poora 30s record hone do |
| 4 | Start/end ka cursor/clicks trim kar do (CapCut ya Photos app) |
| 5 | Reels / YT Shorts / WhatsApp Status pe upload 🚀 |

## 🧠 Ad mein use hui psychology (research-backed)

- **0–3s Hook**: loss aversion + identifiable situation ("3 साल से 'कल से' पढ़ूंगा?") — heartbeat SFX se pulse feel
- **3–7s Agitation**: decision-paralysis storm (PDF rain, accelerating tick 60→150bpm feel) — chaos = fast/glitchy pacing
- **7–12s Reframe**: time-freeze → silence-then-riser (frisson trick: payoff riser ke तुरंत baad) → **"PLAN है."** glitch slam + sub-boom
- **12–20s Demo**: Day 1→60 grid cascade (goal-gradient), concept card — tricks/traps/PYQ button
- **20–26s Proof**: filter cascade (chapter→concept→exam→year→shift), question card with **exam·year·shift meta**, counter **37,061** easeOutExpo + landing boom
- **26–30s Resolve**: warm teal-orange grade, "DAY 60 ✔" stamp, **"Selection लॉटरी नहीं. PROCESS है."** → orange pulsing CTA
- Editing rules: pattern interrupt har ~2s (varied), zoom-punch sirf 3 key claims par, captions hamesha on-screen (85% log bina sound dekhte hain), kinetic type = animate fast, HOLD for read-time.

## 🎙️ Assets

| File | Kya hai |
|---|---|
| `assets/vo.mp3` | Female Hindi VO (33.9s, 1.12x pace-matched se effective ~30s) |
| `assets/scene-chaos.jpg` | Act-1 hero visual — 4:58 AM chaos desk (cold teal grade) |
| `assets/scene-transform.jpg` | Act-3 — dawn study, ticked calendar (warm grade) |
| `assets/poster.jpg` | Poster/thumbnail key-art (glowing "60") |

Engine: zero-dependency single file (`index.html`) — WAAPI + Canvas + WebAudio synth SFX (drone/riser/boom/whoosh/heartbeat/sparkle in D-major resolve). Koi external library nahi, bas 2 Google Fonts.

## 🔁 Variations (A/B testing ke liye)

- Hook 1 (current): "3 साल से… 'कल से' पढ़ूंगा?" — procrastination pain
- Hook 2 idea: result-first — poster "60" se open → "60 दिन. बस." 
- Har 7 din mein hook refresh karo (retention data ke hisaab se)
