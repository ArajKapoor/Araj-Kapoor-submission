/* ============================================================
   KOHLER ATELIER – Application Logic
   ============================================================ */

// ── Product Catalog ──
// Base prices are real 2026 U.S. retail figures for the actual SKU noted,
// converted to INR at a representative ~87 USD/INR rate (Kohler India list
// pricing differs from this due to import duty and a separate regional
// catalog — see DATA_SOURCES.md for the exact source page and confidence
// level of every field below, including which figures are directly sourced
// vs. reasonably estimated from comparable in-collection products).
//
// Annual water-savings figures are computed, not invented, using:
//   Toilets:  (3.5 GPF pre-1994 baseline − product GPF) × 7,300 flushes/yr
//             (household of 4, 5 flushes/person/day — EPA WaterSense reference usage)
//   Faucets:  (2.2 GPM conventional baseline − product GPM) × 10 min/day × 365
//   Showers:  (2.5 GPM federal-max baseline − product GPM) × 8 min/day × 365
// See DATA_SOURCES.md for the worked calculation per product.
const catalog = [
  { id: 'numi', type: 'INTELLIGENT TOILET', name: 'Numi 2.0', price: 10999, styles: ['Minimalist Modern'], water: 18980, minArea: 48, size: [1.3, 2.2], position: [0.12, 0.12], detail: '0.8/1.0 GPF dual flush · WaterSense certified' },
  { id: 'eir', type: 'INTELLIGENT TOILET', name: 'Eir Smart Toilet', price: 7800, styles: ['Japanese Zen', 'Minimalist Modern'], water: 18980, minArea: 38, size: [1.4, 2.3], position: [0.12, 0.12], detail: '0.8/1.0 GPF dual flush · WaterSense certified' },
  { id: 'memoirs', type: 'INTELLIGENT TOILET', name: 'Memoirs Comfort Height', price: 1050, styles: ['Classic Luxury'], water: 16200, minArea: 34, size: [1.5, 2.3], position: [0.12, 0.12], detail: '1.28 GPF · Comfort Height · WaterSense certified' },
  { id: 'anthems', type: 'VANITY', name: 'Anthem 36" Vanity Cabinet', price: 1400, styles: ['Minimalist Modern'], water: 0, minArea: 45, size: [3.0, 1.75], position: [0.53, 0.08], detail: '36" cabinet · vanity top sold separately' },
  { id: 'kallista', type: 'VANITY', name: 'Tresham 36" Vanity Cabinet', price: 899, styles: ['Classic Luxury'], water: 0, minArea: 38, size: [3.0, 1.8], position: [0.5, 0.08], detail: 'Shaker-style cabinet · vanity top sold separately' },
  { id: 'tailored', type: 'VANITY', name: 'Artifacts 36" Vanity Cabinet', price: 1959, styles: ['Japanese Zen'], water: 0, minArea: 40, size: [3.0, 1.8], position: [0.56, 0.08], detail: 'Light Oak finish · solid-wood dovetail drawers' },
  { id: 'statement', type: 'SHOWER SYSTEM', name: 'Statement VES Shower', price: 1650, styles: ['Minimalist Modern', 'Japanese Zen'], water: 2200, minArea: 42, size: [2.7, 2.7], position: [0.55, 0.54], detail: 'Katalyst air-induction · 1.75 GPM handshower' },
  { id: 'artifacts', type: 'SHOWER SYSTEM', name: 'Artifacts Shower', price: 1950, styles: ['Classic Luxury'], water: 1500, minArea: 42, size: [2.65, 2.65], position: [0.55, 0.54], detail: 'WaterSense certified · \u22642.0 GPM' },
  { id: 'purist', type: 'FAUCET', name: 'Purist Widespread Faucet', price: 880, styles: ['Japanese Zen', 'Minimalist Modern'], water: 3650, minArea: 0, size: null, position: null, detail: '1.2 GPM · WaterSense certified' },
  { id: 'components', type: 'FAUCET', name: 'Components Faucet', price: 747, styles: ['Classic Luxury'], water: 3650, minArea: 0, size: null, position: null, detail: '1.2 GPM · WaterSense certified' }
].map(item => ({ ...item, price: item.price * 87 }));

const themes = {
  'Minimalist Modern': ['A quiet, modern retreat', 'THE ESSENTIAL INTELLIGENCE SUITE', 'Matte black · soft white · oak'],
  'Japanese Zen': ['A restorative, grounded retreat', 'THE STILLNESS SUITE', 'Warm oak · brushed brass · stone'],
  'Classic Luxury': ['A timeless, tailored retreat', 'THE HERITAGE SUITE', 'Polished nickel · walnut · ivory']
};

let currentTheme = 'Minimalist Modern';

const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// ── Particle System ──
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    };
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(80, Math.floor((w * h) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Get accent color from theme
    const style = getComputedStyle(document.documentElement);
    const accentColor = style.getPropertyValue('--accent-1').trim() || '#6366f1';

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.strokeStyle = accentColor;
          ctx.globalAlpha = (1 - dist / 150) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
}

// ── Loader ──
function dismissLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 600);
  }
}

// ── Core generation logic ──
function generate(triggerType = 'init') {
  document.body.setAttribute('data-theme', currentTheme);

  const width = +document.querySelector('#width').value || 8;
  const length = +document.querySelector('#length').value || 10;
  const budget = +document.querySelector('#budget').value;
  const area = width * length;
  const eco = document.querySelector('#sustainability').checked;

  const groups = ['INTELLIGENT TOILET', 'VANITY', 'SHOWER SYSTEM', 'FAUCET'];
  let remaining = budget;

  const chosen = groups.map(type => {
    const matches = catalog.filter(x =>
      x.type === type && x.styles.includes(currentTheme) && x.minArea <= area && x.price <= remaining
    );
    const candidate = matches.sort((a, b) =>
      eco ? (b.water - b.price / 1000) - (a.water - a.price / 1000) : b.price - a.price
    )[0];
    if (candidate) remaining -= candidate.price;
    return candidate;
  }).filter(Boolean);

  // Fallback
  if (chosen.length < 3) {
    const fallback = catalog.filter(x => x.styles.includes(currentTheme) && x.minArea <= area).sort((a, b) => a.price - b.price);
    remaining = budget;
    chosen.length = 0;
    fallback.forEach(x => {
      if (!chosen.some(p => p.type === x.type) && x.price <= remaining) {
        chosen.push(x);
        remaining -= x.price;
      }
    });
  }

  const total = chosen.reduce((s, x) => s + x.price, 0);
  const saved = chosen.reduce((s, x) => s + x.water, 0);

  // Update text
  const [title, bundle, mood] = themes[currentTheme];
  document.querySelector('#concept-title').textContent = title;
  document.querySelector('#bundle-name').textContent = bundle.replace('THE ', '').split(' ').map(x => x[0] + x.slice(1).toLowerCase()).join(' ');
  document.querySelector('#mood-title').innerHTML = currentTheme.replace(' ', '<br />').toUpperCase();
  document.querySelector('#mood-subtitle').textContent = mood;
  document.querySelector('#area-label').textContent = `${area.toFixed(0)} SQ FT`;

  // Render room
  const room = document.querySelector('#room');
  const max = 220;
  const scale = Math.min(max / width, max / length);
  room.style.width = `${width * scale}px`;
  room.style.height = `${length * scale}px`;
  room.querySelectorAll('.fixture').forEach(e => e.remove());

  chosen.filter(x => x.size).forEach((x, i) => {
    const el = document.createElement('div');
    el.className = `fixture ${x.type.includes('TOILET') ? 'toilet' : x.type === 'VANITY' ? 'vanity' : 'shower'}`;
    el.textContent = x.name.split(' ')[0];
    el.style.width = `${x.size[0] * scale}px`;
    el.style.height = `${x.size[1] * scale}px`;
    el.style.left = `${x.position[0] * width * scale}px`;
    el.style.top = `${x.position[1] * length * scale}px`;
    el.style.animationDelay = `${i * 0.1}s`;
    room.appendChild(el);
  });

  // Product cards
  const list = document.querySelector('#products');
  list.innerHTML = '';
  const t = document.querySelector('#product-template');
  const productIcons = ['🚿', '🪞', '🚰', '💧'];
  chosen.forEach((x, i) => {
    const node = t.content.cloneNode(true);
    node.querySelector('.product-type').textContent = x.type;
    node.querySelector('.product-name').textContent = x.name;
    node.querySelector('.product-detail').textContent = x.detail;
    node.querySelector('.product-price').textContent = money(x.price);
    node.querySelector('.product-symbol').textContent = productIcons[i] || '✦';
    list.appendChild(node);
  });

  window.designSummary = `Kohler Atelier: ${currentTheme}, ${width}×${length} ft, ${money(total)} collection, ${saved.toLocaleString()} gallons/year saved.`;

  // ── Plugin Integrations ──

  // 1. Vanilla Tilt for 3D card interactions
  document.querySelectorAll('.layout-card, .mood-card').forEach(el => {
    if (el.vanillaTilt) el.vanillaTilt.destroy();
  });
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.layout-card, .mood-card'), {
      max: 6, speed: 400, glare: true, 'max-glare': 0.12, scale: 1.01
    });
    VanillaTilt.init(document.querySelectorAll('.product.glass-card'), {
      max: 4, speed: 400, glare: true, 'max-glare': 0.08
    });
  }

  // 2. GSAP animations
  if (typeof gsap !== 'undefined') {
    if (triggerType === 'submit') {
      gsap.fromTo('.layout-card, .mood-card',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.3)' }
      );
      gsap.fromTo('.impact-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.5 }
      );
    }

    gsap.fromTo('.product',
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', clearProps: 'all' }
    );

    // Animated counting
    const totalEl = document.querySelector('#total');
    const waterEl = document.querySelector('#water-saved');
    const curTotal = parseFloat(totalEl.textContent.replace(/[^0-9.-]+/g, '')) || 0;
    const curWater = parseFloat(waterEl.textContent.replace(/[^0-9.-]+/g, '')) || 0;

    gsap.to({ t: curTotal, w: curWater }, {
      t: total, w: saved, duration: 0.9, ease: 'power2.out',
      onUpdate: function () {
        totalEl.textContent = money(this.targets()[0].t);
        waterEl.textContent = Math.round(this.targets()[0].w).toLocaleString() + ' gal';
      }
    });
  } else {
    document.querySelector('#total').textContent = money(total);
    document.querySelector('#water-saved').textContent = `${saved.toLocaleString()} gal`;
  }

  // 3. Canvas Confetti on explicit generation
  if (triggerType === 'submit' && typeof confetti !== 'undefined') {
    const style = getComputedStyle(document.documentElement);
    const c1 = style.getPropertyValue('--confetti-1').trim();
    const c2 = style.getPropertyValue('--confetti-2').trim();
    const c3 = style.getPropertyValue('--confetti-3').trim();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.65 },
      colors: [c1, c2, c3],
      disableForReducedMotion: true
    });
  }

  // 4. AI Designer's Note + AI Moodboard — only on explicit user actions,
  // never on slider drags, so the free-tier APIs never get hammered and
  // the page never depends on a network call just to load.
  if (triggerType === 'submit') {
    fetchDesignerNote(currentTheme, chosen, total, saved, budget);
    requestMoodboard(currentTheme, chosen);
  }
}

// ── AI Designer's Note (backend proxy first, then Pollinations, then local) ──

// Set this after deploying backend/worker.js (see backend/README.md).
// Left empty, the app just skips straight to the direct Pollinations call
// below — nothing breaks if the backend isn't deployed yet.
const WORKER_URL = ''; // e.g. 'https://kohler-atelier-backend.YOUR-SUBDOMAIN.workers.dev'

let rationaleController = null;

function localRationale(theme, chosenList, total, saved) {
  const standout = chosenList[0];
  const moodLine = {
    'Minimalist Modern': 'a quiet, considered retreat',
    'Japanese Zen': 'a calm, grounded escape',
    'Classic Luxury': 'a warm, timeless statement'
  }[theme] || 'a considered retreat';
  return `This collection reads as ${moodLine}, anchored by the ${standout ? standout.name : 'featured piece'}. ` +
    `At ${money(total)}, it stays within your budget while saving an estimated ${saved.toLocaleString()} gallons a year — ` +
    `thoughtful design that respects both your space and the planet.`;
}

async function fetchDesignerNote(theme, chosenList, total, saved, budget) {
  const noteEl = document.querySelector('#designer-note-text');
  if (!noteEl || !chosenList.length) return;

  if (rationaleController) rationaleController.abort();
  rationaleController = new AbortController();
  const timeout = setTimeout(() => rationaleController.abort(), 8000);

  const standout = chosenList[0];
  noteEl.classList.add('loading');
  noteEl.textContent = 'Writing your personalized pitch…';

  // 1. Try the backend proxy first — Groq quality, key kept server-side.
  if (WORKER_URL) {
    try {
      const res = await fetch(`${WORKER_URL}/api/rationale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          standoutName: standout.name,
          total: money(total),
          budget: money(budget),
          waterSaved: saved
        }),
        signal: rationaleController.signal
      });
      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          clearTimeout(timeout);
          noteEl.textContent = data.text;
          noteEl.classList.remove('loading');
          return;
        }
      }
    } catch { /* fall through to direct Pollinations call */ }
  }

  // 2. Fall back to calling Pollinations directly from the browser (keyless).
  const prompt = `You are a high-end KOHLER interior designer. Write a warm, confident pitch in 3 short sentences ` +
    `(60 words maximum) for this bathroom design bundle. Theme: ${theme}. Standout product: ${standout.name}. ` +
    `Total price: ${money(total)}, within a budget of ${money(budget)}. Water saved: ${saved.toLocaleString()} gallons per year. ` +
    `Do not mention AI, math, algorithms, or budgets directly. Speak purely as a luxury designer. Output only the pitch text, no preamble or quotation marks.`;

  try {
    const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
      signal: rationaleController.signal
    });
    if (!res.ok) throw new Error('bad response');
    const text = (await res.text()).trim();
    if (!text) throw new Error('empty response');
    noteEl.textContent = text;
  } catch {
    // 3. Both network paths failed — deterministic local fallback, never empty.
    noteEl.textContent = localRationale(theme, chosenList, total, saved);
  } finally {
    clearTimeout(timeout);
    noteEl.classList.remove('loading');
  }
}

// ── AI Moodboard (Pollinations image, no API key) ──

let lastMoodboardCall = 0;
const MOODBOARD_COOLDOWN = 16000; // stays comfortably above the anonymous free-tier limit

function buildMoodboardPrompt(theme, chosenList) {
  const names = chosenList.map(x => x.name).join(', ');
  return `Interior architectural photography of a ${theme} bathroom, featuring ${names}, ` +
    `soft natural lighting, realistic materials and textures, professional real estate photography, high detail, no people, no text, no watermark`;
}

function requestMoodboard(theme, chosenList) {
  const loading = document.querySelector('#moodboard-loading');
  const img = document.querySelector('#moodboard-img');
  if (!loading || !img || !chosenList.length) return;

  const now = Date.now();
  if (now - lastMoodboardCall < MOODBOARD_COOLDOWN) {
    return; // leave whatever is currently shown rather than spamming the free tier
  }
  lastMoodboardCall = now;

  const prompt = buildMoodboardPrompt(theme, chosenList);
  const seed = Math.floor(Math.random() * 100000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=960&height=320&seed=${seed}&nologo=true`;

  loading.hidden = false;
  loading.innerHTML = '<span class="dot"></span> Rendering your space…';
  img.hidden = true;

  const probe = new Image();
  probe.onload = () => {
    img.src = url;
    img.hidden = false;
    loading.hidden = true;
  };
  probe.onerror = () => {
    loading.innerHTML = '<span class="dot"></span> Live preview unavailable right now — showing the mood card above instead.';
  };
  probe.src = url;
}

// ── Event Listeners ──

// Budget slider
const budgetSlider = document.querySelector('#budget');
const budgetOutput = document.querySelector('#budget-value');
budgetSlider.addEventListener('input', e => {
  budgetOutput.textContent = money(+e.target.value);
});
budgetSlider.addEventListener('change', () => generate('slider'));

// Dimension inputs
document.querySelector('#width').addEventListener('input', () => generate('slider'));
document.querySelector('#length').addEventListener('input', () => generate('slider'));

// Sustainability toggle
document.querySelector('#sustainability').addEventListener('change', () => generate('slider'));

// Theme picker
document.querySelectorAll('.theme').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.theme.selected').classList.remove('selected');
    button.classList.add('selected');
    currentTheme = button.dataset.theme;
    generate('submit');
  });
});

// Form submit
document.querySelector('#design-form').addEventListener('submit', e => {
  e.preventDefault();
  generate('submit');
});

// Share button
document.querySelector('#share').addEventListener('click', async () => {
  const btn = document.querySelector('#share');
  try {
    await navigator.clipboard.writeText(window.designSummary);
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    setTimeout(() => {
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>';
    }, 1500);
  } catch { }
});

// AI Style Scan
const keywordTheme = text =>
  /zen|calm|spa|timber|wood|brass|wabi/i.test(text) ? 'Japanese Zen' :
    /classic|heritage|marble|ornate|walnut|nickel/i.test(text) ? 'Classic Luxury' :
      'Minimalist Modern';

document.querySelector('#style-scan').addEventListener('click', async () => {
  const input = document.querySelector('#style-description').value.trim();
  const status = document.querySelector('#ai-status');
  const button = document.querySelector('#style-scan');

  if (!input) {
    status.innerHTML = '<span class="dot"></span> Add a few words about the atmosphere you want.';
    return;
  }

  button.disabled = true;
  status.innerHTML = '<span class="dot"></span> Loading open model for private, in-browser analysis…';

  try {
    const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.0.1');
    const classify = await pipeline('zero-shot-classification');
    const result = await classify(input, ['Minimalist Modern', 'Japanese Zen', 'Classic Luxury']);
    currentTheme = result.labels[0];
    status.innerHTML = `<span class="dot green"></span> AI read: <strong>${currentTheme}</strong> (${Math.round(result.scores[0] * 100)}% confidence)`;
  } catch (error) {
    currentTheme = keywordTheme(input);
    status.innerHTML = `<span class="dot green"></span> Style matched: <strong>${currentTheme}</strong> (local analysis)`;
  }

  document.querySelectorAll('.theme').forEach(el =>
    el.classList.toggle('selected', el.dataset.theme === currentTheme)
  );
  button.disabled = false;
  generate('submit');
});

// ── Photo Style Match (local pixel analysis, no upload, no API) ──

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s, l];
}

// Reads a photo entirely on-device via Canvas pixel sampling: derives a
// circular-mean hue, average saturation/lightness, and the top-3 dominant
// colors (quantized to a coarse RGB grid), then maps that palette to the
// closest Kohler design language. No image data ever leaves the browser.
function analyzePhoto(img) {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const buckets = new Map();
  let sinH = 0, cosH = 0, sumS = 0, sumL = 0, count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);

    const [h, s, l] = rgbToHsl(r, g, b);
    sinH += Math.sin(h * Math.PI / 180);
    cosH += Math.cos(h * Math.PI / 180);
    sumS += s;
    sumL += l;
    count++;
  }

  const avgHue = (Math.atan2(sinH / count, cosH / count) * 180 / Math.PI + 360) % 360;
  const avgSat = sumS / count;
  const avgLight = sumL / count;

  const topColors = [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => `rgb(${key})`);

  // Near-neutral / low-saturation rooms (whites, grays, black, chrome) read as modern.
  // Warm, muted, mid-to-low-light hues (walnut, brass, nickel) read as classic.
  // Earthy warm-green/olive/timber hues read as zen.
  let theme;
  if (avgSat < 0.14) {
    theme = 'Minimalist Modern';
  } else if (avgHue >= 25 && avgHue < 95) {
    theme = 'Japanese Zen';
  } else if (avgHue < 25 || avgHue >= 330) {
    theme = avgLight < 0.6 ? 'Classic Luxury' : 'Minimalist Modern';
  } else {
    theme = 'Minimalist Modern';
  }

  return { theme, topColors };
}

const photoInput = document.querySelector('#photo-input');
const photoDropzone = document.querySelector('#photo-dropzone');
const photoStatus = document.querySelector('#photo-status');

photoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  photoStatus.innerHTML = '<span class="dot"></span> Reading pixels on-device…';

  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const { theme, topColors } = analyzePhoto(img);
      currentTheme = theme;

      photoDropzone.classList.add('has-image');
      photoDropzone.innerHTML = `
        <img class="photo-preview-img" src="${ev.target.result}" alt="Uploaded bathroom photo" />
        <div class="palette-swatches">
          ${topColors.map(c => `<span class="palette-swatch" style="background:${c}"></span>`).join('')}
        </div>
      `;
      photoStatus.innerHTML = `<span class="dot green"></span> Palette read: <strong>${currentTheme}</strong> matched from your photo`;

      document.querySelectorAll('.theme').forEach(el =>
        el.classList.toggle('selected', el.dataset.theme === currentTheme)
      );
      generate('submit');
    };
    img.onerror = () => {
      photoStatus.innerHTML = '<span class="dot"></span> Could not read that image — try another file.';
    };
    img.src = ev.target.result;
  };
  reader.onerror = () => {
    photoStatus.innerHTML = '<span class="dot"></span> Could not read that file.';
  };
  reader.readAsDataURL(file);
});

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  generate();
  dismissLoader();
});
