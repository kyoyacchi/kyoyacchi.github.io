// ========================================
// CONFIG & STATE
// ========================================
const DISCORD_USER_ID = '468509605828493322';

const CONFIG = {
    MAX_BACKOFF: 30000,
    CACHE_TTL: 60000 * 5,
    CONNECT_DEBOUNCE: 1500,
    INIT_TIMEOUT: 10000,
    FETCH_TIMEOUT: 5000,
    VISIBILITY_HIDE_TIMEOUT: 30000,
};

const ACTIVITY_TYPE = {
    PLAYING: 0,
    STREAMING: 1,
    LISTENING: 2,
    WATCHING: 3,
    CUSTOM: 4,
    COMPETING: 5,
};

const ACTIVITY_LABEL = {
    [ACTIVITY_TYPE.STREAMING]: (name) => `STREAMING ${name}`,
    [ACTIVITY_TYPE.PLAYING]: (name) => `PLAYING ${name}`,
    [ACTIVITY_TYPE.WATCHING]: (name) => `WATCHING ${name}`,
    [ACTIVITY_TYPE.LISTENING]: (name) => `LISTENING TO ${name}`,
    [ACTIVITY_TYPE.COMPETING]: (name) => `COMPETING IN ${name}`,
};

const state = {
    ws: null,
    isConnected: false,
    isConnecting: false,
    reconnectTimer: null,
    heartbeatInterval: null,
    backoff: 1000,
    currentSessionID: null,
    lastConnectAttempt: 0,
    hasPrefetched: false,
    visibilityTimeout: null,
    hasTyped: false,
};

// ========================================
// UTILITIES
// ========================================
const logMonika = () =>
    console.log('%cJust Monika.', 'color:#ffffff; font-family:monospace; font-size:16px;');





const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ========================================
// LANYARD / DISCORD PRESENCE
// ========================================
const storageKey = `lanyard_cache_${DISCORD_USER_ID}`;

// DOM Cache for performance (lazy-loaded on first render)
const DOM = {};
function getElements() {
    if (DOM.card) return DOM;
    DOM.card = document.getElementById('discord-profile');
    DOM.avatarEl = document.getElementById('d-avatar');
    DOM.decorationEl = document.getElementById('d-avatar-decoration');
    DOM.nameEl = document.getElementById('d-global-name');
    DOM.userEl = document.getElementById('d-username');
    DOM.activityEl = document.getElementById('d-activity');
    DOM.statusInd = document.getElementById('d-status-indicator');
    DOM.videoBg = document.getElementById('d-bg-video');
    DOM.imgBg = document.getElementById('d-bg-image');
    return DOM;
}

function getCache() {
    try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp > CONFIG.CACHE_TTL) {
            localStorage.removeItem(storageKey);
            return null;
        }
        return parsed.data;
    } catch (e) {
        return null;
    }
}

function setCache(data) {
    try {
        localStorage.setItem(storageKey, JSON.stringify({
            data,
            timestamp: Date.now(),
        }));
    } catch (e) {
        console.warn('Lanyard cache write failed:', e);
    }
}

function renderPresence(data) {
    if (!data || !data.discord_user) return;

    const els = getElements();
    if (!els.card) return;

    const user = data.discord_user;
    const status = data.discord_status || 'offline';

    els.card.classList.remove('opacity-0');

    // Avatar
    const avatarUrl = user.avatar
        ? `https://wsrv.nl/?url=https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
        : `https://wsrv.nl/?url=https://cdn.discordapp.com/embed/avatars/0.png`;

    if (els.avatarEl && els.avatarEl.src !== avatarUrl) els.avatarEl.src = avatarUrl;

    // Avatar Decoration
    if (els.decorationEl) {
        const decoAsset = user.avatar_decoration_data?.asset;
        if (status !== 'offline' && decoAsset) {
            const decoUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${decoAsset}.png`;
            if (els.decorationEl.src !== decoUrl) els.decorationEl.src = decoUrl;
            els.decorationEl.classList.remove('hidden');
        } else {
            els.decorationEl.classList.add('hidden');
            els.decorationEl.src = '';
        }
    }

    // Basic Info
    if (els.statusInd) els.statusInd.className = `status-indicator status-${status}`;
    if (els.nameEl) els.nameEl.textContent = user.global_name || user.username;
    if (els.userEl) els.userEl.textContent = '@' + user.username;

    // Activity Parsing
    let activityText = 'OFFLINE';
    let isActive = false;

    if (status !== 'offline') {
        const activities = data.activities || [];
        const custom = activities.find((a) => a.type === ACTIVITY_TYPE.CUSTOM);
        const match = activities.find((a) => ACTIVITY_LABEL[a.type]);

        if (match) {
            activityText = ACTIVITY_LABEL[match.type](match.name.toUpperCase());
            isActive = true;
        } else if (custom?.state) {
            activityText = custom.state.toUpperCase();
            isActive = true;
        } else {
            activityText = status === 'dnd' ? 'DO NOT DISTURB' : status.toUpperCase();
        }
    }

    if (els.activityEl) {
        els.activityEl.textContent = activityText;
        els.activityEl.className = [
            'text-[10px] md:text-xs font-bold tracking-widest uppercase',
            'px-3 py-2 rounded-xl bg-white/10 border border-white/5',
            'backdrop-blur-md whitespace-normal break-words w-fit max-w-full leading-relaxed',
            isActive ? 'text-kyo-emerald border-kyo-emerald/20' : 'text-white',
        ].join(' ');
    }

    // Background (Video / Banner / Fallback)
    const videoUrl = user.collectibles?.nameplate?.asset
        ? `https://cdn.discordapp.com/assets/collectibles/${user.collectibles.nameplate.asset}asset.webm`
        : null;

    if (videoUrl) {
        if (els.videoBg && els.videoBg.src !== videoUrl) {
            els.videoBg.src = videoUrl;
            els.videoBg.muted = true;
            els.videoBg.playsInline = true;
            els.videoBg.play()?.catch((e) => console.warn(e?.message || e));
        }
        els.videoBg?.classList.remove('hidden');
        els.imgBg?.classList.add('hidden');
    } else if (user.banner) {
        const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${user.banner.startsWith('a_') ? 'gif' : 'png'}?size=1024`;
        if (els.imgBg) els.imgBg.src = bannerUrl;
        els.imgBg?.classList.remove('hidden');
        els.videoBg?.classList.add('hidden');
    } else {
        if (els.imgBg) {
            els.imgBg.style.background = '#50c878';
            els.imgBg.src = '';
        }
        els.imgBg?.classList.remove('hidden');
        els.videoBg?.classList.add('hidden');
    }
}

function connectLanyard() {
    const now = Date.now();
    if (now - state.lastConnectAttempt < CONFIG.CONNECT_DEBOUNCE) return;
    state.lastConnectAttempt = now;

    if (state.isConnecting || state.isConnected) return;
    state.isConnecting = true;

    const cached = getCache();
    if (cached) renderPresence(cached);

    // Initial REST Prefetch
    if (!state.hasPrefetched) {
        state.hasPrefetched = true;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

        fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { signal: controller.signal })
            .then((r) => r.json())
            .then((json) => {
                clearTimeout(timeoutId);
                if (json.success && json.data) {
                    setCache(json.data);
                    renderPresence(json.data);
                }
            })
            .catch((err) => {
                clearTimeout(timeoutId);
                console.warn(`Lanyard REST pre-fetch failed: ${err.name === 'AbortError' ? 'Timeout' : err.message}`);
            });
    }

    const sessionID = Date.now();
    state.currentSessionID = sessionID;

    const ws = new WebSocket('wss://api.lanyard.rest/socket');
    state.ws = ws;

    const timeout = setTimeout(() => {
        if (state.currentSessionID !== sessionID) return;
        if (ws.readyState !== WebSocket.OPEN) {
            cleanupConnection();
            scheduleReconnect();
        }
    }, CONFIG.INIT_TIMEOUT);

    ws.onopen = () => {
        if (state.currentSessionID !== sessionID) return;
        state.isConnected = true;
        state.isConnecting = false;
        state.backoff = 1000;
        clearTimeout(timeout);
    };

    ws.onmessage = ({ data }) => {
        if (state.currentSessionID !== sessionID) return;
        try {
            const parsed = JSON.parse(data);
            const { op, t, d } = parsed;

            if (op === 1 && d?.heartbeat_interval) {
                clearInterval(state.heartbeatInterval);
                state.heartbeatInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ op: 3 }));
                    }
                }, d.heartbeat_interval);

                try {
                    ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }));
                } catch (e) {
                    console.warn('Lanyard subscribe send failed:', e);
                }
            }

            if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
                const presence = t === 'INIT_STATE' ? d[DISCORD_USER_ID] : d;
                if (presence) {
                    setCache(presence);
                    renderPresence(presence);
                }
            }
        } catch (e) {
            console.warn('Lanyard message parse failed:', e);
        }
    };

    ws.onerror = () => {
        if (state.currentSessionID !== sessionID) return;
        clearTimeout(timeout);
        cleanupConnection();
        scheduleReconnect();
    };

    ws.onclose = () => {
        if (state.currentSessionID !== sessionID) return;
        clearTimeout(timeout);
        cleanupConnection();
        scheduleReconnect();
    };
}

function scheduleReconnect() {
    if (state.reconnectTimer) return;
    const jitter = Math.floor(Math.random() * 1000);
    const wait = Math.min(state.backoff + jitter, CONFIG.MAX_BACKOFF);
    state.reconnectTimer = setTimeout(() => {
        state.reconnectTimer = null;
        connectLanyard();
    }, wait);
    state.backoff = Math.min(state.backoff * 1.5, CONFIG.MAX_BACKOFF);
}

function cleanupConnection() {
    state.isConnected = false;
    state.isConnecting = false;
    if (state.heartbeatInterval) {
        clearInterval(state.heartbeatInterval);
        state.heartbeatInterval = null;
    }
    if (state.ws) {
        try { state.ws.close(); } catch (e) {}
        state.ws = null;
    }
}

// ========================================
// TITLE CHANGE (DDLC AESTHETIC)
// ========================================
const originalTitle = document.title;

// ========================================
// VISIBILITY CHANGE (DEBOUNCED)
// ========================================
document.addEventListener('visibilitychange', () => {
    clearTimeout(state.visibilityTimeout);

    if (document.hidden) {
        document.title = 'JUST MONIKA';
        state.visibilityTimeout = setTimeout(() => {
            cleanupConnection();
        }, CONFIG.VISIBILITY_HIDE_TIMEOUT);
    } else {
        document.title = originalTitle;
        const cached = getCache();
        if (cached) renderPresence(cached);
        connectLanyard();
    }
});

// ========================================
// TYPEWRITER EFFECT
// ========================================
async function initTypewriter() {
    const typeTarget = document.getElementById('typed-quote');
    if (!typeTarget || state.hasTyped) return;
    state.hasTyped = true;

    const textToType = 'Every day, I imagine a future where I can be with you.';

    await wait(800);

    for (const char of textToType) {
        typeTarget.textContent += char;
        await wait(50);
    }

    await wait(2000);
    typeTarget.classList.remove('cursor');
}


let navTypingTimeout;

function playNavTyping() {
    const textEl = document.getElementById('nav-monika-text');
    if (!textEl) return;

    clearTimeout(navTypingTimeout);
    textEl.textContent = "";

    const texts = ["JUST MONIKA.", "JUST MONIKA. OK."];
    let textIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIdx];

        if (isDeleting) {
            textEl.textContent = currentText.substring(0, charIdx - 1);
            charIdx--;
        } else {
            textEl.textContent = currentText.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 120;

        if (!isDeleting && charIdx === currentText.length) {
            speed = 1500;
            
            if (textIdx === 0) {
                isDeleting = true;
            } else {
                return;
            }
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            textIdx++;
            speed = 500;
        }

        navTypingTimeout = setTimeout(type, speed);
    }

    type();
}

// ========================================
// MENU TOGGLE
// ========================================
function initMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const navOverlay = document.getElementById('nav-overlay');
    const logo = document.getElementById('site-logo');

    if (!menuBtn || !navOverlay || !logo) return;

    const icon = menuBtn.querySelector('i');
    if (!icon) return;

    let isMenuOpen = false;

    function toggleMenu() {
        if (document.body.classList.contains('ddlc-mode')) {
            openMonikaPopup();
            return;
        }

        isMenuOpen = !isMenuOpen;
        navOverlay.classList.toggle('open', isMenuOpen);
        icon.classList.toggle('fa-bars', !isMenuOpen);
        icon.classList.toggle('fa-xmark', isMenuOpen);
        logo.classList.toggle('opacity-0', isMenuOpen);
        logo.classList.toggle('pointer-events-none', isMenuOpen);
        icon.style.transform = isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)';
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
        
        if (isMenuOpen) {
            playNavTyping();
        } else {
            clearTimeout(navTypingTimeout);
            const textEl = document.getElementById('nav-monika-text');
            if (textEl) textEl.textContent = "";
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
}

// ========================================
// MONIKA POPUP
// ========================================
let isZoomLocked = false;

function preventZoom(e) {
    const isZoomKey = e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0';
    if ((e.ctrlKey || e.metaKey) && isZoomKey) e.preventDefault();
}

function preventWheelZoom(e) {
    if (e.ctrlKey) e.preventDefault();
}

function preventTouchZoom(e) {
    if (e.touches.length > 1) e.preventDefault();
}

function enableZoomLock() {
    if (isZoomLocked) return;
    isZoomLocked = true;
    document.addEventListener('keydown', preventZoom, { capture: true });
    document.addEventListener('wheel', preventWheelZoom, { capture: true, passive: false });
    document.addEventListener('touchmove', preventTouchZoom, { capture: true, passive: false });
    document.addEventListener('touchstart', preventTouchZoom, { capture: true, passive: false });
}

function disableZoomLock() {
    if (!isZoomLocked) return;
    isZoomLocked = false;
    document.removeEventListener('keydown', preventZoom, { capture: true });
    document.removeEventListener('wheel', preventWheelZoom, { capture: true });
    document.removeEventListener('touchmove', preventTouchZoom, { capture: true });
    document.removeEventListener('touchstart', preventTouchZoom, { capture: true });
}

function openMonikaPopup() {
    const popup = document.getElementById('monika-popup');
    if (!popup) return;
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    enableZoomLock();
}

function closeMonikaPopup() {
    const popup = document.getElementById('monika-popup');
    if (!popup) return;
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
    disableZoomLock();
}

// Alias used by storage proxy
const triggerMonikaPopup = openMonikaPopup;

function initMonikaPopup() {
    const monikaHero = document.getElementById('monika-hero');
    const monikaOkBtn = document.getElementById('monika-ok-btn');

    if (!monikaHero || !monikaOkBtn) return;

    monikaHero.addEventListener('click', openMonikaPopup);
    monikaOkBtn.addEventListener('click', closeMonikaPopup);
}

// ========================================
// DDLC MODE TRIGGERS & GLITCH LOGIC
// ========================================
let ddlcClickCount = 0;
let clickTimer;
let typedKeys = '';
const secretWord = 'monika';

function toggleDDLCMode() {
    const body = document.body;
    body.classList.add('is-glitching', 'no-transitions');

    setTimeout(() => {
        body.classList.remove('is-glitching');
        body.classList.toggle('ddlc-mode');

        setTimeout(() => {
            body.classList.remove('no-transitions');
        }, 50);
    }, 500);
}

// Method 1: Typing "monika"
document.addEventListener('keydown', (e) => {
    if (e.key.length !== 1) return;
    typedKeys += e.key.toLowerCase();
    if (typedKeys.length > secretWord.length) {
        typedKeys = typedKeys.slice(-secretWord.length);
    }
    if (typedKeys === secretWord) {
        toggleDDLCMode();
        typedKeys = '';
        logMonika();
    }
});

// Method 2: Clicking Logo 5 times
function initDDLCClicker() {
    const logoElement = document.getElementById('site-logo');
    if (!logoElement) return;

    logoElement.addEventListener('click', () => {
        ddlcClickCount++;
        clearTimeout(clickTimer);
        if (ddlcClickCount >= 5) {
            toggleDDLCMode();
            ddlcClickCount = 0;
        }
        clickTimer = setTimeout(() => { ddlcClickCount = 0; }, 2000);
    });
}

// ========================================
// JUST MONIKA (MUSIC PLAYER)
// ========================================
function initJustM() {
    const STORAGE_KEY = 'monika-music-playing';
    const heroElement = document.getElementById('monika-hero');
    const wasPlaying = localStorage.getItem(STORAGE_KEY) === '1';

const setupMusicPlayer = () => {
        // Note: FontAwesome script loading removed

        const musicBtn = document.createElement('button');
        musicBtn.id = 'monika-music-btn';
        musicBtn.className = 'monika-music-btn'; // Assigned the new CSS class
        musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
        document.body.appendChild(musicBtn);

        const audio = new Audio('https://files.catbox.moe/or6fpo.opus');
        audio.loop = true;
        audio.volume = 0;
        audio.preload = 'auto';

        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: 'Just Monika.',
                artist: 'Doki Doki Literature Club! OST',
                album: 'DDLC',
            });
        }

        let fadeInterval;
        const fadeAudio = (target, duration = 400, cb) => {
            clearInterval(fadeInterval);
            const step = 0.05;
            const steps = Math.abs(target - audio.volume) / step;
            if (steps === 0) return cb?.();

            const interval = duration / steps;
            fadeInterval = setInterval(() => {
                if (audio.volume < target) audio.volume = Math.min(audio.volume + step, target);
                else audio.volume = Math.max(audio.volume - step, target);

                if (Math.abs(audio.volume - target) < 0.01) {
                    audio.volume = target;
                    clearInterval(fadeInterval);
                    cb?.();
                }
            }, interval);
        };
const orijinalTitle = document.title;
        const updateUI = (playing) => {
            // Replaced inline styles with a simple class toggle
            musicBtn.classList.toggle('playing', playing);
            document.title = playing ? 'Just Monika.' : orijinalTitle

            if (heroElement) {
                heroElement.style.boxShadow = playing ? '0 0 20px #50C878' : '0 0 20px rgba(0,0,0,0.5)';
                heroElement.style.borderColor = playing ? '#50C878' : 'rgba(255,255,255,0.1)';
            }
        };

        audio.addEventListener('play', () => { localStorage.setItem(STORAGE_KEY, '1'); updateUI(true); });
        audio.addEventListener('pause', () => { localStorage.setItem(STORAGE_KEY, '0'); updateUI(false); });

        // JS hover event listeners were deleted here since CSS handles it now

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        musicBtn.addEventListener('touchstart', (e) => {
            isDragging = false;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;

            const rect = musicBtn.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            musicBtn.style.bottom = 'auto';
            musicBtn.style.right = 'auto';
            musicBtn.style.left = initialLeft + 'px';
            musicBtn.style.top = initialTop + 'px';
            musicBtn.style.transition = 'none';
        }, { passive: true });

        // Wrapped in requestAnimationFrame for buttery smooth dragging
        let dragRAF;
        musicBtn.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                isDragging = true;
                if (e.cancelable) e.preventDefault();

                cancelAnimationFrame(dragRAF);
                dragRAF = requestAnimationFrame(() => {
                    let newLeft = Math.max(0, Math.min(initialLeft + deltaX, window.innerWidth - musicBtn.offsetWidth));
                    let newTop = Math.max(0, Math.min(initialTop + deltaY, window.innerHeight - musicBtn.offsetHeight));

                    musicBtn.style.left = newLeft + 'px';
                    musicBtn.style.top = newTop + 'px';
                });
            }
        }, { passive: false });

        musicBtn.addEventListener('touchend', () => {
            musicBtn.style.transition = 'all 0.4s ease-in-out';
            if (isDragging) setTimeout(() => { isDragging = false; }, 50);
        });

        musicBtn.addEventListener('click', async () => {
            if (isDragging) return;
            try {
                if (!audio.paused) fadeAudio(0, 400, () => audio.pause());
                else { await audio.play(); fadeAudio(0.4); }
            } catch (err) {
                console.error('Playback blocked:', err);
            }
        });

        musicBtn._audio = audio;

        if (wasPlaying) {
            musicBtn.style.display = 'flex';
            document.addEventListener('click', () => {
                if (audio.paused) audio.play().then(() => fadeAudio(0.4)).catch(() => {});
            }, { once: true });
        }

        return musicBtn;
    };

    if (wasPlaying) setupMusicPlayer();

    if (heroElement) {
        heroElement.addEventListener('click', () => {
            let btn = document.getElementById('monika-music-btn');
            if (!btn) btn = setupMusicPlayer();
            btn.style.display = 'flex';
            if (btn._audio && btn._audio.paused) btn.click();
        });
    }
}

// ========================================
// LOCALSTORAGE PROXY (JUST MONIKA)
// ========================================
function initMonikaStorage() {
    const originalStorage = window.localStorage;

    if (originalStorage.getItem('DDLC') !== 'JUST MONIKA') {
        originalStorage.setItem('DDLC', 'JUST MONIKA');
    }

    const monikaStorage = new Proxy(originalStorage, {
        get(target, prop) {
            if (prop === 'getItem') {
                return (key) => key === 'DDLC' ? 'JUST MONIKA' : target.getItem(key);
            }

            if (prop === 'setItem') {
                return (key, value) => {
                    if (key === 'DDLC' && value !== 'JUST MONIKA') {
                        logMonika();
                        triggerMonikaPopup();
                        value = 'JUST MONIKA';
                    }
                    return target.setItem(key, value);
                };
            }

            if (prop === 'removeItem') {
                return (key) => {
                    if (key === 'DDLC') {
                        logMonika();
                        triggerMonikaPopup();
                        return;
                    }
                    return target.removeItem(key);
                };
            }

            if (prop === 'clear') {
                return () => {
                    logMonika();
                    triggerMonikaPopup();
                    target.clear();
                    target.setItem('DDLC', 'JUST MONIKA');
                };
            }

            return typeof target[prop] === 'function'
                ? target[prop].bind(target)
                : target[prop];
        },

        set(target, prop, value) {
            if (prop === 'DDLC' && value !== 'JUST MONIKA') {
                logMonika();
                triggerMonikaPopup();
                value = 'JUST MONIKA';
            }
            target[prop] = value;
            return true;
        },

        deleteProperty(target, prop) {
            if (prop === 'DDLC') {
                logMonika();
                triggerMonikaPopup();
                return false;
            }
            return Reflect.deleteProperty(target, prop);
        },
    });

    Object.defineProperty(window, 'localStorage', {
        value: monikaStorage,
        configurable: false,
        writable: false,
    });

    window.addEventListener('storage', (event) => {
        if (
            event.storageArea === originalStorage &&
            event.key === 'DDLC' &&
            event.newValue !== 'JUST MONIKA'
        ) {
            originalStorage.setItem('DDLC', 'JUST MONIKA');
            logMonika();
            triggerMonikaPopup();
        }
    });
}

function initFooterHeart() {
    const heart = document.getElementById("footer-heart");
    if (!heart) return;

    let interval = null;

    function beat() {
        heart.style.transform = "scale(1.15)";
        setTimeout(() => {
            heart.style.transform = "scale(1)";
        }, 180);
    }

    heart.addEventListener("mouseenter", () => {
        if (interval) return;
        beat();
        interval = setInterval(beat, 400);
    });

    heart.addEventListener("mouseleave", () => {
        clearInterval(interval);
        interval = null;
        heart.style.transform = "scale(1)";
    });
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    initTypewriter();
    initMenu();
    initMonikaPopup();
    initDDLCClicker();
    initJustM();
    initMonikaStorage();
    initFooterHeart();
    connectLanyard();


    logMonika();
});
