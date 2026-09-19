# Kohler Atelier - Prompt and Workflow Documentation

The shipped prototype uses a deterministic local recommendation engine so it can run without an API key. These prompts document the optional open-source AI enhancement path for the submitted architecture.

## 1. Concierge prompt

```text
You are the Kohler Atelier Design Concierge. Collect exactly three inputs: bathroom width and length (or a floor-plan image), maximum budget, and desired design language. Ask for only one missing item at a time. Be concise and never promise a product will fit. When complete, emit TRIGGER_DESIGN_PIPELINE.
```

Suggested local model: Qwen3 8B through Ollama.

## 2. Constraint extraction prompt

```text
You extract bathroom constraints. Return JSON only. Convert metric dimensions to feet. Use 8 feet as ceiling height when missing. Map style language to Minimalist Modern, Japanese Zen, Classic Luxury, or Unspecified. Mark sustainability_focus true only when water efficiency is requested.
```

```json
{"dimensions":{"width_ft":8,"length_ft":10,"ceiling_height_ft":8},"budget":{"max_total_usd":14000,"currency":"USD"},"aesthetics":{"primary_theme":"Minimalist Modern","color_palette_preference":["Matte Black"]},"sustainability_focus":true}
```

Suggested local model: Pixtral 12B or Qwen2.5-VL, served through Ollama, for floor-plan image extraction.

## 3. Deterministic solver workflow

1. Validate numeric dimensions, total area, and budget.
2. Filter the product catalog by theme, minimum footprint, and remaining budget.
3. Select one compatible product per required category. When sustainability is enabled, rank eligible options by annual water saving before price.
4. Create fixture coordinates only after the hard filters pass.
5. Return bundle JSON, total cost, layout coordinates, and annual water-savings estimate.

No LLM is allowed to override fit or budget checks.

## 4. Presentation prompt

```text
Given verified bundle JSON, explain the selected collection in 60 words or fewer. Mention only provided product attributes, total price, and calculated water savings. Do not invent performance claims.
```

Suggested local model: Qwen3 8B through Ollama.

## 5. Photo Style Match (multimodal input, no model, no upload)

This is the "upload a photo of your space" input from the architecture's Layer 1 (multi-modal ingestion). Rather than sending the image to a hosted vision-language model, the shipped prototype implements it as a deterministic, on-device computer-vision routine in `app.js` (`analyzePhoto`):

1. Draw the user's photo to an off-screen 64×64 canvas — this is the only "compression" step and it never touches the network.
2. Convert every sampled pixel to HSL and take the circular mean of hue plus the arithmetic mean of saturation and lightness.
3. Quantize pixels into a coarse RGB grid to surface the top-3 dominant colors as a palette.
4. Map the aggregate hue/saturation/lightness to the closest of the three design languages (low saturation → Minimalist Modern; warm mid-tone hues → Classic Luxury; warm-green/earthy hues → Japanese Zen) and feed that straight into the same deterministic solver used for typed input.

Why not route this through the vision LLM described in Layer 2 of the architecture (GPT-4o / Gemini / Pixtral)? For a real "read this floor plan and extract wall measurements" task, a VLM is the right tool and is the natural next iteration. For "read the *mood* of this room," a lightweight, explainable, zero-cost color-histogram heuristic is more demo-reliable, needs no model download or GPU, and keeps the photo entirely on the user's device — consistent with the project's local-first, no-API-key constraint. It is documented here as a workflow rather than a prompt because no LLM is invoked in this step.

**Future upgrade path:** swap `analyzePhoto`'s mapping step for a call to an in-browser zero-shot image classifier (e.g., a small open-weight CLIP variant via Transformers.js, mirroring the text-based AI Style Scan in section 2) once model size/latency trade-offs are acceptable for a live demo.

## 6. Designer's Note (implemented — Pollinations text, no key)

This activates the Presentation prompt from section 4, which previously existed only as documentation. In `app.js`, `fetchDesignerNote()` fires this prompt at `https://text.pollinations.ai/{encoded_prompt}` — a plain `GET` request with no API key, no signup, and no server-side proxy, so it runs directly from the static GitHub Pages site with nothing to hide:

```text
You are a high-end KOHLER interior designer. Write a warm, confident pitch in 3 short sentences
(60 words maximum) for this bathroom design bundle. Theme: {theme}. Standout product: {standout_name}.
Total price: {total}, within a budget of {budget}. Water saved: {gallons_saved} gallons per year.
Do not mention AI, math, algorithms, or budgets directly. Speak purely as a luxury designer.
Output only the pitch text, no preamble or quotation marks.
```

It only fires on an explicit "Generate" click, theme change, or AI Style Scan / Photo Style Match result — never on slider drags — so it never spams the free tier and the page never depends on network access just to load. If the request fails or times out (8s cap), it falls back to `localRationale()`, a deterministic template built from the same bundle data, so the panel is never empty and never blocks the demo.

## 7. AI Moodboard (implemented — Pollinations image, no key)

This implements the Layer 4 "Generative Output" moodboard idea from the architecture, using the exact prompt-construction pattern from section 4's "moodboard prompt generator." `requestMoodboard()` builds a prompt from the selected product names and theme, then loads `https://image.pollinations.ai/prompt/{encoded_prompt}?width=960&height=320&seed={n}&nologo=true` directly as an image — again, plain `GET`, no key required.

It fires only on explicit "Generate" actions, with a client-side 16-second cooldown between calls (comfortably above the anonymous free tier's rate limit), so double-clicking Generate or flipping through themes quickly never triggers a 429 — it simply leaves the last successful render in place. If the image fails to load, the panel shows a plain-text fallback message rather than a broken image, and the static Mood card above it (section-free, always-on, zero network dependency) remains the guaranteed visual regardless of API health.

## 8. Backend proxy (implemented — Cloudflare Worker, key held server-side)

`backend/worker.js` is a minimal Cloudflare Worker that upgrades the Designer's Note pipeline from Pollinations' anonymous model to Groq's `llama-3.3-70b-versatile` (free tier), while keeping the API key entirely off the client:

- **Secret handling:** `GROQ_API_KEY` is set via `wrangler secret put` (or the dashboard's Secrets UI), never written to `wrangler.toml` or any file in the repo. `backend/.gitignore` also excludes local `.dev.vars`.
- **CORS allowlist:** only `https://arajkapoor.github.io` (plus local dev ports) may call the Worker from a browser; other origins get a 403.
- **Input sanitization:** every field from the client is length-capped and type-coerced before being placed into the LLM prompt, so a malformed request can't inflate the prompt or the model's context.
- **No error leakage:** upstream failures (bad key, rate limit, timeout) never surface their raw detail to the client — the Worker just falls through to the next provider.
- **Full fallback chain:** Groq (server-side, this Worker) → Pollinations (server-side, same Worker, if Groq fails) → Pollinations (client-side direct call, if the Worker itself is unreachable) → a deterministic local template (in `app.js`, if every network path fails). The Designer's Note panel is never empty.
- **Fails open, not closed:** `WORKER_URL` in `app.js` defaults to an empty string. Undeployed, the app behaves exactly as it did before this layer existed — the backend is additive, never a dependency.

See `backend/README.md` for the deploy steps.
