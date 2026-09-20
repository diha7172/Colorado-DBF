# Colorado Design Build Fly website

Source for [coloradodbf.com](https://www.coloradodbf.com), the site for the University of Colorado Boulder AIAA Design/Build/Fly team.

Plain HTML, CSS and JavaScript. No build step, no framework, nothing to install. Edit a file, push, and GitHub Pages redeploys it.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, mission, stats, subteams, season overview, partners |
| `about.html` | How the team works, the subteams, aircraft by season, history |
| `team.html` | Officers, subteam leads and faculty advisor with photos |
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

**Update leadership.** Open `team.html`, `contact.html` and the team strip on `index.html`, find the person's block, and change the name, role and email. To add a photo, drop a square JPEG in `assets/img/leads/` and replace the initials `div` with `<img src="assets/img/leads/name.jpg" alt="Name">`.

**Add a sponsor.** Put the logo in `assets/img/sponsors/` (SVG or transparent PNG, white or light logos look best on the dark background). Then add a link in the `logos` grid on both `index.html` and `sponsorship.html`. Give the top-tier partner the `logos__hi` class so it gets the wide highlighted card.

**Change sponsorship levels.** The tier cards and the entitlement table are both in `sponsorship.html`. Replace the PDF in `assets/docs/` with the same filename when a new deck is ready, or update the filename in `sponsorship.html` and the footer of every page.

**Change the season dates.** Search for `2027` across the HTML files. The timeline lives in `competition.html`.

## Running it locally

Any static server works. From the repo folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Hosting: GitHub Pages at www.coloradodbf.org

The site is hosted on GitHub Pages, straight from this repository, through the workflow in `.github/workflows/deploy.yml`. Every push to the default branch deploys it. It is also reachable at https://diha7172.github.io/Colorado-DBF/, which redirects to the domain once the domain is connected.

The domain `coloradodbf.org` is registered at Spaceship (spaceship.com) on the `dbf@colorado.edu` account, auto-renewing yearly. The old `coloradodbf.com` is registered elsewhere at GoDaddy and still serves the previous Google Site.

**Connecting the domain (repo owner, in this order):**

1. In Spaceship, open the domain, then Advanced DNS, and add these records (delete any parking records that are already there):

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| CNAME | `www` | `diha7172.github.io` | 30 min |
| A | `@` | `185.199.108.153` | 30 min |
| A | `@` | `185.199.109.153` | 30 min |
| A | `@` | `185.199.110.153` | 30 min |
| A | `@` | `185.199.111.153` | 30 min |

2. Wait until `nslookup www.coloradodbf.org` answers with `diha7172.github.io` (usually under an hour).
3. Only then, in the repo go to Settings, then Pages, enter `www.coloradodbf.org` under Custom domain and save. When the DNS check is green, tick Enforce HTTPS (the certificate can take from minutes to a day). Then add a file named `CNAME` to the repo root containing `www.coloradodbf.org`. Do not add the file earlier, because the file itself attaches the domain.

**Moving to an organisation account later.** Transfer the repository to the organisation (Settings, then Danger Zone, then Transfer). GitHub keeps the Pages site and the custom domain, and the only DNS change is the `www` CNAME target, which becomes `<organisation>.github.io`.
