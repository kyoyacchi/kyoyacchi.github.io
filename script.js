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
    if (document.getElementById("status-pop")) {
        return;
    }

    const pop = document.createElement("div");
    const innerDiv = document.createElement("div");
    pop.id = "status-pop";
    innerDiv.className = "pop-inner";

    const stateClass = isError ? "error" : "success";
    const iconClass = isError ? "fas fa-times-circle" : "fas fa-check-circle";
    const message = isError ? "couldn't update discord pfp" : "updated discord pfp";

    pop.classList.add(stateClass);

    innerDiv.innerHTML = `<i class="${iconClass}"></i> ${message}`;

    pop.appendChild(innerDiv);
    document.body.appendChild(pop);

    requestAnimationFrame(() => {
        pop.classList.add("visible");
    });

    setTimeout(() => {
        pop.classList.remove("visible");
        setTimeout(() => {
             if (pop.parentNode) {
                pop.parentNode.removeChild(pop);
             }
        }, 400);
    }, 3500);
}

async function updateDiscordPfp() {
    const avatarElement = document.getElementById("discord_pfp");
    if (!avatarElement) return;

    const defaultAvatar = GITHUB_AVATAR_URL;
    let currentStoredAvatar = localStorage.getItem('discord_avatar');
    let fetchedAvatarData = { avatar: null, error: true };

    try {
        fetchedAvatarData = await getDiscordAv();
    } catch (error) {

    }

    const finalAvatarUrl = fetchedAvatarData.error ? defaultAvatar : fetchedAvatarData.avatar;

    if (!fetchedAvatarData.error && (!currentStoredAvatar || currentStoredAvatar !== fetchedAvatarData.avatar)) {
        localStorage.setItem('discord_avatar', fetchedAvatarData.avatar);
        showPopUp(false);
        currentStoredAvatar = fetchedAvatarData.avatar;
    } else if (fetchedAvatarData.error && currentStoredAvatar) {

        showPopUp(true);
    }

    avatarElement.onerror = () => {
        console.warn("Oops! Failed to load discord pfp, falling back to github pfp");
        avatarElement.src = defaultAvatar;


    };

    avatarElement.src = currentStoredAvatar && !fetchedAvatarData.error ? currentStoredAvatar : finalAvatarUrl;
}

function setupHeartEffect() {
    const heartIcon = document.getElementById('Footer_heart');
    if (!heartIcon) return;

    const colors = ['#FF6B8B', '#A68BFF', '#6C2BD9', '#ffffff', '#9B59B6'];
    let currentIndex = 0;
    let intervalId = null;

    function changeColor() {
        heartIcon.style.color = colors[currentIndex];
        currentIndex = (currentIndex + 1) % colors.length;
    }

    function startColorChanging() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(changeColor, 150);
    }

    function stopColorChanging() {
        clearInterval(intervalId);
        intervalId = null;
        heartIcon.style.color = "";
    }

    heartIcon.addEventListener('mouseenter', () => {
        startColorChanging();
        setTimeout(stopColorChanging, 1000);
    });

    heartIcon.addEventListener('mouseleave', stopColorChanging);
}

function handleIntroOverlay() {

    const introOverlay = document.querySelector('.intro-overlay');

    setTimeout(() => {
        if (introOverlay) {
            introOverlay.style.opacity = '0';
            setTimeout(() => {
                introOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 500);
        }
    }, 1500);

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

    const preloaderText = document.querySelector('.preloader-text');

    if (preloaderText) {
        preloaderText.textContent = randomText;
    }

    if (randomText === 'Musou me harder, mommy') {

        const subtitleText = document.querySelector('.subtitle-text');
if (subtitleText) {
    subtitleText.textContent = '- A Turkish guy who is obsessed over Raiden Shogun';

}
        if (introOverlay) {


introOverlay.classList.add('shake-it');

            setTimeout(() => {
                introOverlay.classList.remove('shake-it');
            }, 300);
        }
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
         console.log(`Tweet in ${containerSelector} loaded successfully.`);
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
                              console.warn(`widgets.load finished for ${containerSelector}, but no widgets found or 'loaded' event didn't fire.`);

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
                console.log(`Tweet container ${containerSelector} is intersecting. Loading tweet.`);
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
    const PARTICLE_COUNT = 40;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.opacity = Math.random() * 0.4 + 0.2;
            this.life = Math.random() * 500 + 200;
            this.initialLife = this.life;
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

                 if (Math.random() > 0.5) {
                      this.x = this.speedX > 0 ? -this.size : canvas.width + this.size;
                      this.y = Math.random() * canvas.height;
                 } else {
                     this.y = this.speedY > 0 ? -this.size : canvas.height + this.size;
                     this.x = Math.random() * canvas.width;
                 }
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

    for (let i = 0; i < PARTICLE_COUNT; i++) { particles.push(new Particle()); }
    let lastScrollY = window.scrollY;
    let animationFrameId = null;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const currentScrollY = window.scrollY;
        const scrollSpeed = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;
        particles.forEach(p => { p.update(scrollSpeed); p.draw(); });
        animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) { cancelAnimationFrame(animationFrameId); }
        else { lastScrollY = window.scrollY; animate(); }
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

    const bannerUrls = [
        'https://files.catbox.moe/9cvf8l.jpeg', 'https://files.catbox.moe/27mh8k.jpg',
        'https://files.catbox.moe/ftsuwx.jpg', 'https://files.catbox.moe/dx4dym.jpg',
        'https://files.catbox.moe/l98fxt.jpg', 'https://files.catbox.moe/kfn36d.jpg',
        'https://files.catbox.moe/5fwex5.jpg', 'https://files.catbox.moe/1m7rx3.jpg',
        'https://files.catbox.moe/ymqw8y.jpg', 'https://files.catbox.moe/7c6pr2.jpg',
        'https://files.catbox.moe/bpr8u5.jpg', 'https://files.catbox.moe/yf43bj.jpg',
        'https://files.catbox.moe/4atada.jpg', 'https://files.catbox.moe/gc1qh3.jpg',
        'https://files.catbox.moe/ph6zj4.jpeg', 'https://files.catbox.moe/ox23f5.jpeg',
 'https://files.catbox.moe/ai4oz2.gif',
        'https://files.catbox.moe/25kggw.gif', 'https://files.catbox.moe/obaond.jpg', 'https://files.catbox.moe/vywstu.jpg'
    ];

    const euthymiaBannerUrls = [
        'https://files.catbox.moe/1m7rx3.jpg',
        'https://files.catbox.moe/ymqw8y.jpg',
    ];

    const changeInterval = 10000;
    const fadeTransitionDuration = 600;
    const gifFadeDuration = 300;
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
            bannerImg1.style.opacity = '1';
            console.log("Initial banner loaded:", bannerUrls[currentBannerIndex]);
            startProgressCycle();
        };
         bannerImg1.onerror = () => {
             console.error("Failed to load initial banner:", bannerUrls[currentBannerIndex]);
             startProgressCycle();
         };
        bannerImg2.style.opacity = '0';
        isBanner1Active = true;
    } else {
        bannerContainer.style.display = 'none';
        return;
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
                    } else {

                        console.log("Change skipped (tab hidden). Will restart progress on focus.");
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


        let newIndex;
        if (bannerUrls.length > 1) {
            do {
                newIndex = Math.floor(Math.random() * bannerUrls.length);
            } while (newIndex === currentBannerIndex);
        } else {
            newIndex = 0;
        }

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


            activeBannerElement.style.opacity = '0';
            nextBannerElement.style.opacity = '1';

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
            } else {

            }
        }
    });

    updateBioStyle(bannerUrls[currentBannerIndex]);

    console.log(`Dynamic banner initialized. Waiting for initial image load... Interval: ${changeInterval / 1000}s.`);
}


    function PreventRightClick() {
    const allImages = document.querySelectorAll('img');
    allImages.forEach(function(img) {
        img.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
    });
}

const body = document.body;
const parallaxIntensity = 20;

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const normalizedX = (mouseX / windowWidth) * 2 - 1;
    const normalizedY = (mouseY / windowHeight) * 2 - 1;
    const backgroundPositionX = normalizedX * -parallaxIntensity;
    const backgroundPositionY = normalizedY * -parallaxIntensity;
    body.style.backgroundPosition = `${50 + backgroundPositionX}% ${50 + backgroundPositionY}%`;
});

body.style.backgroundPosition = '50% 50%';

    function initializePage() {
    handleIntroOverlay();

   updateDiscordPfp();
    setupHeartEffect();
    setupTweetEmbed('.tweet-embed-container');
   PreventRightClick();
  //  setupParticleCanvas();
    setupScrollAnimations();
    initializeDynamicBanner();


    const checkmarkIcon = document.querySelector('.checkmark');
    if (checkmarkIcon) {


    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {

    initializePage();
}