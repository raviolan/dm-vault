// Lightweight Weather app for public builds
(() => {
    const conds = [
        { id: 'clear', label: 'Clear', emoji: '☀️' },
        { id: 'partly', label: 'Partly cloudy', emoji: '⛅' },
        { id: 'cloudy', label: 'Cloudy', emoji: '☁️' },
        { id: 'light_rain', label: 'Light rain', emoji: '🌦️' },
        { id: 'heavy_rain', label: 'Heavy rain', emoji: '🌧️' },
        { id: 'thunder', label: 'Thunderstorms', emoji: '⛈️' },
        { id: 'fog', label: 'Fog', emoji: '🌫️' },
        { id: 'snow', label: 'Snow', emoji: '❄️' }
    ];

    const effectsByCond = {
        clear: ['Calm winds'],
        partly: ['Light breeze'],
        cloudy: ['Gloomy'],
        light_rain: ['Wet surfaces', 'Reduced visibility'],
        heavy_rain: ['Slippery', 'Heavy downpour'],
        thunder: ['Thunder rolls', 'Chance of lightning'],
        fog: ['Low visibility', 'Damp air'],
        snow: ['Slippery', 'Cold']
    };

    const q = (s) => document.querySelector(s);
    const qAll = (s) => Array.from(document.querySelectorAll(s));

    function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

    function renderCurrent(container, state) {
        const icon = container.querySelector('.weather-icon');
        const condEl = container.querySelector('.weather-condition');
        const meta = container.querySelector('.weather-meta');
        if (icon) icon.textContent = state.emoji;
        if (condEl) condEl.textContent = state.label;
        if (meta) meta.textContent = `${state.temp}° — ${state.winds} wind`;
    }

    function renderForecast(listEl, forecast) {
        listEl.innerHTML = '';
        forecast.forEach(f => {
            const li = document.createElement('li');
            li.className = 'forecast-item';
            li.innerHTML = `<div class="f-time">${f.day}</div><div class="f-desc">${f.label}</div><div class="f-temp">${f.temp}°</div>`;
            listEl.appendChild(li);
        });
    }

    function renderEffects(container, effects) {
        const out = container.querySelector('.weather-effects');
        if (!out) return;
        out.innerHTML = '';
        effects.forEach(e => {
            const span = document.createElement('span');
            span.className = 'effect-badge';
            span.textContent = e;
            out.appendChild(span);
        });
    }

    function generateWeather() {
        const cond = pick(conds);
        const temp = randInt(30, 90);
        const winds = `${randInt(0, 25)} mph`;
        const forecast = [];
        for (let i = 1; i <= 4; i++) {
            const c = pick(conds);
            forecast.push({ day: `+${i}`, label: c.label, temp: randInt(temp - 10, temp + 12) });
        }
        const effects = effectsByCond[cond.id] || [];
        return { ...cond, temp, winds, forecast, effects };
    }

    function attach(root = document) {
        const weatherStrip = root.querySelector('#weatherStrip');
        const weatherCard = root.querySelector('#weatherCard');
        const forecastList = root.querySelector('.weather-forecast');
        const effectsContainer = root.querySelector('.weather-effects');
        const rollBtn = root.querySelector('#rollWeather');

        function applyState(state) {
            if (weatherStrip) {
                const s = weatherStrip;
                s.innerHTML = `<div class="weather-strip-inner"><span class="strip-icon">${state.emoji}</span><span class="strip-temp">${state.temp}°</span><span class="strip-desc">${state.label}</span></div>`;
                s.className = 'weather-strip wc-' + state.id;
            }
            if (weatherCard) renderCurrent(weatherCard, state);
            if (forecastList) renderForecast(forecastList, state.forecast);
            if (effectsContainer) renderEffects(weatherCard || document.body, state.effects);
        }

        if (rollBtn) rollBtn.addEventListener('click', () => { const st = generateWeather(); applyState(st); });

        // initialize
        const initState = generateWeather();
        applyState(initState);
    }

    // Auto-attach on DOMContentLoaded and for dynamically created pages
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => attach());
    else attach();
})();
