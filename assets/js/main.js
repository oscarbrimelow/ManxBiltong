const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('is-open');
        const isExpanded = navLinks.classList.contains('is-open');
        navToggle.setAttribute('aria-expanded', String(isExpanded));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

const basketButtons = document.querySelectorAll('[data-add-to-basket]');
if (basketButtons.length) {
    basketButtons.forEach((button) => {
        button.addEventListener('click', () => {
            alert('Thanks for your interest! Online ordering is coming soon, please use the contact form to place your order today.');
        });
    });
}

const galleries = document.querySelectorAll('[data-gallery]');
if (galleries.length) {
    galleries.forEach((gallery) => {
        const images = Array.from(gallery.querySelectorAll('[data-gallery-image]'));
        const prevButton = gallery.querySelector('[data-gallery-prev]');
        const nextButton = gallery.querySelector('[data-gallery-next]');
        let currentIndex = 0;

        const showImage = (index) => {
            images.forEach((img, idx) => {
                img.classList.toggle('is-active', idx === index);
            });
        };

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            });
        }

        showImage(currentIndex);
    });
}

