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
    
    
       function shakeIt(event) {
            let verifi = document.querySelector('.checkmark');
            if (verifi) {
                verifi.classList.add('fa-shake');
                setTimeout(() => {
                    verifi.classList.remove('fa-shake');
                }, 500);
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

            function showPopUp() {
    var pop = document.createElement("div");
    var innerDiv = document.createElement("div");

    pop.id = "pop";
    innerDiv.className = "pop-inner";

    pop.style.position = "fixed";
    pop.style.bottom = "20px";
    pop.style.left = "20px"; // Sol tarafa sabitle
    pop.style.borderRadius = "15px";
    pop.style.overflow = "hidden";
    pop.style.boxShadow = "0 0 15px rgba(75, 26, 109, 0.8), 0 4px 10px rgba(75, 26, 109, 0.5)"; 
    pop.style.border = "3px solid #4b1a6d"; // Canlı pembe çerçeve
    //pop.style.maxWidth = "90vw"; // Ekranın %90'ı ile sınırla
    pop.style.width = "fit-content";
    pop.style.padding = "5px";
    pop.style.boxSizing = "border-box";

    innerDiv.style.backgroundColor = "#222";
    innerDiv.style.padding = "10px 15px";
    innerDiv.style.display = "inline-flex";
    innerDiv.style.alignItems = "center";
    innerDiv.style.justifyContent = "center";
    innerDiv.style.gap = "10px";
    innerDiv.style.border = "3px solid #5525AE"; // Daha kalın, canlı pembe border
    innerDiv.style.borderRadius = "10px";
    innerDiv.style.fontSize = "14px";
    innerDiv.style.fontWeight = "bold";
    innerDiv.style.color = "white";
    innerDiv.style.userSelect = "none";
    innerDiv.style.whiteSpace = "nowrap"; // Kelimeler yan yana, tek satır
   // innerDiv.style.maxWidth = "400px"; // Metnin tamamı için daha geniş alan
    innerDiv.style.overflow = "hidden"; // Taşma kontrolü
    innerDiv.style.textOverflow = "ellipsis"; // Hala taşarsa "..." koy
    innerDiv.style.boxSizing = "border-box";

    if (hata) {
        innerDiv.innerHTML = `<i class="fas fa-times" style="color: white;
        font-size: 18px;"></i> Couldn't update Discord pfp`;
    } else {
        innerDiv.innerHTML = `<i class="fas fa-check" style="color: white;
        font-size: 18px;"></i> Updated the Discord pfp`;
    }

    var css = `
    @keyframes pop-in {
        0% { transform: scale(0.8); opacity: 0; }
        60% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
    }

    @keyframes pop-out {
        0% { transform: scale(1); opacity: 1; }
        40% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(0.8); opacity: 0; }
    }

    .pop-inner {
        animation: pop-in 0.5s ease-out, pop-out 0.5s ease-in 3s forwards;
    }

    @media (max-width: 600px) {
        #pop {
            bottom: 10px;
            left: 10px;
            padding: 5px;
            box-shadow: 0 0 10px rgba(255, 105, 180, 0.6), 0 4px 8px rgba(255, 20, 147, 0.4);
            border: 2px solid #ff69b4;
        }
        .pop-inner {
            font-size: 12px;
            padding: 8px 12px;
            max-width: 250px; // Mobilde daha küçük
            border: 2px solid #ff69b4;
        }
    }
    `;

    pop.appendChild(innerDiv);
    document.body.appendChild(pop);

    var style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    setTimeout(() => {
        let el = document.getElementById("pop");
        if (el) {
            el.style.display = "none";
        } else {
            console.log("???");
        }
    }, 3500);
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

setupScrollAnimations();
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
    