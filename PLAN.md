# Tooth Nest Dental Clinic — Website Plan

This is the single source of truth for the project. Any new session should read it
first, then continue from the first unchecked item in **Progress**. Update the
checkboxes, the **Session log** and the **Open questions** as work happens, and
commit this file with the work it describes.

> **Rule from the owner:** do not build anything until the owner says "go".
> Planning, research and small housekeeping are fine; writing site pages is not.

---

## 1. Goal

A fast, trustworthy, accessible marketing website for **Tooth Nest Dental Clinic**
that turns visitors into booked appointments. The main audience is local patients
and parents looking for a dentist, people with a dental emergency, and
nervous patients who need reassurance before they call.

Success means a visitor can, within seconds and on a phone:
1. understand what the clinic offers and that it is safe and modern,
2. find the phone number, location and opening hours,
3. request an appointment or get help for an emergency.

## 2. Decisions made

| Topic | Decision | Why |
|---|---|---|
| Stack | Plain HTML + CSS + vanilla JS. No framework, no build step. | Fastest pages, free hosting anywhere, easy for anyone to edit. Fits Ponytail (smallest complete solution). |
| Hosting (testing) | Vercel, connected to the GitHub repo. Every push to a branch gets a preview URL. | Owner connected it: https://tooth-nest-clinic.vercel.app/ |
| Hosting (production) | Not decided. Vercel Hobby is non-commercial only, so production needs Vercel Pro or another static host (Netlify, Cloudflare Pages, GitHub Pages). The site works on any of them unchanged. | Licence terms of Vercel Hobby. |
| Shared header/footer | Copied into each page by hand and kept identical. | 8 pages do not justify a build step. `shortcut:` upgrade to a tiny include/build step if the site grows past ~12 pages. |
| Services | One `services.html` page with an anchored section per service. | Smallest version that does the job. Upgrade to one page per service later if SEO for "dental implants in <city>" etc. becomes a goal. |
| Booking | Front-end form posting to a form-to-email service (Web3Forms or Formspree, owner to choose) plus a WhatsApp/phone fallback. No database, no patient accounts. | No server to run or secure. |
| Patient data | Collect the minimum: name, phone, email, preferred date/time, service, new/existing patient, short optional note. Never ask for medical history, insurance numbers or ID online. No patient data in URLs, `localStorage`, analytics or console logs. Consent checkbox + link to privacy page. | `healthcare-phi-compliance` skill; it is the safe default in every country. |
| Brand colours | Taken from the logo (see section 5). | Logo supplied by owner. |
| Accessibility | WCAG 2.2 AA is a hard requirement. | Many patients are older or anxious; also a legal expectation for healthcare sites in many countries. |

## 3. Skills installed (in `.claude/skills/`)

Use them during the build; their licences are in `.claude/licenses/`.

| Skill | Source | Use it for |
|---|---|---|
| `ponytail` (+ `-review`, `-audit`, `-debt`, `-gain`, `-help`) | DietrichGebert/ponytail | Default working mode: smallest complete change; `/ponytail-review` before each push. |
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | Design search: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux` (or `--design-system`). Offline, stdlib only. |
| `frontend-design-direction` | affaan-m/ECC | Settle the visual direction before writing CSS. |
| `design-system` | affaan-m/ECC | Tokens and consistency audit. |
| `make-interfaces-feel-better` | affaan-m/ECC | Final polish pass. |
| `accessibility` | affaan-m/ECC | WCAG 2.2 AA checks. |
| `seo` | affaan-m/ECC | Meta tags, `Dentist` structured data, sitemap, robots. |
| `browser-qa` | affaan-m/ECC | Playwright checks at 3 breakpoints before calling a phase done. |
| `healthcare-phi-compliance` | affaan-m/ECC | Booking form and privacy page. |

Not installed on purpose: the rest of ECC (300+ unrelated skills, hooks), and the
other ui-ux-pro-max skills (`design` needs paid AI APIs, `ui-styling` is
Tailwind/shadcn, `design-system` clashes with ECC's). `hipaa-compliance` can be added
if the clinic is in the US.

## 4. Site map and page content

All pages share: skip-to-content link, header (logo, nav, phone number, "Book
appointment" button), footer (address, hours, phone, WhatsApp, email, quick links,
privacy link, emergency line). Sticky "Call" and "Book" bar on mobile.

### `index.html` — Home
1. **Hero:** headline (e.g. "Gentle, modern dental care for the whole family"),
   one-line promise, primary button "Book appointment", secondary "Call now".
   Trust chips: years of experience, patients served, rating.
2. **Emergency strip:** "Toothache, broken tooth or swelling? Same-day emergency
   slots." with call button.
3. **Featured services:** 6 cards (check-up & cleaning, whitening, fillings,
   root canal, implants, braces/aligners) linking to `services.html#<id>`.
4. **Why Tooth Nest:** gentle care for nervous patients, sterilisation standard,
   digital X-rays (lower radiation), transparent pricing / payment plans,
   family & kids friendly, modern equipment.
5. **Your visit, step by step:** Book → Welcome & medical history → Examination
   & X-rays → Treatment plan & cost estimate (you decide) → Treatment →
   Follow-up & recall reminder.
6. **Meet the dentists:** short teaser, link to About.
7. **Patient reviews:** 3 reviews, static (no auto-rotating carousel; if a
   carousel is ever added it needs pause, prev/next and reduced-motion support).
   Use real reviews only, with permission.
8. **Final call to action:** book / call / WhatsApp, opening hours, map link.

### `services.html` — Treatments
One section per service, each with: what it is, who it is for, what happens
during the visit, how long it takes / number of visits, recovery & aftercare,
"Book this treatment" button (pre-selects the service on the booking form via
`book.html?service=<id>` — service id only, never personal data).

| id | Service | Key points to cover |
|---|---|---|
| `checkup` | Check-up & cleaning (scaling and polishing) | Every 6 months; exam, gum check, oral cancer screening, X-rays when needed; 30–45 min. |
| `fillings` | Tooth-coloured fillings | Composite; one visit; numbness 2–3 h; avoid chewing on that side until numbness wears off. |
| `root-canal` | Root canal treatment | Saves an infected tooth; 1–3 visits; modern anaesthesia makes it comparable to a filling; crown usually advised afterwards. |
| `crowns-bridges` | Crowns & bridges | 2 visits (prep + temporary, then fit); digital impressions where available. |
| `implants` | Dental implants | Consultation + 3D scan, placement, 3–6 months healing, crown; best long-term tooth replacement. |
| `dentures` | Dentures | Full or partial; several fittings; care instructions. |
| `whitening` | Teeth whitening | In-clinic or take-home trays; temporary sensitivity; not on crowns/fillings. |
| `veneers` | Veneers & smile design | Porcelain or composite; smile preview; 2–3 visits. |
| `orthodontics` | Braces & clear aligners | Metal/ceramic braces, aligners; 6–24 months; retainers afterwards. |
| `gum` | Gum disease treatment | Bleeding gums, deep cleaning (root planing), maintenance. |
| `kids` | Children's dentistry | First visit by age 1 or first tooth; fluoride, fissure sealants; friendly approach. |
| `extractions` | Extractions & wisdom teeth | Simple and surgical; aftercare: bite on gauze, no rinsing/straws/smoking 24 h, soft food. |
| `emergency` | Emergency dental care | Severe pain, swelling, knocked-out or broken tooth, bleeding; same-day slots; what to do until you arrive. |

### `about.html` — About us
Clinic story and mission; dentist profiles (photo, name, qualifications,
registration number, languages, special interests); team; **sterilisation and
infection control** (autoclave sterilisation, single-use items, surface
disinfection between patients, sealed instrument pouches); technology (digital
X-rays, intraoral camera/scanner); clinic photos with alt text.

### `patients.html` — Patient information
- **Your first visit:** what to bring (ID, medication list, previous X-rays,
  insurance card), arrive 10 min early, what happens, how long it takes.
- **Fees, insurance & payment:** accepted insurers, payment methods, payment
  plans, written estimate before treatment.
- **Aftercare guides:** after a filling, extraction, root canal, whitening,
  new braces, new dentures.
- **Dental emergencies — what to do now:** knocked-out tooth (hold by the
  crown, rinse, put back or keep in milk, come within 30–60 min), broken tooth,
  severe pain/swelling (call; seek a hospital if swelling affects breathing or
  swallowing), bleeding after extraction.
- **Nervous patients:** what we do to help.
- **FAQs:** using `<details>` elements (no JS needed).
- **Cancellation policy.**

### `book.html` — Book an appointment
Form fields: full name, phone, email, new/existing patient, service (select,
pre-filled from `?service=`), preferred date (no past dates; closed days blocked),
preferred time window (morning/afternoon/evening), optional short note with a
warning not to include medical details, consent checkbox (links to privacy
page). Visible labels, errors next to the field, error summary at top, keyboard
friendly. On success: clear confirmation message ("We will call you within one
working day to confirm"). Emergency notice above the form: "In pain now? Call
<phone> instead." Also offer WhatsApp and phone.
Spam protection: honeypot field (+ the form service's own protection).

### `contact.html` — Contact
Address, embedded map (lazy-loaded, with a plain link fallback), opening hours
table, phone, WhatsApp, email, parking / public transport, accessibility of the
building (step-free access etc.).

### `privacy.html` — Privacy notice
What the booking form collects, why, who processes it (the form service), how
long it is kept, patient rights, contact for privacy questions. Written plainly.
Needs owner/legal review before launch.

### `404.html`
Friendly message, links to Home, Book and Contact.

### Non-page files
`robots.txt`, `sitemap.xml`, `site.webmanifest`, favicons, `.vercelignore`
(ignores `.claude/`, `PLAN.md`, `CLAUDE.md`, `tests/`).

## 5. Design direction

- **Feel:** calm, clean, warm and reassuring; generous white space; rounded
  shapes echoing the tooth and the nest; no stock "AI slop" gradients, no emoji
  icons (use inline SVG icons).
- **Logo:** `assets/images/logo.png`, 676×542 RGB PNG **with a white background
  (no transparency)**. Use it on white/light surfaces only. Ask owner for an SVG or
  transparent PNG, or trace an SVG version, before using it on coloured or dark
  backgrounds or as a favicon.
- **Colours** (sampled from the logo; contrast measured against white):

  | Token | Value | Use | Contrast on white |
  |---|---|---|---|
  | `--brand` | `#2CB27F` | Logo green: decorative fills, icons, large shapes | 2.7:1 — **not for text or button backgrounds with white text** |
  | `--brand-strong` | `#1A7A56` | Buttons, links, headings accent | 5.3:1 ✔ |
  | `--brand-deep` | `#176B4C` | Button hover / pressed | 6.5:1 ✔ |
  | `--nest` | `#84888B` | Logo grey: borders, decorative lines only | 3.6:1 (not for body text) |
  | `--ink` | `#2E3338` | Body text | 12.8:1 ✔ |
  | `--ink-soft` | `#4A4F54` | Secondary text | 8.3:1 ✔ |
  | `--leaf` | ~`#8DC63F` → `#3DAA48` | Leaf accent, small highlights only | decorative |
  | `--surface` | `#FFFFFF` / `#F3FAF6` | Page / alternate section background | — |

  Dark text `#1F2A2E` on `--brand` gives 5.45:1 if a green surface with text is needed.
- **Type:** one friendly, highly legible sans-serif for everything (decide with
  `ui-ux-pro-max` font search; candidates: "Nunito Sans", "Plus Jakarta Sans",
  "DM Sans"). Body 17–18px, line-height 1.6, max line length ~70ch. Loaded from
  Google Fonts with `display=swap`, or system fonts if the font hurts speed.
- **Style:** flat/soft cards with subtle shadow and 16px radius. Do **not** use
  neumorphism (ui-ux-pro-max's suggestion) — low contrast, high accessibility risk.
- **Motion:** minimal; respect `prefers-reduced-motion`.
- **Breakpoints:** mobile-first; test at 375px, 768px, 1280px. No horizontal scroll.

## 6. Quality bar (definition of done for every page)

- Valid, semantic HTML; one `<h1>`; landmarks; skip link; visible focus.
- WCAG 2.2 AA: contrast, 44×44px tap targets, labelled controls, alt text,
  keyboard-only use works, zoom to 200% works.
- SEO: unique `<title>` and meta description, canonical URL, Open Graph tags;
  `Dentist` (schema.org) JSON-LD with address, phone, hours on Home and Contact.
- Performance: Lighthouse ≥ 90 on mobile for performance, accessibility, best
  practices, SEO; images sized and lazy-loaded; CSS < 50 KB, JS < 20 KB.
- No console errors. No patient data in URLs, storage or logs.
- `browser-qa` pass at three breakpoints on the Vercel preview URL.
- `/ponytail-review` before each push.

## 7. Testing

- `tests/smoke.mjs` (Playwright, pre-installed in cloud sessions — do not run
  `playwright install`): open every page, assert status 200, one `<h1>`, no
  console errors, nav links resolve; fill the booking form with invalid and
  valid data and check errors/confirmation (form service request stubbed).
- Run against a local server (`python3 -m http.server`) and the Vercel preview.
- The network allowlist of the cloud environment includes `*.vercel.app`, so
  sessions can fetch the deployed site.

## 8. Progress

### Phase 0 — Setup ✅
- [x] Install Ponytail skills
- [x] Install curated ECC skills
- [x] Install ui-ux-pro-max skill
- [x] Fix GitHub access (Claude GitHub App installed on the repo) and push
- [x] Add logo to `assets/images/logo.png`
- [x] Connect Vercel (https://tooth-nest-clinic.vercel.app/) and allow `*.vercel.app` in the session network
- [x] Write this plan and `CLAUDE.md`

### Phase 1 — Foundation (waits for "go")
- [ ] `.vercelignore` (hide `.claude/`, plan files, tests from the public site)
- [ ] Finalise design tokens and font (section 5) in `assets/css/styles.css`
- [ ] Header, footer, mobile nav, mobile call/book bar
- [ ] Favicon / web manifest (needs transparent or SVG logo)

### Phase 2 — Pages
- [ ] Home
- [ ] Services
- [ ] About
- [ ] Patient info
- [ ] Book appointment (form + validation + confirmation)
- [ ] Contact
- [ ] Privacy
- [ ] 404

### Phase 3 — SEO, quality, launch prep
- [ ] JSON-LD, meta/OG tags, `sitemap.xml`, `robots.txt`
- [ ] `tests/smoke.mjs` passing locally and on the preview
- [ ] Accessibility and `browser-qa` pass at 375 / 768 / 1280
- [ ] Replace all placeholders with real clinic data (search for `TODO-CLINIC`)
- [ ] Owner review on the Vercel preview
- [ ] Decide production host and domain; set up merge to the default branch

## 9. Open questions for the owner

Until answered, use clearly marked placeholders written as `TODO-CLINIC: …`
so they are easy to find with `grep -rn TODO-CLINIC`.

1. City / country (affects language, legal wording, HIPAA vs GDPR etc., phone format).
2. Address, phone, WhatsApp number, email, opening hours, closed days.
3. Dentists: names, qualifications, registration numbers, photos.
4. Which services the clinic actually offers (trim the list in section 4).
5. Prices or "from" prices — show them or not?
6. Insurers accepted and payment plans.
7. Booking: Web3Forms or Formspree (needs an account/access key owned by the
   clinic), and which email receives requests.
8. Real patient reviews (with permission) and Google Business Profile link.
9. Logo as SVG or transparent PNG.
10. Languages: English only, or more?
11. Production host and domain name.

## 10. Session log

- **2026-10-29** — Planning session. Installed skills (Ponytail, 7 ECC skills,
  ui-ux-pro-max), fixed GitHub push access, added logo, connected Vercel, agreed
  stack (static HTML/CSS/JS). Wrote this plan. Nothing built yet — waiting for
  the owner's "go".
