const DISCORD_USER_ID = '468509605828493322';
const CONFIG = {
    MAX_BACKOFF: 30000,
    CACHE_TTL: 60000 * 5,
    CONNECT_DEBOUNCE: 1500,
    INIT_TIMEOUT: 10000,
    FETCH_TIMEOUT: 5000
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
    hasPrefetched: false // Moved inside state object for cleaner scoping
};

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
            data: data,
            timestamp: Date.now()
        }));
    } catch (e) {}
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
    let activityText = "OFFLINE";
    let colorClass = "text-white";

    if (status !== 'offline') {
        const activities = data.activities || [];
        const playing = activities.find(a => a.type === 0);
        const streaming = activities.find(a => a.type === 1);
        const listening = activities.find(a => a.type === 2);

        if (streaming) {
            activityText = "STREAMING " + streaming.name.toUpperCase();
            colorClass = "text-kyo-emerald";
        } else if (playing) {
            activityText = "PLAYING " + playing.name.toUpperCase();
            colorClass = "text-kyo-emerald";
        } else if (listening) {
            activityText = "LISTENING TO " + listening.name.toUpperCase();
            colorClass = "text-kyo-emerald";
        } else {
            activityText = status === 'dnd' ? "DO NOT DISTURB" : status.toUpperCase();
        }
    }

    if (els.activityEl) {
        els.activityEl.textContent = activityText;
        els.activityEl.className = `text-[10px] md:text-xs font-bold tracking-widest uppercase px-3 py-2 rounded-xl bg-white/10 border border-white/5 backdrop-blur-md whitespace-normal break-words w-fit max-w-full leading-relaxed ${colorClass === 'text-kyo-emerald' ? 'text-kyo-emerald border-kyo-emerald/20' : colorClass}`;
    }

    // Background (Video/Banner/Fallback)
    const videoUrl = user.collectibles?.nameplate?.asset 
        ? `https://cdn.discordapp.com/assets/collectibles/${user.collectibles.nameplate.asset}asset.webm` 
        : null;

    if (videoUrl) {
        if (els.videoBg && els.videoBg.src !== videoUrl) els.videoBg.src = videoUrl;
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
            .then(r => r.json())
            .then(json => {
                clearTimeout(timeoutId); 
                if (json.success && json.data) {
                    setCache(json.data);
                    renderPresence(json.data);
                }
            })
            .catch(err => {
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
                } catch (e) {}
            }

            if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
                const presence = t === 'INIT_STATE' ? d[DISCORD_USER_ID] : d;
                if (presence) {
                    setCache(presence);
                    renderPresence(presence);
                }
            }
        } catch (e) {}
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
document.addEventListener("visibilitychange", () => {
    clearTimeout(state.visibilityTimeout);
    
    if (document.hidden) {
        document.title = "JUST MONIKA";
        
        state.visibilityTimeout = setTimeout(() => {
            cleanupConnection();
        }, 30000);
        
    } else {
        document.title = originalTitle;
        
        const cached = getCache();
        if (cached) renderPresence(cached);
        
        connectLanyard();
    }
});



/*document.querySelectorAll('.flex.justify-center.gap-6 a').forEach(link => {
        link.addEventListener('contextmenu', (e) => e.preventDefault());
    });*/
    
// ========================================
// TYPEWRITER EFFECT
// ========================================
function initTypewriter() {
    const typeTarget = document.getElementById('typed-quote');
    if (!typeTarget || state.hasTyped) return;
    state.hasTyped = true;
    
    const textToType = "Every day, I imagine a future where I can be with you.";
    let typeIndex = 0;

    function typeWriter() {
        if (typeIndex < textToType.length) {
            typeTarget.textContent += textToType[typeIndex++];
            setTimeout(typeWriter, 50);
        } else {
            setTimeout(() => typeTarget.classList.remove('cursor'), 2000);
        }
    }

    setTimeout(typeWriter, 800);
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
        // If DDLC mode is active, override menu button to open Monika popup
        if (document.body.classList.contains('ddlc-mode')) {
            const monikaPopup = document.getElementById('monika-popup');
            if (monikaPopup) {
                monikaPopup.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            return;
        }

        // Normal menu behavior
        isMenuOpen = !isMenuOpen;
navOverlay.classList.toggle('open', isMenuOpen);
icon.classList.toggle('fa-bars', !isMenuOpen);
icon.classList.toggle('fa-xmark', isMenuOpen);
logo.classList.toggle('opacity-0', isMenuOpen);
logo.classList.toggle('pointer-events-none', isMenuOpen);

icon.style.transform = isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)';
document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    }

    menuBtn.addEventListener('click', toggleMenu);
}

// ========================================
// MONIKA POPUP
// ========================================
function initMonikaPopup() {
    const monikaHero = document.getElementById('monika-hero');
    const monikaPopup = document.getElementById('monika-popup');
    const monikaOkBtn = document.getElementById('monika-ok-btn');

    if (!monikaHero || !monikaPopup || !monikaOkBtn) return;

    monikaHero.addEventListener('click', () => {
        monikaPopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    monikaOkBtn.addEventListener('click', () => {
        monikaPopup.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
}


function triggerMonikaPopup() {
    const monikaPopup = document.getElementById('monika-popup');
    if (!monikaPopup) return;
    monikaPopup.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
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
    
    body.classList.add('is-glitching');
    body.classList.add('no-transitions');

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
        console.log('%cJust Monika.', 'color:#ffffff; font-family:monospace; font-size:16px;');
    }
});

// Method 2: Clicking Logo 5 times
function initDDLCClicker() {
    const logoElement = document.getElementById('site-logo');
    if (logoElement) {
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
    connectLanyard();
    
    console.log('%cJust Monika.', 'color:#ffffff; font-family:monospace; font-size:16px;');
    
    const ddlc = localStorage.getItem("DDLC");
    if (ddlc !== "JUST MONIKA") {
        localStorage.setItem("DDLC", "JUST MONIKA");
        if (ddlc !== null) {
            console.log('%cJust Monika.', 'color:#ffffff; font-family:monospace; font-size:16px;');
        }
    }
    
    
    
    
    
    
    
  //===//
  
  
  
const _setItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
    if (key === 'DDLC' && value !== 'JUST MONIKA') {
        console.log('%cJust Monika.', 'color:#ffffff; font-family:monospace; font-size:16px;');
        value = 'JUST MONIKA';
        
        // Jumpscare!
        triggerMonikaPopup(); 
    }
    _setItem(key, value);
};

const _removeItem = localStorage.removeItem.bind(localStorage);
localStorage.removeItem = function(key) {
    if (key === 'DDLC') {
        console.log('%cJust Monika.', 'color:#ffffff; font-family:monospace; font-size:16px;');
        triggerMonikaPopup();
        return; // ssssh!
    }
    _removeItem(key);
};

window.addEventListener('storage', (event) => {
    if (event.key === 'DDLC' && event.newValue !== 'JUST MONIKA') {
      //no escape
        localStorage.setItem('DDLC', 'JUST MONIKA'); 
        
        console.log('%cJust Monika.', 'color:#ffffff; font-family:monospace; font-size:16px;');
        
        // Jumpscare!
        triggerMonikaPopup(); 
    }
});

    
});
