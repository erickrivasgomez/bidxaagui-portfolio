# BIDXAAGUI – First Version

A minimal static site inspired by the layout of lugaitan.com: uppercase nav, strong typographic hero, restrained palette, simple cards/grid.

## Structure
- `index.html` – sections: header/nav, hero, sesiones, recursos, sobre, contacto, footer
- `styles.css` – theming with CSS variables to quickly update palette
- `script.js` – year + mobile nav toggle
- `assets/` – placeholders for images and icons

## Run locally
Just open `index.html` in your browser. No build step required.

Optionally, start a simple local server (Python example):

```bash
python -m http.server 8080
```

Then open http://localhost:8080

## Theming
Update colors in `styles.css` under `:root`:
```css
:root{
  --bg:#faf7f2;
  --text:#1b1b1b;
  --muted:#7b7b7b;
  --accent:#2d4b3a;
  --card:#ffffff;
  --line:#e8e3dc;
}
```
Share your new palette and I’ll integrate it.

## Next steps
- Replace placeholders with your images/logo in `assets/`
- Provide color palette and preferred typefaces
- Add pages for tienda/cursos if needed
- Hook a real form endpoint (Formspree/Netlify/EmailJS) when ready
