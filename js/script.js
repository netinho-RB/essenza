document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. MENU MOBILE BOUTIQUE (ABRIR/FECHAR)
       ============================================================ */
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const themeToggleM = document.getElementById('theme-toggle-m');

    if (themeToggleM) {
        const body = document.body;
        const icon = themeToggleM.querySelector('i');

        // Check for saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            icon.className = 'fa-solid fa-sun';
        }

        themeToggleM.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                icon.className = 'fa-solid fa-sun';
            } else {
                localStorage.setItem('theme', 'light');
                icon.className = 'fa-solid fa-moon';
            }
        });
    }
    const menuClose = document.getElementById('menu-close');
    // Seleciona tanto os links normais quanto o botão de agendamento dentro do menu
    const menuLinks = document.querySelectorAll('.menu-link, .menu-link-highlight');

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
        });
    }

    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // Libera o scroll
        }
    };

    if (menuClose) menuClose.addEventListener('click', closeMenu);
    
    // Fecha o menu ao clicar em qualquer link
    menuLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Fecha o menu se clicar na parte escura (fora do card)
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) closeMenu();
        });
    }

    /* ============================================================
       2. CARROSSEL 3D (HERO) - COM AUTO-PLAY
       ============================================================ */
    const cards = document.querySelectorAll('.m-card');
    const dots = document.querySelectorAll('.m-dot');
    let currentIndex = 0; // Começa no primeiro

    function updateCarousel(index) {
        if (cards.length === 0) return;
        
        cards.forEach((card, i) => {
            card.classList.remove('m-active', 'm-left', 'm-right');
            if (dots[i]) dots[i].classList.remove('active');

            if (i === index) {
                card.classList.add('m-active');
                if (dots[i]) dots[i].classList.add('active');
            } else if (i < index) {
                card.classList.add('m-left');
            } else {
                card.classList.add('m-right');
            }
        });
    }

    if (cards.length > 0) {
        let autoPlayHero = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel(currentIndex);
        }, 5000);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(autoPlayHero);
                currentIndex = i;
                updateCarousel(currentIndex);
            });
        });

        updateCarousel(currentIndex);
    }

    /* ============================================================
       3. DOTS DO CARROSSEL DE ESPECIALIDADES (SCROLL-BASED)
       ============================================================ */
    const specSlider = document.querySelector('.m-spec-slider');
    const specDots = document.querySelectorAll('.m-spec-dot');

    if (specSlider && specDots.length > 0) {
        specSlider.addEventListener('scroll', () => {
            const scrollLeft = specSlider.scrollLeft;
            // Ajustado para m-spec-card (seu HTML atual)
            const firstCard = specSlider.querySelector('.m-spec-card');
            if (!firstCard) return;

            const cardWidth = firstCard.offsetWidth + 20; // Largura + gap de 20px
            const index = Math.round(scrollLeft / cardWidth);

            specDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        });
    }
window.addEventListener('scroll', function() {
    const waButton = document.querySelector('.wa-float');
    const scrollPosition = window.innerHeight + window.scrollY;
    const bodyHeight = document.documentElement.scrollHeight;

    // Se estiver a menos de 150px do fim da página, sobe o botão
    if (scrollPosition > bodyHeight - 70) {
        waButton.classList.add('wa-at-bottom');
    } else {
        waButton.classList.remove('wa-at-bottom');
    }
});


        // ============================================================
    // 4. MOTOR DE REVELAÇÃO NO SCROLL (ALTO PADRÃO)
    // ============================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Dispara um pouquinho antes de chegar no limite
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active', 'reveal-active');
                observer.unobserve(entry.target); // Melhora performance não animando de novo
            }
        });
    }, observerOptions);

    // Selecionamos elementos específicos (cards, títulos) em vez da seção inteira
    const elementsToReveal = document.querySelectorAll('.m-section-header, .m-spec-card, .m-team-card, .m-location-card-premium, .m-feat, .about-text h2, .about-text p, .service-card');
    
    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal');
        
        // Efeito cascata: se for um slider ou lista, ele dá um pequeno delay baseado na posição dele
        if(el.classList.contains('m-spec-card') || el.classList.contains('m-feat')) {
            // Pega o index dentro do pai para calcular o delay
            let siblings = Array.from(el.parentNode.children);
            let myIndex = siblings.indexOf(el);
            el.style.transitionDelay = `${myIndex * 0.15}s`; 
        }
        
        revealObserver.observe(el);
    });
});