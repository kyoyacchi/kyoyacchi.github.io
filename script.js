   function setLang() {
    document.addEventListener("DOMContentLoaded", () => {
  const lang = navigator.language;
try {
  if (lang.startsWith("tr")) {//TÜRKÇE İSE
    console.log("Türk bir kullanıcı!? Hemen geçiş yapıyorum!");
    setTimeout(() =>{
    //console.clear();
    },1500);
    document.querySelector(".footer-main").innerHTML = `
      <i id="Footer_heart" class="fas fa-heart"></i> ile <img id="discord_pfp" src="" alt="Discord Avatar" class="footer-avatar"> <span class="Footer_text">Kyo</span> tarafından yapıldı.
    `;

    document.querySelector(".shogunate-approval").innerHTML = 
      `<p class="shogunate-approval">"Bu websitesi <span
      class="almighty-raiden">Yüce Raiden Shogun</span> ve Shogunate koruması
      altındadır."</p>`;

    
    const bio = document.querySelector(".bio");
    if (bio) {
      bio.textContent = "Ei benim karım ulan!";
    }

    // Tweet yükleniyor
    const loadingText = document.querySelector(".loading-text");
    if (loadingText) {
      loadingText.textContent = "Tweet yükleniyor...";
    }
    
   /* const tweetBlock = document.getElementById("tweetBlock");
  
  if (tweetBlock) {
    tweetBlock.setAttribute("data-lang", "tr");
  }*/
  }
} catch(e){
  console.error(e||e.message)
}
});
}
//setLang();
    
    
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

        var hata = null;
        async function getDiscordAv() {
            try {
                const response = await axios.get("https://kyopi.vercel.app/api/pfp?id=468509605828493322");
                return response.data.avatar;
            } catch (error) {
                hata = true;
                console.error(error);
            }
        }

        document.addEventListener("DOMContentLoaded", async function () {
            const avatar = document.getElementById("discord_pfp");
            let current = localStorage.getItem('avatar');
            let avurl;
            const github = "https://avatars.githubusercontent.com/u/63583961";

      function showPopUp(isError) {
    // Check if a popup already exists
    if (document.getElementById("status-pop")) {
        return;
    }

    const pop = document.createElement("div");
    const innerDiv = document.createElement("div");
    pop.id = "status-pop"; // Unique ID
    innerDiv.className = "pop-inner";

    // --- Popup Styling  ---
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

      

            try {
                avurl = await getDiscordAv();
            } catch (error) {
                console.error("Failed to fetch Discord avatar:", error);
                avurl = github;
            }

            if (!current || current !== avurl) {
                current = avurl;
                showPopUp();
                localStorage.setItem('avatar', avurl);
            }

            avatar.onload = () => {};
            avatar.onerror = (e) => {
                console.warn("Oops! I had issue getting discord pfp, so using github pfp for now");
                avatar.src = github;
            };
            avatar.src = current || github;
        });

        changeHeartColor();
        function changeHeartColor() {
const heartIcon = document.getElementById('Footer_heart');
    if (!heartIcon) return;

    const colors = ['#FF6B8B', '#A68BFF', '#6C2BD9', '#ffffff', '#9B59B6']; // Raiden temalı renkler
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
        heartIcon.style.color = ""; // CSS'deki varsayılan renge dön
    }

    heartIcon.addEventListener('mouseenter', () => {
        startColorChanging();
        setTimeout(stopColorChanging, 1000); // 1 saniye sonra dursun
    });
    heartIcon.addEventListener('mouseleave', stopColorChanging);
        }

        document.addEventListener('DOMContentLoaded', function() {
            const introOverlay = document.querySelector('.intro-overlay');
            setTimeout(() => {
                introOverlay.style.opacity = '0';
                setTimeout(() => {
                    introOverlay.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 500);
            }, 1000);
        });
        
        document.addEventListener('DOMContentLoaded', function() {
    const introOverlay = document.querySelector('.intro-overlay');
    const lines = document.querySelectorAll('.line');
    
  
    setTimeout(() => {
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500); 
    }, 1500); 
});

document.addEventListener('DOMContentLoaded', function() {
  const tweetContainer = document.querySelector('.tweet-embed-container');
  const tweetContent = document.querySelector('.tweet-content');
  const spinner = document.querySelector('.loading-spinner');
const loadingWrapper = document.querySelector('.loading-wrapper');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadTweet();
        observer.unobserve(tweetContainer);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(tweetContainer);

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
      t.ready = function(f) {
        t._e.push(f);
      };
      
      return t;
    }(document, "script", "twitter-wjs"));


    twttr.ready(function() {
      twttr.events.bind('loaded', showContent);
    });

    
    setTimeout(showContent, 5000);
  }

  function showContent() {
    tweetContent.classList.add('loaded');
    spinner.style.display = 'none';
    loadingWrapper.style.display = 'none';
  }
});
setupParticleCanvas();
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
       
        
        document.addEventListener('DOMContentLoaded', function() {
    const preloaderText = document.querySelector('.preloader-text');
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
        'Koko yori, jakumetsu no toki!'
    ];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    preloaderText.textContent = randomText;
});
    setupScrollAnimations();