   
    const PRELOADER_EXIT_DELAY = 1500; // ms after lines finish
const PRELOADER_FADE_DURATION = 500; // ms for fade out
const PARTICLE_COUNT = 40; // Reduced particle count for performance
const DISCORD_USER_ID = "468509605828493322";
const GITHUB_AVATAR_URL = "https://avatars.githubusercontent.com/u/63583961";
const DISCORD_API_URL = `https://kyopi.vercel.app/api/pfp?id=${DISCORD_USER_ID}`;

       function shakeCheckmark(event) {
    const checkmark = event.currentTarget; // Get the clicked element
    if (checkmark) {
        checkmark.style.transition = 'transform 0.1s ease-in-out'; // Faster transition for shake
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
        const response = await axios.get(DISCORD_API_URL, { timeout: 5000 }); // Add timeout
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
    // Check if a popup already exists
    if (document.getElementById("status-pop")) {
        return;
    }

    const pop = document.createElement("div");
    const innerDiv = document.createElement("div");
    pop.id = "status-pop"; // Unique ID
    innerDiv.className = "pop-inner";

    // --- Popup Styling (Consider moving to CSS for cleaner JS) ---
    pop.style.position = "fixed";
    pop.style.bottom = "20px";
    pop.style.left = "20px";
    pop.style.borderRadius = "12px"; /* Match root */
    pop.style.overflow = "hidden";
    pop.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
    pop.style.border = `2px solid ${isError ? 'var(--accent)' : 'var(--primary-light)'}`;
    pop.style.width = "fit-content";
    pop.style.maxWidth = "calc(100vw - 40px)"; /* Prevent overflow */
    pop.style.zIndex = "1100"; /* Ensure visibility */
    pop.style.padding = "3px";
    pop.style.boxSizing = "border-box";
    pop.style.opacity = "0"; // Start hidden for animation
    pop.style.transform = "translateX(-20px)"; // Start off-screen for animation
    pop.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";

    innerDiv.style.backgroundColor = "var(--bg-light)";
    innerDiv.style.padding = "10px 18px";
    innerDiv.style.display = "inline-flex";
    innerDiv.style.alignItems = "center";
    innerDiv.style.gap = "12px";
    innerDiv.style.border = `1px solid ${isError ? 'rgba(255, 107, 139, 0.5)' : 'rgba(138, 79, 255, 0.5)'}`;
    innerDiv.style.borderRadius = "9px"; /* Inner radius */
    innerDiv.style.fontSize = "14px";
    innerDiv.style.fontWeight = "bold";
    innerDiv.style.color = "var(--text-light)";
    innerDiv.style.userSelect = "none";
    innerDiv.style.whiteSpace = "nowrap";
    innerDiv.style.overflow = "hidden";
    innerDiv.style.textOverflow = "ellipsis";
    innerDiv.style.boxSizing = "border-box";
    // --- End Popup Styling ---

    const iconClass = isError ? "fas fa-times-circle" : "fas fa-check-circle";
    const iconColor = isError ? "var(--accent)" : "var(--primary-light)";
    const message = isError ? "Couldn't update Discord pfp" : "Updated Discord pfp";

    innerDiv.innerHTML = `<i class="${iconClass}" style="color: ${iconColor}; font-size: 18px;"></i> ${message}`;

    pop.appendChild(innerDiv);
    document.body.appendChild(pop);

    // Trigger fade-in animation
    requestAnimationFrame(() => {
        pop.style.opacity = "1";
        pop.style.transform = "translateX(0)";
    });


    // Auto-dismiss after a delay
    setTimeout(() => {
        pop.style.opacity = "0";
        pop.style.transform = "translateX(-20px)";
        // Remove from DOM after animation
        setTimeout(() => {
             if (pop.parentNode) {
                pop.parentNode.removeChild(pop);
             }
        }, 400); // Match transition duration
    }, 3500); // Display duration
}
async function updateDiscordPfp() {
    const avatarElement = document.getElementById("discord_pfp");
    if (!avatarElement) return;

    const defaultAvatar = GITHUB_AVATAR_URL;
    let currentStoredAvatar = localStorage.getItem('discord_avatar');
    let fetchedAvatarData = { avatar: null, error: true }; // Initialize as error

    try {
        fetchedAvatarData = await getDiscordAv();
    } catch (error) {
        // Error already logged in getDiscordAv
    }

    const finalAvatarUrl = fetchedAvatarData.error ? defaultAvatar : fetchedAvatarData.avatar;

    // Update only if necessary and show popup
    if (!fetchedAvatarData.error && (!currentStoredAvatar || currentStoredAvatar !== fetchedAvatarData.avatar)) {
        localStorage.setItem('discord_avatar', fetchedAvatarData.avatar);
        showPopUp(false); // Success popup
        currentStoredAvatar = fetchedAvatarData.avatar; // Update current for immediate display
    } else if (fetchedAvatarData.error && currentStoredAvatar) {
        // If fetch failed but we have a stored one, maybe use it? Or show error?
        // For now, just show error if fetch failed.
        showPopUp(true); // Error popup
    }

    avatarElement.onerror = () => {
        console.warn("Oops! Failed to load discord pfp, falling back to github pfp");
        avatarElement.src = defaultAvatar;
        // Optionally show error popup here too if the final URL failed to load
        // showPopUp(true);
    };

    // Set the source (either newly fetched, stored, or default)
    avatarElement.src = currentStoredAvatar && !fetchedAvatarData.error ? currentStoredAvatar : finalAvatarUrl;
}


        function setupHeartEffect() {
    const heartIcon = document.getElementById('Footer_heart');
    if (!heartIcon) return;

    const colors = ['#FF6B8B', '#A68BFF', '#6C2BD9', '#ffffff', '#9B59B6']; // Raiden themed colors + white
    let currentIndex = 0;
    let intervalId = null;

    function changeColor() {
        heartIcon.style.color = colors[currentIndex];
        currentIndex = (currentIndex + 1) % colors.length;
    }

    function startColorChanging() {
        if (intervalId) clearInterval(intervalId); // Clear previous interval if any
        intervalId = setInterval(changeColor, 150); // Faster cycle
    }

    function stopColorChanging() {
        clearInterval(intervalId);
        intervalId = null;
        heartIcon.style.color = ""; // Reset to default CSS color
    }

    heartIcon.addEventListener('mouseenter', () => {
        startColorChanging();
        // Stop after a short duration even if mouse stays
        setTimeout(stopColorChanging, 1000);
    });

    // Ensure it stops if mouse leaves quickly
    heartIcon.addEventListener('mouseleave', stopColorChanging);
}


        function handleIntroOverlay() {
    // Giriş overlay'ini seçelim
    const introOverlay = document.querySelector('.intro-overlay');

    // Ana fade-out animasyonu (1.5 saniye sonra başlar, 0.5 saniye sürer)
    setTimeout(() => {
        if (introOverlay) { // Null check eklendi
            introOverlay.style.opacity = '0';
            setTimeout(() => {
                introOverlay.style.display = 'none';
                document.body.style.overflow = 'auto'; // Sayfa kaydırmayı etkinleştir
            }, 500); // Opacity 0 olduktan 500ms sonra gizle
        }
    }, 1500); // 1.5 saniye bekle

    // Rastgele metinler dizisi 
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
        'Musou me harder, mommy' // Özel muamele görecek arkadaş
    ];

    // Rastgele bir metin seçelim
    const randomText = texts[Math.floor(Math.random() * texts.length)];

    // Metni gösterecek elementi seçelim
    const preloaderText = document.querySelector('.preloader-text');

    // Element varsa metni içine yazalım
    if (preloaderText) {
        preloaderText.textContent = randomText;
    }

    // --- İŞTE O MEŞHUR KISIM ---
    // Eğer seçilen metin "O" metinse...
    if (randomText === 'Musou me harder, mommy') {
        // introOverlay null değilse devam et
        if (introOverlay) {
            // Arka planı koyu mora çekelim
         //   introOverlay.style.backgroundColor = '#3b0f5a';
introOverlay.classList.add('shake-it');
            // Hafifçe yanıp sönme efekti (kısa süreliğine daha koyu yapıp geri al)
            setTimeout(() => {
                introOverlay.classList.remove('shake-it');
            }, 300); // 0.3 saniye = 300 milisaniye
        }
    }
    // --- MEŞHUR KISIM SONU ---



}



/**
 * Belirtilen bir tweet gömme konteynerini Intersection Observer kullanarak
 * görünür hale geldiğinde yüklemek üzere ayarlar.
 * Yükleme sırasında bir yükleme göstergesi gösterir ve içerik yüklendiğinde
 * veya bir hata oluştuğunda durumu günceller.
 *
 * @param {string} containerSelector - Tweet gömme işlemini içeren ana HTML elementinin CSS seçicisi (örn: '.tweet-embed-container').
 *                                     Bu elementin içinde '.tweet-content' ve '.loading-wrapper' (veya '.loading-spinner')
 *                                     adında alt elementler bulunmalıdır.
 */
function setupTweetEmbed(containerSelector) {
    const tweetContainer = document.querySelector(containerSelector);

    // Konteyner bulunamazsa hata ver ve çık
    if (!tweetContainer) {
        console.error(`Tweet container ('${containerSelector}') not found.`);
        return;
    }

    // Konteyner içindeki gerekli alt elementleri bul
    const tweetContent = tweetContainer.querySelector('.tweet-content');
    let loadingIndicator = tweetContainer.querySelector('.loading-wrapper') || tweetContainer.querySelector('.loading-spinner'); // Önce wrapper'ı ara, yoksa spinner'ı

    // Gerekli alt elementler yoksa hata ver ve çık
    if (!tweetContent) {
        console.error(`Required element '.tweet-content' not found inside '${containerSelector}'.`);
        return;
    }
    // Yükleme göstergesi opsiyonel, bulunamazsa sadece uyar
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
    // --- İç Fonksiyonlar ---
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

    function showErrorState(errorMessage = 'Tweet yüklenemedi.') {
         if (isTweetLoaded) return;
         console.error(`Error loading tweet in ${containerSelector}:`, errorMessage);
         requestAnimationFrame(() => {
             if (loadingIndicator) {
                 if (loadingIndicator.classList.contains('loading-wrapper')) {
                    loadingIndicator.innerHTML = `<p style="color: red; text-align: center;">${errorMessage}</p>`;
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
                              console.warn(`widgets.load finished for ${containerSelector}, but no widgets found or loaded event didn't fire.`);
                              // showErrorState('Tweet yapısı bulunamadı veya yüklenemedi.');
                         }
                     }, 500);
                 }
            }).catch(function(error) {
                showErrorState(`Tweet yüklenirken bir hata oluştu: ${error.message || error}`);
            });
        });
    }

    // --- Ana Mantık ---
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex'; // veya block (CSS'ine göre ayarla)
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
    const PARTICLE_COUNT = 40; // Partikül sayısı (azaltılmış olabilir)

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];

    // GÜNCELLENMİŞ Particle Sınıfı
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1; // Boyut ayarı
            this.speedX = (Math.random() - 0.5) * 1.5; // Hız ayarı
            this.speedY = (Math.random() - 0.5) * 1.5; // Hız ayarı
            this.opacity = Math.random() * 0.4 + 0.2; // Başlangıç opaklığı
            this.life = Math.random() * 500 + 200; // Yaşam süresi
            this.initialLife = this.life;
        }
        update(scrollSpeed) {
            this.x += this.speedX;
            this.y += this.speedY + scrollSpeed * 0.05; // Scroll etkisi azaltıldı
            this.life -= 1;
            this.opacity = (this.life / this.initialLife) * 0.6; // Yaşama göre solma
            if (this.x < -this.size || this.x > canvas.width + this.size ||
                this.y < -this.size || this.y > canvas.height + this.size ||
                this.life <= 0) {
                this.reset(); // Ekran dışına çıkınca veya ömrü bitince resetle
                 // Reset pozisyonunu ekranın hemen dışı yap
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
            ctx.fillStyle = `rgba(155, 89, 182, ${this.opacity * 0.8})`; // Ana renk
            ctx.fill();
             // Daha parlak iç çekirdek efekti
             if (this.opacity > 0.3) {
                 ctx.beginPath();
                 ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
                 ctx.fillStyle = `rgba(216, 191, 255, ${this.opacity * 0.5})`; // İç renk
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
    // İsteğe bağlı: Sekme görünür değilken animasyonu durdurma
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
                // Belirli elementlere özel animasyon sınıfı ekleyebilirsin
                if (entry.target.matches('.profile-header, .bio, .social-icons, footer, .tweet-embed-container')) {
                   entry.target.classList.add('slide-up'); // slide-up keyframes'i kullanır
                }
                obs.unobserve(entry.target); // Görünür olunca izlemeyi bırak
            }
        });
    }, {
        threshold: 0.15, // %15 görünür olunca tetikle
        rootMargin: "0px 0px -50px 0px" // Biraz daha erken tetikle
    });

    animatedElements.forEach(el => { observer.observe(el); });
}
       
        
        
    function summonYae(){
      document.addEventListener("click", (e) => {
          
            
            const kitsune = document.createElement("img");
            kitsune.src = "https://files.catbox.moe/g87kzk.gif"; 
            
            kitsune.classList.add("kitsune");

            // Tıklanan yere yerleştir
            kitsune.style.left = `${e.clientX}px`;
            kitsune.style.top = `${e.clientY}px`;

            // Sayfaya ekle
            document.body.appendChild(kitsune);

            // Kitsune görünür yap ve animasyonu başlat
            setTimeout(() => {
                kitsune.classList.add("active");
            }, 10);

            // Kitsune bir süre sonra kaybolsun
            setTimeout(() => {
                kitsune.classList.remove("active");
                setTimeout(() => kitsune.remove(), 300);
            }, 1500);
        });
    }
    
    /**
 * Dinamik olarak değişen banner işlevselliğini başlatır.
 * Bu fonksiyonun DOM hazır olduğunda (örn. DOMContentLoaded içinde) çağrılması gerekir.
 */
function initializeDynamicBanner() {
    const bannerElement = document.querySelector('.banner-img');
    // --- BANNER URL'LERİNİ BURAYA EKLE ---
    const bannerUrls = [
        'https://pbs.twimg.com/profile_banners/1283317081631416320/1739900077/1080x360', // 1. Varsayılan (HTML'deki src ile aynı olmalı)
'https://files.catbox.moe/27mh8k.jpg',
'https://files.catbox.moe/ftsuwx.jpg',
'https://files.catbox.moe/dx4dym.jpg',
'https://files.catbox.moe/l98fxt.jpg',
'https://files.catbox.moe/kfn36d.jpg',
'https://files.catbox.moe/5fwex5.jpg',
'https://files.catbox.moe/1m7rx3.jpg',
'https://files.catbox.moe/ymqw8y.jpg',
    ];
    // ----------------------------------

    const changeInterval = 10000;// Değişim aralığı (ms) - 30 saniye
    const fadeTransitionDuration = 600; // CSS transition süresi (ms) - 0.6 saniye
    let currentBannerIndex = 0;
    let bannerIntervalId = null;

    // Eleman yoksa veya yeterli banner yoksa işlemi başlatma
    if (!bannerElement) {
        console.warn("couldnt start dynamic banner func: couldn't find the banner element.");
        return;
    }
     if (bannerUrls.length < 2) {
        console.info('Could not start dynamic banner func: Not enough dynamic banners to change.');
        return;
    }

    // Ana banner değiştirme fonksiyonu
    function changeBanner() {
        // Yeni ve farklı bir banner indeksi seç
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * bannerUrls.length);
        } while (newIndex === currentBannerIndex);

        // Mevcut banner'ı fade out yap
        bannerElement.style.opacity = '0';

        // Geçiş süresi kadar bekledikten sonra resmi değiştir ve fade in yap
        setTimeout(() => {
            currentBannerIndex = newIndex;
            bannerElement.src = bannerUrls[currentBannerIndex];

            // Yeni resim yüklendikten sonra (veya direkt) fade in yap
             bannerElement.style.opacity = '1';

        }, fadeTransitionDuration);
    }

    // İlk banner değişimini belirli aralıklarla başlat
    bannerIntervalId = setInterval(changeBanner, changeInterval);
    console.log(`dynamic banner started to change per ${changeInterval /
    1000} sec`);
    
// Sekme görünürlük durumunu kontrol et
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Sekme gizli, interval'i durdur
            clearInterval(bannerIntervalId);
          //  console.log('dynamic banner stopped (tab hidden)');
        } else {
            // Sekme aktif, tekrar başlat
            bannerIntervalId = setInterval(changeBanner, changeInterval);
          //  console.log('dynamic banner resumed (tab visible)');
        }
    });
} // initializeDynamicBanner fonksiyonu sonu

// --- ÖNEMLİ ---
// Bu fonksiyonu kullanmak için, script'inin uygun bir yerinde
// (DOM tamamen yüklendikten sonra) çağırman gerekir:
//
// Örnek Kullanım:
// document.addEventListener('DOMContentLoaded', () => {
//     initializeDynamicBanner();
//     // diğer kodların...
// });
//
// VEYA script dosyanın en sonunda, defer ile yükleniyorsa direkt çağırabilirsin:
// initializeDynamicBanner();
//
    
    
    
    function initializePage() {
    handleIntroOverlay();
   // setLang();
   // updateDiscordPfp();
    setupHeartEffect();
    setupTweetEmbed('.tweet-embed-container');
   
    setupParticleCanvas();
    setupScrollAnimations();
    initializeDynamicBanner();
//summonYae();
    // Add event listener for checkmark click (if needed globally)
    const checkmarkIcon = document.querySelector('.checkmark');
    if (checkmarkIcon) {
         // Check if the handler is already attached via HTML onclick
         // If not using onclick="shakeCheckmark(event)" in HTML, add listener here:
         // checkmarkIcon.addEventListener('click', shakeCheckmark);
    }
}
// --- Run Initialization ---
// Use DOMContentLoaded to ensure the DOM is ready before selecting elements
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    // DOM is already loaded
    initializePage();
}