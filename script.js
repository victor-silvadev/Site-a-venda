
        AOS.init({
            once: true,
            duration: 800
        });

        document.querySelector('nav').addEventListener('click', event => {
            const link = event.target.closest('a[href^="#"]');

            if (!link) return;

            const target = document.querySelector(link.getAttribute('href'));

            if (!target) return;

            event.preventDefault();

            const navHeight = document.querySelector('nav').offsetHeight;
            const startPosition = window.scrollY;
            const targetPosition = target.getBoundingClientRect().top + startPosition - navHeight;
            const distance = targetPosition - startPosition;
            const duration = 700;

            // Respeita a preferência do usuário por menos movimento.
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                window.scrollTo(0, targetPosition);
                history.pushState(null, '', link.getAttribute('href'));
                return;
            }

            const startTime = performance.now();

            const animateScroll = currentTime => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easedProgress = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                window.scrollTo(0, startPosition + distance * easedProgress);

                if (progress < 1) requestAnimationFrame(animateScroll);
            };

            requestAnimationFrame(animateScroll);
            history.pushState(null, '', link.getAttribute('href'));
        });

        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            const toggleActive = () => {
                const isActive = card.classList.toggle('active');
                if (isActive) {
                    serviceCards.forEach(other => {
                        if (other !== card) other.classList.remove('active');
                    });
                }
            };

            card.addEventListener('click', event => {
                if (event.target.closest('.service-action')) return;
                toggleActive();
            });

            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleActive();
                }
            });
        });

        const portfolioCards = document.querySelectorAll('.portfolio-card');
        portfolioCards.forEach(card => {
            const video = card.querySelector('video');

            const playVideo = () => {
                if (video) {
                    video.play().catch(() => { });
                }
            };

            const pauseVideo = () => {
                if (video) {
                    video.pause();
                }
            };

            const toggleActive = () => {
                const isActive = card.classList.toggle('active');
                if (isActive) {
                    playVideo();
                    portfolioCards.forEach(other => {
                        if (other !== card) {
                            other.classList.remove('active');
                            const otherVideo = other.querySelector('video');
                            if (otherVideo) otherVideo.pause();
                        }
                    });
                } else {
                    pauseVideo();
                }
            };

            card.addEventListener('mouseenter', () => {
                playVideo();
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('active')) {
                    pauseVideo();
                }
            });

            card.addEventListener('click', () => {
                toggleActive();
            });

            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleActive();
                }
            });
        });

        // Acordeao da secao de perguntas frequentes
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = document.getElementById(question.getAttribute('aria-controls'));
                const isOpen = question.getAttribute('aria-expanded') === 'true';

                question.setAttribute('aria-expanded', String(!isOpen));
                answer.setAttribute('aria-hidden', String(isOpen));

                if (isOpen) {
                    // Mantem a altura atual antes de iniciar o fechamento.
                    answer.style.maxHeight = `${answer.scrollHeight}px`;
                    requestAnimationFrame(() => {
                        answer.classList.remove('is-open');
                        answer.style.maxHeight = '0px';
                    });
                } else {
                    // Primeiro abre o estado visual e, no frame seguinte, anima ate a altura real.
                    answer.style.maxHeight = '0px';
                    answer.classList.add('is-open');
                    requestAnimationFrame(() => {
                        answer.style.maxHeight = `${answer.scrollHeight}px`;
                    });
                }
            });
        });

        // Toggle do Menu Mobile Animado
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            const toggleMobileMenu = () => {
                const isActive = mobileMenuButton.classList.toggle('is-active');
                mobileMenu.classList.toggle('is-active', isActive);
            };

            mobileMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMobileMenu();
            });

            // Fechar menu mobile ao clicar em um link interno
            document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileMenuButton.classList.contains('is-active')) {
                        toggleMobileMenu();
                    }
                });
            });

            // Fechar ao clicar fora do menu
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                    if (mobileMenuButton.classList.contains('is-active')) {
                        toggleMobileMenu();
                    }
                }
            });
        }
    
