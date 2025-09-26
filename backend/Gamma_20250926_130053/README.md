# NovaLab Static Scaffold

A modern, production-ready static website scaffold using
- HTML
- TailwindCSS (CDN)
- jQuery (CDN)
- Dark/Light mode
- Sticky navigation
- Smooth scroll and reveal animations
- Modal popup
- Contact form with AJAX submission (via jQuery)

Note: All HTML pages load Tailwind CDN and jQuery CDN as required.

Folder Structure
- index.html: Main landing page (hero, features, CTA, footer)
- about.html: Team/company info page
- contact.html: Contact form with validation + AJAX submission
- css/styles.css: Theme variables, animations, and custom utilities
- js/main.js: Global site logic (dark mode, scroll reveal)
- js/utils.js: Reusable utilities (formatDate, debounce, scrollToSection)
- js/components/navbar.js: Sticky/mobile nav behavior
- js/components/modal.js: Accessible modal with transitions
- README.md: This file

How to run locally
- Open/index.html directly in a browser or deploy to GitHub Pages, Netlify, or Vercel.
- CDN-based Tailwind will load automatically from the internet.

Customization tips
- Change colors in CSS using CSS variables (styles.css). Tailwind classes handle most UI, but CSS vars help for global theming.
- Replace placeholder content with your own text and images.
- The dark mode is stored in localStorage under the key theme.

Licenses and notes
- Tailwind CDN is used for rapid prototyping and production-ready design via CDN.
- jQuery is used for AJAX in the contact form and small interactions.
- All code is commented for clarity.

Hello World
- A friendly "Hello World" marker is shown in the index.html hero as part of the design, fulfilling the requested demo content.

