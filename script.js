document.addEventListener("DOMContentLoaded", () => {
    // --- LÓGICA DE VERIFICAÇÃO DE IDADE (Age Gate por Ano) ---
    const ageGate = document.getElementById('age-gate');
    const isVerified = localStorage.getItem('dionisioAgeVerified');

    // Permite apertar ENTER no input para enviar
    const ageInput = document.getElementById('age-year');
    if(ageInput) {
        ageInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                checkAgeInput();
            }
        });
    }

    if (isVerified === 'true') {
        if (ageGate) ageGate.style.display = 'none';
        document.body.style.overflow = 'auto'; 
    } else {
        if (ageGate) ageGate.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    }
    
    // Configura máscaras
    const cnpjInput = document.getElementById('cnpj');
    const phoneInput = document.getElementById('whatsapp');

    if(cnpjInput) {
        cnpjInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 14) value = value.slice(0, 14);
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }

    if(phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });
    }
    
    // --- LÓGICA DO FAQ (ACORDEÃO) ---
    const questions = document.querySelectorAll(".faq-question");
    questions.forEach((question) => {
        question.addEventListener("click", () => {
            const item = question.parentElement; 
            const answer = item.querySelector(".faq-answer");
            const isOpen = item.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach((otherItem) => {
                otherItem.classList.remove("active");
                otherItem.querySelector(".faq-answer").style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add("active");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- LÓGICA DO CARROSSEL DE RÓTULOS (PAUSAR AO CLICAR) ---
    const marqueeContainer = document.querySelector('.marquee-container');
    const marqueeTrack = document.querySelector('.marquee-track');

    if (marqueeContainer && marqueeTrack) {
        marqueeContainer.style.cursor = 'pointer';
        marqueeContainer.addEventListener('click', () => {
            marqueeTrack.classList.toggle('paused');
        });
    }

    // --- LÓGICA DE BLUR/DARK NO VIDEO MOBILE AO SCROLLAR ---
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 768) {
            const videoMobile = document.querySelector('.bg-video-mobile');
            if (videoMobile) {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                let ratio = scrollY / (windowHeight * 0.6);
                if (ratio > 1) ratio = 1;

                const blurValue = ratio * 12;
                const brightnessValue = 100 - (ratio * 70); 

                videoMobile.style.filter = `blur(${blurValue}px) brightness(${brightnessValue}%)`;
            }
        }
    });

    // --- LÓGICA DO CARROSSEL DE RECEITAS (AUTO PLAY + LOOP INFINITO) ---
    setupInfiniteScroll();
    startAutoPlay();
});

let autoPlayInterval;

function setupInfiniteScroll() {
    const track = document.getElementById('recipesTrack');
    if (!track) return;

    const originalCards = Array.from(track.children);
    
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); 
        track.appendChild(clone);
    });

    track.addEventListener('scroll', () => {
        const scrollLimit = track.scrollWidth / 2;
        
        if (track.scrollLeft >= scrollLimit) {
            track.style.scrollBehavior = 'auto'; 
            track.scrollLeft -= scrollLimit;     
            track.style.scrollBehavior = 'smooth'; 
        } 
        else if (track.scrollLeft <= 0) {
            track.style.scrollBehavior = 'auto';
            track.scrollLeft += scrollLimit;
        }
    });
}

function scrollCarousel(direction) {
    const track = document.getElementById('recipesTrack');
    const cardWidth = 320; 
    
    if (track) {
        track.scrollTo({
            left: track.scrollLeft + (direction * cardWidth),
            behavior: 'smooth'
        });
        resetAutoPlay();
    }
}

function startAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        scrollCarousel(1);
    }, 3000); 
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

function toggleRecipe(card) {
    const isActive = card.classList.contains('active');
    document.querySelectorAll('.recipe-card').forEach(c => c.classList.remove('active'));
    
    if (!isActive) card.classList.add('active');
    
    clearInterval(autoPlayInterval);
    setTimeout(startAutoPlay, 10000); 
}

function checkAgeInput() {
    const inputYear = document.getElementById('age-year').value;
    const currentYear = new Date().getFullYear();
    
    if (inputYear.length !== 4 || isNaN(inputYear)) {
        alert("Por favor, digite um ano válido (4 dígitos).");
        return;
    }

    const age = currentYear - parseInt(inputYear);

    if (age >= 18) {
        localStorage.setItem('dionisioAgeVerified', 'true');
        const ageGate = document.getElementById('age-gate');
        
        if (ageGate) {
            ageGate.style.opacity = '0';
            ageGate.style.transition = 'opacity 0.5s ease';
            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden'; 
            setTimeout(() => { ageGate.style.display = 'none'; }, 500);
        }
    } else {
        alert("Acesso restrito para menores de 18 anos.");
        window.location.href = "https://www.google.com";
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    const currentTheme = html.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'light');
        icon.classList.remove('ph-moon');
        icon.classList.add('ph-sun');
    } else {
        html.setAttribute('data-theme', 'dark');
        icon.classList.remove('ph-sun');
        icon.classList.add('ph-moon');
    }
}

function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
    
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
        document.body.style.overflowX = 'hidden';
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => { modal.classList.add('active'); }, 10);
        document.body.style.overflow = 'hidden'; 
    }
}

function closeModal(event, modalId) {
    if (event && event.target !== event.currentTarget) return; 
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; 
        }, 300);
    }
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal-overlay.active');
        activeModals.forEach(modal => closeModal(null, modal.id));
    }
});

function handleFormSubmit(event) {
    event.preventDefault(); 
    const cnpj = document.getElementById('cnpj').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    const cleanPhone = whatsapp.replace(/\D/g, '');

    if (cleanCNPJ.length !== 14) {
        alert("Por favor, insira um CNPJ válido com 14 dígitos.");
        return;
    }
    if (cleanPhone.length < 10) {
        alert("Por favor, insira um número de WhatsApp válido com DDD.");
        return;
    }

    alert('Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve com uma proposta personalizada.');
    document.getElementById('b2b-form').reset();
}