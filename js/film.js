// Chapters use absolute video timecodes H:MM:SS:FF, with fps set on data-film.
export function initFilm(wrap) {
    if (!wrap) return;
    const video = wrap.querySelector('[data-film-video]');
    const fallback = wrap.querySelector('[data-film-fallback]');
    const play = wrap.querySelector('[data-film-play]');
    const toast = wrap.querySelector('[data-film-toast]');
    const fps = Number(wrap.dataset.filmFps) || 60;
    const secondsAt = timecode => {
        const parts = String(timecode).split(':').map(Number);
        if (parts.length === 4) {
            const [hours, minutes, seconds, frames] = parts;
            return hours * 3600 + minutes * 60 + seconds + frames / fps;
        }
        return Number(timecode) || 0;
    };
    const chapters = [...document.querySelectorAll('.chapter')].map(el => ({
        el, at: secondsAt(el.dataset.at), time: el.dataset.time,
        title: el.dataset.title, text: el.dataset.text, icon: el.dataset.icon,
    }));
    if (!chapters.length) return;
    let active = 0, timer, swap, pendingSeek = null;
    let demo = !video?.querySelector('source[src]') && !video?.getAttribute('src');
    let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function activate(index) {
        active = index;
        chapters.forEach((chapter, i) => {
            chapter.el.setAttribute('aria-pressed', String(i === index));
            chapter.el.classList.toggle('is-complete', i < index);
            chapter.el.style.setProperty('--p', i <= index ? '1' : '0');
        });
        const chapter = chapters[index];
        wrap.querySelector('[data-film-time]').textContent = chapter.time;
        clearTimeout(swap);
        toast.classList.add('is-swapping');
        swap = setTimeout(() => {
            wrap.querySelector('[data-film-title]').textContent = chapter.title;
            wrap.querySelector('[data-film-text]').textContent = chapter.text;
            wrap.querySelector('[data-film-icon] use').setAttribute('href', chapter.icon);
            toast.classList.remove('is-swapping');
        }, 160);
    }
    function buttonState() {
        play.innerHTML = `<svg aria-hidden="true"><use href="#i-${paused ? 'play' : 'pause'}"/></svg>`;
        play.setAttribute('aria-label', `${paused ? 'Продолжить' : 'Приостановить'} ${demo ? 'показ этапов' : 'видео'}`);
    }
    function demoTimer() {
        clearInterval(timer);
        if (!paused) timer = setInterval(() => activate((active + 1) % chapters.length), 4000);
        buttonState();
    }
    function showDemo() {
        demo = true; video.hidden = true; fallback.hidden = false; demoTimer();
    }
    chapters.forEach((chapter, i) => chapter.el.addEventListener('click', () => {
        if (!demo) {
            if (Number.isFinite(video.duration)) video.currentTime = chapter.at;
            else pendingSeek = chapter.at;
        }
        activate(i);
        if (demo) demoTimer();
    }));
    play.addEventListener('click', () => {
        if (demo) { paused = !paused; demoTimer(); }
        else if (video.paused) video.play().catch(showDemo);
        else video.pause();
    });
    function syncChapter(time = video.currentTime) {
        if (demo || video.seeking || !Number.isFinite(video.duration) || !video.duration) return;
        const progress = time + .001;
        const index = chapters.reduce((result, chapter, i) => progress >= chapter.at ? i : result, 0);
        if (index !== active) activate(index);
    }
    video.addEventListener('timeupdate', () => syncChapter());
    video.addEventListener('seeked', () => syncChapter());
    if ('requestVideoFrameCallback' in video) {
        const onFrame = () => {
            // Use the playhead after seeking: the delivered frame can still be from before the seek.
            syncChapter();
            video.requestVideoFrameCallback(onFrame);
        };
        video.requestVideoFrameCallback(onFrame);
    }
    video.addEventListener('loadedmetadata', () => {
        if (pendingSeek !== null) { video.currentTime = pendingSeek; pendingSeek = null; }
    });
    video.addEventListener('play', () => { paused = false; buttonState(); });
    video.addEventListener('pause', () => { paused = true; buttonState(); });
    video.addEventListener('error', showDemo);
    activate(0);
    if (demo) showDemo();
    else {
        video.hidden = false; fallback.hidden = true;
        if (!paused) video.play().catch(() => { paused = true; buttonState(); });
        buttonState();
    }
}
