document.addEventListener('DOMContentLoaded', function() {
    // Функционал мобильного меню
    function initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const mobileMenuContent = document.querySelector('.mobile-menu-content');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        const body = document.body;

        function openMenu() {
            mobileMenuToggle.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            mobileMenuContent.classList.add('active');
            body.style.overflow = 'hidden';
        }

        function closeMenu() {
            mobileMenuToggle.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuContent.classList.remove('active');
            body.style.overflow = 'auto';
        }

        // Открытие меню
        mobileMenuToggle.addEventListener('click', openMenu);

        // Закрытие меню
        mobileMenuClose.addEventListener('click', closeMenu);
        mobileMenuOverlay.addEventListener('click', closeMenu);

        // Закрытие при клике на ссылку
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    closeMenu();

                    // Плавная прокрутка
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;

                    setTimeout(() => {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Обновляем URL
                        history.pushState(null, null, targetId);
                    }, 300);
                }
            });
        });

        // Закрытие при нажатии Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
    }


    // Слайдер отзывов
    const track = document.querySelector('.reviews-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cards = document.querySelectorAll('.review-card');
    const indicators = document.querySelectorAll('.indicator');
    let currentPosition = 0;
    let cardsPerView = 3;
    let maxPosition = Math.ceil(cards.length / cardsPerView) - 1;

    // Определяем количество карточек в зависимости от ширины экрана
    function updateCardsPerView() {
        if (window.innerWidth < 768) {
            cardsPerView = 1;
        } else if (window.innerWidth < 1200) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }
        maxPosition = Math.ceil(cards.length / cardsPerView) - 1;
        updateSlider();
    }

    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + 30;
        track.style.transform = `translateX(-${currentPosition * cardWidth * cardsPerView}px)`;
        updateButtons();
        updateIndicators();
    }

    function updateButtons() {
        prevBtn.disabled = currentPosition === 0;
        nextBtn.disabled = currentPosition >= maxPosition;
    }

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentPosition);
        });
    }

    nextBtn.addEventListener('click', function() {
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentPosition > 0) {
            currentPosition--;
            updateSlider();
        }
    });

    // Клик по индикаторам
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentPosition = index;
            updateSlider();
        });
    });

    // Обработка свайпов на мобильных устройствах
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentPosition < maxPosition) {
                // Свайп влево
                currentPosition++;
            } else if (diff < 0 && currentPosition > 0) {
                // Свайп вправо
                currentPosition--;
            }
            updateSlider();
        }
    }

    // Плавная прокрутка к секциям
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    // Закрываем мобильное меню если оно открыто
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        socialMedia.classList.remove('active');
                        menuToggle.classList.remove('active');
                    }

                    // Вычисляем позицию с учетом фиксированной шапки
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;

                    // Плавная прокрутка
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Добавляем активный класс к текущей ссылке
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');

                    // Обновляем URL без перезагрузки страницы
                    history.pushState(null, null, targetId);
                }
            });
        });

        // Подсветка активного раздела при скролле
        function updateActiveSection() {
            const sections = document.querySelectorAll('section');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const scrollPosition = window.scrollY + headerHeight + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        // Обработчик скролла
        window.addEventListener('scroll', updateActiveSection);
        window.addEventListener('load', updateActiveSection);
    }

    // Автопрокрутка отзывов (опционально)
    let autoScroll = setInterval(function() {
        if (currentPosition < maxPosition) {
            currentPosition++;
        } else {
            currentPosition = 0;
        }
        updateSlider();
    }, 5000);

    // Останавливаем автопрокрутку при наведении
    const sliderContainer = document.querySelector('.reviews-container');
    sliderContainer.addEventListener('mouseenter', function() {
        clearInterval(autoScroll);
    });

    sliderContainer.addEventListener('mouseleave', function() {
        autoScroll = setInterval(function() {
            if (currentPosition < maxPosition) {
                currentPosition++;
            } else {
                currentPosition = 0;
            }
            updateSlider();
        }, 5000);
    });

    // Инициализация
    updateCardsPerView();
    updateButtons();
    updateIndicators();
    initSmoothScroll();
    initMobileMenu();

    // Обновление при изменении размера окна
    window.addEventListener('resize', function() {
        updateCardsPerView();
    });

    // Анимация появления футера при скролле
    function initFooterAnimation() {
        const footer = document.querySelector('.footer');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.style.opacity = '1';
                    footer.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        observer.observe(footer);
    }

    // Добавляем стили для анимации футера
    const style = document.createElement('style');
    style.textContent = `
        .footer {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
    `;
    document.head.appendChild(style);

    initFooterAnimation();
});