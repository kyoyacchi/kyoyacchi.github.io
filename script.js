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

const preloadImages = [
    'https://files.catbox.moe/9cvf8l.jpeg',
    'https://files.catbox.moe/c6vwxv.gif',
    'https://files.catbox.moe/a53d5g.jpg',
    'https://files.catbox.moe/dx4dym.jpg',
    'https://files.catbox.moe/kfn36d.jpg',
    'https://files.catbox.moe/5fwex5.jpg',
    'https://files.catbox.moe/1m7rx3.jpg',
    'https://files.catbox.moe/ymqw8y.jpg',
    'https://files.catbox.moe/7c6pr2.jpg',
    'https://files.catbox.moe/yf43bj.jpg',
    'https://files.catbox.moe/ox23f5.jpeg',
    'https://files.catbox.moe/ai4oz2.gif',
    'https://files.catbox.moe/25kggw.gif',
    'https://files.catbox.moe/obaond.jpg',
    'https://files.catbox.moe/vywstu.jpg',
    'https://files.catbox.moe/4nz27h.jpg',
    'https://files.catbox.moe/p0duyn.jpg',
    'https://files.catbox.moe/590yyq.png',
    'https://files.catbox.moe/dvxsv8.jpg',
    'https://files.catbox.moe/a8y5q1.jpg',
    'https://files.catbox.moe/l82m6v.png',
    'https://files.catbox.moe/sko7xm.png',
    'https://files.catbox.moe/rojatg.png',
    'https://files.catbox.moe/d146hq.png',
    'https://files.catbox.moe/1s76mj.jpg',
    'https://files.catbox.moe/dczsae.png'
];

const randomIntroImages = [
    'https://files.catbox.moe/b0fq4l.jpg',
    'https://files.catbox.moe/6fdl5v.jpg',
    'https://files.catbox.moe/ncf10w.gif',
    'https://files.catbox.moe/1s76mj.jpg'
];

function handleIntroOverlay() {
    const introOverlay = document.querySelector('.intro-overlay');
    if (!introOverlay) return;

    const preloaderText = document.querySelector('.preloader-text');
    const subtitleText = document.querySelector('.subtitle-text');
    const overlayImage = document.querySelector('.overlay-image');

    const hidePreloader = () => {
        triggerMainContentAnimations();
        
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
    };
    
    if (overlayImage && randomIntroImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * randomIntroImages.length);
        overlayImage.style.display = "block"
        overlayImage.src = randomIntroImages[randomIndex];
    }

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
    setTimeout(initializeDynamicBanner, 1500);
    preloadImagesThrottled(
        [...preloadImages],
        2, 
        350 
    );
    setTimeout(connectLanyard, 2500);
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
    
    // Setup social icons with staggered animation indices
    const socialIcons = document.querySelectorAll('.social-icons.animate-on-scroll a');
    socialIcons.forEach((icon, index) => {
        icon.style.setProperty('--social-icon-index', index);
    });
    
    // Define animation sequence with delays (in ms)
    const animationOrder = [
        { selector: '.profile-header', delay: 250 },
        { selector: '.bio', delay: 400 },
        { selector: '.social-icons', delay: 550 },
        { selector: '.tweet-embed-container', delay: 700 },
        { selector: 'footer', delay: 850 }
    ];
    
    // Trigger animations in sequence
    animationOrder.forEach(({ selector, delay }) => {
        const element = document.querySelector(`${selector}.animate-on-scroll`);
        if (!element) return;
        
        setTimeout(() => {
            element.classList.add('is-visible');
            
            // Add slide-up animation to specific elements
            const slideUpSelectors = [
                '.profile-header',
                '.bio',
                '.social-icons',
                '.footer',
                '.tweet-embed-container'
            ];
            
            if (slideUpSelectors.some(s => element.matches(s))) {
                element.classList.add('slide-up');
            }
            
            // Special blur effect for banner
            if (element.matches('.banner')) {
                element.style.filter = 'blur(0px)';
            }
        }, delay);
    });
    
    // Initialize scroll animations after initial sequence
    setTimeout(() => {
        if (typeof setupScrollAnimations === 'function') {
            setupScrollAnimations();
        }
    }, 1000);
}


function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            const target = entry.target;
            target.classList.add('is-visible');

            // Slide-up animation for specific elements
            const slideUpSelectors = [
                '.profile-header',
                '.bio',
                '.social-icons',
                'footer',
                '.tweet-embed-container'
            ];

            if (slideUpSelectors.some(selector => target.matches(selector))) {
                target.classList.add('slide-up');
            }

            obs.unobserve(target);
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));
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
    elements.bannerContainer?.appendChild(makotoMemoryTag);

    const config = {
        changeInterval: 5.5,
        fadeTransitionDuration: 0.35,
        gifFadeDuration: 0.25,
        progressUpdateFrequency: 0.05,
        renderDelay: 0.05
    };

    const bannerUrls = [
        'https://files.catbox.moe/9cvf8l.jpeg',
        'https://files.catbox.moe/c6vwxv.gif',
        'https://files.catbox.moe/a53d5g.jpg',
        'https://files.catbox.moe/dx4dym.jpg',
        'https://files.catbox.moe/kfn36d.jpg',
        'https://files.catbox.moe/5fwex5.jpg',
        'https://files.catbox.moe/1m7rx3.jpg',
        'https://files.catbox.moe/ymqw8y.jpg',
        'https://files.catbox.moe/7c6pr2.jpg',
        'https://files.catbox.moe/yf43bj.jpg',
        'https://files.catbox.moe/ox23f5.jpeg',
        'https://files.catbox.moe/ai4oz2.gif',
        'https://files.catbox.moe/25kggw.gif',
        'https://files.catbox.moe/obaond.jpg',
        'https://files.catbox.moe/vywstu.jpg',
        'https://files.catbox.moe/4nz27h.jpg',
        'https://files.catbox.moe/p0duyn.jpg',
        'https://files.catbox.moe/590yyq.png',
        'https://files.catbox.moe/dvxsv8.jpg',
        'https://files.catbox.moe/a8y5q1.jpg'
    ];

    const euthymiaBannerUrls = new Set([
        'https://files.catbox.moe/1m7rx3.jpg',
        'https://files.catbox.moe/ymqw8y.jpg',
        'https://files.catbox.moe/a53d5g.jpg',
        'https://files.catbox.moe/lc17bc.jpg',
        'https://files.catbox.moe/4nz27h.jpg'
    ]);

    // State management
    const state = {
        currentBannerIndex: 0,
        progressIntervalId: null,
        nextChangeTimeoutId: null,
        isBanner1Active: true,
        isLoadingNext: false,
        shuffledIndexes: shuffleArray([...Array(bannerUrls.length).keys()]),
        currentShuffledIndex: 0,
        startTime: null,
        pauseStartTime: null
    };

    if (!validateElements()) return;

    function validateElements() {
        return !!(
            elements.bannerContainer && 
            elements.bannerImg1 && 
            elements.bannerImg2 && 
            bannerUrls.length > 0
        );
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
        if (state.currentShuffledIndex >= state.shuffledIndexes.length - 1) {
            state.shuffledIndexes = shuffleArray(state.shuffledIndexes);
            state.currentShuffledIndex = -1;
        }
        return state.shuffledIndexes[++state.currentShuffledIndex];
    }

    function clearTimers() {
        if (state.progressIntervalId) {
            clearInterval(state.progressIntervalId);
            state.progressIntervalId = null;
        }
        if (state.nextChangeTimeoutId) {
            clearTimeout(state.nextChangeTimeoutId);
            state.nextChangeTimeoutId = null;
        }
    }

    function setProgressStyles(progress, useTransition = true) {
        if (elements.progressBar) {
            elements.progressBar.style.transition = useTransition 
                ? `width ${config.progressUpdateFrequency}s linear` 
                : 'none';
            elements.progressBar.style.width = `${progress}%`;
        }
        
        if (elements.progressGif) {
            const transition = useTransition 
                ? `left ${config.progressUpdateFrequency}s linear, opacity ${config.gifFadeDuration}s ease-in-out` 
                : 'none';
            elements.progressGif.style.transition = transition;
            elements.progressGif.style.left = `${progress}%`;
        }
    }

    function resetProgress() {
        setProgressStyles(0, false);
        elements.progressGif?.classList.add('hidden');
    }

    function runProgressAnimation() {
        clearTimers();
        elements.progressGif?.classList.remove('hidden');
        
        state.progressIntervalId = setInterval(() => {
            if (state.isLoadingNext) return;
            
            const elapsedTime = (Date.now() - state.startTime) / 1000;
            const progress = Math.min((elapsedTime / config.changeInterval) * 100, 100);
            
            if (progress >= 100) {
                clearInterval(state.progressIntervalId);
                state.progressIntervalId = null;
                setProgressStyles(100, false);
                
                state.nextChangeTimeoutId = setTimeout(() => {
                    if (!document.hidden) prepareBannerChange();
                    state.nextChangeTimeoutId = null;
                }, config.renderDelay * 1000);
            } else {
                setProgressStyles(progress, true);
            }
        }, config.progressUpdateFrequency * 1000);
    }

    function startProgressCycle() {
        clearTimers();
        state.isLoadingNext = false;
        resetProgress();
        state.startTime = Date.now();
        setTimeout(runProgressAnimation, 50);
    }

    function prepareBannerChange() {
        if (state.isLoadingNext) return;
        state.isLoadingNext = true;
        
        const newIndex = getNextIndex();
        const newBannerUrl = bannerUrls[newIndex];
        const activeBanner = state.isBanner1Active ? elements.bannerImg1 : elements.bannerImg2;
        const nextBanner = state.isBanner1Active ? elements.bannerImg2 : elements.bannerImg1;
        
        const img = new Image();
        
        img.onload = () => {
            state.currentBannerIndex = newIndex;
            resetProgress();
            
            activeBanner.classList.remove('active');
            nextBanner.classList.add('active');
            nextBanner.src = newBannerUrl;
            
            state.isBanner1Active = !state.isBanner1Active;
            
            updateBioStyle(newBannerUrl);
            updateMakotoMemoryTag(newBannerUrl);
            
            setTimeout(() => {
                state.isLoadingNext = false;
                startProgressCycle();
            }, config.fadeTransitionDuration * 1000);
        };
        
        img.onerror = () => {
            state.isLoadingNext = false;
            startProgressCycle();
        };
        
        img.src = newBannerUrl;
    }

    function updateBioStyle(currentUrl) {
        const isEuthymia = euthymiaBannerUrls.has(currentUrl);
        elements.bio?.classList.toggle('euthymia-bio-style', isEuthymia);
        elements.bannerContainer?.classList.toggle('euthymia-bio-style', isEuthymia);
    }

    function updateMakotoMemoryTag(currentUrl) {
        if (currentUrl === makotoBannerUrl) {
            makotoMemoryTag.style.display = 'block';
            makotoMemoryTag.classList.remove('hide');
        } else {
            makotoMemoryTag.classList.add('hide');
            
            const handleAnimationEnd = () => {
                if (makotoMemoryTag.classList.contains('hide')) {
                    makotoMemoryTag.style.display = 'none';
                    makotoMemoryTag.classList.remove('hide');
                }
                makotoMemoryTag.removeEventListener('animationend', handleAnimationEnd);
            };
            
            makotoMemoryTag.addEventListener('animationend', handleAnimationEnd);
        }
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            clearTimers();
            state.pauseStartTime = Date.now();
        } else {
            if (state.pauseStartTime && state.startTime) {
                const pausedDuration = Date.now() - state.pauseStartTime;
                state.startTime += pausedDuration;
                state.pauseStartTime = null;

                const elapsedTime = (Date.now() - state.startTime) / 1000;
                const progress = Math.min((elapsedTime / config.changeInterval) * 100, 100);

                if (progress >= 100) {
                    prepareBannerChange();
                    return;
                } else {
                    setProgressStyles(progress, false);
                    elements.progressGif?.classList.remove('hidden');
                }
            }
            
            runProgressAnimation();
        }
    }

    function initializeBanner() {
        if (bannerUrls.length === 0) {
            elements.bannerContainer.style.display = 'none';
            return;
        }
        
        elements.bannerImg1.src = bannerUrls[state.currentBannerIndex];
        
        elements.bannerImg1.onload = () => {
            elements.bannerImg1.classList.add('active');
            elements.bannerImg2.classList.remove('active');
            startProgressCycle();
        };
        
        elements.bannerImg1.onerror = () => {
            elements.bannerImg2.classList.remove('active');
            startProgressCycle();
        };
        
        updateBioStyle(bannerUrls[state.currentBannerIndex]);
        updateMakotoMemoryTag(bannerUrls[state.currentBannerIndex]);
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
  if (!element) return; // Safety check
  
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smoother animation (optional)
    const easeOutQuad = progress * (2 - progress); // Makes it slow down at the end
    
    const current = Math.floor(start + (end - start) * easeOutQuad);
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Ensure final value is exact
      element.textContent = end.toLocaleString();
    }
  };
  
  requestAnimationFrame(animate);
}

function calculateStats() {
  const today = new Date();
  
  const stats = [
    {
      id: 'genshin-days',
      value: Math.ceil((today - GENSHIN_START_DATE) / 86400000), // 86400000 = 1000*60*60*24
      duration: 2000,
      delay: 0
    },
    {
      id: 'raiden-days',
      value: Math.ceil((today - RAIDEN_OBTAINED_DATE) / 86400000),
      duration: 2500,
      delay: 150
    }
  ];
  
  // Animate all stats
  stats.forEach(stat => {
    const el = document.getElementById(stat.id);
    if (el) {
      setTimeout(() => {
        animateNumber(el, 0, stat.value, stat.duration);
      }, stat.delay);
    }
  });
  
  // Constellation display
  const constellationEl = document.getElementById('constellation');
  if (constellationEl) {
    constellationEl.textContent = `${RAIDEN_CONSTELLATION}`;
    constellationEl.style.textShadow = '0 0 8px var(--raiden-glow)';
  }
}


// State management
const state = {
  ws: null,
  isConnected: false,
  isConnecting: false,
  reconnectTimer: null,
  heartbeatInterval: null,
  initTimeout: null,
  renderDebounceTimer: null,
  backoff: 1000,
  currentSessionID: null,
  lastConnectAttempt: 0,
  lastPresenceHash: null
};

// Cache management
const cache = {
  data: null,
  timestamp: 0,
  isRevalidating: false
};

// DOM elements cache
const elements = {
  presence: null,
  avatar: null
};

// Constants
const CONFIG = {
  MAX_BACKOFF: 30000,
  CACHE_TTL: 60000,
  SWR_THRESHOLD: 120000,
  CONNECT_DEBOUNCE: 1500,
  INIT_TIMEOUT: 10000,
  REVALIDATE_TIMEOUT: 8000,
  RENDER_DEBOUNCE: 150,
  AVATAR_SIZE: 128
};

// Cache utilities
function setCache(data) {
  cache.data = data;
  cache.timestamp = Date.now();
}

function getCache() {
  const age = Date.now() - cache.timestamp;
  
  if (age < CONFIG.CACHE_TTL) return cache.data;
  
  if (age < CONFIG.SWR_THRESHOLD && !cache.isRevalidating) {
    revalidateCache();
    return cache.data;
  }
  
  return null;
}

async function revalidateCache() {
  if (cache.isRevalidating) return;
  cache.isRevalidating = true;
  
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), CONFIG.REVALIDATE_TIMEOUT);
  
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { 
      signal: ac.signal 
    });
    const json = await res.json();
    
    if (json?.success && json.data) {
      if (presenceChanged(cache.data, json.data)) {
        setCache(json.data);
        debouncedRenderPresence(json.data);
      } else {
        setCache(json.data);
      }
    }
  } catch (err) {
    console.warn("Cache revalidation failed:", err);
  } finally {
    clearTimeout(timeout);
    cache.isRevalidating = false;
  }
}

// Avatar utilities
function safeAvatarUrl(id, hash, size = CONFIG.AVATAR_SIZE) {
  if (!hash) return 'https://cdn.discordapp.com/embed/avatars/0.png';
  
  const isGif = hash.startsWith('a_');
  const ext = isGif ? 'gif' : 'webp';
  return `https://cdn.discordapp.com/avatars/${id}/${hash}.${ext}?size=${size}`;
}

function setAvatar(hash) {
  if (!elements.avatar) {
    elements.avatar = document.getElementById('discord_pfp');
  }
  if (!elements.avatar) return;
  
  elements.avatar.onerror = () => {
    elements.avatar.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
  };
  elements.avatar.src = safeAvatarUrl(DISCORD_USER_ID, hash);
}

// Presence comparison
function presenceChanged(oldP, newP) {
  if (!oldP || !newP) return true;
  if (oldP.discord_status !== newP.discord_status) return true;
  if ((oldP.discord_user?.avatar || '') !== (newP.discord_user?.avatar || '')) return true;
  
  const oldActs = oldP.activities || [];
  const newActs = newP.activities || [];
  if (oldActs.length !== newActs.length) return true;
  
  for (let i = 0; i < Math.min(oldActs.length, newActs.length); i++) {
    if (oldActs[i].name !== newActs[i].name || oldActs[i].type !== newActs[i].type) {
      return true;
    }
  }
  
  return false;
}

function getPresenceHash(data) {
  if (!data?.discord_user) return null;
  
  const activities = (data.activities || [])
    .filter(a => a && a.type !== 4)
    .map(a => ({
      name: a.name,
      type: a.type,
      details: a.details,
      state: a.state
    }));
  
  return JSON.stringify({
    status: data.discord_status,
    avatar: data.discord_user.avatar,
    username: data.discord_user.global_name || data.discord_user.username,
    activities
  });
}

// Render functions
function debouncedRenderPresence(data) {
  if (state.renderDebounceTimer) {
    cancelAnimationFrame(state.renderDebounceTimer);
  }
  
  state.renderDebounceTimer = requestAnimationFrame(() => {
    renderPresence(data);
    state.renderDebounceTimer = null;
  });
}

function renderPresence(data) {
  if (!data?.discord_user) return;
  
  const currentHash = getPresenceHash(data);
  if (currentHash === state.lastPresenceHash) return;
  state.lastPresenceHash = currentHash;
  
  const user = data.discord_user;
  const status = data.discord_status || 'offline';
  const activities = Array.isArray(data.activities) ? data.activities : [];
  const displayName = user.global_name || user.username || 'Unknown';
  
  setAvatar(user.avatar);

  let activityText = '';
  let isGenshin = false;

  if (status === 'offline') {
    activityText = '<i class="fab fa-discord"></i> Offline';
  } else {
    const priority = { 2: 1, 0: 2, 1: 3 };
    const activity = activities
      .filter(a => a && a.type !== 4)
      .sort((a, b) => (priority[a.type] ?? 99) - (priority[b.type] ?? 99))[0];

    if (activity) {
      if (activity.name?.toLowerCase().includes('genshin')) {
        isGenshin = true;
        activityText = '<i class="fas fa-bolt"></i> Playing Genshin Impact';
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
      const statusText = {
        online: 'Online',
        idle: 'Idle',
        dnd: 'Do Not Disturb'
      };
      activityText = statusText[status] || '';
    }
  }

  if (!elements.presence) {
    elements.presence = document.getElementById('discord-presence');
  }
  if (!elements.presence) return;

  elements.presence.classList.add('fade-out');
  
  setTimeout(() => {
    elements.presence.innerHTML = `
      <div class="discord-status ${isGenshin ? 'genshin-activity' : ''}">
        <img src="${safeAvatarUrl(DISCORD_USER_ID, user.avatar, 64)}"
             alt="Discord Avatar" 
             class="discord-avatar" 
             loading="lazy"/>
        <div class="discord-info">
          <div class="discord-username">${displayName}</div>
          <div class="discord-activity">
            <span class="activity-text">${activityText}</span>
          </div>
        </div>
        <div class="status-indicator status-${status}"></div>
      </div>`;
    elements.presence.classList.remove('fade-out');
  }, CONFIG.RENDER_DEBOUNCE);
}

// Cleanup utilities
function clearTimers() {
  if (state.reconnectTimer) {
    clearTimeout(state.reconnectTimer);
    state.reconnectTimer = null;
  }
  if (state.heartbeatInterval) {
    clearInterval(state.heartbeatInterval);
    state.heartbeatInterval = null;
  }
  if (state.initTimeout) {
    clearTimeout(state.initTimeout);
    state.initTimeout = null;
  }
  if (state.renderDebounceTimer) {
    cancelAnimationFrame(state.renderDebounceTimer);
    state.renderDebounceTimer = null;
  }
}

function closeWebSocket() {
  try {
    if (state.ws?.readyState === WebSocket.OPEN || 
        state.ws?.readyState === WebSocket.CONNECTING) {
      state.ws.close();
    }
  } catch (e) {
    console.warn('WS close error:', e);
  }
}

// Connection management
async function connectLanyard() {
  const now = Date.now();
  if (now - state.lastConnectAttempt < CONFIG.CONNECT_DEBOUNCE) return;
  state.lastConnectAttempt = now;

  if (!elements.presence) {
    elements.presence = document.getElementById('discord-presence');
  }
  if (!elements.presence) return;
  if (state.isConnecting || state.isConnected) return;

  clearTimers();
  closeWebSocket();
  
  state.isConnecting = true;
  elements.presence.innerHTML = '<div class="discord-status connecting"><i class="fab fa-discord"></i> Connecting...</div>';

  // Try to use cached data first
  const cached = getCache();
  if (!cached) {
    try {
      const ac = new AbortController();
      const timeout = setTimeout(() => ac.abort(), CONFIG.REVALIDATE_TIMEOUT);
      
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {
        signal: ac.signal
      });
      clearTimeout(timeout);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const json = await res.json();
      if (json?.success && json.data) {
        setCache(json.data);
        debouncedRenderPresence(json.data);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err) {
      console.warn('Lanyard REST fetch failed:', err);
      // REST failed, but we'll continue with WebSocket
      // If WebSocket also fails, reconnect will handle retry
    }
  } else {
    debouncedRenderPresence(cached);
  }

  // Create WebSocket
  let ws;
  try {
    ws = new WebSocket('wss://api.lanyard.rest/socket');
  } catch (err) {
    console.error('WS creation error:', err);
    state.isConnecting = false;
    scheduleReconnect();
    return;
  }

  const sessionID = Date.now().toString(36) + Math.random().toString(36).slice(2);
  state.currentSessionID = sessionID;
  state.ws = ws;

  ws.onopen = () => {
    if (state.currentSessionID !== sessionID) return;
    
    state.isConnected = true;
    state.isConnecting = false;
    state.backoff = 1000;
    
    try {
      ws.send(JSON.stringify({ 
        op: 2, 
        d: { subscribe_to_id: DISCORD_USER_ID } 
      }));
    } catch (e) {
      console.warn('Send subscribe error:', e);
    }
    
    state.initTimeout = setTimeout(() => {
      if (state.currentSessionID !== sessionID) return;
      console.warn('INIT_STATE timeout - forcing reconnect');
      state.isConnected = false;
      state.isConnecting = false;
      clearTimers();
      closeWebSocket();
      scheduleReconnect();
    }, CONFIG.INIT_TIMEOUT);
  };

  ws.onmessage = ({ data }) => {
    if (state.currentSessionID !== sessionID) return;
    
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }
    
    const { op, t, d } = parsed || {};
    
    // Setup heartbeat
    if (op === 1 && d?.heartbeat_interval) {
      clearInterval(state.heartbeatInterval);
      state.heartbeatInterval = setInterval(() => {
        try {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ op: 3 }));
          }
        } catch (e) {
          console.warn('Heartbeat send error:', e);
        }
      }, d.heartbeat_interval);
    }
    
    // Clear init timeout on INIT_STATE
    if (t === 'INIT_STATE') {
      clearTimeout(state.initTimeout);
      state.initTimeout = null;
    }
    
    // Handle presence updates
    if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
      const presence = t === 'INIT_STATE' ? d[DISCORD_USER_ID] : d;
      if (presence?.discord_user) {
        setCache(presence);
        debouncedRenderPresence(presence);
      }
    }
  };

  ws.onerror = (err) => {
    console.error('WS error:', err);
    if (state.currentSessionID !== sessionID) return;
    
    state.isConnected = false;
    state.isConnecting = false;
    clearTimers();
    closeWebSocket();
    
    // Show error state if no cached data
    if (!cache.data && elements.presence) {
      elements.presence.innerHTML = '<div class="discord-status connecting"><i class="fab fa-discord"></i> Connection failed, retrying...</div>';
    }
    
    scheduleReconnect();
  };

  ws.onclose = () => {
    if (state.currentSessionID !== sessionID) return;
    
    state.isConnected = false;
    state.isConnecting = false;
    clearTimers();
    
    // Show error state if no cached data
    if (!cache.data && elements.presence) {
      elements.presence.innerHTML = '<div class="discord-status connecting"><i class="fab fa-discord"></i> Reconnecting...</div>';
    }
    
    scheduleReconnect();
  };
}

function scheduleReconnect() {
  if (state.reconnectTimer) return;
  
  const jitter = Math.floor(Math.random() * Math.min(1000, state.backoff));
  const wait = Math.min(state.backoff + jitter, CONFIG.MAX_BACKOFF);
  
  state.reconnectTimer = setTimeout(() => {
    state.reconnectTimer = null;
    connectLanyard();
  }, wait);
  
  state.backoff = Math.min(Math.floor(state.backoff * 1.8), CONFIG.MAX_BACKOFF);
}

// Event listeners
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !state.isConnected && !state.isConnecting) {
    connectLanyard();
  }
});

['beforeunload', 'pagehide'].forEach(evt => {
  window.addEventListener(evt, () => {
    clearTimers();
    closeWebSocket();
    state.isConnected = false;
    state.isConnecting = false;
  });
});
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


function preloadImagesThrottled(urls, perTick = 2, delay = 350, settleDelay = 1200) {
  const queue = [...new Set(urls)]; // remove duplicates
  const cache = new Set(); // track loaded URLs

  function tick() {
    let count = 0;
    while (count < perTick && queue.length) {
      const url = queue.shift();
      if (!url || cache.has(url)) continue;

      const img = new Image();
      img.decoding = 'async'; // hint for async decode
      img.loading = 'eager';  // force preload
      img.src = url;

      img.onload = () => cache.add(url);
      img.onerror = () => console.warn('Failed to preload:', url);

      count++;
    }
    if (queue.length) setTimeout(tick, delay);
  }

  setTimeout(tick, settleDelay);
}


// ===== COLLECTION SLIDER FUNCTIONALITY =====
let collectionSlides = [];
let collectionCurrentIndex = 0;
let collectionAutoplayTimer;
let collectionIndicators = [];
let collectionModalIndicators = [];

function initializeCollectionSlider() {
    const sliderContainer = document.getElementById('collectionSlider');
    if (!sliderContainer) return;

    collectionSlides = [...document.querySelectorAll('.collection-slide')];
    const rail = document.getElementById('collectionRail');
    const indicatorsWrap = document.getElementById('collectionIndicators');
    const modalIndicatorsWrap = document.getElementById('collectionModalIndicators');
    const modal = document.getElementById('collectionModal');
    const modalImg = document.getElementById('collectionModalImg');
    const modalInstaLink = document.getElementById('collectionModalInstaLink');
    const modalInstaText = document.getElementById('collectionModalInstaText');

    if (!collectionSlides.length) return;

    // Create indicators
    function createCollectionIndicators(container, clickFn) {
        container.innerHTML = '';
        return collectionSlides.map((_, i) => {
            let b = document.createElement('button');
            b.className = 'collection-indicator';
            b.innerHTML = '<i class="fa-solid fa-bolt"></i>';
            b.onclick = () => clickFn(i);
            container.appendChild(b);
            return b;
        });
    }

    function updateCollectionIndicators(inds, active) {
        inds.forEach((el, idx) => el.classList.toggle('active', idx === active));
    }

    collectionIndicators = createCollectionIndicators(indicatorsWrap, goToCollectionSlide);
    collectionModalIndicators = createCollectionIndicators(modalIndicatorsWrap, (i) => {
        goToCollectionSlide(i);
        showCollectionModalImage(i, true);
    });

    // Slider functions
    function goToCollectionSlide(i, skipHash = false) {
        const len = collectionSlides.length;
        collectionCurrentIndex = (i + len) % len;
        
        // Hide all slides
        collectionSlides.forEach(slide => slide.classList.remove('active'));
        
        // Show active slide
        collectionSlides[collectionCurrentIndex].classList.add('active');
        
        updateCollectionIndicators(collectionIndicators, collectionCurrentIndex);
        if (modal.style.display === 'flex') {
            showCollectionModalImage(collectionCurrentIndex, true);
        }
        if (!skipHash) location.hash = `#collection-slide-${collectionCurrentIndex + 1}`;
        startCollectionAutoplay();
    }

    function nextCollectionSlide() { 
        goToCollectionSlide(collectionCurrentIndex + 1); 
    }

    function prevCollectionSlide() { 
        goToCollectionSlide(collectionCurrentIndex - 1); 
    }

    // Modal functions
    function showCollectionModalImage(i, skipHash = false) {
        const s = collectionSlides[i];
        modalImg.style.opacity = '0';
        setTimeout(() => {
            modalImg.src = s.querySelector('img').src;
            const linkEl = s.querySelector('.collection-insta-link');
            modalInstaLink.href = linkEl.href;
            modalInstaText.textContent = linkEl.textContent.trim();
            modalImg.style.opacity = '1';
            updateCollectionIndicators(collectionModalIndicators, i);
        }, 150);
        if (!skipHash) location.hash = `#collection-slide-${i + 1}`;
    }

    function openCollectionModal(i) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
        goToCollectionSlide(i);
        stopCollectionAutoplay();
    }

    function closeCollectionModal() {
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('fade-in', 'fade-out');
            startCollectionAutoplay();
        }, 250);
    }

    // Event listeners
    collectionSlides.forEach((s, i) => {
        const img = s.querySelector('img');
        if (img) {
            img.onclick = () => openCollectionModal(i);
        }
    });

    // Navigation buttons
    const prevBtn = document.getElementById('collectionPrevBtn');
    const nextBtn = document.getElementById('collectionNextBtn');
    const modalPrevBtn = document.getElementById('collectionModalPrev');
    const modalNextBtn = document.getElementById('collectionModalNext');
    const closeBtn = document.getElementById('collectionCloseModal');

    if (prevBtn) prevBtn.onclick = prevCollectionSlide;
    if (nextBtn) nextBtn.onclick = nextCollectionSlide;
    if (modalPrevBtn) modalPrevBtn.onclick = prevCollectionSlide;
    if (modalNextBtn) modalNextBtn.onclick = nextCollectionSlide;
    if (closeBtn) closeBtn.onclick = closeCollectionModal;

    // Modal click to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCollectionModal();
        }
    });

    // Swipe functionality
    function handleCollectionSwipe(el, leftFn, rightFn) {
        let startX = 0;
        el.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX, { passive: true });
        el.addEventListener('touchend', e => {
            let dist = e.changedTouches[0].screenX - startX;
            if (Math.abs(dist) > 50) { 
                dist < 0 ? leftFn() : rightFn(); 
            }
        }, { passive: true });
    }

    handleCollectionSwipe(sliderContainer, nextCollectionSlide, prevCollectionSlide);
    handleCollectionSwipe(modal, nextCollectionSlide, prevCollectionSlide);

    // Autoplay functions
    function startCollectionAutoplay() {
        stopCollectionAutoplay();
        collectionAutoplayTimer = setInterval(nextCollectionSlide, 5000);
    }

    function stopCollectionAutoplay() { 
        clearInterval(collectionAutoplayTimer); 
    }

    // Mouse events for autoplay
    sliderContainer.addEventListener('mouseenter', stopCollectionAutoplay);
    sliderContainer.addEventListener('mouseleave', startCollectionAutoplay);
    modal.addEventListener('mouseenter', stopCollectionAutoplay);
    modal.addEventListener('mouseleave', startCollectionAutoplay);

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') prevCollectionSlide();
            if (e.key === 'ArrowRight') nextCollectionSlide();
            if (e.key === 'Escape') closeCollectionModal();
        }
    });

    // Hash deep link
    function openFromCollectionHash() {
        const match = location.hash.match(/collection-slide-(\d+)/);
        if (match) {
            const idx = parseInt(match[1], 10) - 1;
            if (idx >= 0 && idx < collectionSlides.length) {
                goToCollectionSlide(idx, true);
            }
        }
    }

    // Initialize
    goToCollectionSlide(0, true);
    startCollectionAutoplay();
    window.addEventListener('load', openFromCollectionHash);
}

   function initializePage() {
    handleIntroOverlay();
// connectLanyard();

    setupHeartEffect();
    setupTweetEmbed('.tweet-embed-container');
  setupParticleCanvas();
 //   initializeDynamicBanner();
    
//initializeBirthdayCountdown();
startBirthdayCelebration();
    
   initializeCollectionSlider(); 
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {

    initializePage();
}
