const catalog = [
  { id: 'numi', type: 'INTELLIGENT TOILET', name: 'Numi 2.0', price: 8500, styles: ['Minimalist Modern'], water: 4200, minArea: 48, size: [1.6, 2.5], position: [0.12, 0.12], detail: 'Dual-flush · ambient light' },
  { id: 'eir', type: 'INTELLIGENT TOILET', name: 'Eir Smart Toilet', price: 5200, styles: ['Japanese Zen', 'Minimalist Modern'], water: 3900, minArea: 38, size: [1.55, 2.35], position: [0.12, 0.12], detail: 'Water-saving · heated seat' },
  { id: 'memoirs', type: 'INTELLIGENT TOILET', name: 'Memoirs Comfort', price: 3100, styles: ['Classic Luxury'], water: 3100, minArea: 34, size: [1.65, 2.45], position: [0.12, 0.12], detail: 'Dual flush · skirted design' },
  { id: 'anthems', type: 'VANITY', name: 'Anthem 36” Vanity', price: 3150, styles: ['Minimalist Modern'], water: 0, minArea: 45, size: [3, 1.8], position: [0.53, 0.08], detail: 'White oak · integrated storage' },
  { id: 'kallista', type: 'VANITY', name: 'Tresham Vanity', price: 2700, styles: ['Classic Luxury'], water: 0, minArea: 38, size: [3.3, 1.85], position: [0.5, 0.08], detail: 'Walnut · Carrara-inspired top' },
  { id: 'tailored', type: 'VANITY', name: 'Tailored 30” Vanity', price: 1950, styles: ['Japanese Zen'], water: 0, minArea: 32, size: [2.5, 1.75], position: [0.56, 0.08], detail: 'Natural oak · quiet-close drawers' },
  { id: 'statement', type: 'SHOWER SYSTEM', name: 'Statement VES', price: 2400, styles: ['Minimalist Modern', 'Japanese Zen'], water: 1800, minArea: 42, size: [2.7, 2.7], position: [0.55, 0.54], detail: 'Katalyst air-induction technology' },
  { id: 'artifacts', type: 'SHOWER SYSTEM', name: 'Artifacts Shower', price: 2050, styles: ['Classic Luxury'], water: 1500, minArea: 42, size: [2.65, 2.65], position: [0.55, 0.54], detail: 'MasterShower low-flow system' },
  { id: 'purist', type: 'FAUCET', name: 'Purist Widespread Faucet', price: 650, styles: ['Japanese Zen', 'Minimalist Modern'], water: 700, minArea: 0, size: null, position: null, detail: '1.2 GPM low-flow aerator' },
  { id: 'components', type: 'FAUCET', name: 'Components Faucet', price: 850, styles: ['Classic Luxury'], water: 650, minArea: 0, size: null, position: null, detail: '1.2 GPM water-saving aerator' }
].map(item => ({ ...item, price: item.price * 87 }));
const themes = { 'Minimalist Modern': ['A quiet, modern retreat', 'THE ESSENTIAL INTELLIGENCE SUITE', 'Matte black · soft white · oak'], 'Japanese Zen': ['A restorative, grounded retreat', 'THE STILLNESS SUITE', 'Warm oak · brushed brass · stone'], 'Classic Luxury': ['A timeless, tailored retreat', 'THE HERITAGE SUITE', 'Polished nickel · walnut · ivory'] };
let currentTheme = 'Minimalist Modern';
const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
function best(items, budget, area) { return items.filter(x => x.styles.includes(currentTheme) && x.minArea <= area).sort((a,b) => (b.water/a.price)-(a.water/b.price)).find(x=>x.price<=budget); }
function generate(triggerType = 'init') {
  document.body.setAttribute('data-theme', currentTheme);
  const width = +document.querySelector('#width').value || 8, length = +document.querySelector('#length').value || 10;
  const budget = +document.querySelector('#budget').value, area = width * length, eco = document.querySelector('#sustainability').checked;
  const groups = ['INTELLIGENT TOILET','VANITY','SHOWER SYSTEM','FAUCET']; let remaining = budget;
  const chosen = groups.map(type => { const matches = catalog.filter(x=>x.type===type && x.styles.includes(currentTheme) && x.minArea<=area && x.price<=remaining); const candidate = matches.sort((a,b)=>eco ? (b.water-b.price/1000)-(a.water-a.price/1000) : b.price-a.price)[0]; if(candidate) remaining-=candidate.price; return candidate; }).filter(Boolean);
  if (chosen.length < 3) { const fallback = catalog.filter(x=>x.styles.includes(currentTheme)&&x.minArea<=area).sort((a,b)=>a.price-b.price); remaining=budget; chosen.length=0; fallback.forEach(x=>{if(!chosen.some(p=>p.type===x.type)&&x.price<=remaining){chosen.push(x);remaining-=x.price;}}); }
  const total = chosen.reduce((s,x)=>s+x.price,0), saved = chosen.reduce((s,x)=>s+x.water,0);
  const [title,bundle,mood] = themes[currentTheme]; document.querySelector('#concept-title').textContent=title; document.querySelector('#bundle-name').textContent=bundle.replace('THE ','').split(' ').map(x=>x[0]+x.slice(1).toLowerCase()).join(' '); document.querySelector('#mood-title').innerHTML=currentTheme.replace(' ','<br />').toUpperCase(); document.querySelector('#mood-subtitle').textContent=mood; document.querySelector('#area-label').textContent=`${area.toFixed(0)} SQ FT`;
  const room=document.querySelector('#room'); const max=250, scale=Math.min(max/width,max/length); room.style.width=`${width*scale}px`;room.style.height=`${length*scale}px`;room.querySelectorAll('.fixture').forEach(e=>e.remove());
  chosen.filter(x=>x.size).forEach(x=>{const el=document.createElement('div');el.className=`fixture ${x.type.includes('TOILET')?'toilet':x.type==='VANITY'?'vanity':'shower'}`;el.textContent=x.name.split(' ')[0];el.style.width=`${x.size[0]*scale}px`;el.style.height=`${x.size[1]*scale}px`;el.style.left=`${x.position[0]*width*scale}px`;el.style.top=`${x.position[1]*length*scale}px`;room.appendChild(el);});
  const list=document.querySelector('#products');list.innerHTML='';const t=document.querySelector('#product-template');chosen.forEach(x=>{const node=t.content.cloneNode(true);node.querySelector('.product-type').textContent=x.type;node.querySelector('.product-name').textContent=x.name;node.querySelector('.product-detail').textContent=x.detail;node.querySelector('.product-price').textContent=money(x.price);list.appendChild(node);});
  window.designSummary=`Kohler Atelier: ${currentTheme}, ${width} x ${length} ft, ${money(total)} collection, ${saved.toLocaleString()} gallons/year saved.`;
  
  // Apply Plugins
  
  // 1. Vanilla Tilt for 3D card interactions
  document.querySelectorAll(".layout-card, .mood-card").forEach(el => { if (el.vanillaTilt) el.vanillaTilt.destroy(); });
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".layout-card, .mood-card"), { max: 5, speed: 400, glare: true, "max-glare": 0.15 });
    VanillaTilt.init(document.querySelectorAll(".product"), { max: 3, speed: 400, glare: true, "max-glare": 0.1 });
  }

  // 2. GSAP for dynamic entry animations
  if (typeof gsap !== 'undefined') {
    if (triggerType === 'submit') {
      gsap.fromTo('.layout-card, .mood-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)' });
      gsap.fromTo('.impact', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.4 });
    }
    gsap.fromTo('.product', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out', clearProps: 'all' });
    
    const totalEl = document.querySelector('#total');
    const waterEl = document.querySelector('#water-saved');
    const curTotal = parseFloat(totalEl.textContent.replace(/[^0-9.-]+/g,"")) || 0;
    const curWater = parseFloat(waterEl.textContent.replace(/[^0-9.-]+/g,"")) || 0;
    
    gsap.to({t: curTotal, w: curWater}, {
      t: total, w: saved, duration: 0.8, ease: 'power2.out',
      onUpdate: function() {
        totalEl.textContent = money(this.targets()[0].t);
        waterEl.textContent = Math.round(this.targets()[0].w).toLocaleString() + ' gal';
      }
    });
  } else {
    document.querySelector('#total').textContent=money(total);
    document.querySelector('#water-saved').textContent=`${saved.toLocaleString()} gal`;
  }

  // 3. Canvas Confetti on explicit user generation
  if (triggerType === 'submit' && typeof confetti !== 'undefined') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#d9ee6d', '#243d38', '#17211f'],
      disableForReducedMotion: true
    });
  }
}
document.querySelector('#budget').addEventListener('input',e=>{document.querySelector('#budget-value').textContent=money(+e.target.value);});
document.querySelector('#budget').addEventListener('change',()=>generate('slider'));
document.querySelector('#width').addEventListener('input',()=>generate('slider'));
document.querySelector('#length').addEventListener('input',()=>generate('slider'));
document.querySelector('#sustainability').addEventListener('change',()=>generate('slider'));

document.querySelectorAll('.theme').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.theme.selected').classList.remove('selected');button.classList.add('selected');currentTheme=button.dataset.theme;generate('submit');}));
document.querySelector('#design-form').addEventListener('submit',e=>{e.preventDefault();generate('submit');});
document.querySelector('#share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(window.designSummary);document.querySelector('#share').textContent='✓';setTimeout(()=>document.querySelector('#share').textContent='↗',1200)}catch{}});
const keywordTheme = text => /zen|calm|spa|timber|wood|brass|wabi/i.test(text) ? 'Japanese Zen' : /classic|heritage|marble|ornate|walnut|nickel/i.test(text) ? 'Classic Luxury' : 'Minimalist Modern';
document.querySelector('#style-scan').addEventListener('click', async () => {
  const input = document.querySelector('#style-description').value.trim(), status = document.querySelector('#ai-status'), button = document.querySelector('#style-scan');
  if (!input) { status.textContent = 'Add a few words about the atmosphere you want.'; return; }
  button.disabled = true; status.textContent = 'Loading the open model for a private, in-browser read…';
  try {
    const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.0.1');
    const classify = await pipeline('zero-shot-classification');
    const result = await classify(input, ['Minimalist Modern', 'Japanese Zen', 'Classic Luxury']);
    currentTheme = result.labels[0];
    status.textContent = `AI read: ${currentTheme} (${Math.round(result.scores[0] * 100)}% confidence)`;
  } catch (error) {
    currentTheme = keywordTheme(input);
    status.textContent = `Style read locally: ${currentTheme}. AI download can be retried when online.`;
  }
  document.querySelectorAll('.theme').forEach(el => el.classList.toggle('selected', el.dataset.theme === currentTheme));
  button.disabled = false; generate('submit');
});
generate();
