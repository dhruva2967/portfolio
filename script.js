// Helper function to format video URLs into iframe-compatible embeds
function getEmbedUrl(url) {
    if (!url) return '';

    // YouTube match
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&enablejsapi=1&rel=0`;
    }

    // Vimeo match
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    // Direct video files
    return url;
}

function isDirectVideoUrl(url) {
    return /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(url || '');
}

function getOptimizedVideoUrl(url) {
    if (!url) return '';
    if (url.includes('res.cloudinary.com') && url.includes('/video/upload/') && !url.includes('/q_auto')) {
        return url.replace('/video/upload/', '/video/upload/q_auto:good/');
    }
    return url;
}

function createVideoPlayer(src, options = {}) {
    const video = document.createElement('video');
    video.src = getOptimizedVideoUrl(src);
    video.controls = true;
    video.controlsList = 'nodownload';
    video.setAttribute('controlsList', 'nodownload');
    video.setAttribute('oncontextmenu', 'return false;');
    video.playsInline = true;
    video.preload = options.autoplay ? 'auto' : 'metadata';
    video.className = 'w-full h-full bg-black object-contain outline-none';

    if (options.poster) {
        video.poster = options.poster;
    }

    if (options.autoplay) {
        video.autoplay = true;
        video.addEventListener('canplay', () => {
            video.play().catch(() => {
                video.controls = true;
            });
        }, { once: true });
    }

    return video;
}

function createMediaPlayer(src, options = {}) {
    if (isDirectVideoUrl(src)) {
        return createVideoPlayer(src, options);
    }

    const iframe = document.createElement('iframe');
    iframe.src = getEmbedUrl(src);
    iframe.className = 'w-full h-full border-0';
    iframe.allow = 'autoplay; fullscreen; encrypted-media';
    iframe.allowFullscreen = true;
    return iframe;
}

window.addEventListener('DOMContentLoaded', () => {

    // Split active heading styles into individual letters or words.
    function initAnimatedText() {
        const charAnimatedTexts = document.querySelectorAll(".wave-text, .typing-text, .rotate-scale-text, .color-scale-text, .skew-slide-text");

        charAnimatedTexts.forEach((textElement) => {
            let charClass, baseDelay;

            if (textElement.classList.contains("wave-text")) {
                charClass = "wave-char";
                baseDelay = 0.06;
            } else if (textElement.classList.contains("typing-text")) {
                charClass = "typing-char";
                baseDelay = 0.03;
            } else if (textElement.classList.contains("rotate-scale-text")) {
                charClass = "rotate-scale-char";
                baseDelay = 0.05;
            } else if (textElement.classList.contains("color-scale-text")) {
                charClass = "color-scale-char";
                baseDelay = 0.04;
            } else if (textElement.classList.contains("skew-slide-text")) {
                charClass = "skew-slide-char";
                baseDelay = 0.04;
            }

            const textContent = textElement.textContent.trim();
            const words = textContent.split(/\s+/);
            textElement.innerHTML = "";

            let letterIndex = 0;
            words.forEach((word, wordIdx) => {
                const wordSpan = document.createElement("span");
                wordSpan.style.display = "inline-block";
                wordSpan.style.whiteSpace = "nowrap";

                const letters = word.split("");
                letters.forEach((letter) => {
                    const charSpan = document.createElement("span");
                    charSpan.textContent = letter === " " ? "\u00A0" : letter;
                    charSpan.className = charClass;
                    charSpan.style.animationDelay = `${letterIndex * baseDelay}s`;
                    wordSpan.appendChild(charSpan);
                    letterIndex++;
                });

                textElement.appendChild(wordSpan);

                if (wordIdx < words.length - 1) {
                    const spaceSpan = document.createElement("span");
                    spaceSpan.innerHTML = "&nbsp;";
                    spaceSpan.style.display = "inline-block";
                    textElement.appendChild(spaceSpan);
                }
            });

            if (!textElement.closest("#hero-section")) {
                ScrollTrigger.create({
                    trigger: textElement,
                    start: "top 85%",
                    onEnter: () => textElement.classList.add("animated"),
                    once: true
                });
            }
        });

        const wordAnimatedTexts = document.querySelectorAll(".word-fade-rise-text");

        wordAnimatedTexts.forEach((textElement) => {
            let wordClass, baseDelay;

            if (textElement.classList.contains("word-fade-rise-text")) {
                wordClass = "word-fade-rise-item";
                baseDelay = 0.12;
            }

            const textContent = textElement.textContent.trim();
            const words = textContent.split(/\s+/);
            textElement.innerHTML = "";

            words.forEach((word, idx) => {
                const wordSpan = document.createElement("span");
                wordSpan.className = wordClass;
                wordSpan.textContent = word;
                wordSpan.style.animationDelay = `${idx * baseDelay}s`;
                textElement.appendChild(wordSpan);

                if (idx < words.length - 1) {
                    const spaceSpan = document.createElement("span");
                    spaceSpan.innerHTML = "&nbsp;";
                    spaceSpan.style.display = "inline-block";
                    textElement.appendChild(spaceSpan);
                }
            });

            if (!textElement.closest("#hero-section")) {
                ScrollTrigger.create({
                    trigger: textElement,
                    start: "top 85%",
                    onEnter: () => textElement.classList.add("animated"),
                    once: true
                });
            }
        });
    }

    initAnimatedText();

    // Fade & Rise Animation for Contact/Testimonials headings
    gsap.to(".fade-rise-text", {
        scrollTrigger: {
            trigger: ".fade-rise-text",
            start: "top 85%",
            markers: false,
            once: true
        },
        duration: 1,
        opacity: 1,
        y: 0,
        ease: "power3.out",
        stagger: 0.2
    });

    // 1. Wen Launch Hero Entry Timeline
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl.call(() => {
        document.querySelector(".hero-title-top")?.classList.add("animated");
    })
        .call(() => {
            document.querySelector(".hero-title-bot")?.classList.add("animated");
        }, null, "+=0.35")
        .from(".hero-copy p", { duration: 1, opacity: 0, x: 20, ease: "power3.out" }, "+=0.4")
        .from(".hero-ctas", { duration: 1, y: 30, opacity: 0, ease: "power4.out" }, "-=0.8")
        .to(".side-label-left, .side-label-right", { duration: 1, opacity: 1, stagger: 0.2, ease: "power3.out" }, "-=0.5");

    // Parallax shift for side labels only. Keep them visible while scrolling.
    gsap.to("#hero-section .side-label-left, #hero-section .side-label-right", {
        scrollTrigger: {
            trigger: "#hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: 80,
        ease: "none"
    });

    // 2. Showreel Reveal
    gsap.from(".showreel-header", {
        scrollTrigger: { trigger: "#showreel", start: "top 80%", once: true },
        duration: 1.2, y: 50, opacity: 0, ease: "power4.out"
    });


    // 3. Services Animation
    gsap.from("#services .services-grid > .service-card", {
        scrollTrigger: { trigger: "#services", start: "top 75%", once: true },
        duration: 1.2, y: 60, opacity: 0, stagger: 0.2, ease: "power4.out"
    });

    // 4. Portfolio Cards Animation
    gsap.from("#portfolio .group", {
        scrollTrigger: { trigger: "#portfolio", start: "top 80%", once: true },
        duration: 1.2, y: 80, opacity: 0, stagger: 0.1, ease: "power4.out"
    });

    // 5. Testimonials Animation (Slide Up)
    gsap.from("#testimonials .glass-dark", {
        scrollTrigger: { trigger: "#testimonials", start: "top 80%", once: true },
        duration: 1.2,
        x: 100,
        opacity: 0,
        stagger: 0.2,
        ease: "power4.out",
        clearProps: "all"
    });

    // === LIGHTWEIGHT LAZY LOADING ===
    // One-time Intersection Observer for image reveal animations
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Trigger a subtle fade-in animation
                gsap.to(img, { duration: 0.6, opacity: 1, ease: "power2.out" });
                // Stop observing after first intersection
                imageObserver.unobserve(img);
            }
        });
    }, { threshold: 0.1, rootMargin: "50px" });

    // Observe all lazy-loaded images
    document.querySelectorAll("img[loading='lazy']").forEach(img => {
        img.style.opacity = "0.7"; // Start slightly transparent for fade-in effect
        imageObserver.observe(img);
    });

    // --- Inline Showreel Playback Logic ---
    const showreelContainer = document.getElementById('inline-showreel-container');
    const showreelOverlay = document.getElementById('inline-showreel-overlay');
    const showreelPoster = document.getElementById('inline-showreel-poster');
    const showreelIframeContainer = document.getElementById('inline-showreel-iframe-container');

    if (showreelContainer && showreelOverlay && showreelIframeContainer) {
        showreelOverlay.addEventListener('click', (e) => {
            e.stopPropagation();

            if (!showreelIframeContainer.children.length) {
                const videoSrc = showreelContainer.getAttribute('data-video-src');
                const player = createMediaPlayer(videoSrc, {
                    autoplay: true,
                    poster: showreelPoster?.getAttribute('src')
                });

                showreelIframeContainer.appendChild(player);
            }

            showreelIframeContainer.classList.remove('opacity-0', 'pointer-events-none');
            showreelIframeContainer.classList.add('opacity-100', 'pointer-events-auto');

            showreelOverlay.style.opacity = '0';
            showreelOverlay.style.pointerEvents = 'none';
            if (showreelPoster) {
                showreelPoster.style.opacity = '0';
            }
        });
    }

});

// Scroll Progress Bar & Navbar Transformation
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;


    // Navbar: Hide top nav and show floating nav past hero
    const navbar = document.getElementById('navbar');
    const floatingContainer = document.getElementById('floating-nav-container');
    const heroSection = document.getElementById('hero-section');
    const heroHeight = heroSection?.offsetHeight || 600;

    if (winScroll > heroHeight * 0.8) {
        navbar.style.transform = 'translateY(-100%)';
        floatingContainer.style.transform = 'translateY(0) scale(1)';
    } else {
        navbar.style.transform = 'translateY(0)';
        floatingContainer.style.transform = 'translateY(24px) scale(0)';

        // Ensure menu closes if user scrolls back up
        const floatingMenu = document.getElementById('floating-nav-menu');
        if (floatingMenu && floatingMenu.style.opacity === '1') {
            floatingMenu.style.opacity = '0';
            floatingMenu.style.pointerEvents = 'none';
            floatingMenu.style.transform = 'translateX(10px)';
        }
    }

});

// Floating Nav Toggle Logic
const floatingToggle = document.getElementById('floating-nav-toggle');
const floatingMenu = document.getElementById('floating-nav-menu');

if (floatingToggle && floatingMenu) {

    floatingToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent immediate close from document listener
        const isOpen = floatingMenu.style.opacity === '1';
        if (isOpen) {
            closeFloatingMenu();
        } else {
            openFloatingMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isOpen = floatingMenu.style.opacity === '1';
        if (isOpen && !floatingMenu.contains(e.target) && !floatingToggle.contains(e.target)) {
            closeFloatingMenu();
        }
    });

    function openFloatingMenu() {
        floatingMenu.style.opacity = '1';
        floatingMenu.style.pointerEvents = 'auto';
        floatingMenu.style.transform = 'translateX(0)';
    }

    function closeFloatingMenu() {
        floatingMenu.style.opacity = '0';
        floatingMenu.style.pointerEvents = 'none';
        floatingMenu.style.transform = 'translateX(10px)';
    }
}

// Mobile Menu Logic (Top Nav)
const mobileMenuBtn = document.querySelector('nav button.md\\:hidden');
const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('span') : null;
const desktopMenu = document.querySelector('.hidden.md\\:flex');

if (mobileMenuBtn && menuIcon) {
    mobileMenuBtn.addEventListener('click', () => {
        const isMenuOpen = desktopMenu.classList.contains('hidden');
        if (isMenuOpen) {
            desktopMenu.classList.remove('hidden');
            desktopMenu.classList.add('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-white', 'dark:bg-black', 'p-6', 'space-y-4', 'border-t', 'border-black/5', 'dark:border-white/5', 'animate-fade-in');
        } else {
            desktopMenu.classList.add('hidden');
            desktopMenu.classList.remove('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-white', 'dark:bg-black', 'p-6', 'space-y-4', 'border-t', 'border-black/5', 'dark:border-white/5', 'animate-fade-in');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isMenuOpen = !desktopMenu.classList.contains('hidden');
        if (isMenuOpen && !desktopMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            desktopMenu.classList.add('hidden');
            desktopMenu.classList.remove('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-white', 'dark:bg-black', 'p-6', 'space-y-4', 'border-t', 'border-black/5', 'dark:border-white/5', 'animate-fade-in');
        }
    });
}

// Form Submission (EmailJS Handler)
// Will be handled by the EmailJS configuration below

// Smooth scroll for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });

            // Close mobile menu if open
            if (desktopMenu && !desktopMenu.classList.contains('hidden') && window.innerWidth < 768) {
                mobileMenuBtn.click();
            }

            // Close floating menu if open
            if (floatingMenu && floatingMenu.style.opacity === '1') {
                floatingToggle.click();
            }
        }
    });
});

// --- Cursor Follower Logic ---
const cursor = document.getElementById('cursor-follower');
let mouseX = 0;
let mouseY = 0;

if (cursor) {
    // Only enable cursor follower on desktop (screen width >= 1024px and not touch-only devices)
    const isMobileDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;

    if (!isMobileDevice) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (cursor.style.opacity === '0' || cursor.style.opacity === '') {
                cursor.style.opacity = '1';
            }

            gsap.to(cursor, {
                x: mouseX, y: mouseY,
                xPercent: -50, yPercent: -50,
                duration: 0.1, ease: "none"
            });
        });

        const pushCursorHover = () => cursor.classList.add('cursor-hover');
        const popCursorHover = () => cursor.classList.remove('cursor-hover');

        const interactiveElements = document.querySelectorAll('a, button, .glass, input, textarea, #floating-nav-toggle');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', pushCursorHover);
            el.addEventListener('mouseleave', popCursorHover);
        });
    }
}

// --- Video Modal Logic ---
const videoModal = document.getElementById('video-modal');
const modalPlayer = document.getElementById('modal-player');
const videoLoader = document.getElementById('video-loader');

window.openVideoModal = function (src) {
    if (!videoModal || !modalPlayer) return;

    videoLoader.style.display = 'flex';
    modalPlayer.style.opacity = '0';
    modalPlayer.replaceChildren();

    const player = createMediaPlayer(src, { autoplay: true });
    modalPlayer.appendChild(player);

    videoModal.classList.remove('hidden');
    setTimeout(() => {
        videoModal.classList.remove('opacity-0');
        videoModal.classList.add('opacity-100');
        videoModal.classList.remove('pointer-events-none');
        videoModal.classList.add('pointer-events-auto');
        const inner = videoModal.querySelector('div');
        if (inner) {
            inner.style.transform = 'scale(1)';
            inner.style.opacity = '1';
        }
    }, 10);

    const showPlayer = function () {
        videoLoader.style.display = 'none';
        modalPlayer.style.opacity = '1';
    };

    if (player.tagName === 'VIDEO') {
        player.addEventListener('loadedmetadata', showPlayer, { once: true });
        player.addEventListener('error', showPlayer, { once: true });
    } else {
        player.onload = showPlayer;
    }

    document.body.style.overflow = 'hidden';
};

window.closeVideoModal = function () {
    if (!videoModal || !modalPlayer) return;

    videoModal.classList.remove('opacity-100');
    videoModal.classList.add('opacity-0');
    videoModal.classList.remove('pointer-events-auto');
    videoModal.classList.add('pointer-events-none');
    const inner = videoModal.querySelector('div');
    if (inner) {
        inner.style.transform = 'scale(0.95)';
        inner.style.opacity = '0';
    }

    setTimeout(() => {
        videoModal.classList.add('hidden');
        modalPlayer.replaceChildren();
        document.body.style.overflow = '';
    }, 500);
};

// Close modal on background click
if (videoModal) {
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
}

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = 'hDpbMRc9OyxkZFUh6';
const EMAILJS_SERVICE_ID = 'service_185sr4c';
const EMAILJS_TEMPLATE_ID = 'template_r1gubmc';
let emailJSRetryCount = 0;

// Wait for EmailJS to be available, then initialize.
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('EmailJS initialized');
        setupContactForm();
    } else if (emailJSRetryCount < 50) {
        emailJSRetryCount += 1;
        setTimeout(initializeEmailJS, 100);
    } else {
        console.error('EmailJS failed to load. Check your internet connection or CDN script URL.');
        setupContactFormUnavailable();
    }
}

// Setup contact form handler
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        if (contactForm.dataset.emailjsBound === 'true') {
            return;
        }
        contactForm.dataset.emailjsBound = 'true';

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Log form data for debugging
            const formData = new FormData(this);
            console.log('Form data being sent:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const submitButton = this.querySelector('button[type="submit"]');
            const statusMessage = document.getElementById('contact-form-status');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            if (statusMessage) {
                statusMessage.textContent = '';
                statusMessage.className = 'hidden text-sm font-semibold text-center';
            }

            console.log(`Sending with ${EMAILJS_SERVICE_ID} and ${EMAILJS_TEMPLATE_ID}`);

            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
                .then((response) => {
                    console.log('Email sent successfully!', response);
                    submitButton.textContent = 'Message Sent! \u2713';
                    submitButton.style.backgroundColor = '#00c853';
                    if (statusMessage) {
                        statusMessage.textContent = 'Your message was sent successfully. I will get back to you soon.';
                        statusMessage.className = 'text-sm font-semibold text-center text-[#00c853]';
                    }
                    this.reset();

                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.style.backgroundColor = '';
                        submitButton.disabled = false;
                    }, 3000);
                }, (error) => {
                    console.error('EmailJS error:', error);
                    console.error('Error status:', error.status);
                    console.error('Full error:', JSON.stringify(error));
                    submitButton.textContent = 'Failed to Send';
                    submitButton.style.backgroundColor = '#ff1744';
                    if (statusMessage) {
                        statusMessage.textContent = 'Sorry, the message could not be sent. Please try again.';
                        statusMessage.className = 'text-sm font-semibold text-center text-[#ff1744]';
                    }

                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.style.backgroundColor = '';
                        submitButton.disabled = false;
                    }, 3000);
                });
        });
    } else {
        console.error('Contact form not found!');
    }
}

function setupContactFormUnavailable() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm || contactForm.dataset.emailjsBound === 'true') {
        return;
    }

    contactForm.dataset.emailjsBound = 'true';
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Email service is not available. Please check your internet connection and try again.');
    });
}

// Initialize EmailJS when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEmailJS);
} else {
    initializeEmailJS();
}

// Handle contact form submission
// This will be set up by initializeEmailJS function above
