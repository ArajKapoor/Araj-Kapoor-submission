# Kohler Atelier

A free, local-first Track 1 prototype for the Kohler AI Bathroom Designer & Planner challenge.

## Run it

Open `index.html` in a browser, or serve this folder with any static server. No API key, package installation, or cloud service is needed for the working demo.

## What works

- Converts room dimensions and a budget in Indian rupees into a constrained product bundle.
- Never includes a selected fixture whose minimum-area requirement exceeds the room or whose price exceeds the remaining bundle budget.
- Offers three design languages and a water-conservation preference.
- Draws a scaled 2D top-down layout and shows annual estimated water savings.
- Keeps the recommendation layer deterministic and local so it is stable in a live demo.

The optional AI Style Scan uses Hugging Face Transformers.js and an open zero-shot model directly in the browser. It downloads on first use only and requires no API key. A local keyword fallback keeps the experience usable offline.

`setup_db.py` and `query_db.py` are earlier optional experiments for a future local Ollama + Chroma retrieval layer. The static demo does not depend on them.
