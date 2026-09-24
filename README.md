# tamjid0x01 — Portfolio

> **Tamjidur Rohman** (a.k.a. **tamjid0x01**) · Blockchain Security Researcher (DLT) & Smart Contract Auditor.
> *Love hacking for a more secure Web3.*

A single-page, zero-dependency, fully static portfolio — built to be hosted **directly on GitHub Pages** at **https://tamjid0x01.github.io**.

<p align="center">
  <img src="assets/favicon.svg" width="80" />
</p>

---

## ✨ Features

- 🖥️ **Terminal / cyber aesthetic** — hero typing effect, `zsh`-style intro card, `nmap` about card, boot preloader
- 🌐 **Animated blockchain chain background** — hex grid + drifting chain-linked blocks with hashes (respects `prefers-reduced-motion`)
- 📊 **Live-style stats counters** — repos, stars, followers, protocols secured
- 🛡️ **Highlights section** — Bedrock uniBTC critical bug, Q1 2025 multi-protocol disclosures
- 🛠 **Skills bars + toolbelt chips** (Solidity, Foundry, Slither, Echidna, Go, Python …)
- 🕐 **Experience timeline** — Code4rena · Sherlock · Immunefi · Web3 research
- 📁 **Featured open-source projects** — `SmartContracts-audit-checklist` (790★+), `awesome-smartcontract-hacking` (100★+), `Web3Bugs`, `DeFiHackLabs`, `nfte-token`
- 📱 **Fully responsive** with mobile hamburger menu
- ⚡ **Zero build step** — pure HTML/CSS/JS, works on any static host

## 📁 Project Structure

```
.
├── index.html          # Single-page portfolio
├── css/style.css       # All styling (theme: cyber-terminal)
├── js/main.js          # Particles, typing, reveal, counters, nav
├── assets/favicon.svg  # Site favicon
├── .github/workflows/deploy.yml  # GitHub Pages CI/CD (optional)
└── LICENSE             # MIT
```

## 🚀 Deploy to GitHub Pages

### Option A — user site at `tamjid0x01.github.io` (recommended)

1. Create a **new public repository** named exactly: **`tamjid0x01.github.io`**
2. Push the contents of this folder to that repo's `main` branch:

   ```bash
   git init
   git add .
   git commit -m "feat: deploy portfolio 🚀"
   git branch -M main
   git remote add origin https://github.com/tamjid0x01/tamjid0x01.github.io.git
   git push -u origin main
   ```

3. Your site is live at **https://tamjid0x01.github.io** 🎉

> ℹ️ For user sites, GitHub Pages automatically serves `index.html` from the root of `main`. No settings to change.

### Option B — project site with GitHub Actions (this repo)

1. Keep your files on the `main` branch of this repo (`tamjid0x01/tamjid0x01-Pro`).
2. Go to **Settings → Pages** and set **Source → GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) deploys automatically on every push to `main`.
4. Your site will live at: **https://tamjid0x01.github.io/tamjid0x01-Pro/**

### Option C — project site from `/docs`

1. Move `index.html`, `css/`, `js/` and `assets/` into a `docs/` folder.
2. In **Settings → Pages** choose **Source → Deploy from a branch**, branch `main`, folder `/docs`.

## 🧪 Run Locally

```bash
# any static server works — e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

## 🎨 Customization

- **Colors / fonts**: edit the CSS variables at the top of `css/style.css`.
- **Roles / terminal commands**: edit the arrays in `js/main.js`.
- **Projects / findings / socials**: edit the cards in `index.html`.

## 📬 Contact

- GitHub · X · LinkedIn · Telegram · Linktree → all under **`tamjid0x01`**
- Hub: https://linktr.ee/tamjid0x01

---

**© 2026 Tamjidur Rohman (tamjid0x01)** — *Love hacking for a more secure Web3* 🔐