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

## Hosting and the custom domain

The site is live on Vercel at **https://colorado-dbf-program-council.vercel.app**, deployed straight from this repository (Vercel project `colorado-dbf` on the Program Council team). The domains `www.coloradodbf.com` and `coloradodbf.com` are already attached to that project, so the only remaining step is DNS.

At the domain registrar (wherever coloradodbf.com is registered), replace the Google Sites records with:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `www` | `cname.vercel-dns.com` |
| A | `@` | `76.76.21.21` |

Once that propagates (minutes to a few hours), `www.coloradodbf.com` serves this site, `coloradodbf.com` redirects to it, and Vercel issues the HTTPS certificate on its own. The Vercel dashboard for the project shows a green check next to each domain when it is working.

**Redeploying after changes.** Vercel is not yet linked to GitHub for automatic deploys. Two ways to fix that, pick one:

- Install the Vercel GitHub app on this repository (https://github.com/apps/vercel) and connect it to the `colorado-dbf` project. Every push to the default branch then deploys automatically.
- Or run `npx vercel --prod` from the repo folder after logging in with `npx vercel login`.

**GitHub Pages alternative.** The workflow in `.github/workflows/deploy.yml` can host the same site on GitHub Pages instead. Enable it once under Settings, then Pages, with Source set to **GitHub Actions**, run the workflow from the Actions tab, and set the custom domain there (the `CNAME` file in the repo holds `www.coloradodbf.com`). GitHub's DNS records differ from Vercel's: `www` as a CNAME to `diha7172.github.io`, and the four A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. Full guide: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
