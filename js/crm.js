/* Repeat purchases based on a fictional pet's previous order. */
const plural = (n, [one, few, many]) => { const a = Math.abs(n) % 100, b = a % 10; return a > 10 && a < 20 ? many : b === 1 ? one : b > 1 && b < 5 ? few : many; };
const rub = n => `${n.toLocaleString('ru-RU')} ₽`;
const dateAt = days => { const date = new Date(); date.setDate(date.getDate() + days); return date; };
const dateLabel = date => date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
const SEGMENTS = { all: 'Все питомцы', dog: 'Собаки', cat: 'Кошки', other: 'Другие' };
const CLIENTS = [
    { id: 1, name: 'Анна Петрова', pet: 'Рокки', who: 'корм для Рокки', in: 3, last: 'Корм для собак · 12 кг', sum: 5200, seg: 'dog', orders: 8 },
    { id: 2, name: 'Михаил Орлов', pet: 'Луна', who: 'наполнитель для Луны', in: 5, last: 'Наполнитель · 10 л', sum: 1400, seg: 'cat', orders: 5 },
    { id: 3, name: 'Светлана Ким', pet: 'Персик', who: 'корм для Персика', in: 8, last: 'Корм для кошек · 2 кг', sum: 2400, seg: 'cat', orders: 4 },
    { id: 4, name: 'Дмитрий Зайцев', pet: 'Бруно', who: 'лакомства для Бруно', in: 10, last: 'Лакомства · 200 г', sum: 650, seg: 'dog', orders: 2 },
    { id: 5, name: 'Ольга Смирнова', pet: 'Плюша', who: 'сено для Плюши', in: 12, last: 'Сено · 500 г', sum: 490, seg: 'other', orders: 11 },
    { id: 6, name: 'Артём Лебедев', pet: 'Ричи', who: 'корм для Ричи', in: 14, last: 'Корм для щенков · 3 кг', sum: 2900, seg: 'dog', orders: 3 },
    { id: 7, name: 'Лейла Ахмедова', pet: 'Кеша', who: 'корм для Кеши', in: 18, last: 'Корм для птиц · 1 кг', sum: 780, seg: 'other', orders: 6 },
];
export function initCRM(container, toast) {
    const find = selector => container.querySelector(selector);
    const listEl = find('[data-crm-list]'), segments = find('[data-crm-segments]');
    const preview = find('[data-crm-push]'), send = find('[data-crm-send]');
    const phone = find('[data-phone-notification]'), hint = find('[data-phone-hint]');
    if (!listEl) return;
    find('.push-phone__date').textContent = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    let range = 14, segment = 'all', template = 'remind', selected = 1;
    const sent = new Set();
    const messages = client => {
        const first = client.name.split(' ')[0], date = dateLabel(dateAt(client.in));
        if (template === 'repeat') return { title: 'Повторим привычный заказ?', text: `${first}, «${client.last}» за ${rub(client.sum)}. Привезём к ${date}.` };
        if (template === 'promo') return { title: 'Немного заботы с выгодой', text: `${first}, −10% на повторную покупку. Промокод ХВОСТ10 до ${date}.` };
        return { title: `Скоро понадобится ${client.who}`, text: `${first}, в прошлый раз вы брали «${client.last}». Повторить с доставкой?` };
    };
    function renderPush() {
        const client = CLIENTS.find(item => item.id === selected);
        if (!client) { preview.textContent = 'Выберите клиента'; phone.replaceChildren(); hint.textContent = 'В этом сегменте пока нет повторных покупок'; send.disabled = true; send.textContent = 'Отправить демо-push'; return; }
        const message = messages(client);
        preview.innerHTML = `<p class="push-preview__recipient">Получатель: <b>${client.name}</b> · питомец <b>${client.pet}</b></p><p>${message.text}</p>`;
        phone.innerHTML = `<div class="push"><div class="push__app"><span class="push__icon"><svg width="22" height="22" aria-hidden="true"><use href="#logo-mark"/></svg></span><b>Хвост и лапы</b><span class="push__now">сейчас</span></div><div class="push__title">${message.title}</div><div class="push__text">${message.text}</div></div>`;
        send.disabled = sent.has(client.id);
        send.textContent = sent.has(client.id) ? 'Демо-push доставлен ✓' : `Отправить демо-push: ${client.name.split(' ')[0]}`;
        hint.textContent = sent.has(client.id) ? 'Демо: уведомление доставлено ✓' : 'Предпросмотр напоминания о следующей покупке';
    }
    function render() {
        const inRange = CLIENTS.filter(item => item.in <= range);
        const list = inRange.filter(item => segment === 'all' || item.seg === segment);
        if (!list.some(item => item.id === selected)) selected = list[0]?.id ?? null;
        listEl.innerHTML = list.length ? list.map(client => {
            const date = dateAt(client.in);
            return `<button class="client" type="button" data-client="${client.id}" aria-pressed="${client.id === selected}"><span class="client__date"><b>${date.getDate()}</b>${date.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '')}</span><span><span class="client__name">${client.name}</span><br><span class="client__info">${client.pet} · ${client.last}</span></span><span class="client__status${sent.has(client.id) ? ' is-sent' : ''}">${sent.has(client.id) ? '✓' : `${client.in} дн.`}</span></button>`;
        }).join('') : '<p class="crm-empty">В этом периоде нет повторных покупок</p>';
        find('[data-crm-summary]').textContent = `${list.length} ${plural(list.length, ['клиент', 'клиента', 'клиентов'])} · ${rub(list.reduce((sum, client) => sum + client.sum, 0))}`;
        segments.innerHTML = Object.entries(SEGMENTS).map(([key, label]) => `<button class="chip" type="button" data-seg="${key}" aria-pressed="${key === segment}">${label}<span class="chip__count">${inRange.filter(item => key === 'all' || item.seg === key).length}</span></button>`).join('');
        renderPush();
    }
    find('[data-crm-range]').addEventListener('click', e => {
        const button = e.target.closest('[data-value]'); if (!button) return;
        range = Number(button.dataset.value);
        container.querySelectorAll('[data-crm-range] button').forEach(item => item.setAttribute('aria-pressed', String(item === button))); render();
    });
    segments.addEventListener('click', e => { const button = e.target.closest('[data-seg]'); if (button) { segment = button.dataset.seg; render(); } });
    listEl.addEventListener('click', e => { const button = e.target.closest('[data-client]'); if (button) { selected = Number(button.dataset.client); render(); } });
    find('[data-crm-template]').addEventListener('click', e => {
        const button = e.target.closest('[data-value]'); if (!button) return;
        template = button.dataset.value;
        container.querySelectorAll('[data-crm-template] button').forEach(item => item.setAttribute('aria-pressed', String(item === button))); renderPush();
    });
    send.addEventListener('click', () => {
        if (!selected || sent.has(selected)) return;
        sent.add(selected); render();
        phone.classList.remove('is-arriving'); void phone.offsetWidth; phone.classList.add('is-arriving');
        toast?.('Демо: напоминание о покупке доставлено');
    });
    render();
}
