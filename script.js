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
    visibilityTimeout: null,
    hasTyped: false
};

const DOM = {
    card: null,
    avatar: null,
    name: null,
    username: null,
    activity: null,
    statusInd: null,
    videoBg: null,
    imgBg: null,
    typeTarget: null,
    year: null
};

const storageKey = `lanyard_cache_${DISCORD_USER_ID}`;

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

// UPDATED: Now uses cached DOM elements
function renderPresence(data) {
    if (!data || !data.discord_user) return;

    const user = data.discord_user;
    const status = data.discord_status || 'offline';

    DOM.card.classList.remove('opacity-0');

    const avatarUrl = user.avatar 
        ? `https://wsrv.nl/?url=https://cdn.discordapp.com/avatars/\( {user.id}/ \){user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
        : `https://wsrv.nl/?url=https://cdn.discordapp.com/embed/avatars/0.png`;

    if (DOM.avatar.src !== avatarUrl) DOM.avatar.src = avatarUrl;

    DOM.statusInd.className = `status-indicator status-${status}`;

    DOM.name.textContent = user.global_name || user.username;
    DOM.username.textContent = '@' + user.username;

    let activityText = "OFFLINE";
    let colorClass = "text-white";

    if (status !== 'offline') {
        const activities = data.activities || [];
        const game = activities.find(a => a.type === 0 || a.type === 1);
        const listeningActivity = activities.find(a => a.type === 2);

        if (game) {
            activityText = "PLAYING " + game.name.toUpperCase();
            colorClass = "text-kyo-emerald";
        } else if (listeningActivity) {
            activityText = "LISTENING TO " + listeningActivity.name.toUpperCase();
            colorClass = "text-kyo-emerald";
        } else {
            activityText = status.toUpperCase();
            if (status === 'dnd') activityText = "DO NOT DISTURB";
        }
    }

    DOM.activity.textContent = activityText;
    DOM.activity.className = `text-[10px] md:text-xs font-bold tracking-widest uppercase px-3 py-2 rounded-xl bg-white/10 border border-white/5 backdrop-blur-md whitespace-normal break-words w-fit max-w-full leading-relaxed ${colorClass === 'text-kyo-emerald' ? 'text-kyo-emerald border-kyo-emerald/20' : 'text-white'}`;

    let videoUrl = null;
    if (user.collectibles && user.collectibles.nameplate && user.collectibles.nameplate.asset) {
        videoUrl = `https://cdn.discordapp.com/assets/collectibles/${user.collectibles.nameplate.asset}asset.webm`;
    }

    if (videoUrl) {
        if (DOM.videoBg.src !== videoUrl) DOM.videoBg.src = videoUrl;
        DOM.videoBg.classList.remove('hidden');
        DOM.imgBg.classList.add('hidden');
    } else if (user.banner) {
        const bannerUrl = `https://cdn.discordapp.com/banners/\( {user.id}/ \){user.banner}.${user.banner.startsWith('a_') ? 'gif' : 'png'}?size=1024`;
        DOM.imgBg.src = bannerUrl;
        DOM.imgBg.classList.remove('hidden');
        DOM.videoBg.classList.add('hidden');
    } else {
        DOM.imgBg.style.background = '#50c878';
        DOM.imgBg.src = '';
        DOM.imgBg.classList.remove('hidden');
        DOM.videoBg.classList.add('hidden');
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

    const sessionID = Date.now();
    state.currentSessionID = sessionID;

    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { 
        signal: AbortSignal.timeout(CONFIG.FETCH_TIMEOUT || 5000) 
    })
        .then(r => r.json())
        .then(json => {
            if (json.success && json.data) {
                setCache(json.data);
                renderPresence(json.data);
            }
        })
        .catch(err => console.warn('Lanyard REST pre-fetch failed', err));

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
        state.isConnected = false;
        state.isConnecting = false;
        if (state.heartbeatInterval) clearInterval(state.heartbeatInterval);
        try { ws.close(); } catch (e) {}
        scheduleReconnect();
    };

    ws.onclose = () => {
        if (state.currentSessionID !== sessionID) return;
        state.isConnected = false;
        state.isConnecting = false;
        if (state.heartbeatInterval) clearInterval(state.heartbeatInterval);
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
// VISIBILITY CHANGE (DEBOUNCED + BULLETPROOF)
// ========================================
document.addEventListener("visibilitychange", () => {
    clearTimeout(state.visibilityTimeout);
    
    if (document.hidden) {
        document.title = "JUST MONIKA";
        
        state.visibilityTimeout = setTimeout(() => {
            if (document.hidden) cleanupConnection();   // ← safety check
        }, 30000);
        
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
function initTypewriter() {
    if (!DOM.typeTarget || state.hasTyped) return;
    state.hasTyped = true;
    
    const textToType = "Every day, I imagine a future where I can be with you.";
    let typeIndex = 0;

    function typeWriter() {
        if (typeIndex < textToType.length) {
            DOM.typeTarget.textContent += textToType[typeIndex++];
            setTimeout(typeWriter, 50);
        } else {
            setTimeout(() => DOM.typeTarget.classList.remove('cursor'), 2000);
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
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            navOverlay.classList.add('open');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
            icon.style.transform = 'rotate(90deg)';
            document.body.style.overflow = 'hidden';
            logo.classList.add('opacity-0', 'pointer-events-none');
        } else {
            navOverlay.classList.remove('open');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            icon.style.transform = 'rotate(0deg)';
            document.body.style.overflow = 'auto';
            logo.classList.remove('opacity-0', 'pointer-events-none');
        }
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

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    DOM.card = document.getElementById('discord-profile');
    DOM.avatar = document.getElementById('d-avatar');
    DOM.name = document.getElementById('d-global-name');
    DOM.username = document.getElementById('d-username');
    DOM.activity = document.getElementById('d-activity');
    DOM.statusInd = document.getElementById('d-status-indicator');
    DOM.videoBg = document.getElementById('d-bg-video');
    DOM.imgBg = document.getElementById('d-bg-image');
    DOM.typeTarget = document.getElementById('typed-quote');
    DOM.year = document.getElementById('year');

    // Set year
    if (DOM.year) {
        DOM.year.textContent = new Date().getFullYear();
    }

    // Initialize features
    initTypewriter();
    initMenu();
    initMonikaPopup();
    connectLanyard();
});