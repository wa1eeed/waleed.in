# waleed.in

Personal CV website for **Waleed Al Harbi**. Static, bilingual (EN/AR), no build step.
Every image (profile photo + company logos) is embedded as Base64 — no external assets.
A built-in **Export PDF** button produces an ATS-friendly, text-selectable resume via the browser print dialog.

## Structure
```
index.html      # auto-detects browser language → /en or /ar
en/index.html   # English
ar/index.html   # Arabic (RTL)
404.html        # redirects to home
CNAME           # custom domain (waleed.in)
.nojekyll       # disable Jekyll on GitHub Pages
```

## Deploy (GitHub Pages)
```bash
git clone https://github.com/wa1eeed/waleed.in.git
cd waleed.in
# unzip the site files here, then:
git add .
git commit -m "Publish CV site"
git push origin main
```
Repo → **Settings → Pages → Source: Deploy from a branch → main / root**.
GitHub reads `CNAME` and serves https://waleed.in.

## DNS (at the waleed.in registrar)
| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | wa1eeed.github.io |

Then enable **Enforce HTTPS** in Pages settings.

## Server later
Upload the whole folder to any web root; keep the structure so `/en` and `/ar` resolve.
