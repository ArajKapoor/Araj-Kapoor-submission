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
