import { EVENTS, nextEventDate } from './events.js';
const pad = n => String(n).padStart(2, '0');
export function initPeak(container) {
    const chips = container.querySelector('[data-peak-chips]');
    if (!chips) return;
    let selected = EVENTS[0];
    function tick() {
        const now = new Date(), diff = nextEventDate(selected, now) - now;
        container.querySelector('[data-cd="d"]').textContent = pad(Math.floor(diff / 86400000));
        container.querySelector('[data-cd="h"]').textContent = pad(Math.floor(diff % 86400000 / 3600000));
        container.querySelector('[data-cd="m"]').textContent = pad(Math.floor(diff % 3600000 / 60000));
    }
    function render(event) {
        selected = event;
        chips.innerHTML = EVENTS.map(item => `<button class="chip" type="button" data-hid="${item.id}" aria-pressed="${item.id === event.id}">${item.label}</button>`).join('');
        container.querySelector('[data-peak-timeline]').innerHTML = event.timeline.map(([when, what, desc]) => `<li><span class="timeline__when">${when}</span><span class="timeline__what"><b>${what}</b>${desc}</span></li>`).join('');
        container.querySelector('[data-peak-cta]').dataset.ctaContext = `Хочу подготовить зоомагазин: ${event.label}`;
        tick();
    }
    chips.addEventListener('click', e => {
        const event = EVENTS.find(item => item.id === e.target.closest('[data-hid]')?.dataset.hid);
        if (event) render(event);
    });
    render(selected);
    setInterval(tick, 60000);
}
