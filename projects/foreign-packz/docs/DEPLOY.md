# Putting Foreign Packz online

The prototype builds to plain static files, so it runs on any static host. Pick whichever
of these fits. All three give a public URL you can send to anyone.

Before you share it with anyone: this is a design prototype. The licence number, premises
and support details are bracketed placeholders, there is no payment processing and no real
authentication. Say that when you send the link, so nobody mistakes it for a live
dispensary ordering page.

---

## Option 1 — Drag and drop (about a minute, no account needed to start)

Fastest way to a public link.

1. Build it, or use the zip you were given:
   ```bash
   cd projects/foreign-packz
   npm install
   npm run build:preview
   ```
   That produces `out/`.
2. Go to **https://app.netlify.com/drop** and drag the `out` folder onto the page.
3. You get a URL like `https://random-name-123.netlify.app` straight away.

Sign in afterwards to keep the site, rename it to something like `foreignpackz`, or point
a custom domain at it. Cloudflare Pages (`pages.cloudflare.com`) and Vercel both accept the
same folder the same way.

Do **not** set a base path for this option. These hosts serve at a domain root, which is
what a plain `npm run build:preview` targets.

---

## Option 2 — GitHub Pages (permanent, rebuilds itself on every push)

A workflow is already committed at `.github/workflows/deploy-foreign-packz.yml`.

1. In the repository on GitHub: **Settings → Pages → Build and deployment → Source**, choose
   **GitHub Actions**. This is the one step that cannot be automated.
2. Push to `main` or to the `claude/foreign-packz-ecommerce-4fy4oi` branch, or run the
   workflow by hand from the **Actions** tab.
3. The site lands at:
   ```
   https://<your-github-username>.github.io/<repo-name>/foreign-packz/
   ```

The workflow type-checks, builds with the right base path, and publishes. It serves from a
`/foreign-packz/` sub-path so it does not take over this repository's Pages root, and it
puts a redirect at the root so the bare Pages URL still reaches the site.

Pages sites in a public repository are public. If the repository is private, Pages is
available on paid plans only.

---

## Option 3 — Vercel or Netlify connected to the repo

Best if you want preview URLs on every branch.

Import the repository, then set:

| Setting | Value |
| --- | --- |
| Root directory | `projects/foreign-packz` |
| Build command | `npm run build:preview` |
| Output directory | `out` |
| Install command | `npm ci` |

Leave `BASE_PATH` unset. Both hosts serve at a domain root.

---

## Custom domain

All three hosts take a custom domain in their dashboard: add the domain, then point a CNAME
at the host. The site itself needs no change, because it is built with relative navigation
and no hard-coded hostname.

---

## Base path, the one thing that breaks deployments

`BASE_PATH` must match the URL path the site is served from, or every asset returns 404 and
you get an unstyled page.

| Where it is served | BASE_PATH |
| --- | --- |
| `https://example.com/` | leave unset |
| `https://user.github.io/repo/foreign-packz/` | `/repo/foreign-packz` |

```bash
BASE_PATH=/repo/foreign-packz npm run build:preview
```

## What the preview build does

`npm run build:preview` runs `next build` and then `scripts/prepare-static-preview.mjs`,
which renames Next's `_next` directory to `assets` and drops the legacy `noModule` polyfill
chunk. Both exist for hosts that reject underscore-prefixed paths. Plain `npm run build`
works fine on hosts that do not care.

## Before this stops being a prototype

Static hosting is right for a preview and wrong for a real store. Age gating, inventory
checks, order persistence, payment and every permission check have to run on a server. See
the Before Launch checklist in the project README for what that involves and who has to
sign it off.
