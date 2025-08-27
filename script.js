const PRELOADER_EXIT_DELAY = 1500;
const PRELOADER_FADE_DURATION = 500;
const PARTICLE_COUNT = 55;
const DISCORD_USER_ID = "468509605828493322";
const GITHUB_AVATAR_URL = "https://avatars.githubusercontent.com/u/63583961";
const DISCORD_API_URL = `https://kyopi.vercel.app/api/pfp?id=${DISCORD_USER_ID}`;



const GENSHIN_START_DATE = new Date('2022-04-10'); 
const RAIDEN_OBTAINED_DATE = new Date('2024-09-17'); 
const RAIDEN_CONSTELLATION = 'C2';

function shakeCheckmark(event) {
    const checkmark = event.currentTarget;
    if (checkmark) {
        checkmark.style.transition = 'transform 0.1s ease-in-out';
        checkmark.style.transform = 'translateX(-2px) rotate(-5deg)';
        setTimeout(() => {
            checkmark.style.transform = 'translateX(2px) rotate(5deg)';
            setTimeout(() => {
                checkmark.style.transform = 'translateX(0) rotate(0)';
            }, 100);
        }, 100);
    }
}

// from AutumnVN/chino.pages.dev
function updateDiscordAvatar() {
  
const ws = new WebSocket('wss://api.lanyard.rest/socket');  
const avatarElement = document.getElementById("discord_pfp");

    ws.addEventListener('open', () => {
        ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: DISCORD_USER_ID }
        }));
    });

    ws.addEventListener('error', () => ws.close());
    ws.addEventListener('close', () => setTimeout(connectLanyard, 2000));

    ws.addEventListener('message', ({ data }) => {
        const { t, d } = JSON.parse(data);
        if (t !== 'INIT_STATE' && t !== 'PRESENCE_UPDATE') return;

        const avatarHash = d.discord_user?.avatar;
        if (!avatarHash) {
            avatarElement.src = GITHUB_AVATAR_URL;
            return;
        }

        const isGif = avatarHash.startsWith("a_");
        const format = isGif ? "gif" : "webp";
        const avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${avatarHash}.${format}?size=128`;

        avatarElement.src = avatarUrl;

        avatarElement.onerror = () => {
            avatarElement.src = GITHUB_AVATAR_URL;
        };
    });
}


function setupHeartEffect() {
    const heartIcon = document.getElementById('Footer_heart');
    if (!heartIcon) return;

    const colors = ['#FF6B8B', '#A68BFF', '#6C2BD9', '#ffffff', '#9B59B6'];
    let currentIndex = 0;
    let intervalId = null;
    let timeoutId = null;

    function changeColor() {
        heartIcon.style.color = colors[currentIndex];
        currentIndex = (currentIndex + 1) % colors.length;
    }

    function startColorChanging() {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        intervalId = setInterval(changeColor, 150);
        timeoutId = setTimeout(stopColorChanging, 1000);
    }

    function stopColorChanging() {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        intervalId = null;
        timeoutId = null;
        heartIcon.style.color = "";
    }

    heartIcon.addEventListener('mouseenter', startColorChanging);
    heartIcon.addEventListener('mouseleave', stopColorChanging);
}

function handleIntroOverlay() {
    const introOverlay = document.querySelector('.intro-overlay');
    if (!introOverlay) return;

    const preloaderText = document.querySelector('.preloader-text');
    const subtitleText = document.querySelector('.subtitle-text');

    const hidePreloader = () => {
        // Start animations immediately as preloader begins fading
        triggerMainContentAnimations();
        
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
    };

    const today = new Date();
    const isRaidenBirthday = today.getMonth() === 5 && today.getDate() === 26;

    if (isRaidenBirthday) {
        preloaderText.textContent = "Happy birthday, Almighty Raiden Shogun!";
        subtitleText.textContent = "🎉 Glory to the Shogun!⚡️";
        subtitleText.style.top = '61%';
        
        introOverlay.classList.remove('shake-it', 'shogun-denied');
        introOverlay.querySelector('.denied-icon')?.remove();
        
        setTimeout(hidePreloader, 2500);
        return;
    }

    subtitleText.style.top = '';


    if (Math.random() < 0.002) {
        preloaderText.textContent = "The Almighty Raiden Shogun has denied your access.";
        preloaderText.className = 'preloader-text denied-text';
        subtitleText.textContent = '';
        
        introOverlay.classList.remove('shake-it');
        introOverlay.classList.add('shogun-denied');
        
        const iconElement = document.createElement('i');
        iconElement.className = 'fas fa-times denied-icon';
        introOverlay.appendChild(iconElement);

        setTimeout(() => {
            introOverlay.classList.remove('shogun-denied');
            introOverlay.querySelector('.denied-icon')?.remove();
            
            preloaderText.textContent = "The Almighty Raiden Shogun has approved your access.";
            preloaderText.className = 'preloader-text approved-text';
            
            setTimeout(hidePreloader, 2000);
        }, 1500);
        return;
    }

    // Random texts
    const texts = [
        { romaji: 'Inabikari, sunawachi Eien nari', jp: '稲光、すなわち永遠なり。' },
        { romaji: 'Mikirimashita', jp: '見切りました。' },
        { romaji: 'Sabaki no ikazuchi', jp: '裁きの雷。' },
        { romaji: 'Nigemichi wa arimasen', jp: '逃げ道はありません。' },
        { romaji: 'Muga no kyouchi he', jp: '無我の境地へ。' },
        { romaji: 'Koko yori, jakumetsu no toki!', jp: 'ここより、寂滅の時！' },
        'Now, you shall perish!',
        'There is no escape!',
        'Inazuma shines eternal!',
        'NONE CAN CONTEND WITH THE SUPREME POWER OF THE ALMIGHTY RAIDEN SHOGUN AND THE MUSOU NO HITOTACHI!',
        'Shine down!',
        'Illusion shattered!',
        'Torn to oblivion!',
        'Musou me harder, mommy'
    ];

    const randomText = texts[Math.floor(Math.random() * texts.length)];

    if (typeof randomText === 'string') {
        preloaderText.textContent = randomText;
        subtitleText.textContent = randomText === 'Musou me harder, mommy' 
            ? '- A Turkish guy who is obsessed over Raiden Shogun' 
            : '';
            
        if (randomText === 'Musou me harder, mommy') {
            introOverlay.classList.add('shake-it');
            setTimeout(() => introOverlay.classList.remove('shake-it'), 300);
        }
    } else {
        preloaderText.textContent = randomText.romaji;
        subtitleText.textContent = randomText.jp;
    }

    setTimeout(hidePreloader, 2000);
    setTimeout(WritingAnimate, 2100);
    setTimeout(calculateStats, 1500);
}







function setupTweetEmbed(containerSelector) {
    const tweetContainer = document.querySelector(containerSelector);
    if (!tweetContainer) {
        console.error(`Tweet container ('${containerSelector}') not found.`);
        return;
    }

    const tweetContent = tweetContainer.querySelector('.tweet-content');
    const loadingIndicator = tweetContainer.querySelector('.loading-wrapper') || tweetContainer.querySelector('.loading-spinner');
    if (!tweetContent) {
        console.error(`Required element '.tweet-content' not found inside '${containerSelector}'.`);
        return;
    }
    if (!loadingIndicator) console.warn(`Optional loading indicator not found in '${containerSelector}'.`);

    const isTurkish = navigator.language.toLowerCase().startsWith('tr');
    const tweetEmbedHTML = `
        <blockquote class="twitter-tweet" data-lang="${isTurkish ? 'tr' : 'en'}" data-dnt="true" data-theme="dark">
            <p lang="en" dir="ltr">C2 RAIDEN SHOOOOGUUUUUN!<br><br>YAYYYY!!!!!🥳🥳💜<a href="https://twitter.com/hashtag/RaidenShogun?src=hash&ref_src=twsrc%5Etfw">#RaidenShogun</a> <a href="https://twitter.com/hashtag/GenshinImpact?src=hash&ref_src=twsrc%5Etfw">#GenshinImpact</a> <a href="https://t.co/5FMRjZZGz2">pic.twitter.com/5FMRjZZGz2</a></p>
            — Kyoや (@kyoyacchi) <a href="https://twitter.com/kyoyacchi/status/1927412978376126845?ref_src=twsrc%5Etfw">May 27, 2025</a>
        </blockquote>`;

    tweetContent.innerHTML = tweetEmbedHTML;

    function showContent() {
        if (!tweetContent.classList.contains('loaded')) {
            tweetContent.classList.add('loaded');
            tweetContent.style.opacity = '1';
            tweetContent.style.visibility = 'visible';
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        }
    }

    function showErrorState(message = 'Could not load Tweet.') {
        console.error(`Error loading tweet in ${containerSelector}:`, message);
        if (loadingIndicator?.classList.contains('loading-wrapper')) {
            loadingIndicator.innerHTML = `<div style="color: red; text-align: center;"><i class="fas fa-times-circle"></i> ${message}</div>`;
            loadingIndicator.style.display = 'flex';
        }
        tweetContent.style.opacity = '0';
        tweetContent.style.visibility = 'hidden';
    }

    function loadTweet() {
        window.twttr = (function(d, s, id) {
            const t = window.twttr || {};
            if (d.getElementById(id)) return t;
            const js = d.createElement(s); 
            js.id = id; 
            js.src = "https://platform.twitter.com/widgets.js"; 
            js.async = true;
            d.getElementsByTagName(s)[0].parentNode.insertBefore(js, d.getElementsByTagName(s)[0]); 
            t._e = []; 
            t.ready = f => t._e.push(f); 
            return t;
        }(document, "script", "twitter-wjs"));

        twttr.ready(twttr => {
            twttr.events.bind('loaded', e => {
                if (e.widgets?.some(w => tweetContainer.contains(w))) showContent();
            });
            twttr.widgets.load(tweetContainer).catch(showErrorState);
        });
    }

    if (loadingIndicator) loadingIndicator.style.display = 'flex';
    tweetContent.style.opacity = '0';
    tweetContent.style.visibility = 'hidden';
    tweetContent.classList.remove('loaded');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadTweet();
                observer.unobserve(tweetContainer);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(tweetContainer);
}





function setupParticleCanvas() {
    const canvas = document.getElementById('sparks-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
  //  const PARTICLE_COUNT = 55;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 150);
    });
    resizeCanvas();

    const particles = [];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.size = Math.random() * 3.5 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.life = Math.random() * 500 + 200;
            this.initialLife = this.life;

            if (Math.random() > 0.5) {
                this.x = this.speedX > 0 ? -this.size : canvas.width + this.size;
                this.y = Math.random() * canvas.height;
            } else {
                this.y = this.speedY > 0 ? -this.size : canvas.height + this.size;
                this.x = Math.random() * canvas.width;
            }

            this.opacity = Math.random() * 0.4 + 0.2;
        }
        update(scrollSpeed) {
            this.x += this.speedX;
            this.y += this.speedY + scrollSpeed * 0.05;
            this.life -= 1;
            this.opacity = (this.life / this.initialLife) * 0.6;
            if (this.x < -this.size || this.x > canvas.width + this.size ||
                this.y < -this.size || this.y > canvas.height + this.size ||
                this.life <= 0) {
                this.reset();
            }
        }
        draw() {
            if (this.opacity <= 0) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(155, 89, 182, ${this.opacity * 0.8})`;
            ctx.fill();

            if (this.opacity > 0.3) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(216, 191, 255, ${this.opacity * 0.5})`;
                ctx.fill();
            }
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    let lastScrollY = window.scrollY;
    let animationFrameId;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const currentScrollY = window.scrollY;
        const scrollSpeed = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        particles.forEach(p => {
            p.update(scrollSpeed);
            p.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
        } else {
            lastScrollY = window.scrollY;
            animate();
        }
    });
}


function triggerMainContentAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;
    
    // Add CSS variables for social icons staggered animation
    const socialIcons = document.querySelectorAll('.social-icons.animate-on-scroll a');
    socialIcons.forEach((icon, index) => {
        icon.style.setProperty('--social-icon-index', index);
    });
    
    // Define animation order and delays - balanced timing
    const animationOrder = [
        { selector: '.profile-header', delay: 250 },
        { selector: '.bio', delay: 400 },
        { selector: '.social-icons', delay: 550 },
        { selector: '.tweet-embed-container', delay: 700 },
        { selector: 'footer', delay: 850 }
    ];
    
    animationOrder.forEach(({ selector, delay }) => {
        const element = document.querySelector(selector + '.animate-on-scroll');
        if (element) {
            setTimeout(() => {
                element.classList.add('is-visible');
                if (element.matches('.profile-header, .bio, .social-icons, footer, .tweet-embed-container')) {
                    element.classList.add('slide-up');
                }
                
                // Add special effect for the banner
                if (element.matches('.banner')) {
                    element.style.filter = 'blur(0px)';
                }
            }, delay);
        }
    });
    
    // Setup scroll animations for any future elements or if page is scrolled
    setTimeout(() => {
        setupScrollAnimations();
    }, 1000);
}

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                if (entry.target.matches('.profile-header, .bio, .social-icons, footer, .tweet-embed-container')) {
                   entry.target.classList.add('slide-up');
                }
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => { observer.observe(el); });
}


    function summonYae(){
      document.addEventListener("click", (e) => {


            const kitsune = document.createElement("img");
            kitsune.src = "https://files.catbox.moe/g87kzk.gif";

            kitsune.classList.add("kitsune");

            kitsune.style.left = `${e.clientX}px`;
            kitsune.style.top = `${e.clientY}px`;

            document.body.appendChild(kitsune);

            setTimeout(() => {
                kitsune.classList.add("active");
            }, 10);

            setTimeout(() => {
                kitsune.classList.remove("active");
                setTimeout(() => kitsune.remove(), 300);
            }, 1500);
        });
    }

function initializeDynamicBanner() {

    const elements = {
        bannerContainer: document.querySelector('.banner'),
        bannerImg1: document.querySelector('.banner-img-1'),
        bannerImg2: document.querySelector('.banner-img-2'),
        progressBar: document.querySelector('.banner-progress-bar'),
        progressGif: document.querySelector('.progress-gif'),
        bio: document.querySelector('.bio')
    };

    const makotoBannerUrl = 'https://files.catbox.moe/a8y5q1.jpg';


    const makotoMemoryTag = document.createElement('div');
    makotoMemoryTag.className = 'makoto-memory';
    makotoMemoryTag.innerText = "🌸 In memory of Makoto...";

  
    makotoMemoryTag.style.display = 'none';
    elements.bannerContainer.appendChild(makotoMemoryTag);


    const config = {
        changeInterval: 5500,
        fadeTransitionDuration: 350,
        gifFadeDuration: 250,
        progressUpdateFrequency: 50,
        renderDelay: 50
    };

    
    const bannerUrls = [
        'https://files.catbox.moe/9cvf8l.jpeg', 'https://files.catbox.moe/a53d5g.jpg',          'https://files.catbox.moe/dx4dym.jpg',        'https://files.catbox.moe/kfn36d.jpg', 'https://files.catbox.moe/5fwex5.jpg', 'https://files.catbox.moe/1m7rx3.jpg',        'https://files.catbox.moe/ymqw8y.jpg', 'https://files.catbox.moe/7c6pr2.jpg', 'https://files.catbox.moe/bpr8u5.jpg',       'https://files.catbox.moe/yf43bj.jpg',  'https://files.catbox.moe/ph6zj4.jpeg',        'https://files.catbox.moe/ox23f5.jpeg', 'https://files.catbox.moe/ai4oz2.gif', 'https://files.catbox.moe/25kggw.gif',       'https://files.catbox.moe/obaond.jpg', 'https://files.catbox.moe/vywstu.jpg', 'https://files.catbox.moe/m0nyat.jpg',      'https://files.catbox.moe/4nz27h.jpg',
'https://files.catbox.moe/p0duyn.jpg',
'https://files.catbox.moe/590yyq.png',
'https://files.catbox.moe/dvxsv8.jpg',
'https://files.catbox.moe/a8y5q1.jpg',

    ];

    
    const euthymiaBannerUrls = new Set([
        'https://files.catbox.moe/1m7rx3.jpg', 'https://files.catbox.moe/ymqw8y.jpg',
        'https://files.catbox.moe/a53d5g.jpg', 'https://files.catbox.moe/lc17bc.jpg',
        'https://files.catbox.moe/4nz27h.jpg'
    ]);

  
    let currentBannerIndex = 0;
    let progressIntervalId = null;
    let nextChangeTimeoutId = null;
    let isBanner1Active = true;
    let isLoadingNext = false;
    let shuffledIndexes = shuffleArray([...Array(bannerUrls.length).keys()]);
    let currentShuffledIndex = 0;

  
    if (!validateElements()) return;

    
    function validateElements() {
        if (!elements.bannerContainer || !elements.bannerImg1 || !elements.bannerImg2) {
            console.warn("Required banner elements not found.");
            return false;
        }
        

        ['progressBar', 'progressGif', 'bio'].forEach(key => {
            if (!elements[key]) console.warn(`${key} element not found.`);
        });

        if (bannerUrls.length === 0) {
            console.info('Banner URL list is empty.');
            return false;
        }
        
        return true;
    }

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function getNextIndex() {
        if (currentShuffledIndex >= shuffledIndexes.length - 1) {
            shuffledIndexes = shuffleArray(shuffledIndexes);
            currentShuffledIndex = -1;
        }
        return shuffledIndexes[++currentShuffledIndex];
    }

    function clearTimers() {
        if (progressIntervalId) {
            clearInterval(progressIntervalId);
            progressIntervalId = null;
        }
        if (nextChangeTimeoutId) {
            clearTimeout(nextChangeTimeoutId);
            nextChangeTimeoutId = null;
        }
    }

    function setProgressStyles(progress, useTransition = true) {
        const transitionTiming = `${config.progressUpdateFrequency / 1000}s`;
        
        if (elements.progressBar) {
            elements.progressBar.style.transition = useTransition ? `width ${transitionTiming} linear` : 'none';
            elements.progressBar.style.width = `${progress}%`;
        }
        
        if (elements.progressGif) {
            const transition = useTransition ? 
                `left ${transitionTiming} linear, opacity ${config.gifFadeDuration / 1000}s ease-in-out` : 'none';
            elements.progressGif.style.transition = transition;
            elements.progressGif.style.left = `${progress}%`;
        }
    }

    function resetProgress() {
        setProgressStyles(0, false);
        
        if (elements.progressGif) {
            elements.progressGif.classList.add('hidden');
        }

      
        if (elements.progressBar) elements.progressBar.offsetHeight;
        if (elements.progressGif) elements.progressGif.offsetHeight;
    }

    function runProgressAnimation() {
        const startTime = Date.now();
        clearTimers();

        if (elements.progressGif) {
            elements.progressGif.classList.remove('hidden');
        }

        progressIntervalId = setInterval(() => {
            if (isLoadingNext) return;

            const elapsedTime = Date.now() - startTime;
            const progress = Math.min((elapsedTime / config.changeInterval) * 100, 100);

            if (progress >= 100) {
                clearInterval(progressIntervalId);
                progressIntervalId = null;

                setProgressStyles(100, false);

                nextChangeTimeoutId = setTimeout(() => {
                    if (!document.hidden) {
                        prepareBannerChange();
                    }
                    nextChangeTimeoutId = null;
                }, config.renderDelay);
            } else {
                setProgressStyles(progress, true);
            }
        }, config.progressUpdateFrequency);
    }

    function startProgressCycle() {
        clearTimers();
        isLoadingNext = false;
        resetProgress();

        setTimeout(runProgressAnimation, 50);
    }

    function prepareBannerChange() {
        if (isLoadingNext) return;
        isLoadingNext = true;

        const newIndex = getNextIndex();
        const newBannerUrl = bannerUrls[newIndex];
        const activeBanner = isBanner1Active ? elements.bannerImg1 : elements.bannerImg2;
        const nextBanner = isBanner1Active ? elements.bannerImg2 : elements.bannerImg1;

        function executeFade() {
            currentBannerIndex = newIndex;
            resetProgress();

          
            activeBanner.classList.remove('active');
            nextBanner.classList.add('active');
            isBanner1Active = !isBanner1Active;

            updateBioStyle(newBannerUrl);
updateMakotoMemoryTag(newBannerUrl);

            setTimeout(() => {
                isLoadingNext = false;
                startProgressCycle();
            }, config.fadeTransitionDuration);
        }

        nextBanner.onload = executeFade;
        nextBanner.onerror = () => {
            console.error("Failed to load banner image:", newBannerUrl);
            isLoadingNext = false;
            startProgressCycle();
        };

        nextBanner.src = newBannerUrl;
    }

    function updateBioStyle(currentUrl) {
        if (!elements.bio) return;
        
        const needsEuthymiaStyle = euthymiaBannerUrls.has(currentUrl);
        const hasEuthymiaStyle = elements.bio.classList.contains('euthymia-bio-style');

        if (needsEuthymiaStyle !== hasEuthymiaStyle) {
            elements.bio.classList.toggle('euthymia-bio-style', needsEuthymiaStyle);
        }
    }
function updateMakotoMemoryTag(currentUrl) {
    if (currentUrl === makotoBannerUrl) {
        makotoMemoryTag.style.display = 'block';
        makotoMemoryTag.classList.remove('hide');
    } else {
        // animasyonla gizle
        makotoMemoryTag.classList.add('hide');
        makotoMemoryTag.addEventListener('animationend', () => {
            if (makotoMemoryTag.classList.contains('hide')) {
                makotoMemoryTag.style.display = 'none';
                makotoMemoryTag.classList.remove('hide');
            }
        }, { once: true });
    }
}

    function handleVisibilityChange() {
        if (document.hidden) {
            clearTimers();
        } else {
            clearTimers();
            if (!isLoadingNext) {
                startProgressCycle();
            }
        }
    }

    
    function initializeBanner() {
        if (bannerUrls.length === 0) {
            elements.bannerContainer.style.display = 'none';
            return;
        }

        elements.bannerImg1.src = bannerUrls[currentBannerIndex];
        elements.bannerImg1.onload = () => {
            elements.bannerImg1.classList.add('active');
            elements.bannerImg2.classList.remove('active');
            startProgressCycle();
        };
        elements.bannerImg1.onerror = () => {
            console.error("Failed to load initial banner:", bannerUrls[currentBannerIndex]);
            elements.bannerImg2.classList.remove('active');
            startProgressCycle();
        };

        updateBioStyle(bannerUrls[currentBannerIndex]);
        updateMakotoMemoryTag(bannerUrls[currentBannerIndex]);
        
    }


    document.addEventListener('visibilitychange', handleVisibilityChange);

    
    initializeBanner();
}
function toggleNamaeVisibility() {
  const namae = document.querySelector(".namae");
  if (!namae) return;

  if (document.visibilityState === "hidden") {
    namae.style.visibility = "hidden"; 
  } else {
    namae.style.visibility = "visible"
  }
}


/*function initializeBirthdayCountdown() {
    const timerElement = document.getElementById('countdown-timer');

    if (!timerElement) {
        console.error("Element with ID 'countdown-timer' not found.");
        return;
    }

    let countdownIntervalId = null;

    function updateAndDisplay() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();

        if (currentMonth === 5 && currentDay === 26) { 
            timerElement.innerText = "Happy birthday, Raiden Shogun!";
            if (countdownIntervalId) {
                clearInterval(countdownIntervalId);
                countdownIntervalId = null;
            }
            triggerSingleConfettiBurst();
            setTimeout(triggerSingleConfettiBurst, 600);
            setTimeout(triggerSingleConfettiBurst, 1200);
            return;
        }

        let targetDate = new Date(now.getFullYear(), 5, 26, 0, 0, 0); 

        if (now > targetDate) {
            targetDate.setFullYear(targetDate.getFullYear() + 1);
        }

        const diff = targetDate - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        timerElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateAndDisplay();

    if (countdownIntervalId) clearInterval(countdownIntervalId);
    countdownIntervalId = setInterval(updateAndDisplay, 1000);
}*/





    function PreventRightClick() {
    const allImages = document.querySelectorAll('img');
    allImages.forEach(function(img) {
        img.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
    });
}

function triggerSingleConfettiBurst() {
  confetti({
    particleCount: 150,
    spread: 180,
    origin: { y: 0.6 },
    colors: ['#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4']
  });
}

function startBirthdayCelebration() {
  const today = new Date();
  const currentMonth = today.getMonth(); 
  const currentDay = today.getDate();


  if (currentMonth === 5 && currentDay === 26) { 
    triggerSingleConfettiBurst();
    setTimeout(triggerSingleConfettiBurst, 500);
    setTimeout(function() {
      console.log("TODAY IS JUN 26TH!")
      triggerSingleConfettiBurst();
    }, 1500);
  } else {
  }

}


function animateNumber(element, start, end, duration) {
  const startTime = performance.now();
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
   const current = Math.floor(start + (end - start) * progress);
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
}

function calculateStats() {
  const today = new Date();
  

  const genshinDiff = Math.abs(today - GENSHIN_START_DATE);
  const genshinDays = Math.ceil(genshinDiff / (1000 * 60 * 60 * 24));
const raidenDiff = Math.abs(today - RAIDEN_OBTAINED_DATE);
  const raidenDays = Math.ceil(raidenDiff / (1000 * 60 * 60 * 24));
  const genshinElement = document.getElementById('genshin-days');
  const raidenElement = document.getElementById('raiden-days');
  const constellationElement = document.getElementById('constellation');
  if (genshinElement) {
    animateNumber(genshinElement, 0, genshinDays, 2000);
  }
  
  if (raidenElement) {
    animateNumber(raidenElement, 0, raidenDays, 2500);
  }
  if (constellationElement) {
    constellationElement.style.textShadow = '0 0 8px var(--raiden-glow)';
    constellationElement.textContent = RAIDEN_CONSTELLATION;
  }
}

async function connectLanyard() {
  const presenceElement = document.getElementById("discord-presence");
  let ws = null;
  let reconnectTimeout = null;

  function showConnecting() {
    presenceElement.innerHTML = `<div class="discord-status"><i class="fab fa-discord"></i> Connecting...</div>`;
  }

  async function fetchUserData() {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      const data = await response.json();
      if (data.success) return data.data;
    } catch (error) {
      console.error('REST API error:', error);
    }
    return null;
  }

  let userData = await fetchUserData();
  if (!userData) {
    showConnecting();
    setTimeout(connectLanyard, 5000);
    return;
  }

  renderPresence(userData);

  function connectWebSocket() {
    if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) return;

    ws = new WebSocket('wss://api.lanyard.rest/socket');

    ws.addEventListener('open', () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }));
    });

    ws.addEventListener('error', () => {
      showConnecting();
      ws.close(1006, 'WebSocket error');
    });

    ws.addEventListener('close', () => {
      showConnecting();
      if (!reconnectTimeout) {
        reconnectTimeout = setTimeout(connectWebSocket, 2000);
      }
    });

    ws.addEventListener('message', ({ data }) => {
      const { t, d } = JSON.parse(data);
      if (t !== 'INIT_STATE' && t !== 'PRESENCE_UPDATE') return;

      let presence = t === 'INIT_STATE' ? d[DISCORD_USER_ID] : d;
      if (presence?.discord_user) {
        userData = presence;
        renderPresence(userData);
      }
    });
  }

  function renderPresence(data) {
    if (!data?.discord_user) return;

    const user = data.discord_user;
    const status = data.discord_status || 'offline';
    const activities = data.activities || [];
    const displayName = user.global_name || user.username;

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "webp"}?size=64`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    let activityText = '';
    let isGenshin = false;

    if (status === 'offline') {
      activityText = `<i class="fab fa-discord"></i> Offline`;
    } else {
      const activity = activities.find(a => a.type !== 4);
      if (activity?.name) {
        if (activity.name.toLowerCase().includes('genshin')) {
          isGenshin = true;
          activityText = `<i class="fas fa-bolt"></i> Playing Genshin Impact`;
        } else {
          switch (activity.type) {
            case 0:
              activityText = `<i class="fas fa-gamepad"></i> Playing ${activity.name}`;
              break;
            case 2:
              if (activity.name === 'Spotify' && activity.details && activity.state) {
                activityText = `<i class="fas fa-music"></i> ${activity.details} - ${activity.state}`;
              } else {
                activityText = `<i class="fas fa-music"></i> Listening to ${activity.name}`;
              }
              break;
            default:
              activityText = `<i class="fas fa-desktop"></i> ${activity.name}`;
          }
        }
      } else {
        const statusMap = {
          online: 'Online',
          idle: 'Idle',
          dnd: 'Do Not Disturb'
        };
        activityText = statusMap[status] || '';
      }
    }

    const genshinClass = isGenshin ? 'genshin-activity' : '';
    presenceElement.innerHTML = `
      <div class="discord-status ${genshinClass}">
        <img src="${avatarUrl}" alt="${displayName}" class="discord-avatar">
        <div class="discord-info">
          <div class="discord-username">${displayName}</div>
          <div class="discord-activity">
            <span class="activity-text">${activityText}</span>
          </div>
        </div>
        <div class="status-indicator status-${status}"></div>
      </div>
    `;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (!ws || ws.readyState === WebSocket.CLOSED) connectWebSocket();
    } else {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      if (ws && ws.readyState === WebSocket.OPEN) ws.close(1000, 'Tab hidden');
    }
  });

  showConnecting();
  connectWebSocket();
}

document.addEventListener("visibilitychange", toggleNamaeVisibility);
function WritingAnimate() {
    const heroTitle = document.querySelector('.namae');
    const titleText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    function typeTitle() {
        if (i < titleText.length) {
            heroTitle.textContent += titleText.charAt(i);
            
            
            heroTitle.style.textShadow = '0 0 10px #9945ff, 0 0 20px #9945ff';
            setTimeout(() => {
                heroTitle.style.textShadow = '0 0 5px #9945ff';
            }, 100);
            
            
            heroTitle.textContent += '|';
            setTimeout(() => {
                heroTitle.textContent = heroTitle.textContent.slice(0, -1);
            }, 75);
            
            i++;
            
            const speed = Math.random() * 100 + 100;
            setTimeout(typeTitle, speed);
        }
    }
    
    setTimeout(typeTitle, 1000);
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createElement(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}


function triggerElectroShock(event) {
    const element = event.currentTarget;
    
    
    element.style.transform = 'scale(1.2) rotate(360deg)';
    element.style.filter = 'brightness(2) saturate(2)';
    
    
    createSparkEffect(element);
    
    
    setTimeout(() => {
        element.style.transform = '';
        element.style.filter = '';
    }, 600);

    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const bolt = createElement('div', 'lightning-bolt');
            const left = random(0, window.innerWidth);
            const height = random(200, 500);
            
            bolt.style.left = `${left}px`;
            bolt.style.height = `${height}px`;
            bolt.style.top = `${random(0, window.innerHeight - height)}px`;
            bolt.style.animationDuration = '0.5s';
            bolt.style.animationTimingFunction = 'steps(5)';
            bolt.style.opacity = '1';
            
            document.body.appendChild(bolt);
            
            setTimeout(() => {
                if (bolt.parentNode) {
                    bolt.parentNode.removeChild(bolt);
                }
            }, 500);
        }, i * 100);
    }
    
    
    flashScreen();
}


function createSparkEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const spark = createElement('div', 'spark-particle');
        
        spark.style.position = 'fixed';
        spark.style.left = `${centerX}px`;
        spark.style.top = `${centerY}px`;
        spark.style.width = '4px';
        spark.style.height = '4px';
        spark.style.background = '#A663E8';  
        spark.style.borderRadius = '50%';
        spark.style.pointerEvents = 'none';
        spark.style.zIndex = '10000';
        spark.style.boxShadow = '0 0 10px #A663E8';
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = random(50, 150);
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        spark.style.transform = `translate(-50%, -50%)`;
        spark.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        document.body.appendChild(spark);
        
        setTimeout(() => {
            spark.style.left = `${endX}px`;
            spark.style.top = `${endY}px`;
            spark.style.opacity = '0';
            spark.style.transform = 'translate(-50%, -50%) scale(0)';
        }, 50);
        
        setTimeout(() => {
            if (spark.parentNode) {
                spark.parentNode.removeChild(spark);
            }
        }, 850);
    }
}


function flashScreen() {
    const flash = createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.background = 'rgba(166, 99, 232, 0.3)';  // Based on electro-accent
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '9998';
    flash.style.opacity = '0';
    flash.style.transition = 'opacity 0.2s ease';
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        flash.style.opacity = '0';
    }, 200);
    
    setTimeout(() => {
        if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
        }
    }, 400);
}

   function initializePage() {
    handleIntroOverlay();
  connectLanyard();
  updateDiscordAvatar();
    setupHeartEffect();
    setupTweetEmbed('.tweet-embed-container');
  setupParticleCanvas();
    initializeDynamicBanner();
    
//initializeBirthdayCountdown();
startBirthdayCelebration();
    
    
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {

    initializePage();
}
