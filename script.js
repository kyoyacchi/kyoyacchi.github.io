const PRELOADER_EXIT_DELAY = 1500;
const PRELOADER_FADE_DURATION = 500;
const PARTICLE_COUNT = 55;
const DISCORD_USER_ID = "468509605828493322";
const GITHUB_AVATAR_URL = "https://avatars.githubusercontent.com/u/63583961";
const DISCORD_API_URL = `https://kyopi.vercel.app/api/pfp?id=${DISCORD_USER_ID}`;

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

async function getDiscordAv() {
    try {
        const response = await axios.get(DISCORD_API_URL, { timeout: 5000 });
        if (response.data && response.data.avatar) {
            return { avatar: response.data.avatar, error: false };
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        console.error("Failed to fetch Discord avatar:", error.message);
        return { avatar: null, error: true };
    }
}

function showPopUp(isError) {
    if (document.getElementById("status-pop")) return;

    const pop = document.createElement("div");
    const innerDiv = document.createElement("div");
    pop.id = "status-pop";
    innerDiv.className = "pop-inner";

    pop.classList.add(isError ? "error" : "success");
    innerDiv.innerHTML = `<i class="fas ${isError ? "fa-times-circle" : "fa-check-circle"}"></i> ${isError ? "couldn't update discord pfp" : "updated discord pfp"}`;

    pop.appendChild(innerDiv);
    document.body.appendChild(pop);

    requestAnimationFrame(() => {
        pop.classList.add("visible");
    });

    setTimeout(() => {
        pop.classList.remove("visible");
        setTimeout(() => {
            if (pop.parentNode) pop.parentNode.removeChild(pop);
        }, 400);
    }, 3500);
}

async function updateDiscordPfp() {
    const avatarElement = document.getElementById("discord_pfp");
    if (!avatarElement) return;

    let currentStoredAvatar = localStorage.getItem('discord_avatar');
    let fetchedAvatarData = { avatar: null, error: true };

    try {
        fetchedAvatarData = await getDiscordAv();
    } catch {}

    let finalAvatarUrl = fetchedAvatarData.error ? (currentStoredAvatar || GITHUB_AVATAR_URL) : fetchedAvatarData.avatar;

    if (!fetchedAvatarData.error && fetchedAvatarData.avatar !== currentStoredAvatar) {
        localStorage.setItem('discord_avatar', fetchedAvatarData.avatar);
        showPopUp(false);
        currentStoredAvatar = fetchedAvatarData.avatar;
    } else if (fetchedAvatarData.error && currentStoredAvatar) {
        showPopUp(true);
    }

    avatarElement.onerror = () => {
        avatarElement.src = GITHUB_AVATAR_URL;
    };

    avatarElement.src = finalAvatarUrl;
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

            // Banner geçişi
            activeBanner.classList.remove('active');
            nextBanner.classList.add('active');
            isBanner1Active = !isBanner1Active;

            updateBioStyle(newBannerUrl);

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
    }


    document.addEventListener('visibilitychange', handleVisibilityChange);

    
    initializeBanner();
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





    function initializePage() {
    handleIntroOverlay();

   updateDiscordPfp();
    setupHeartEffect();
    setupTweetEmbed('.tweet-embed-container');
 //  PreventRightClick();
  setupParticleCanvas();
    setupScrollAnimations();
    initializeDynamicBanner();
//initializeBirthdayCountdown();
startBirthdayCelebration();
    const checkmarkIcon = document.querySelector('.checkmark');
    if (checkmarkIcon) {
const tooltips = document.querySelectorAll('.tooltip');

   /* tooltips.forEach(tooltipContainer => {
        const tooltipText = tooltipContainer.querySelector('.tooltiptext');
        let autoHideTimer = null;
        let visibilityTimer = null; 

        if (!tooltipText) {
            return; 
        }


        tooltipContainer.addEventListener('mouseenter', function() {

            clearTimeout(autoHideTimer);
            clearTimeout(visibilityTimer);


            tooltipText.style.opacity = '';
            tooltipText.style.transform = '';
            tooltipText.style.visibility = '';
            

            autoHideTimer = setTimeout(() => {

                tooltipText.style.opacity = '0';
                tooltipText.style.transform = 'translateX(-50%) translateY(10px)'; 
                clearTimeout(visibilityTimer); 
                visibilityTimer = setTimeout(() => {
                    tooltipText.style.visibility = 'hidden';
                }, 400); 

            }, 1500); 
        });


        tooltipContainer.addEventListener('mouseleave', function() {

            clearTimeout(autoHideTimer);
            clearTimeout(visibilityTimer);


            tooltipText.style.opacity = '';
            tooltipText.style.transform = '';
            tooltipText.style.visibility = '';
        });
    });*/

    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {

    initializePage();
}