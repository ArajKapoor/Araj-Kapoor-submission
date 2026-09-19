# Data Sources

The product catalog in `app.js` (10 SKUs, one hardcoded array) uses real
Kohler product names, real specs, and real U.S. retail pricing wherever a
specific figure could be verified — replacing the fully-invented numbers the
prototype shipped with earlier. This file documents exactly what's sourced,
what's estimated, and how, so the answer to "where's this data from" is
never a guess.

**Currency note:** Kohler doesn't publish an Indian retail catalog with
comparable pricing for these exact SKUs, so every price below is the
verified U.S. retail figure converted to INR at a representative ~87
USD/INR rate. Real Kohler India pricing would differ due to import duty and
a separate regional product line — this is disclosed in `app.js` and
`README.md`, not hidden.

## Confidence key
- 🟢 **Sourced** — name, dimensions, flow rate/GPF, and price pulled directly from a live Kohler or authorized-retailer product page for the exact SKU.
- 🟡 **Estimated** — the collection and product line are confirmed real (verified on kohler.com), but the exact price/dimensions are a reasonable figure based on comparable in-collection or comparable-tier products, not a single sourced page.

## Toilets

| Product | Confidence | Source |
|---|---|---|
| Numi 2.0 (K-30754) | 🟢 | 0.8/1.0 GPF dual flush, WaterSense certified, 26.19"L × 15.06"W × 18.5"H. U.S. retail ranges $9,937–$12,999 depending on finish/retailer; $10,999 used as a representative mid-point. |
| Eir Smart Toilet (K-77795) | 🟢 | 0.8/1.0 GPF dual flush, WaterSense, ADA compliant, 27.5"L × 16.5"W × ~21"H. U.S. retail ranges $7,299–$8,399; $7,800 used as representative. |
| Memoirs Comfort Height (K-6428, Classic) | 🟢 | 1.28 GPF, Comfort Height, WaterSense, 27.75"L × 18.25"W × 28.25"H. Sourced list price $1,050 (25%-off showroom price found; other Memoirs configurations run up to ~$1,800). |

## Vanities

| Product | Confidence | Source |
|---|---|---|
| Artifacts 36" Vanity Cabinet (K-33559-WEK, Light Oak) | 🟢 | Real SKU. 35.98"W × 21.89"D × 34.49"H, solid-wood dovetail drawers. Sourced price $1,959 (Light Oak finish; other finishes $1,879). |
| Anthem 36" Vanity Cabinet | 🟡 | "Anthem" confirmed as a current real Kohler bathroom collection (kohler.com navigation). Exact product-page price not pulled; $1,400 is a representative figure based on comparable 36" Kohler vanity cabinets found in the same tier (Seer $1,498, Kresla $1,399, Charlemont $1,599, cabinet-only Artifacts $1,879). |
| Tresham 36" Vanity Cabinet (K-5288) | 🟡 | Real SKU confirmed to exist (Shaker-style, kohler.com product page located), but its exact cabinet-only price wasn't in the pulled page content. $899 is a representative figure based on the Tresham collection's generally lower price tier (its matching vanity top sells for $433–578) compared to the premium Artifacts/Anthem cabinets above. |

Note: the original prototype's "Tailored 30" Vanity" name has been replaced
with the real Artifacts 36" cabinet above. "Tailored" turned out to also be
a genuine Kohler vanity collection name (confirmed via a Damask-collection
product description), but no specific SKU/price for it was pulled, so
Artifacts — fully sourced — was used instead for higher confidence.

## Shower Systems

| Product | Confidence | Source |
|---|---|---|
| Statement VES Shower | 🟡 | "Statement" and its Katalyst air-induction technology are real (multiple real SKUs found: rainheads/handshowers from $150–$800 each with confirmed 1.75–2.5 GPM ratings). Kohler doesn't sell a single "shower system" SKU at one price — a real installation combines a valve, trim, and one or more heads bought separately. $1,650 is an assembled-system estimate from those real component prices, not a single sourced page. |
| Artifacts Shower | 🟡 | "Artifacts" confirmed as a real multi-room Kohler collection including showering components. Same caveat as above: no single "shower system" SKU exists to price directly. $1,950 is an estimate in line with the Artifacts collection's premium tier (its vanity cabinet alone is $1,959). |

## Faucets

| Product | Confidence | Source |
|---|---|---|
| Purist Widespread Faucet | 🟢 | Real SKU family (K-14406/14408/14410). 1.2 GPM, WaterSense certified, ~16"W × 5.5"L. U.S. retail ranges roughly $600–$1,200 by finish; $880 used as representative. |
| Components Faucet | 🟢 | Real SKU family (K-77958/77959). 1.2 GPM, WaterSense certified, ~7"H × 1.88"W × 6.6"L. U.S. retail ranges roughly $550–$950 by finish; $747 used as representative (a sourced single-handle configuration price). |

## Water-savings methodology

The app's "estimated water saved every year" figure is computed per
product, not invented, using published EPA WaterSense reference usage
assumptions:

- **Toilets:** `(3.5 GPF pre-1994 federal baseline − product GPF) × 7,300 flushes/year`, where 7,300 = a household of 4 people × 5 flushes/person/day × 365 days (5 flushes/person/day is a standard WaterSense reference figure).
  - Numi/Eir (0.9 GPF average dual-flush): (3.5 − 0.9) × 7,300 = **18,980 gal/yr**
  - Memoirs (1.28 GPF): (3.5 − 1.28) × 7,300 = **16,206 gal/yr** — this lines up closely with Kohler's own published claim of ~16,500 gal/yr savings for 1.28 GPF toilets vs. a 3.5 GPF baseline, which is a good sanity check on the method.
- **Faucets:** `(2.2 GPM conventional baseline − product GPM) × 10 min/day × 365 days`. At 1.2 GPM: (2.2 − 1.2) × 10 × 365 = **3,650 gal/yr**.
- **Showers:** `(2.5 GPM current U.S. federal max − product GPM) × 8 min/day × 365 days`. Statement at 1.75 GPM: (2.5 − 1.75) × 8 × 365 = **2,190 gal/yr** (rounded to 2,200). Artifacts assumed at the WaterSense shower ceiling of 2.0 GPM: (2.5 − 2.0) × 8 × 365 = **1,460 gal/yr** (rounded to 1,500).

These are reasonable, disclosed household-level estimates for a demo — not
a certified engineering calculation — but every constant in the formula is
a real, citable reference figure rather than a made-up multiplier.
