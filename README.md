# Colorado Design Build Fly website

Source for [coloradodbf.com](https://www.coloradodbf.com), the site for the University of Colorado Boulder AIAA Design/Build/Fly team.

Plain HTML, CSS and JavaScript. No build step, no framework, nothing to install. Edit a file, push, and GitHub Pages redeploys it.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, mission, stats, subteams, season overview, partners |
| `about.html` | How the team works, the five subteams, leadership, advisors, history |
| `competition.html` | What AIAA DBF is, 2026 figures, the season timeline, track record |
| `events.html` | Meeting types, calendar links, what a season looks like |
| `resources.html` | Software, shop trainings, Teams / Overleaf / GitHub |
| `sponsorship.html` | Partnership levels, in-kind needs, where money goes, the deck, partner logos |
| `join.html` | Four-step join flow, what to expect, FAQ |
| `contact.html` | Team inbox, leadership, advisors, socials |
| `404.html` | Not-found page |

Shared files live in `assets/`:

- `assets/css/style.css` is the whole stylesheet. Colours and fonts are variables at the top.
- `assets/js/main.js` handles the nav, mobile menu, scroll reveals, count-ups, the hero airflow animation, the cursor and the FAQ accordion.
- `assets/img/` holds every photo, sorted by section. Keep new photos under about 1600px wide and saved as JPEG so the site stays fast.
- `assets/docs/` holds the sponsorship deck PDF that the sponsorship page embeds and links.
- `assets/brand/` holds the logo as SVG: mark only, horizontal and stacked lockups, each in white (for dark backgrounds) and black (for light), plus single-colour versions for print or embroidery. Use these for shirts, the deck and social posts.

## Common edits

**Update leadership.** Open `about.html` and `contact.html`, find the person's block, and change the name, role and email. To add a photo, drop a square JPEG in `assets/img/leads/` and replace the initials `div` with `<img src="assets/img/leads/name.jpg" alt="Name">`.

**Add a sponsor.** Put the logo in `assets/img/sponsors/` (SVG or transparent PNG, white or light logos look best on the dark background). Then add a link in the `logos` grid on both `index.html` and `sponsorship.html`. Give the top-tier partner the `logos__hi` class so it gets the wide highlighted card.

**Change sponsorship levels.** The tier cards and the entitlement table are both in `sponsorship.html`. Replace the PDF in `assets/docs/` with the same filename when a new deck is ready, or update the filename in `sponsorship.html` and the footer of every page.

**Change the season dates.** Search for `2027` across the HTML files. The timeline lives in `competition.html`.

## Running it locally

Any static server works. From the repo folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploying and the custom domain

The site is hosted on GitHub Pages through the workflow in `.github/workflows/deploy.yml`. It runs on every push to `main`, and can also be run by hand from the Actions tab.

One-time setup in the GitHub repo:

1. Settings, then Pages. Under "Build and deployment" set Source to **GitHub Actions**.
2. Under "Custom domain" enter `www.coloradodbf.com` and save. The `CNAME` file in this repo keeps that setting across deploys.
3. Tick "Enforce HTTPS" once the certificate shows as ready (this can take up to a day after DNS is set).

At the domain registrar (wherever coloradodbf.com is registered), set these DNS records:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `www` | `diha7172.github.io` |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Remove any existing records that point `www` or the root at Google Sites first. Once DNS propagates, `coloradodbf.com` and `www.coloradodbf.com` both serve this site, and the old `github.io` address redirects to it.

Full instructions from GitHub: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
