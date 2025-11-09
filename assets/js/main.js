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

