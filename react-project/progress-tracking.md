# BIDXAAGUI Static Site → React Migration Plan

## 📋 Task Overview
Rebuild the existing static HTML/CSS/JS site using modern React components with pixel-perfect fidelity.

## 🔍 Static Site Analysis Complete

### 📄 Pages Identified
- **index.html** - Main homepage with multiple sections
- **index-v2.html** - Alternative homepage (check if needed)
- **pages/antropologia-fisica.html** - Placeholder page
- **pages/comunidad.html** - Community/events page with galleries
- **pages/consultorio.html** - Therapy services page with modals
- **pages/antroponomadas.html** - Publication/project showcase
- **admin/login.html** - Magic link authentication
- **admin/dashboard.html** - Admin subscriber management

### 🎨 CSS Files
- **css/styles.css** - Main stylesheet with design system
- **css/buttons.css** - Button styles
- **css/animations.css** - Base animations
- **css/comunidad-animations.css** - Community page animations
- **css/consultorio-animations.css** - Therapy page animations
- **css/scroll-animations.css** - Scroll-triggered animations

### 🟨 JavaScript Modules
- **js/script.js** - Common UI (mobile menu, instagram dropdown, year)
- **js/newsletter.js** - Contact form submission to Cloudflare Worker
- **js/lightbox.js** - Image gallery modals
- **js/therapies-data.js** - Therapy content structure
- **js/therapies-modal.js** - Therapy card/modal system
- **js/index-animations.js** - Scroll animations for homepage
- **js/consultorio-animations.js** - Therapy page scroll animations
- **js/scroll-animations.js** - General scroll animations

### 🖼️ Assets Organization
- 400+ images across `/assets/images/` subfolders
- Thumbnails, fullres, and original versions
- Logo variations, profile images, event photos

---

## 🗂️ Proposed React Component Architecture

### 🔧 Shared Components (in `/components/`)

#### **Layout Components**
1. **`Header.jsx`** - Navigation with mobile menu, instagram dropdown
2. **`Footer.jsx`** - Site footer with year and links
3. **`SkipLink.jsx`** - Accessibility skip navigation

#### **UI Components**
4. **`MasonryGallery.jsx`** - Gallery component with lightbox integration
5. **`Lightbox.jsx`** - Image overlay modal
6. **`NewsletterForm.jsx`** - Contact form with async submission
7. **`TherapyCard.jsx`** - Individual therapy service card
8. **`TherapyModal.jsx`** - Full therapy details modal

#### **Content Components**
9. **`BioSection.jsx`** - Reusable bio section with icon + content
10. **`WelcomeSection.jsx`** - Hero welcome content
11. **`HeroSection.jsx`** - Profile image, quote, and "About me" content

### 📜 Page Components (in `/pages/`)

12. **`Home.jsx`** - Main homepage assembling all sections
13. **`Comunidad.jsx`** - Community/events page
14. **`Consultorio.jsx`** - Therapy services page with dynamic therapies grid
15. **`Antroponomadas.jsx`** - Publications/project page
16. **`AntropologiaFisica.jsx`** - Placeholder page
17. **`AdminLogin.jsx`** - Magic link authentication
18. **`AdminDashboard.jsx`** - Subscriber management

---

## 🔀 Next Steps After Approval

1. **Setup React Router** - Install react-router-dom
2. **Create base App structure** - App.jsx with routes
3. **Migrate assets first** - Copy images, fonts, CSS to /src/assets and /src/css
4. **Build shared components** - Header, Footer, UI primitives
5. **Create page components** - One by one, preserving exact markup
6. **Convert JavaScript logic** - Turn DOM manipulation into React hooks
7. **Test fidelity** - Compare pixel by pixel with original
8. **Polish and optimize** - Code cleanup, performance tweaks

---

## ✅ Benefits of This Structure

- **Modular**: Components are reusable and maintainable
- **Exact fidelity**: Every HTML element, class, and behavior preserved
- **React-native patterns**: Hooks, functional components, clean effects
- **Performance**: Only load what's needed per page
- **Scalable**: Easy to extend with new sections/features
- **Type-safe ready**: Component APIs well-defined for TypeScript future

---

## ⚠️ Important Considerations

1. **Exact HTML preservation**: Copy every className, attribute, SVG inline
2. **Image paths**: Update paths from `/assets/` to `/src/assets/`
3. **CSS imports**: Import all CSS files globally or component-specific
4. **External links**: Preserve all external Instagram, Cloudflare Worker URLs
5. **Animations**: Convert IntersectionObserver to React useEffect/useRef
6. **Form submission**: Migrate fetch calls to dedicated custom hooks
7. **Mobile responsiveness**: All media queries and breakpoints preserved

---

## 🔄 Next Steps
- Handle edge cases
- Test the implementation
- Verify results

**Ready to begin testing and verification!** 🎯
