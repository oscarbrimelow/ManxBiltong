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

const newsletterForms = document.querySelectorAll('[data-newsletter]');
if (newsletterForms.length) {
    newsletterForms.forEach((newsletterForm) => {
        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailField = newsletterForm.querySelector('input[type="email"]');
            if (emailField) {
                const email = emailField.value.trim();
                if (email) {
                    alert(`Thanks for subscribing, ${email}!`);
                    emailField.value = '';
                } else {
                    alert('Please enter a valid email address.');
                }
            }
        });
    });
}

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        alert(`Thanks ${name || 'friend'}! We'll be in touch shortly.`);
        contactForm.reset();
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

