// Demo forecast: stock decreases by average daily demand, without expiry simulation.
const GOODS = [
    { name: 'Корм для кошек', pack: '2 кг', icon: '🐈', sku: 'CAT-020', qty: 48, daily: 12 },
    { name: 'Корм для собак', pack: '12 кг', icon: '🐕', sku: 'DOG-120', qty: 28, daily: 8 },
    { name: 'Наполнитель', pack: '10 л', icon: '📦', sku: 'LIT-010', qty: 72, daily: 18 },
    { name: 'Паучи для кошек', pack: 'набор 12 шт.', icon: '🐈', sku: 'CAT-012', qty: 60, daily: 9 },
    { name: 'Лакомства для собак', pack: '200 г', icon: '🦴', sku: 'DOG-200', qty: 45, daily: 7 },
    { name: 'Корм для щенков', pack: '3 кг', icon: '🐕', sku: 'PUP-030', qty: 22, daily: 6 },
    { name: 'Игрушка-мяч', pack: 'размер M', icon: '🎾', sku: 'TOY-001', qty: 38, daily: 4 },
    { name: 'Сено для грызунов', pack: '500 г', icon: '🐇', sku: 'HAY-500', qty: 30, daily: 5 },
    { name: 'Корм для птиц', pack: '1 кг', icon: '🐦', sku: 'BRD-010', qty: 34, daily: 4 },
    { name: 'Шлейка', pack: 'размер M', icon: '🐾', sku: 'ACC-010', qty: 15, daily: 2 },
];
const DAYS = ['сегодня', '+1 день', '+2 дня', '+3 дня', '+4 дня', '+5 дней'];
const STATUS = {
    fresh: ['#b1ec52', 'В наличии'], tomorrow: ['#ffd23f', 'Пополнить'],
    today: ['#ff7a24', 'Заканчивается'], 'write-off': ['#737b88', 'Нет на складе'],
};
export function initStock(widget) {
    const slider = widget.querySelector('[data-stock-day]');
    const list = widget.querySelector('[data-stock-list]');
    if (!slider || !list) return;
    function select(day) {
        slider.value = day;
        slider.style.setProperty('--range-progress', `${day / 5 * 100}%`);
        slider.setAttribute('aria-valuetext', DAYS[day]);
        widget.querySelector('[data-stock-day-label]').textContent = DAYS[day];
        widget.querySelectorAll('[data-stock-select]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.stockSelect) === day)));
        let total = 0, low = 0, unavailable = 0;
        list.innerHTML = GOODS.map(item => {
            const qty = Math.max(0, item.qty - day * item.daily);
            const status = !qty ? 'write-off' : qty <= item.daily ? 'today' : qty <= item.daily * 2 ? 'tomorrow' : 'fresh';
            const [color, label] = STATUS[status];
            total += qty;
            if (!qty) unavailable++; else if (status !== 'fresh') low++;
            return `<div class="stock__row" data-freshness="${status}"><span class="stock__flower" aria-hidden="true">${item.icon}</span><span class="stock__details"><span class="stock__name">${item.name} · ${item.pack}</span><span class="stock__sub">${item.sku} · спрос ~${item.daily} уп./день</span></span><span class="stock__qty">${qty} <small>уп.</small></span><span class="stock__status"><span class="fresh__dot" style="background:${color}"></span>${label}</span></div>`;
        }).join('');
        widget.querySelector('[data-stock-summary]').textContent = `${total} упаковок · пополнить ${low} поз. · нет в наличии ${unavailable} поз. Прогноз без новых поставок.`;
    }
    slider.addEventListener('input', () => select(Number(slider.value)));
    widget.querySelector('.stock-days__ticks').addEventListener('click', event => {
        const button = event.target.closest('[data-stock-select]');
        if (button) select(Number(button.dataset.stockSelect));
    });
    select(0);
}
