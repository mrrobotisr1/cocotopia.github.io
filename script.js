// file name: script.js
// Основной скрипт без кода слайдера

document.addEventListener('DOMContentLoaded', function() {
    // Language switcher - добавьте этот элемент в header
    const languageSwitcher = document.createElement('div');
    languageSwitcher.className = 'language-switcher';
    languageSwitcher.innerHTML = `
        <button class="language-btn" data-lang="ru">
            <i class="fas fa-globe"></i>
            <span>RU</span>
        </button>
        <div class="language-dropdown">
            <button class="language-option" data-lang="ru">Русский</button>
            <button class="language-option" data-lang="en">English</button>
            <button class="language-option" data-lang="he">עברית</button>
        </div>
    `;
    
    // Theme switcher - добавьте этот элемент в header
    const themeSwitcher = document.createElement('button');
    themeSwitcher.id = 'themeSwitcher';
    themeSwitcher.className = 'theme-switcher-btn';
    themeSwitcher.innerHTML = '<i class="fas fa-moon"></i><span>Тёмная тема</span>';
    
    // Добавляем переключатели в header
    const headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
        // Создаем контейнер для кнопок
        const headerControls = document.createElement('div');
        headerControls.className = 'header-controls';
        headerControls.appendChild(languageSwitcher);
        headerControls.appendChild(themeSwitcher);
        headerContainer.appendChild(headerControls);
    }
    
    // Language management
    function initLanguage() {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');

        const savedLang = localStorage.getItem('language') || 'ru';
        const lang = (urlLang && translations[urlLang]) ? urlLang : savedLang;

        changeLanguage(lang);
    }
        
    function changeLanguage(lang) {
        if (!translations || !translations[lang]) return;

        // сохраняем язык
        localStorage.setItem('language', lang);

        // ставим lang/dir (для RTL уже есть стили в style.css)
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'he') ? 'rtl' : 'ltr';

        // обновляем кнопку языка (RU/EN/HE)
        updateLanguageSwitcher(lang);

        // применяем переводы так, чтобы НЕ ломать структуру меню/кнопок
        applyTranslations(lang);

        // обновляем текст кнопки темы под текущий язык
        const currentTheme = localStorage.getItem('theme') || 'dark';
        updateThemeSwitcher(currentTheme);

        // если слайдер зависит от RTL/языка — переинициализируем
        if (window.initSlider) window.initSlider();
    }
    
    function updateLanguageSwitcher(lang) {
        const languageBtn = document.querySelector('.language-btn');
        if (languageBtn) {
            const icon = languageBtn.querySelector('i');
            const text = languageBtn.querySelector('span');
            
            if (lang === 'ru') {
                text.textContent = 'RU';
                languageBtn.setAttribute('data-lang', 'ru');
            } else if (lang === 'en') {
                text.textContent = 'EN';
                languageBtn.setAttribute('data-lang', 'en');
            } else if (lang === 'he') {
                text.textContent = 'HE';
                languageBtn.setAttribute('data-lang', 'he');
            }
        }
    }
    
    // Theme management
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.toggle('light-theme', savedTheme === 'light');
        updateThemeSwitcher(savedTheme);
    }
    
    function updateThemeSwitcher(theme) {
        if (themeSwitcher) {
            const icon = themeSwitcher.querySelector('i');
            const text = themeSwitcher.querySelector('span');
            
            // Получаем текущий язык
            const currentLang = document.documentElement.lang;
            
            if (theme === 'light') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                // Текст в зависимости от языка
                if (currentLang === 'he') {
                    text.textContent = 'תצוגה בהירה';
                } else if (currentLang === 'en') {
                    text.textContent = 'Light theme';
                } else {
                    text.textContent = 'Светлая тема';
                }
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                // Текст в зависимости от языка
                if (currentLang === 'he') {
                    text.textContent = 'תצוגה כהה';
                } else if (currentLang === 'en') {
                    text.textContent = 'Dark theme';
                } else {
                    text.textContent = 'Тёмная тема';
                }
            }
        }
    }
    
    function toggleTheme() {
        const isLightTheme = document.body.classList.toggle('light-theme');
        const theme = isLightTheme ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        updateThemeSwitcher(theme);
    }
    
    // Обработчики для переключателя языка
    document.addEventListener('click', function(e) {
        const languageBtn = document.querySelector('.language-btn');
        const languageDropdown = document.querySelector('.language-dropdown');
        
        if (languageBtn && languageBtn.contains(e.target)) {
            languageDropdown.classList.toggle('show');
        } else if (languageDropdown && !languageDropdown.contains(e.target)) {
            languageDropdown.classList.remove('show');
        }
        
        // Обработка выбора языка
        if (e.target.classList.contains('language-option')) {
            const lang = e.target.getAttribute('data-lang');
            changeLanguage(lang);
            languageDropdown.classList.remove('show');
        }
    });
    
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', toggleTheme);
    }
    
    // Инициализируем язык и тему
    initLanguage();
    initTheme();
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Блокируем скролл при открытом меню
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Восстанавливаем скролл
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(event.target) && 
                !mobileMenuBtn.contains(event.target)) {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие меню при нажатии ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    document.body.style.overflow = '';
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Add active class to nav links on scroll
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Add smooth hover effects to all buttons
    const allButtons = document.querySelectorAll('.btn, .slider-btn, .social-icon, .theme-switcher-btn, .language-btn');
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
// ===== LANGUAGE SWITCH WITHOUT PAGE RELOAD =====

function applyLanguage(lang) {
    if (!translations[lang]) return;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    localStorage.setItem('language', lang);

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        if (translations[lang][key]) {
            if (el.tagName === 'META') {
                el.setAttribute('content', translations[lang][key]);
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    // 🔥 ПЕРЕИНИЦИАЛИЗИРУЕМ СЛАЙДЕР ДЛЯ ИВРИТА
    if (window.initSlider) {
        initSlider();
    }
}

// init
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'ru';
    applyLanguage(savedLang);

    document.querySelectorAll('[data-lang]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            applyLanguage(link.dataset.lang);
        });
    });
});
function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        const value = dict[key];
        if (!value) return;

        // meta description
        if (el.tagName === 'META') {
            el.setAttribute('content', value);
            return;
        }

        // ВАЖНО: НЕ ломаем ссылки меню и кнопки с иконками:
        // если внутри есть <i> и <span>, переводим ТОЛЬКО span
        const hasIcon = el.querySelector('i');
        const directSpan = el.querySelector(':scope > span');

        if (hasIcon && directSpan) {
            directSpan.innerHTML = value;
            return;
        }

        // обычные элементы можно переводить целиком
        el.innerHTML = value;
    });

    // title — лучше отдельно
    const titleEl = document.querySelector('title[data-translate]');
    if (titleEl) {
        const key = titleEl.getAttribute('data-translate');
        if (dict[key]) document.title = dict[key];
    }
}