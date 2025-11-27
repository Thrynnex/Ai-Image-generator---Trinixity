// State Management
let state = { model: 'ideogram', ratio: '16:9', style: 'reproduction-v3-31' };
let history = JSON.parse(localStorage.getItem('tx_hs_history') || '[]');

document.addEventListener('DOMContentLoaded', () => renderHistory());

// UI INTERACTION
function toggleMenu(id) {
    document.querySelectorAll('.popup-menu').forEach(p => p.id !== id && p.classList.remove('show'));
    document.getElementById(id).classList.toggle('show');
}

window.addEventListener('click', (e) => {
    if (!e.target.closest('.chip') && !e.target.closest('.popup-menu')) {
        document.querySelectorAll('.popup-menu').forEach(p => p.classList.remove('show'));
    }
});

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// RANDOM PROMPTS
function rollDice() {
    const prompts = [
        "A futuristic city built inside a giant glass dome on Mars, cinematic lighting, 8k",
        "A tiny cute robot holding a glowing flower in a dark forest, macro photography",
        "Portrait of a cyberpunk samurai with neon armor, rain, night city background",
        "An underwater steampunk castle with mechanical fish, intricate details",
        "A vast desert landscape with floating geometric monoliths, surreal art style"
    ];
    const el = document.getElementById('prompt');
    el.value = prompts[Math.floor(Math.random() * prompts.length)];
    autoResize(el);
}

// SETTINGS
function setModel(val, label, el) {
    state.model = val;
    document.getElementById('label-model').innerText = label;
    document.getElementById('chip-ratio-wrapper').style.display = (val === 'midjourney') ? 'block' : 'none';
    document.getElementById('chip-style-wrapper').style.display = (val === 'sdxl') ? 'block' : 'none';
    updateSelection(el);
}
function setRatio(val, el) {
    state.ratio = val;
    document.getElementById('label-ratio').innerText = val;
    updateSelection(el);
}
function setStyle(val, label, el) {
    state.style = val;
    document.getElementById('label-style').innerText = label;
    updateSelection(el);
}
function updateSelection(el) {
    el.parentNode.querySelectorAll('.menu-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    el.parentNode.classList.remove('show');
}

// GENERATION (Calls Local Backend)
async function generate() {
    const prompt = document.getElementById('prompt').value.trim();
    if(!prompt) return;

    setLoading(true);
    try {
        // Construct query parameters for our Vercel Backend
        let url = `/api/generate?model=${state.model}&text=${encodeURIComponent(prompt)}`;
        if(state.model === 'midjourney') url += `&ratio=${state.ratio}`;
        if(state.model === 'sdxl') url += `&style=${state.style}`;

        const res = await fetch(url);
        const data = await res.json();
        
        if(!data.ok && !data.jobId && !data.task_url) throw new Error(data.message || "Busy");

        await poll(data.task_url, prompt);
    } catch(e) {
        alert(e.message);
        setLoading(false);
    }
}

async function poll(url, prompt) {
    const interval = setInterval(async () => {
        try {
            const res = await fetch(url); // Direct poll (usually safe for status checks)
            const data = await res.json();
            if(data.status === 'done') {
                clearInterval(interval);
                finish(data.url, prompt);
            } else if (data.status === 'failed') {
                clearInterval(interval);
                throw new Error("Failed");
            }
        } catch(e) {
            clearInterval(interval);
            setLoading(false);
            console.error(e);
        }
    }, 2500);
}

function finish(url, prompt) {
    setLoading(false);
    const img = document.getElementById('resultImg');
    img.src = url;
    img.onload = () => {
        document.getElementById('imgWrapper').classList.add('visible');
        document.getElementById('heroState').classList.add('hidden');
        saveHistory(url, prompt);
    };
}

function setLoading(active) {
    const btn = document.getElementById('genBtn');
    const wrapper = document.getElementById('imgWrapper');
    if(active) {
        btn.disabled = true;
        btn.innerHTML = '...';
        wrapper.classList.add('loading');
        wrapper.classList.add('visible');
        wrapper.style.opacity = "1";
        document.getElementById('resultImg').style.opacity = '0.3';
    } else {
        btn.disabled = false;
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
        wrapper.classList.remove('loading');
        document.getElementById('resultImg').style.opacity = '1';
    }
}

// DOWNLOAD & ACTIONS
async function downloadImage() {
    const img = document.getElementById('resultImg');
    if(!img.src) return;
    try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Trinixity-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (e) {
        window.open(img.src, '_blank');
    }
}

function openFullscreen() {
    const img = document.getElementById('resultImg');
    if(img.src) window.open(img.src, '_blank');
}

// HISTORY
function saveHistory(url, prompt) {
    history.unshift({ url, prompt });
    if(history.length > 20) history.pop();
    localStorage.setItem('tx_hs_history', JSON.stringify(history));
    renderHistory();
}
function renderHistory() {
    const strip = document.getElementById('historyStrip');
    strip.innerHTML = '';
    history.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<img src="${item.url}" loading="lazy">`;
        div.onclick = () => {
            document.getElementById('resultImg').src = item.url;
            document.getElementById('imgWrapper').classList.add('visible');
            document.getElementById('heroState').classList.add('hidden');
            document.getElementById('prompt').value = item.prompt;
        };
        strip.appendChild(div);
    });
}
