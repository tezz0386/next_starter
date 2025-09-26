# NovaShop - Modern Ecommerce Static Scaffold

This repository contains a production-ready static website scaffold for an ecommerce-like storefront. It uses:
- HTML, CSS, JS
- jQuery (for AJAX demo forms)
- Tailwind CSS via CDN (latest stable as of 2025)

File structure
- index.html                  (landing page with hero, features, shop grid, CTA)
- about.html                  (team/company info page)
- contact.html                (form with validation + AJAX submission)
- css/
  - styles.css                (custom theme variables, animations, custom utilities)
- js/
  - main.js                    (global init: dark/light toggle, scroll reveal)
  - utils.js                   (formatDate, debounce, scrollToSection)
  - components/
    - navbar.js                (mobile toggle, active link highlight)
    - modal.js                 (modal open/close with fade transitions)
- README.md                    (setup & customization guide)

How to use
1) Open index.html in any modern browser. The site is self-contained and requires no build step.
2) For deployment, host the three HTML pages on your static hosting provider (GitHub Pages, Netlify, Vercel, etc.).
3) If Tailwind changes, update the CDN link in each HTML file. Our configuration uses Tailwind via CDN with a small tailwind.config block for dark mode and color extensions.
4) The contact form demonstrates AJAX submission using jsonplaceholder.typicode.com/posts for a realistic response. In production, swap the URL to your own endpoint (e.g., Netlify Forms, Formik, etc.).

Notes and tips
- Dark/Light mode is stored in localStorage and toggled by a button (#themeToggle).
- The navigation uses a sticky header and highlights the current section on scroll.
- Scroll reveal animations are implemented with the .reveal class and a small in-view trigger.
- The CSS includes a demonstration of how to extend Tailwind with custom utilities using plain CSS (variables + utility-like classes). For full Tailwind @apply extensions, a build step would be required.

Customization guide
- Change color palette: edit CSS variables in css/styles.css, or extend Tailwind colors in the tailwind.config block inside each HTML file.
- Add more products: duplicate product cards in index.html#shop.
- Add more sections: copy/paste a new section block with Tailwind utility classes.

Accessibility
- Semantic HTML is used (sections, headings, main, nav, aria-labels).
- Keyboard navigation support for modal and interactive elements.
- Focus outlines retained.

Copy-paste ready
- All HTML pages include Tailwind CDN and jQuery CDN.
- All JavaScript and CSS files are linked with relative paths as shown.
- Favicon and OpenGraph meta tags are included for basic social sharing.

If you want me to adapt this scaffold to a specific brand style (colors, typography, spacing) or to add a real cart system (localStorage cart, cart drawer, etc.), I can extend it accordingly.
