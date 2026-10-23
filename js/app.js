/* ==========================================================================
   Goulash.tech Pets — главный модуль
   ========================================================================== */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { initLedCanvases, initSign } from './led.js';
import { initWorkshop } from './workshop.js';
import { initEkbMap } from './ekb-map.js';
import { initStock } from './stock.js';
import { initPeak } from './peak.js';
import { EVENTS, nextEventDate } from './events.js';
import { initFilm } from './film.js';
import { initCRM } from './crm.js';
import { initForm } from './form.js';
import { initRevenue } from './revenue.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rub = n => `${Math.round(n).toLocaleString('ru-RU')} ₽`;
const pad = n => String(n).padStart(2, '0');
const plural = (n, [one, few, many]) => {
	const a = Math.abs(n) % 100, b = a % 10;
	if (a > 10 && a < 20) return many;
	if (b > 1 && b < 5) return few;
	if (b === 1) return one;
	return many;
};

// Lenis
const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Toast
const toaster = $('[data-toaster]');
let toastTimer;
function toast(text) {
	if (!toaster) return;
	toaster.textContent = text;
	toaster.classList.add('is-shown');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toaster.classList.remove('is-shown'), 2800);
}

// Шапка
(()=>{
	const header=$('[data-header]'),burger=$('[data-burger]');
	if(!header||!burger)return;
	const close=()=>{header.classList.remove('is-open');burger.setAttribute('aria-expanded','false');};
	burger.addEventListener('click',()=>{const o=!header.classList.contains('is-open');header.classList.toggle('is-open',o);burger.setAttribute('aria-expanded',String(o));});
	$$('.nav a').forEach(a=>a.addEventListener('click',close));
	const onScroll=()=>header.classList.toggle('is-stuck',window.scrollY>8);
	window.addEventListener('scroll',onScroll,{passive:true});
	onScroll();
	document.addEventListener('keydown',e=>e.key==='Escape'&&close());
})();

// Sticky CTA
(()=>{
	const cta=$('[data-sticky-cta]');
	if(!cta)return;
	const obs=new IntersectionObserver(entries=>cta.classList.toggle('is-shown',!entries.some(e=>e.isIntersecting)),{threshold:0});
	const hero=$('section.hero');
	if(hero)obs.observe(hero);
})();

// LED знак (спрайты + гомография)
initLedCanvases();
initSign();

// CTA context
(()=>{
	const fc=$('[data-form-context]'),ct=$('[data-form-context-text]'),cl=$('[data-form-context-close]');
	$$('[data-cta-context]').forEach(el=>el.addEventListener('click',()=>{
		const msg=el.dataset.ctaContext;
		if(!msg||!fc||!ct)return;
		ct.textContent=msg;fc.removeAttribute('hidden');
	}));
	cl?.addEventListener('click',()=>fc?.setAttribute('hidden',''));
})();

// FAQ
(()=>{
	$$('[data-faq] .faq__item').forEach(item=>{
		const btn=item.querySelector('.faq__q'),ans=item.querySelector('.faq__a');
		if(!btn||!ans)return;
		btn.addEventListener('click',()=>btn.setAttribute('aria-expanded',String(btn.getAttribute('aria-expanded')!=='true')));
	});
})();

// Hero KPI ticker
(()=>{
	const ORDERS=[
		{num:1842,product:'Корм для кошек · 2 кг',status:'Курьер в пути'},
		{num:1843,product:'Корм для собак · 12 кг',status:'Собирается'},
		{num:1844,product:'Наполнитель · 10 л',status:'Выдан курьеру'},
		{num:1845,product:'Лакомства · 200 г',status:'Принят'},
	];
	let idx=0;
	const numEl=$('[data-hero-num]'),productEl=$('[data-hero-product]'),statusEl=$('[data-hero-status]');
	const fillEl=$('[data-hero-fill]'),kpiActive=$('[data-kpi="active"]'),kpiDone=$('[data-kpi="done"]');
	function upd(){
		const o=ORDERS[idx%ORDERS.length];
		if(numEl)numEl.textContent=o.num;
		if(productEl)productEl.textContent=o.product;
		if(statusEl)statusEl.textContent=o.status;
		if(fillEl)fillEl.style.width=`${30+(idx%4)*18}%`;
		if(kpiActive)kpiActive.textContent=12-(idx%3);
		if(kpiDone)kpiDone.textContent=38+idx;
		idx++;
	}
	upd(); setInterval(upd,3000);
})();

// Seasonal scenarios and delivery-film chapters.
(() => {
    const list = $('[data-peakstrip]');
    if (!list) return;
    const now = new Date();
    const events = EVENTS.map(event => ({ ...event, date: nextEventDate(event, now) }))
        .sort((a, b) => a.date - b.date);
    list.innerHTML = events.map((event, i) => {
        const days = Math.ceil((event.date - now) / 86400000);
        const date = event.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
        return `<li class="peakstrip__item${i === 0 ? ' is-next' : ''}"><span class="peakstrip__num pixel">${days}</span><span class="peakstrip__label">${plural(days, ['день', 'дня', 'дней'])} до ${date}<small>${event.label}</small></span></li>`;
    }).join('');
})();
initFilm(document.querySelector('[data-film]'));

// Пиковые дни
(()=>{ const c=document.querySelector('#peak'); if(c)initPeak(c); })();
initRevenue(document.querySelector('[data-revenue]'));

// CRM
(()=>{ const c=document.querySelector('#occasions'); if(c)initCRM(c,toast); })();

// Форма
(()=>{ initForm(document.querySelector('[data-connect-form]')); })();

// Demo tabs — переключение вкладок кабинета (только внутри #demo)
(()=>{
	const demoSection=document.getElementById('demo');
	if(!demoSection)return;
	// Берём только табы внутри demo-секции
	const tabs=$$('.demo-tab[data-tab]',demoSection);
	// Берём только панели внутри demo-секции
	const panels=$$('.demo-panel[id^="tab-"]',demoSection);
	if(!tabs.length)return;
	let activeMap=false,activeStock=false;

	function switchTab(id){
		tabs.forEach(t=>{ t.classList.toggle('is-active',t.dataset.tab===id); t.setAttribute('aria-selected',String(t.dataset.tab===id)); });
		panels.forEach(p=>{ const ok=p.id===`tab-${id}`; p.classList.toggle('is-active',ok); p.hidden=!ok; });
		// ленивая инициализация при первом показе
		const panel=demoSection.querySelector(`#tab-${id}`);
		if(!panel)return;
		if(id==='couriers'&&!activeMap){
			activeMap=true;
			initEkbMap(panel);
		}
		if(id==='stock'&&!activeStock){
			activeStock=true;
			initStock(panel);
		}
	}

	tabs.forEach(tab=>tab.addEventListener('click',()=>switchTab(tab.dataset.tab)));

	// Мастерская — инициализируем сразу
	const workshop=demoSection.querySelector('[data-widget="workshop"]');
	if(workshop)initWorkshop(workshop);
})();
