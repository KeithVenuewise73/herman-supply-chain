# Herman Supply Chain Solutions — Website v1.0

**Professional multi-page website for Herman Supply Chain Solutions**  
Logistics, Transportation, Warehousing, 3PL & Supply Chain Consulting

---

## 📁 Folder Structure

```
herman-supply-chain/
│
├── index.html          ← Homepage
├── about.html          ← About page
├── services.html       ← Services page
├── assessment.html     ← Operational Assessment form
├── results.html        ← Assessment results page
├── contact.html        ← Contact / consultation request
│
├── css/
│   └── styles.css      ← All styles (design system, components, responsive)
│
├── js/
│   └── script.js       ← Navigation, assessment calculator, results renderer
│
└── README.md           ← This file
```

---

## 🚀 Quick Start

### Option A — Open Locally (Simplest)
1. Download or unzip the project folder
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
3. All pages work without a server — pure HTML/CSS/JS

### Option B — Local Dev Server (Recommended)
If you have Node.js installed:
```bash
cd herman-supply-chain
npx serve .
# Opens at http://localhost:3000
```

Or with Python:
```bash
cd herman-supply-chain
python3 -m http.server 8080
# Opens at http://localhost:8080
```

---

## 🌐 GitHub Pages Deployment

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Name it: `herman-supply-chain` (or your preferred name)
4. Set to **Public** (required for free GitHub Pages)
5. Click **Create repository**

### Step 2: Upload Files
**Option A — GitHub Web Interface (Easiest):**
1. On your new repo page, click **Add file → Upload files**
2. Drag the entire `herman-supply-chain` folder contents
3. Write commit message: `Initial release v1.0`
4. Click **Commit changes**

**Option B — Git Command Line:**
```bash
cd herman-supply-chain
git init
git add .
git commit -m "Initial release v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/herman-supply-chain.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Source**, select **Deploy from a branch**
5. Under **Branch**, select `main` / `(root)`
6. Click **Save**
7. Wait 1–2 minutes, then visit:
   `https://YOUR_USERNAME.github.io/herman-supply-chain/`

### Step 4: Custom Domain (Optional)
1. Purchase a domain (e.g., HermanSupplyChainSolutions.com)
2. In GitHub Pages settings, enter your custom domain
3. At your domain registrar, add a CNAME record:
   - Name: `www`
   - Value: `YOUR_USERNAME.github.io`
4. Enable **Enforce HTTPS** in GitHub Pages settings

---

## ⚙️ Assessment Tool — How It Works

The Operational Assessment Tool is fully client-side — no backend required.

### Data Flow
1. User fills out the form on `assessment.html`
2. On submit, `calculateAssessment()` in `script.js` computes all metrics
3. Results are saved to `localStorage` as JSON
4. User is redirected to `results.html`
5. `initResults()` reads from `localStorage` and renders the report

### Metrics Calculated
| Metric | Formula |
|--------|---------|
| Cost Per Route | (Transport + Labor Cost) / Routes |
| Cost Per Stop | (Transport + Labor Cost) / Stops |
| Revenue Per Stop | Weekly Revenue / Stops |
| Transport Cost % | Transport Cost / Revenue × 100 |
| Labor Cost % | Labor Cost / Revenue × 100 |
| Efficiency Score | 0–100 based on benchmarks |
| Annual Savings | Projected savings vs. best-in-class targets |

### Grading Scale
| Score | Grade |
|-------|-------|
| 90–100 | A |
| 80–89 | B |
| 70–79 | C |
| 60–69 | D |
| 0–59 | F |

### Risk Level
| Condition | Risk |
|-----------|------|
| Score ≥80 and total cost % <40% | Low |
| Score ≥65 or total cost % <50% | Medium |
| Below above thresholds | High |

---

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--navy` | `#0B1D3A` | Primary dark |
| `--teal` | `#006D77` | Primary accent |
| `--teal-light` | `#00A9B7` | Highlights |
| `--green` | `#1A7A4A` | Positive indicators |
| `--gold` | `#C9A84C` | Warning indicators |
| `--gray-100` | `#F5F6F8` | Section backgrounds |

### Typography
- **Display / Headlines:** Playfair Display (serif)
- **Body / UI:** IBM Plex Sans
- **Labels / Mono:** IBM Plex Mono

### Fonts loaded from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| `> 1024px` | Full desktop layout |
| `768–1024px` | Tablet: stacked columns |
| `< 768px` | Mobile: hamburger nav, single column |
| `< 480px` | Small mobile: full-width buttons |

---

## 🖨 Print / PDF Export

The results page includes full print styles:
- Navigation and footer hidden
- Report-optimized layout
- Page break management for clean printing

**To export as PDF:**
1. Open results page in browser
2. Click **Download PDF** or **Print Report**
3. In print dialog, select **Save as PDF**
4. Choose landscape or portrait (portrait recommended)

---

## ✏️ Customization Guide

### Update Company Info
Edit the following in all HTML files:
- Email: `info@hermansupplychain.com`
- Phone: `1-800-555-1234`
- Founded year in nav: `Est. 1994`

### Update Stats / Metrics on Homepage
Edit the hero card and metrics strip in `index.html`:
```html
<div class="metric-value">200+</div>
<div class="metric-label">Operational Engagements</div>
```

### Modify Assessment Benchmarks
Edit thresholds in `js/script.js` in the `calculateAssessment()` function:
```js
// On-time: target >95%
if (onTimePct < 95) score -= Math.min(25, (95 - onTimePct) * 1.5);
```

### Add/Remove Services
Edit the `.service-row` blocks in `services.html`.

### Change Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
  --teal: #006D77;
  --navy: #0B1D3A;
  /* etc. */
}
```

---

## 🔧 Technical Notes

- **No dependencies** — pure HTML/CSS/JS, no frameworks or build tools required
- **No backend** — all calculation is client-side
- **localStorage** — assessment data persists in the browser session
- **Print-ready** — results page has full `@media print` stylesheet
- **Accessible** — semantic HTML, ARIA labels on interactive elements
- **SEO-ready** — meta descriptions on all pages
- **Mobile-first** — responsive at all breakpoints

---

## 📋 Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Full support |
| Firefox 88+ | ✅ Full support |
| Safari 14+ | ✅ Full support |
| Edge 90+ | ✅ Full support |
| IE 11 | ❌ Not supported (CSS Variables) |

---

## 📄 License

Built for Herman Supply Chain Solutions.  
Version 1.0 — May 2025  
All rights reserved.
