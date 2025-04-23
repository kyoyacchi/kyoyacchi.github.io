   
    const PRELOADER_EXIT_DELAY = 1500; // ms after lines finish
const PRELOADER_FADE_DURATION = 500; // ms for fade out
const PARTICLE_COUNT = 55; // Reduced particle count for performance
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
        const subtitleText = document.querySelector('.subtitle-text'); // HTML'e eklediğimiz elementi seçelim
if (subtitleText) {
    subtitleText.textContent = '- A Turkish guy who is obsessed over Raiden Shogun'; // Sabit yazımızı basalım
   // subtitleText.style.fontStyle = 'italic'; // Yazıyı italik yapalım
}
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
// Bu fonksiyonu çalıştırmadan önce Font Awesome'ı HTML'ine eklediğinden emin ol!
// Örnek: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" ... />

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

    // Türkçe Tweet HTML'i
    const tweetEmbedHTML_TR = `
        <blockquote class="twitter-tweet" data-lang="tr" data-dnt="true" data-theme="dark">
        <p lang="en" dir="ltr">RAAAAAAGAHSJSHAHSHNADJAJDJ I DID IT! <a href="https://twitter.com/hashtag/raidenshogun?src=hash&amp;ref_src=twsrc%5Etfw">#raidenshogun</a> <a href="https://twitter.com/hashtag/genshinimpact?src=hash&amp;ref_src=twsrc%5Etfw">#genshinimpact</a> WITH HER WEAPON LMAOAOOOO <a href="https://t.co/L7mJJ3DezG">pic.twitter.com/L7mJJ3DezG</a></p>
        &mdash; Kyoや (@kyoyacchi) <a href="https://twitter.com/kyoyacchi/status/1836094129312297212?ref_src=twsrc%5Etfw">17 Eylül 2024</a></blockquote>`;

    // İngilizce Tweet HTML'i
    const tweetEmbedHTML_EN = `
        <blockquote class="twitter-tweet" data-lang="en" data-theme="dark">
        <p lang="en" dir="ltr">RAAAAAAGAHSJSHAHSHNADJAJDJ I DID IT! <a href="https://twitter.com/hashtag/raidenshogun?src=hash&amp;ref_src=twsrc%5Etfw">#raidenshogun</a> <a href="https://twitter.com/hashtag/genshinimpact?src=hash&amp;ref_src=twsrc%5Etfw">#genshinimpact</a> WITH HER WEAPON LMAOAOOOO <a href="https://t.co/L7mJJ3DezG">pic.twitter.com/L7mJJ3DezG</a></p>
        &mdash; Kyoや (@kyoyacchi) <a href="https://twitter.com/kyoyacchi/status/1836094129312297212?ref_src=twsrc%5Etfw">September 17, 2024</a></blockquote>`;

    // Tarayıcı diline göre doğru HTML'i içeriğe bas
    tweetContent.innerHTML = isTurkish ? tweetEmbedHTML_TR : tweetEmbedHTML_EN;

    // --- İç Fonksiyonlar ---

    // Tweet başarıyla yüklendiğinde içeriği gösterir
    function showContent() {
        if (isTweetLoaded) return;
        isTweetLoaded = true;
        requestAnimationFrame(() => {
            tweetContent.style.opacity = '1';
            tweetContent.style.visibility = 'visible';
            tweetContent.classList.add('loaded'); // Belki CSS ile animasyon eklemek istersin
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none'; // Yükleme göstergesini gizle
            }
        });
         console.log(`Tweet in ${containerSelector} loaded successfully.`);
    }

    // Tweet yüklenemediğinde hata durumunu gösterir (İngilizce mesaj ve ikon ile)
    function showErrorState(errorMessage = 'Could not load Tweet.') { // Default mesaj İngilizce
        if (isTweetLoaded) return; // Zaten yüklendiyse veya hata gösterildiyse tekrar yapma
        console.error(`Error loading tweet in ${containerSelector}:`, errorMessage);

        requestAnimationFrame(() => {
            if (loadingIndicator) {
                // Eğer loadingIndicator bir wrapper ise (içine HTML basmak daha kolay)
                if (loadingIndicator.classList.contains('loading-wrapper')) {
                    // Font Awesome ikonu ve İngilizce hata mesajı
                    loadingIndicator.innerHTML = `
                        <div style="color: red; text-align: center; display: flex; align-items: center; justify-content: center; padding: 10px;">
                            <i class="fas fa-times-circle" style="margin-right: 8px; font-size: 1.2em; vertical-align: middle;"></i>
                            <span>${errorMessage}</span>
                        </div>`;
                    loadingIndicator.style.display = 'flex'; // Wrapper'ı görünür yap
                } else {
                    // Sadece spinner varsa, onu gizle
                    loadingIndicator.style.display = 'none';
                }
            }
            // Tweet içeriğini gizle
            tweetContent.style.opacity = '0';
            tweetContent.style.visibility = 'hidden';
        });
    }

    // Twitter'ın widgets.js script'ini yükler ve tweet'i render etmeye çalışır
    function loadTweet() {
        // Twitter'ın global twttr objesini yükle/oluştur
        window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
            if (d.getElementById(id)) return t; // Script zaten varsa tekrar ekleme
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            js.async = true; // Asenkron yükle
            fjs.parentNode.insertBefore(js, fjs);
            t._e = []; // Event kuyruğu
            t.ready = function(f) { t._e.push(f); }; // Hazır olunca çalışacak fonksiyonları ekle
            return t;
        }(document, "script", "twitter-wjs"));

        // Twitter script'i hazır olduğunda...
        twttr.ready(function(twttrInstance) {
            let widgetLoaded = false; // Widget'ın 'loaded' event'ini tetikleyip tetiklemediğini takip et

            // Tweet widget'ı başarıyla yüklendiğinde tetiklenen event
            twttrInstance.events.bind('loaded', function(event) {
                // Event'in bizim konteynerimizdeki widget için olup olmadığını kontrol et
                if (event && event.widgets && event.widgets.some(widget => tweetContainer.contains(widget))) {
                    widgetLoaded = true;
                    showContent(); // İçeriği göster
                }
            });

            // Belirtilen konteyner içindeki widget'ları yüklemeyi dene
            twttrInstance.widgets.load(
                tweetContainer
            ).then(function(widgets) {
                 // widgets.load bittiğinde, eğer hiç widget bulunamadıysa VE loaded eventi tetiklenmediyse,
                 // bir sorun olmuş olabilir. Küçük bir gecikmeyle kontrol et.
                 if ((!widgets || widgets.length === 0) && !widgetLoaded) {
                     setTimeout(() => {
                         if (!isTweetLoaded) { // Hala yüklenmediyse hata göster
                              console.warn(`widgets.load finished for ${containerSelector}, but no widgets found or 'loaded' event didn't fire.`);
                         //     showErrorState('Could not load the Tweet.'); // İngilizce hata mesajı
                         }
                     }, 500); // Yarım saniye bekle, belki event gecikmiştir
                 }
                 // Not: Başarılı durumda 'loaded' eventi showContent'i çağırmalı.
                 // Eğer widgets array'i dolu gelse bile loaded eventi tetiklenmezse diye yukarıdaki timeout var.
            }).catch(function(error) {
                // widgets.load sırasında bir Promise rejection olursa hatayı yakala
           //     showErrorState(`Error loading Tweet: ${error.message || error}`); // İngilizce hata mesajı
            });
        });
    }

    // --- Ana Mantık ---

    // Başlangıçta yükleme göstergesini göster, içeriği gizle
    if (loadingIndicator) {
        // loading-wrapper için display: flex; veya block; kullanıyor olabilirsin CSS'de, ona göre ayarla
        loadingIndicator.style.display = loadingIndicator.classList.contains('loading-wrapper') ? 'flex' : 'block';
    }
    tweetContent.style.opacity = '0';
    tweetContent.style.visibility = 'hidden';
    tweetContent.classList.remove('loaded'); // Varsa 'loaded' class'ını kaldır

    // Intersection Observer: Tweet konteyneri ekrana girdiğinde yüklemeyi başlat
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            // Eğer ekrana giriyorsa VE daha önce yükleme başlamadıysa
            if (entry.isIntersecting && !isTweetLoading) {
                console.log(`Tweet container ${containerSelector} is intersecting. Loading tweet.`);
                isTweetLoading = true; // Yüklemenin başladığını işaretle
                loadTweet(); // Tweet yükleme fonksiyonunu çağır
                observerInstance.unobserve(tweetContainer); // Gözlemciyi kaldır, artık işi bitti
            }
        });
    }, { threshold: 0.1 }); // %10'u ekrana girince tetiklen

    // Konteyneri gözlemlemeye başla
    observer.observe(tweetContainer);
}

// Kullanım Örneği:
// setupTweetEmbed('#my-tweet-container'); // HTML'deki tweet konteynerinin ID'si veya class'ı





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
    const progressBarElement = document.querySelector('.banner-progress-bar');
    const progressGifElement = document.querySelector('.progress-gif');
    const bioElement = document.querySelector('.bio'); // Senin kodunda bu vardı varsayıyorum
    // --- BANNER URL'LERİNİ BURAYA EKLE ---
    const bannerUrls = [
        'https://files.catbox.moe/9cvf8l.jpeg', // 1. Varsayılan
        'https://files.catbox.moe/27mh8k.jpg',
        'https://files.catbox.moe/ftsuwx.jpg',
        'https://files.catbox.moe/dx4dym.jpg',
        'https://files.catbox.moe/l98fxt.jpg',
        'https://files.catbox.moe/kfn36d.jpg',
        'https://files.catbox.moe/5fwex5.jpg',
        'https://files.catbox.moe/1m7rx3.jpg',
        'https://files.catbox.moe/ymqw8y.jpg',
        'https://files.catbox.moe/7c6pr2.jpg',
        'https://files.catbox.moe/bpr8u5.jpg',
        'https://files.catbox.moe/yf43bj.jpg'
    ];
    // ----------------------------------

    const euthymiaBannerUrls = [
        'https://files.catbox.moe/1m7rx3.jpg',
        'https://files.catbox.moe/ymqw8y.jpg',
    ];

    const changeInterval = 10000;
    const fadeTransitionDuration = 600;
    const gifFadeDuration = 300;
    const progressUpdateFrequency = 50;
    const renderDelay = 50;

    let currentBannerIndex = 0; // İlk index 0
    let progressIntervalId = null;
    let nextChangeTimeoutId = null;

    // --- ELEMAN KONTROLLERİ (Senin Kodundaki Gibi) ---
    if (!bannerElement) { console.warn("Banner resmi elementi bulunamadı."); return; }
    if (!progressBarElement) { console.warn("Progress bar elementi bulunamadı."); }
    if (!progressGifElement) { console.warn("Progress GIF elementi bulunamadı."); }
    if (!bioElement) { console.warn("Bio elementi (.bio) bulunamadı."); }
    if (bannerUrls.length === 0) { console.info('Banner URL listesi boş.'); return; }
    if (bannerUrls.length > 0 && !bannerElement.src) { bannerElement.src = bannerUrls[0]; }


    // --- Fonksiyon Tanımları (SENİN KODUNDAKİ GİBİ - DEĞİŞTİRİLMEDİ) ---

    function runProgressAnimation() {
        const startTime = Date.now();
        if (progressIntervalId) { clearInterval(progressIntervalId); progressIntervalId = null; }
        if (nextChangeTimeoutId) { clearTimeout(nextChangeTimeoutId); nextChangeTimeoutId = null; }
        const transitionTiming = `${progressUpdateFrequency / 1000}s`;
        if(progressGifElement) { progressGifElement.style.transition = `left ${transitionTiming} linear, opacity ${gifFadeDuration / 1000}s ease-in-out`; }
        if(progressBarElement) { progressBarElement.style.transition = `width ${transitionTiming} linear`; }
        progressIntervalId = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            let progress = (elapsedTime / changeInterval) * 100;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressIntervalId);
                progressIntervalId = null;
                if(progressBarElement) { progressBarElement.style.width = progress + '%'; }
                if(progressGifElement) { progressGifElement.style.left = progress + '%'; }
                nextChangeTimeoutId = setTimeout(() => {
                    if (!document.hidden) { changeBanner(); }
                }, renderDelay);
            } else {
                if(progressBarElement) { progressBarElement.style.width = progress + '%'; }
                if(progressGifElement) { progressGifElement.style.left = progress + '%'; }
            }
        }, progressUpdateFrequency);
    }

    function resetAndStartProgress() {
        if (progressIntervalId) { clearInterval(progressIntervalId); progressIntervalId = null; }
        if (nextChangeTimeoutId) { clearTimeout(nextChangeTimeoutId); nextChangeTimeoutId = null; }
        if(progressGifElement) { progressGifElement.classList.add('hidden'); }
        if(progressBarElement) {
            progressBarElement.style.transition = 'none';
            progressBarElement.style.width = '0%';
            progressBarElement.offsetHeight; // Reflow
        }
        setTimeout(() => {
            if(progressGifElement) {
                progressGifElement.style.transition = 'none';
                progressGifElement.style.left = '0%';
                progressGifElement.offsetHeight; // Reflow
                const transitionTiming = `${progressUpdateFrequency / 1000}s`;
                progressGifElement.style.transition = `left ${transitionTiming} linear, opacity ${gifFadeDuration / 1000}s ease-in-out`;
                progressGifElement.classList.remove('hidden');
            }
            runProgressAnimation();
        }, gifFadeDuration);
    }

    function changeBanner() {
        resetAndStartProgress();
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * bannerUrls.length);
        } while (newIndex === currentBannerIndex && bannerUrls.length > 1);
        const newBannerUrl = bannerUrls[newIndex];
        bannerElement.style.opacity = '0';
        setTimeout(() => {
            currentBannerIndex = newIndex;
            bannerElement.src = bannerUrls[currentBannerIndex]; // Sen burada currentBannerIndex kullanmıştın
            bannerElement.style.opacity = '1';
            // --- Bio style update (Senin kodundaki gibi, anında silme yok) ---
            if (bioElement) {
                if (euthymiaBannerUrls.includes(newBannerUrl)) { // newBannerUrl ile kontrol doğru
                    bioElement.classList.add('euthymia-bio-style');
                } else {
                    bioElement.classList.remove('euthymia-bio-style');
                }
            }
            // --- End bio style update ---
        }, fadeTransitionDuration);
    }


    // ---------- BAŞLANGIÇ KISMI DÜZENLENDİ ----------
    // --- İLK ÇALIŞTIRMA ---

    // 1. İlk banner için Bio stilini kontrol et:
    if (bioElement) {
        if (euthymiaBannerUrls.includes(bannerUrls[currentBannerIndex])) { // Index 0 kontrolü
             bioElement.classList.add('euthymia-bio-style');
             // Eğer ilk banner Euthymia ise animasyonun başlaması için:
             bioElement.style.animation = 'none';
             void bioElement.offsetWidth;
             bioElement.style.animation = '';
        } else {
             bioElement.classList.remove('euthymia-bio-style');
        }
    }

    // 2. İlk banner için animasyonu başlat (bu, ilk değişimi süre sonunda tetikleyecek):
    resetAndStartProgress();

    // 3. Direkt changeBanner çağrısı kaldırıldı:
    // changeBanner(); // <<< KALDIRILDI

    console.log(`Dinamik banner başlatıldı. İlk banner (index ${currentBannerIndex}) gösteriliyor. Değişim ~${changeInterval / 1000} saniye sonra başlayacak.`);
    // ---------- DÜZENLENEN KISIM BİTTİ ----------


    // --- SEKME GÖRÜNÜRLÜK KONTROLÜ (SENİN KODUNDAKİ GİBİ - DEĞİŞTİRİLMEDİ) ---
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (progressIntervalId) clearInterval(progressIntervalId);
            if (nextChangeTimeoutId) clearTimeout(nextChangeTimeoutId);
            progressIntervalId = null;
            nextChangeTimeoutId = null;
        } else {
            if (progressIntervalId) clearInterval(progressIntervalId);
            if (nextChangeTimeoutId) clearTimeout(nextChangeTimeoutId);
            progressIntervalId = null;
            nextChangeTimeoutId = null;
            changeBanner(); // Sekme geri gelince hemen değiştir (senin kodundaki gibi)
        }
    });
}

// --- Fonksiyonu çağırmayı unutma ---
// initializeDynamicBanner();


// CSS kodun aynı kalabilir.
// HTML'de bu fonksiyonu çağırdığından emin ol, mesela:
// document.addEventListener('DOMContentLoaded', initializeDynamicBanner);





// --- FONKSİYONU ÇAĞIR ---
// Sayfa yüklendikten sonra veya DOM hazır olduğunda bu fonksiyonu çağır.
// Eğer script'i head içine koyuyorsan DOMContentLoaded veya window.onload kullanman gerekebilir.
// Eğer script'i body'nin sonuna koyuyorsan direkt çağırabilirsin.
//initializeDynamicBanner();

// ÖNEMLİ: Bu fonksiyonu HTML'in sonunda veya DOM hazır olduğunda çağırmayı unutma!
// Örneğin:
// document.addEventListener('DOMContentLoaded', initializeDynamicBanner);
// Veya script'i body'nin en sonuna koyuyorsan direkt:
// initializeDynamicBanner();


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
    
    function PreventRightClick() {
    const allImages = document.querySelectorAll('img');
    allImages.forEach(function(img) {
        img.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
    });
}
    
    function initializePage() {
    handleIntroOverlay();
   // setLang();
   updateDiscordPfp();
    setupHeartEffect();
    setupTweetEmbed('.tweet-embed-container');
   PreventRightClick();
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