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
                pop.style.bottom = '0';
                pop.style.left = '20px';

                innerDiv.style.backgroundColor = "#333";
                innerDiv.style.padding = "10px";
                innerDiv.style.alignItems = "center";
                if (hata) {
                    innerDiv.innerHTML = `<i class="fas fa-times" style="color: white; font-size: 17px;"></i> couldn't update the discord profile picture, using default pfp from github`;
                } else {
                    innerDiv.innerHTML = `<i class="fas fa-check" style="color: white; font-size: 17px;"></i> updated discord profile picture`;
                }
                innerDiv.style.color = "white";
                innerDiv.style.userSelect = "none";

                innerDiv.style.animation = "pop-in 0.4s ease-in, pop-out 0.4s ease-out 2s forwards";
                pop.style.borderRadius = "10px";

                var css = `
                @keyframes pop-in {
                    0% { transform: translateY(100%); opacity: 0; }
                    80% { transform: translateY(-10%); opacity: 1; }
                    100% { transform: translateY(0); opacity: 1; }
                }

                @keyframes pop-out {
                    0% { transform: translateY(0); opacity: 1; }
                    20% { transform: translateY(10%); opacity: 1; }
                    100% { transform: translateY(100%); opacity: 0; }
                }

                .pop-inner {
                    animation: pop-in 0.4s ease-in, pop-out 0.4s ease-out 2s forwards;
                    border-radius: 10px;
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
                }, 2500);
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
            const colors = ['red', 'pink', 'blue', 'green', 'black'];
            let currentIndex = 0;
            let intervalId;

            function changeColor() {
                heartIcon.style.color = colors[currentIndex];
                currentIndex = (currentIndex + 1) % colors.length;
            }

            function startColorChanging() {
                intervalId = setInterval(changeColor, 200);
            }

            function stopColorChanging() {
                heartIcon.style.color = "";
                clearInterval(intervalId);
            }

            heartIcon.addEventListener('mouseenter', () => {
                startColorChanging();
                setTimeout(stopColorChanging, 1200);
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

document.addEventListener('DOMContentLoaded', function() {
            const canvas = document.getElementById('sparks-canvas');
            const ctx = canvas.getContext('2d');


            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

          
            const particles = [];
            const particleCount = 50; 

            class Particle {
                constructor() {
                    this.reset();
                }

                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 3 + 1;
                    this.speedX = (Math.random() - 0.5) * 2;
                    this.speedY = (Math.random() - 0.5) * 2;
                    this.opacity = Math.random() * 0.5 + 0.3;
                }

                update(scrollSpeed) {
                    this.x += this.speedX;
                    this.y += this.speedY + scrollSpeed * 0.1;
                    this.opacity -= 0.005; 


                    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.opacity <= 0) {
                        this.reset();
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(128, 0, 255, ${this.opacity})`; // Mor renk
                    ctx.fill();
                }
            }


            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            let lastScrollY = window.scrollY;

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);


                const currentScrollY = window.scrollY;
                const scrollSpeed = currentScrollY - lastScrollY;
                lastScrollY = currentScrollY;


                particles.forEach(particle => {
                    particle.update(scrollSpeed);
                    particle.draw();
                });

                requestAnimationFrame(animate);
            }

            animate();
        });
        document.addEventListener('DOMContentLoaded', function() {
    const preloaderText = document.querySelector('.preloader-text');
    const texts = [
        'Now, you shall perish!',
        'There is no escape!',
        'Inazuma shines eternal!',
        'Inabikari, sunawachi Eien nari',
        'Mikirimashita',
        'NONE CAN CONTEND WITH THE SUPREME POWER OF THE ALMIGHTY RAIDEN SHOGUN AND THE MUSOU NO HITOTACHI!'
        'Shine down!',
        'Illusion shattered!',
        'Torn to oblivion!',
        'Sabaki no ikazuchi',
        'Nigemichi wa arimasen'
        'Muga no kyouchi he',
        'Koko yori, jakumetsu no toki!'
    ];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    preloaderText.textContent = randomText;
});
    