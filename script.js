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
    } catch (e) { return null; }
}

function setCache(data) {
    try { localStorage.setItem(storageKey, JSON.stringify({ data: data, timestamp: Date.now() })); } catch (e) {}
}

function renderPresence(data) {
    if (!data || !data.discord_user) return;

    const card = document.getElementById('discord-profile');
    const avatarEl = document.getElementById('d-avatar');
    const nameEl = document.getElementById('d-global-name');
    const userEl = document.getElementById('d-username');
    const activityEl = document.getElementById('d-activity');
    const statusInd = document.getElementById('d-status-indicator');
    const videoBg = document.getElementById('d-bg-video');
    const imgBg = document.getElementById('d-bg-image');
    const decorationEl = document.getElementById('d-avatar-decoration');

    if (!card) return;

    const user = data.discord_user;
    const status = data.discord_status || 'offline';

    card.classList.remove('opacity-0');

    const avatarUrl = user.avatar 
        ? `https://wsrv.nl/?url=https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
        : `https://wsrv.nl/?url=https://cdn.discordapp.com/embed/avatars/0.png`;

    if (avatarEl.src !== avatarUrl) avatarEl.src = avatarUrl;
    statusInd.className = `status-indicator status-${status}`;

    // Avatar Dekorasyonu Ekleme Mantigi
    if (status !== 'offline' && user.avatar_decoration_data && user.avatar_decoration_data.asset) {
        const assetId = user.avatar_decoration_data.asset;
        decorationEl.src = `https://cdn.discordapp.com/avatar-decoration-presets/${assetId}.png`;
        decorationEl.classList.remove('hidden');
    } else {
        decorationEl.src = '';
        decorationEl.classList.add('hidden');
    }

    nameEl.textContent = user.global_name || user.username;
    userEl.textContent = '@' + user.username;

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

    activityEl.textContent = activityText;
    activityEl.className = `text-[10px] md:text-xs font-bold tracking-widest uppercase px-3 py-2 rounded-xl bg-white/10 border border-white/5 backdrop-blur-md whitespace-normal break-words w-fit max-w-full leading-relaxed ${colorClass === 'text-kyo-emerald' ? 'text-kyo-emerald border-kyo-emerald/20' : 'text-white'}`;

    let videoUrl = null;
    if (user.collectibles && user.collectibles.nameplate && user.collectibles.nameplate.asset) {
        videoUrl = `https://cdn.discordapp.com/assets/collectibles/${user.collectibles.nameplate.asset}asset.webm`;
    }

    if (videoUrl) {
        if (videoBg.src !== videoUrl) videoBg.src = videoUrl;
        videoBg.classList.remove('hidden');
        imgBg.classList.add('hidden');
    } else if (user.banner) {
        const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${user.banner.startsWith('a_') ? 'gif' : 'png'}?size=1024`;
        imgBg.src = bannerUrl;
        imgBg.classList.remove('hidden');
        videoBg.classList.add('hidden');
    } else {
        imgBg.style.background = '#50c878';
        imgBg.src = '';
        imgBg.classList.remove('hidden');
        videoBg.classList.add('hidden');
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

    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { signal: AbortSignal.timeout(CONFIG.FETCH_TIMEOUT) })
        .then(r => r.json())
        .then(json => {
            if (json.success && json.data) {
                setCache(json.data);
                renderPresence(json.data);
            }
        })
        .catch(err => console.warn('Lanyard REST fetch failed', err));

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
                    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 3 }));
                }, d.heartbeat_interval);

                try { ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } })); } catch (e) {}
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

    ws.onerror = ws.onclose = () => {
        if (state.currentSessionID !== sessionID) return;
        cleanupConnection();
        scheduleReconnect();
    };
}

function scheduleReconnect() {
    if (state.reconnectTimer) return;
    const wait = Math.min(state.backoff + Math.floor(Math.random() * 1000), CONFIG.MAX_BACKOFF);
    state.reconnectTimer = setTimeout(() => {
        state.reconnectTimer = null;
        connectLanyard();
    }, wait);
    state.backoff = Math.min(state.backoff * 1.5, CONFIG.MAX_BACKOFF);
}

function cleanupConnection() {
    state.isConnected = false;
    state.isConnecting = false;
    if (state.heartbeatInterval) clearInterval(state.heartbeatInterval);
    if (state.ws) { try { state.ws.close(); } catch (e) {} }
}

const originalTitle = document.title;
document.addEventListener("visibilitychange", () => {
    clearTimeout(state.visibilityTimeout);
    if (document.hidden) {
        document.title = "JUST MONIKA";
        state.visibilityTimeout = setTimeout(cleanupConnection, 30000);
    } else {
        document.title = originalTitle;
        const cached = getCache();
        if (cached) renderPresence(cached);
        connectLanyard();
    }
});

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

function initMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const navOverlay = document.getElementById('nav-overlay');
    const logo = document.getElementById('site-logo');
    const monikaPopup = document.getElementById('monika-popup');
    
    if (!menuBtn || !navOverlay || !logo) return;
    
    let isMenuOpen = false;
    
    menuBtn.addEventListener('click', () => {
        // 
        if (document.body.classList.contains('ddlc-mode')) {
            if (monikaPopup) {
                monikaPopup.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            return; // 
        }
        
        // hamburga
        isMenuOpen = !isMenuOpen;
        navOverlay.classList.toggle('open');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
        icon.style.transform = isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)';
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
        logo.classList.toggle('opacity-0');
        logo.classList.toggle('pointer-events-none');
    });
}

function initMonikaPopup() {
    const monikaHero = document.getElementById('monika-hero');
    const monikaPopup = document.getElementById('monika-popup');
    const monikaOkBtn = document.getElementById('monika-ok-btn');
    
    if (!monikaHero || !monikaPopup || !monikaOkBtn) return;

    // 
    monikaHero.addEventListener('click', () => {
        monikaPopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    // OK
    monikaOkBtn.addEventListener('click', () => {
        monikaPopup.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
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
    const isCurrentlyDDLC = body.classList.contains('ddlc-mode');

    // 
    body.classList.add('is-glitching');
    body.classList.add('no-transitions');

    // 
    setTimeout(() => {
        // stop the glitch
        body.classList.remove('is-glitching');
        
        // change theme 
        body.classList.toggle('ddlc-mode');

        if (!isCurrentlyDDLC) {
            console.log('%cDDLC Mode Activated! Just Monika.', 'color: #ffbde1; font-size: 16px; font-weight: bold;');
        } else {
            console.log('%cDDLC Mode Deactivated.', 'color: #50C878; font-size: 16px;');
        }

        // 
        setTimeout(() => {
            body.classList.remove('no-transitions');
        }, 50);

    }, 500); // Glitch 
}

// 
document.addEventListener('keydown', (e) => {
    if (e.key.length !== 1) return;
    typedKeys += e.key.toLowerCase();
    if (typedKeys.length > secretWord.length) {
        typedKeys = typedKeys.slice(-secretWord.length);
    }
    if (typedKeys === secretWord) {
        toggleDDLCMode();
        typedKeys = ''; 
    }
});

// e.e 2
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
    }
});
