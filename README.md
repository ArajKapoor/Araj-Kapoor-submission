# Kohler Atelier

A free, local-first Track 1 prototype for the Kohler AI Bathroom Designer & Planner challenge.

The product catalog uses real Kohler product names, specs, and U.S. retail pricing (converted to INR) wherever verifiable — see `DATA_SOURCES.md` for exactly what's directly sourced vs. reasonably estimated, and the worked water-savings calculation.

## Run it

Open `index.html` in a browser, or serve this folder with any static server. No API key, package installation, or cloud service is needed for the working demo.

## What works

- Converts room dimensions and a budget in Indian rupees into a constrained product bundle.
- Never includes a selected fixture whose minimum-area requirement exceeds the room or whose price exceeds the remaining bundle budget.
- Offers three design languages and a water-conservation preference.
- Draws a scaled 2D top-down layout and shows annual estimated water savings.
- Keeps the recommendation layer deterministic and local so it is stable in a live demo.

The optional AI Style Scan uses Hugging Face Transformers.js and an open zero-shot model directly in the browser. It downloads on first use only and requires no API key. A local keyword fallback keeps the experience usable offline.

The optional **Photo Style Match** lets a user snap or upload a photo of their current bathroom (camera capture on mobile). It is read entirely on-device with a Canvas-based color/light analysis — no upload, no model download, no API key — and maps the room's dominant palette to the closest design language. See `PROMPTS.md` §5 for the full workflow and the future VLM upgrade path.

Two more AI features run on generation, both via [Pollinations.ai](https://pollinations.ai)'s keyless free endpoints — genuine LLM/image-gen calls with no API key to manage or hide, so they run straight from this static site:

- **Designer's Note** — a short AI-written pitch for the selected bundle (activates the Presentation prompt from `PROMPTS.md` §4). Falls back to a local template if the request fails or times out.
- **AI Moodboard** — a generated photo of the selected bundle in its theme. Rate-limited client-side to avoid the free tier's cooldown; falls back to a plain-text message if a render fails, while the static Mood card above it always stays up.

Both only fire on an explicit "Generate" action (never on slider drags), so the page never depends on network access just to load. See `PROMPTS.md` §6–7 for the exact prompts and fallback behavior.

## Optional backend

`backend/` contains a small Cloudflare Worker that upgrades the Designer's Note from Pollinations' anonymous model to Groq's free, fast Llama 3.3 70B — with the API key held server-side only, never in the browser or the repo. It's entirely optional: `WORKER_URL` in `app.js` defaults to empty, so without deploying it the app behaves exactly as described above. See `backend/README.md` for the 3-minute deploy path.

`setup_db.py` and `query_db.py` are earlier optional experiments for a future local Ollama + Chroma retrieval layer. The static demo does not depend on them.
## Video Demonstration Link
https://drive.google.com/file/d/1JnwM4SnjUTB8q1_5IHpw4dPN6rJdzUEr/view?usp=sharing
