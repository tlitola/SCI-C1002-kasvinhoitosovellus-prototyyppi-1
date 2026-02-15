# AI Agent Instructions: Mobile-first Prototype  
**Stack:** Vite + HTML screens + page.js routing + TypeScript interactions + GitLab Pages

**Important:** All texts must be in Finnish

---

## Goal
Build and maintain a **mobile-first, lightweight, PowerPoint-like** static prototype:

- ~15 screens
- Static data only (JSON), no backend, no API calls
- Limited interactions: navigation + simple UI toggles
- Unpolished UI is fine
- Must be easy for AI tools to edit
- Deploy via **GitLab Pages**
- Support custom images

---

## Core Principles
1. **Static-first**: everything must build into `/dist` and run without a server.
2. **Keep it simple**: one screen = one HTML file.
3. **Routing is page.js only**.
4. **Minimal TypeScript**: only event binding + tiny behavior.
5. **Hash routing**: required for GitLab Pages.
6. **AI-editable**: avoid unnecessary abstractions.

---

## Required Repository Structure

```
/
  index.html
  vite.config.ts
  package.json
  tsconfig.json
  public/
    images/
  src/
    app.ts
    router.ts
    routes.ts
    screenLoader.ts
    interactions.ts
    styles/
      app.css
    screens/
      home.html
      profile.html
    data/
      app.json
```

---

## Dependencies

Install:

- page

Do not add any other framework or router.

---

## HTML Conventions

### index.html

Must contain:

```html
<div id="app"></div>
```

---

### Screens (`src/screens/*.html`)

Rules:

- Each screen is an HTML fragment
- Exactly one top-level container

Example:

```html
<main class="screen">
  <h1>Home</h1>
</main>
```

No inline scripts.

---

## Assets

### Images

- Store in `public/images/`
- Reference as `/images/...`

Example:

```html
<img src="/images/logo.png" alt="Logo">
```

---

## Styling

- Single stylesheet: `src/styles/app.css`
- Mobile-first
- Plain CSS only

---

## Routing with page.js

Use hashbang routing.

Router initialization must use:

```ts
page({ hashbang: true });
```

URL format:

```
#/home
#/profile
```

---

### Routes (`src/routes.ts`)

Maintain one route map:

```ts
export const routes = {
  home: { title: "Home", screen: "home.html" },
  profile: { title: "Profile", screen: "profile.html" },
} as const;
```

To add screens:

1. Add HTML file
2. Add route entry

---

## Screen Loading

Responsibilities:

- Load HTML fragment
- Inject into `#app`
- Bind interactions

Keep logic minimal.

---

## Interactions

Use data attributes.

### Navigation

```html
<button data-nav="profile">Go</button>
```

Behavior:

- Call `page.show('/profile')`

---

### Toggle

```html
<button data-toggle="details">Toggle</button>
<div id="details" hidden></div>
```

Behavior:

- Toggle `hidden`

---

### Fake Forms

- Never submit
- Only UI transitions or navigation

---

## Static Data

- Store JSON in `src/data/`
- No external calls
- Keep data small

---

## GitLab Pages Deployment

- Build output: `dist/`
- CI pipeline must build and publish `dist/`

No rewrites needed.

---

## Agent Workflow Rules

When modifying:

1. Prefer editing screens
2. Update routes only in routes.ts
3. Keep TS minimal
4. Avoid refactors

---

## Definition of Done

- Dev server runs
- Build works
- Navigation works
- Images load
- No backend dependencies

---

## Strict Prohibitions

Do NOT introduce:

- Frameworks
- Backend logic
- Complex state systems
- UI libraries

---

## Intent

This is a **static prototype**, not a production application.

Optimize for simplicity, clarity, and AI editability.
