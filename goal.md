# GOAL: Bidxaagui — Proyecto monorepo (Resumen y reglas)

## Propósito general
Este repositorio aloja el sitio público estático, un lector de revista (`/lector`), y el panel de administración (React + Vite) en `/admin`, junto con los Workers/Endpoints que exponen la API y gestionan envíos de email (Resend), almacenamiento (R2) y base de datos (D1).  
Objetivo final: una plataforma desplegada en Cloudflare bajo `bidxaagui.com` que permita gestionar ediciones mensuales, enviar campañas de email y servir un lector responsivo.

---

## Alcance exacto (lo que se debe entregar)
1. Sitio público estático en `/` (ya implementado).  
2. Lector de revista en `/lector` (SPA estático que consume la API).  
3. Panel Admin en `/admin` (React + Vite + React Router), con:
   - login por magic link (Resend + Worker)
   - CRUD de suscriptores (newsletter)
   - CRUD de ediciones (magazine_editions)
   - CRUD de convocatorias
   - Envío de campañas por email (batches y control de estado)
4. Backend en Workers con rutas bajo `/api/*`.  
5. Almacenamiento de assets de revista en R2.  
6. Base de datos D1 con migraciones en `/migrations`.  
7. CI/CD con GitHub Actions que build & deploy a Cloudflare Pages + Workers.  

---

## Reglas obligatorias (constraints)
- **Todo el contenido UI** por defecto debe estar en **español**.
- **Dominio único**: todas las rutas deben resolverse bajo `bidxaagui.com`.
- **No se rompen las rutas legacy**: `/pages/*.html` deben redirect 301 a `/*` limpio, y `/pages/*not-exist*` → redirect a `/`.
- **/admin/** debe servir el `index.html` del build del admin (SPA fallback).
- **Autenticación**: magic links deben usar el mismo dominio y establecer cookies HttpOnly `Domain=bidxaagui.com`.
- **Email**: usar MJML para plantillas; cada email debe contener versión texto plana y link de unsubscribe.
- **Procesamiento de ZIPs**: si se suben spreads (2 páginas por imagen), el backend debe cortar por la mitad y subir imágenes por página a R2.
- **Infra**: usar Cloudflare Pages (public + admin), Workers (API), D1 (DB), R2 (assets).
- **Tests**: todo endpoint nuevo debe tener pruebas unitarias mínimas (simuladas) y tests e2e para flows críticos (login magic link + envío de campaña).
- **Revisiones**: Pull Requests obligatorios; cada PR necesita una descripción clara, checklist y al menos 1 aprobación de reviewer.

---

## Estándares de código y best practices (resumen)
- **JS/TS**: TypeScript en backend y frontend cuando aplique. Usar `strict` y linting con ESLint (config shareable).
- **React**: componentes funcionales, hooks, separación de concerns, tests con react-testing-library / vitest.
- **API**: contratos JSON explicados en OpenAPI / postman collection. Validación de payloads (Zod o similar).
- **CI/CD**: build determinista, deploy preview para PRs, secrets en GitHub Actions.
- **Commits**: convención `feat|fix|chore(scope): mensaje breve` (Conventional Commits).
- **Mensajes en PR**: incluir pasos para reproducir, screenshots y impactos.
- **Seguridad**: no guardar secretos en código; variables en `wrangler.toml` o GitHub Secrets.

---

## Checklist obligatorio antes de merge
- [ ] Linter pasa (no warnings críticos)
- [ ] Tests unitarios pasan
- [ ] Tests e2e básicos (login + enviar campaña) pasan en staging
- [ ] Documentación de endpoints actualizada
- [ ] Migraciones creadas si aplica
- [ ] Plan de rollback documentado

---

## Proceso de uso por LLMs (cómo deben comportarse las AI tools)
1. Antes de ejecutar un cambio, **leer todo GOAL.md**.  
2. Generar un **plan de cambios** (diffs/files) y presentarlo para aprobación.  
3. Solo después de aprobación, aplicar los cambios en archivos.  
4. Al aplicar cambios, crear PR con descripción y checklist.  
5. No desplegar a producción sin PR aprobado y pipelines verdes.

---

## Definición de éxito
- El sitio público y el lector funcionan en `https://bidxaagui.com`.
- El admin en `https://bidxaagui.com/admin` permite login por magic link y las funcionalidades listadas.
- Campañas de email envían correctamente a grupos de suscriptores con seguimiento de estado.
- Las imágenes de revista se procesan automáticamente desde ZIPs y se sirven por página.
