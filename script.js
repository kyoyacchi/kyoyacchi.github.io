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

    const hidePreloaderNormally = () => {
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
    };

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const isRaidenBirthday = (currentMonth === 5 && currentDay === 26);

    if (isRaidenBirthday) {
        preloaderText.textContent = "Happy birthday, Almighty Raiden Shogun!";
        subtitleText.textContent = "🎉 Glory to the Shogun!⚡️";
        subtitleText.style.top = '61%';

        introOverlay.classList.remove('shake-it');
        introOverlay.classList.remove('shogun-denied');
        const existingDeniedIcon = introOverlay.querySelector('.denied-icon');
        if (existingDeniedIcon) existingDeniedIcon.remove();

        setTimeout(hidePreloaderNormally, 2500);
        return;
    } else {
        subtitleText.style.top = '';
    }

    const denialChance = 0.002;
    if (Math.random() < denialChance) {
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
            const deniedIcon = introOverlay.querySelector('.denied-icon');
            if (deniedIcon) deniedIcon.remove();

            preloaderText.textContent = "The Almighty Raiden Shogun has approved your access.";
            preloaderText.className = 'preloader-text approved-text';

            setTimeout(hidePreloaderNormally, 2000);
        }, 1500);

    } else {
        const texts = [
            'Now, you shall perish!',
            'There is no escape!',
            'Inazuma shines eternal!',
            'Inabikari, sunawachi Eien nari',
            'Mikirimashita',
            'NONE CAN CONTEND WITH THE SUPREME POWER OF THE ALMIGHTY RAIDEN SHOGUN AND THE MUSOU NO HITOTACHI!',
            'Shine down!',
            'Illusion shattered!',
            'Torn to oblivion!',
            'Sabaki no ikazuchi',
            'Nigemichi wa arimasen',
            'Muga no kyouchi he',
            'Koko yori, jakumetsu no toki!',
            'Musou me harder, mommy'
        ];
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        preloaderText.textContent = randomText;

        subtitleText.textContent = '';

        if (randomText === 'Musou me harder, mommy') {
            subtitleText.textContent = '- A Turkish guy who is obsessed over Raiden Shogun';
            introOverlay.classList.add('shake-it');
            setTimeout(() => introOverlay.classList.remove('shake-it'), 300);
        }

        setTimeout(hidePreloaderNormally, 2000);
    }
}







function setupTweetEmbed(containerSelector) {
    const tweetContainer = document.querySelector(containerSelector);

    if (!tweetContainer) {
        console.error(`Tweet container ('${containerSelector}') not found.`);
        return;
    }

    const tweetContent = tweetContainer.querySelector('.tweet-content');
    let loadingIndicator = tweetContainer.querySelector('.loading-wrapper') || tweetContainer.querySelector('.loading-spinner');

    if (!tweetContent) {
        console.error(`Required element '.tweet-content' not found inside '${containerSelector}'.`);
        return;
    }

    if (!loadingIndicator) {
         console.warn(`Optional element '.loading-wrapper' or '.loading-spinner' not found inside '${containerSelector}'. Loading state might not be visible.`);
    }

    let isTweetLoading = false;
    let isTweetLoaded = false;
    const lang = navigator.language;
    const isTurkish = lang.toLowerCase().startsWith("tr");

    const tweetEmbedHTML_TR = `
        <blockquote class="twitter-tweet" data-lang="tr" data-dnt="true" data-theme="dark">
        <p lang="en" dir="ltr">RAAAAAAGAHSJSHAHSHNADJAJDJ I DID IT! <a href="https://twitter.com/hashtag/raidenshogun?src=hash&amp;ref_src=twsrc%5Etfw">#raidenshogun</a> <a href="https://twitter.com/hashtag/genshinimpact?src=hash&amp;ref_src=twsrc%5Etfw">#genshinimpact</a> WITH HER WEAPON LMAOAOOOO <a href="https://t.co/L7mJJ3DezG">pic.twitter.com/L7mJJ3DezG</a></p>
        &mdash; Kyoや (@kyoyacchi) <a href="https://twitter.com/kyoyacchi/status/1836094129312297212?ref_src=twsrc%5Etfw">17 Eylül 2024</a></blockquote>`;

    const tweetEmbedHTML_EN = `
        <blockquote class="twitter-tweet" data-lang="en" data-theme="dark">
        <p lang="en" dir="ltr">RAAAAAAGAHSJSHAHSHNADJAJDJ I DID IT! <a href="https://twitter.com/hashtag/raidenshogun?src=hash&amp;ref_src=twsrc%5Etfw">#raidenshogun</a> <a href="https://twitter.com/hashtag/genshinimpact?src=hash&amp;ref_src=twsrc%5Etfw">#genshinimpact</a> WITH HER WEAPON LMAOAOOOO <a href="https://t.co/L7mJJ3DezG">pic.twitter.com/L7mJJ3DezG</a></p>
        &mdash; Kyoや (@kyoyacchi) <a href="https://twitter.com/kyoyacchi/status/1836094129312297212?ref_src=twsrc%5Etfw">September 17, 2024</a></blockquote>`;

    tweetContent.innerHTML = isTurkish ? tweetEmbedHTML_TR : tweetEmbedHTML_EN;


    function showContent() {
        if (isTweetLoaded) return;
        isTweetLoaded = true;
        requestAnimationFrame(() => {
            tweetContent.style.opacity = '1';
            tweetContent.style.visibility = 'visible';
            tweetContent.classList.add('loaded');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        });
     //    console.log(`Tweet in ${containerSelector} loaded successfully.`);
    }

    function showErrorState(errorMessage = 'Could not load Tweet.') {
        if (isTweetLoaded) return;
        console.error(`Error loading tweet in ${containerSelector}:`, errorMessage);

        requestAnimationFrame(() => {
            if (loadingIndicator) {

                if (loadingIndicator.classList.contains('loading-wrapper')) {

                    loadingIndicator.innerHTML = `
                        <div style="color: red; text-align: center; display: flex; align-items: center; justify-content: center; padding: 10px;">
                            <i class="fas fa-times-circle" style="margin-right: 8px; font-size: 1.2em; vertical-align: middle;"></i>
                            <span>${errorMessage}</span>
                        </div>`;
                    loadingIndicator.style.display = 'flex';
                } else {

                    loadingIndicator.style.display = 'none';
                }
            }

            tweetContent.style.opacity = '0';
            tweetContent.style.visibility = 'hidden';
        });
    }

    function loadTweet() {

        window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            js.async = true;
            fjs.parentNode.insertBefore(js, fjs);
            t._e = [];
            t.ready = function(f) { t._e.push(f); };
            return t;
        }(document, "script", "twitter-wjs"));

        twttr.ready(function(twttrInstance) {
            let widgetLoaded = false;

            twttrInstance.events.bind('loaded', function(event) {

                if (event && event.widgets && event.widgets.some(widget => tweetContainer.contains(widget))) {
                    widgetLoaded = true;
                    showContent();
                }
            });

            twttrInstance.widgets.load(
                tweetContainer
            ).then(function(widgets) {

                 if ((!widgets || widgets.length === 0) && !widgetLoaded) {
                     setTimeout(() => {
                         if (!isTweetLoaded) {
    //                          console.warn(`widgets.load finished for ${containerSelector}, but no widgets found or 'loaded' event didn't fire.`);

                         }
                     }, 500);
                 }


            }).catch(function(error) {


            });
        });
    }



    if (loadingIndicator) {

        loadingIndicator.style.display = loadingIndicator.classList.contains('loading-wrapper') ? 'flex' : 'block';
    }
    tweetContent.style.opacity = '0';
    tweetContent.style.visibility = 'hidden';
    tweetContent.classList.remove('loaded');

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {

            if (entry.isIntersecting && !isTweetLoading) {
      //          console.log(`Tweet container ${containerSelector} is intersecting. Loading tweet.`);
                isTweetLoading = true;
                loadTweet();
                observerInstance.unobserve(tweetContainer);
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
const bannerContainer = document.querySelector('.banner');
const bannerImg1 = document.querySelector('.banner-img-1');
const bannerImg2 = document.querySelector('.banner-img-2');
const progressBarElement = document.querySelector('.banner-progress-bar');
const progressGifElement = document.querySelector('.progress-gif');
const bioElement = document.querySelector('.bio');
const profileImg = document.querySelector('.profile-img');
const tweetContent = document.querySelector('.tweet-content');
const tweetEmbedContainer = document.querySelector('.tweet-embed-container');

const bannerUrls = [
    'https://files.catbox.moe/9cvf8l.jpeg', 'https://files.catbox.moe/a53d5g.jpg', 'https://files.catbox.moe/27mh8k.jpg',
    'https://files.catbox.moe/ftsuwx.jpg', 'https://files.catbox.moe/dx4dym.jpg',
    'https://files.catbox.moe/l98fxt.jpg', 'https://files.catbox.moe/kfn36d.jpg',
    'https://files.catbox.moe/5fwex5.jpg', 'https://files.catbox.moe/1m7rx3.jpg',
    'https://files.catbox.moe/ymqw8y.jpg', 'https://files.catbox.moe/7c6pr2.jpg',
    'https://files.catbox.moe/bpr8u5.jpg', 'https://files.catbox.moe/yf43bj.jpg',
    'https://files.catbox.moe/4atada.jpg',
    'https://files.catbox.moe/ph6zj4.jpeg', 'https://files.catbox.moe/ox23f5.jpeg',
    'https://files.catbox.moe/ai4oz2.gif',
    'https://files.catbox.moe/25kggw.gif', 'https://files.catbox.moe/obaond.jpg', 'https://files.catbox.moe/vywstu.jpg',
    'https://files.catbox.moe/m0nyat.jpg',
    'https://files.catbox.moe/4nz27h.jpg'
];

const euthymiaBannerUrls = [
    'https://files.catbox.moe/1m7rx3.jpg',
    'https://files.catbox.moe/ymqw8y.jpg',
    'https://files.catbox.moe/a53d5g.jpg',
    'https://files.catbox.moe/lc17bc.jpg',
    'https://files.catbox.moe/4nz27h.jpg'
];

const changeInterval = 5500;
const fadeTransitionDuration = 350;
const gifFadeDuration = 250;
const progressUpdateFrequency = 50;
const renderDelay = 50;

let currentBannerIndex = 0;
let progressIntervalId = null;
let nextChangeTimeoutId = null;
let isBanner1Active = true;
let isLoadingNext = false;

if (!bannerContainer || !bannerImg1 || !bannerImg2) { console.warn("Banner elements not found."); return; }
if (!progressBarElement) { console.warn("Progress bar element not found."); }
if (!progressGifElement) { console.warn("Progress GIF element not found."); }
if (!bioElement) { console.warn("Bio element (.bio) not found."); }
if (bannerUrls.length === 0) { console.info('Banner URL list is empty.'); return; }

if (bannerUrls.length > 0) {
    bannerImg1.src = bannerUrls[currentBannerIndex];
    bannerImg1.onload = () => {
        bannerImg1.classList.add('active');
        bannerImg2.classList.remove('active');
        startProgressCycle();
    };
    bannerImg1.onerror = () => {
        console.error("Failed to load initial banner:", bannerUrls[currentBannerIndex]);
        bannerImg2.classList.remove('active');
        startProgressCycle();
    };

    isBanner1Active = true;
} else {
    bannerContainer.style.display = 'none';
    return;
}

let shuffledIndexes = [...Array(bannerUrls.length).keys()].sort(() => Math.random() - 0.5);


let currentShuffledIndex = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getNextIndex() {
    if (currentShuffledIndex === shuffledIndexes.length - 1) {
        shuffleArray(shuffledIndexes);
        currentShuffledIndex = -1; 
    }
    currentShuffledIndex++;
    return shuffledIndexes[currentShuffledIndex];
}


function runProgressAnimation() {
    const startTime = Date.now();

    if (progressIntervalId) clearInterval(progressIntervalId);
    if (nextChangeTimeoutId) clearTimeout(nextChangeTimeoutId);
    progressIntervalId = null; nextChangeTimeoutId = null;

    const transitionTiming = `${progressUpdateFrequency / 1000}s`;
    if (progressGifElement) { progressGifElement.style.transition = `left ${transitionTiming} linear, opacity ${gifFadeDuration / 1000}s ease-in-out`; }
    if (progressBarElement) { progressBarElement.style.transition = `width ${transitionTiming} linear`; }

    if (progressGifElement) { progressGifElement.classList.remove('hidden'); }

    progressIntervalId = setInterval(() => {
        if (isLoadingNext) {
            return;
        }

        const elapsedTime = Date.now() - startTime;
        let progress = (elapsedTime / changeInterval) * 100;

        if (progress >= 100) {
            progress = 100;
            clearInterval(progressIntervalId);
            progressIntervalId = null;

            if (progressBarElement) {
                progressBarElement.style.transition = 'none';
                progressBarElement.style.width = progress + '%';
                progressBarElement.offsetHeight;
            }
            if (progressGifElement) {
                progressGifElement.style.transition = 'none';
                progressGifElement.style.left = progress + '%';
                progressGifElement.offsetHeight;
            }

            nextChangeTimeoutId = setTimeout(() => {
                if (!document.hidden) {
                    prepareBannerChange();
                }
                nextChangeTimeoutId = null;
            }, renderDelay);

        } else {
            if (progressBarElement) {
                progressBarElement.style.transition = `width ${transitionTiming} linear`;
                progressBarElement.style.width = progress + '%';
            }
            if (progressGifElement) {
                progressGifElement.style.transition = `left ${transitionTiming} linear, opacity ${gifFadeDuration / 1000}s ease-in-out`;
                progressGifElement.style.left = progress + '%';
            }
        }
    }, progressUpdateFrequency);
}

function startProgressCycle() {
    if (progressIntervalId) clearInterval(progressIntervalId);
    if (nextChangeTimeoutId) clearTimeout(nextChangeTimeoutId);
    progressIntervalId = null; nextChangeTimeoutId = null;
    isLoadingNext = false;

    if (progressBarElement) {
        progressBarElement.style.transition = 'none';
        progressBarElement.style.width = '0%';
        progressBarElement.offsetHeight;
    }
    if (progressGifElement) {
        progressGifElement.classList.add('hidden');
        progressGifElement.style.transition = 'none';
        progressGifElement.style.left = '0%';
        progressGifElement.offsetHeight;
    }

    setTimeout(() => {
        runProgressAnimation();
    }, 50);
}

function prepareBannerChange() {
    if (isLoadingNext) return;
    isLoadingNext = true;

    const newIndex = getNextIndex();
    const newBannerUrl = bannerUrls[newIndex];

    const activeBannerElement = isBanner1Active ? bannerImg1 : bannerImg2;
    const nextBannerElement = isBanner1Active ? bannerImg2 : bannerImg1;

    const executeFade = () => {
        currentBannerIndex = newIndex;

        if (progressBarElement) {
            progressBarElement.style.transition = 'none';
            progressBarElement.style.width = '0%';
            progressBarElement.offsetHeight;
        }
        if (progressGifElement) {
            progressGifElement.classList.add('hidden');
            progressGifElement.style.transition = 'none';
            progressGifElement.style.left = '0%';
            progressGifElement.offsetHeight;
        }


        activeBannerElement.classList.remove('active');
        nextBannerElement.classList.add('active');


        isBanner1Active = !isBanner1Active;
        updateBioStyle(newBannerUrl);

        setTimeout(() => {
            isLoadingNext = false;
            startProgressCycle();
        }, fadeTransitionDuration);
    };

    nextBannerElement.onload = executeFade;
    nextBannerElement.onerror = () => {
        console.error("Failed to load banner image:", newBannerUrl);
        isLoadingNext = false;
        startProgressCycle();
    };

    nextBannerElement.src = newBannerUrl;
}

function updateBioStyle(currentUrl) {
if (!bioElement) return;
    const needsEuthymiaStyle = euthymiaBannerUrls.includes(currentUrl);
    const hasEuthymiaStyle = bioElement.classList.contains('euthymia-bio-style');

    if (needsEuthymiaStyle && !hasEuthymiaStyle) {
        bioElement.classList.add('euthymia-bio-style');
        bioElement.style.animation = 'none';
        void bioElement.offsetWidth;
        bioElement.style.animation = '';
    } else if (!needsEuthymiaStyle && hasEuthymiaStyle) {
        bioElement.classList.remove('euthymia-bio-style');
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (progressIntervalId) clearInterval(progressIntervalId);
        if (nextChangeTimeoutId) clearTimeout(nextChangeTimeoutId);
        progressIntervalId = null; nextChangeTimeoutId = null;
    } else {
        if (progressIntervalId) clearInterval(progressIntervalId);
        if (nextChangeTimeoutId) clearTimeout(nextChangeTimeoutId);
        progressIntervalId = null; nextChangeTimeoutId = null;

        if (!isLoadingNext) {
            startProgressCycle();
        }
    }
});

updateBioStyle(bannerUrls[currentBannerIndex]);

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