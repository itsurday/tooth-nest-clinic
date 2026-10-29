# Tooth Nest Dental Clinic — Website Plan

This is the single source of truth for the project. Any new session should read it
first, then continue from the first unchecked item in **Progress** (section 10).
Update the checkboxes, the **Session log** and the **Open questions** as work
happens, and commit this file with the work it describes.

> **Rule from the owner:** build only after the owner says "go". The owner said
> "go" for **Phase 1** on 2026-10-29. Ask again before starting each later phase.

---

## 1. Goal

A fast, trustworthy, accessible website for **Tooth Nest Dental Clinic**
(Alwal, Secunderabad — Hyderabad, India) that turns visitors into booked appointments and makes the
clinic easy to find on Google. Audience: local patients and parents looking for
a dentist, people with a dental emergency, and nervous patients who need
reassurance before they call.

Success means a visitor can, within seconds and on a phone:
1. understand what the clinic offers and that it is safe and modern,
2. find the phone/WhatsApp number, location and opening hours,
3. book a slot, send an enquiry or get help for an emergency —
   and the clinic is alerted on WhatsApp at once.

## 2. Clinic facts (known so far)

| Item | Value |
|---|---|
| Name | Tooth Nest Dental Clinic |
| Address | Manjira Nagar Colony, Alwal, Secunderabad, Telangana 500010, India (Plus code GF7V+78) |
| Phone | +91 97047 37577 (`tel:+919704737577`) — on Google and the signboard · second number on the signboard: +91 70130 01802 (`tel:+917013001802`) |
| WhatsApp | `TODO-CLINIC` — confirm whether it is the same number |
| Email | `TODO-CLINIC` |
| Opening hours | Mon–Sat 10:00–14:00 and 17:00–20:30 · Sun 10:00–13:00 (time zone Asia/Kolkata) per Google. **The signboard says evenings 5–9 PM** — owner to confirm which is right and make Google, the signboard and the site match (NAP consistency matters for local SEO). |
| Google category | Dental clinic |
| Google rating | 4.9 ★ from 19 reviews (2026-10-29) |
| Google Maps listing | https://www.google.com/maps/place/Tooth+Nest+Dental+Clinic/@17.5132213,78.4926402,19z/data=!3m1!4b1!4m6!3m5!1s0x3bcb9b0006f1db2f:0x5137c09347de1a3c!8m2!3d17.5132213!4d78.4932839!16s%2Fg%2F11lf2hkjpm |
| Short map link | https://maps.google.com/maps?cid=5852357979589712444 |
| Coordinates | 17.5132213, 78.4932839 |
| Place ID | `ChIJL9vxBgCbyzsRPBreR5PAN1E` → review link https://search.google.com/local/writereview?placeid=ChIJL9vxBgCbyzsRPBreR5PAN1E |
| Website on the listing | None yet — add the site URL once live |
| Dentists | **Dr. K. Ramya, Cosmetic Dental Surgeon** (name confirmed by owner; title from the signboard). Qualifications, State Dental Council registration number, photo, languages `TODO-CLINIC`; other team members `TODO-CLINIC` |
| Practice software | None. Google Calendar is the diary for now; free/own software later. |
| Services on the clinic's window poster | Dental implants, Treatment (fillings/root canal), Oral hygiene, Dentures, Cosmetic dentistry, Periodontology (gums), Dental surgery, Orthodontics |
| House rules seen on photos | "Please leave your footwear outside", "Please wear face mask", "No shake hands, only namaskar" |
| Photos | `assets/images/clinic/` — see section 7 |
| Alerts channel | WhatsApp |
| Payments | Simple payment info for now (see section 5.9) |

Details above were read from the public Google Maps listing on 2026-10-29; the
owner should confirm them.

**Reviews:** 5 of the 19 Google reviews (all 4–5 ★) are saved in
`assets/data/reviews.json` at the owner's request (the other 14 need a logged-in
browser). On the site: show first name + last initial only, keep the text
unedited (no "improving" spelling), show "Google review" with a link to the
listing, and refresh from Google before launch. Check the DCI advertising rules
on testimonials (section 5.8) before publishing.

## 3. Features (owner's list + agreed additions)

**Owner's list**
1. Lead capture and instant alerts (WhatsApp)
2. Smart patient intake form
3. Online booking calendar (Google Calendar first)
4. Logo and mini brand kit
5. Local SEO and Google Search Console
6. Google Business Profile

**Added after review (must have)**
7. Click-to-call and WhatsApp chat buttons on every page
8. Booking confirmations, appointment reminders and 6-month recall (WhatsApp)
9. Review collection (Google review link after visits) and reviews on the site
10. Privacy, consent and compliance for India (DPDP Act; DCI ethics rules)
11. Lead log and simple staff workflow (who replies, status of each lead)
12. Privacy-friendly analytics and conversion tracking (calls, WhatsApp, bookings)
13. Easy editing of hours, prices, holidays and team (one data file)
14. Emergency path (same-day slots, first-aid steps)
15. Spam protection on all forms

**Later (nice to have)**
- One page per treatment and per nearby locality (stronger local SEO)
- Before/after gallery (only with written patient consent, and only if DCI rules allow)
- Telugu and Hindi versions
- Patient education blog
- Online deposits/payments (UPI via Razorpay or similar)
- Own clinic software (patients, diary, treatment records) replacing Google Calendar

## 4. Architecture

```
Visitor ──► Static site (HTML/CSS/JS on Vercel)
              │
              ├─ wa.me / tel: links ──────────► Clinic WhatsApp / phone (no server)
              │
              └─ forms (enquiry, booking, intake)
                    │  HTTPS POST (never GET; no personal data in URLs)
                    ▼
              Vercel serverless functions  /api/*
                    ├─ Google Calendar API  ── free/busy check, create event (the diary)
                    ├─ Google Sheets API    ── lead log + intake responses (private sheet)
                    └─ WhatsApp Cloud API   ── instant alert to clinic staff,
                                               confirmation/reminder to patient (templates)
              Scheduled job (Vercel Cron or Google Apps Script, daily)
                    └─ reminders for tomorrow's appointments + 6-month recall
```

| Topic | Decision | Why |
|---|---|---|
| Front end | Plain HTML + CSS + vanilla JS. No framework, no build step. | Fastest pages, easy to edit, fits Ponytail. |
| Back end | A few Vercel serverless functions (Node, `fetch`, Node's `crypto` for the Google service-account token). Avoid SDK dependencies unless they save real code. | Smallest backend that can reach Calendar, Sheets and WhatsApp securely. |
| Diary | One Google Calendar owned by the clinic's Google account, shared with a service account. Events hold first name + service + booking ID only; phone and details stay in the Sheet. | Free; staff already understand calendars; easy to replace later. |
| Booking UI | Own booking page: pick service → see free slots (from Calendar free/busy and the clinic hours in `site-data`) → enter details → confirm. | Keeps the clinic's branding, lets the booking trigger WhatsApp alerts, avoids a third-party page. **Fallback if time is short:** embed a Google Calendar *appointment schedule* booking page (zero code, but no WhatsApp alert without an extra Apps Script). |
| Lead log | Private Google Sheet: one tab for enquiries/bookings (with status column: new / contacted / booked / no-answer), one tab for intake forms. Only clinic staff accounts have access. | Free, staff-friendly "inbox" until real software exists. |
| WhatsApp alerts | **WhatsApp Business Platform (Cloud API)** with pre-approved templates. Alert to clinic staff number(s) on every new lead/booking; confirmation and reminders to patients who opted in. | Official, reliable, allowed for health businesses. Costs a small fee per business-initiated message (check current Meta pricing for India). Unofficial gateways are not used because they would pass patient data to an unknown third party. |
| Click-to-chat | `https://wa.me/<number>?text=<prefilled message without personal data>` | Free, instant, needs no setup. Live from day one, before the Cloud API is approved. |
| Site data | `assets/data/site.json` (or a JS object) with hours, holidays, phone, services, prices, team. Pages and the booking slot logic read it. | One place for staff to edit; no CMS needed yet. `shortcut:` upgrade to a headless CMS if non-technical staff edit often. |
| Secrets | Vercel environment variables only (service-account key, WhatsApp token, sheet/calendar IDs). Never in the repo. | Security. |
| Hosting (testing) | Vercel, connected to GitHub; previews on every push. https://tooth-nest-clinic.vercel.app/ | Owner connected it. |
| Hosting (production) | **Decide before launch.** Vercel Hobby is for non-commercial use only. Options: Vercel Pro, or Cloudflare Pages + Workers (free tier allows commercial use; functions would need a small port). | Licence terms. |
| Analytics | Cookie-free analytics (Vercel Web Analytics or a free cookieless tool such as GoatCounter). Track clicks on call/WhatsApp, form submits, bookings. No personal data in events. | No cookie banner needed; DPDP-friendly. |
| Spam | Honeypot field + Cloudflare Turnstile (free) on forms + basic rate limit per IP in the function. | Protects the lead log and WhatsApp costs. |

## 5. Feature specs

### 5.1 Lead capture and instant alerts
- Entry points: sticky mobile bar (Call · WhatsApp · Book), header button,
  "Request a call back" mini-form (name, phone, reason), booking form,
  emergency strip.
- Every submission → row in the Sheet (timestamp, source page, name, phone,
  service, status = new) → WhatsApp template alert to clinic staff:
  "New booking/enquiry: <first name>, <service>, <date/time>. Open sheet: <link>".
  Keep alert text minimal; the full details stay in the Sheet.
- Patient sees a clear confirmation and what happens next ("We will call you
  within 1 working hour during opening times").
- Failure path: if the function or WhatsApp fails, the form still shows the
  phone/WhatsApp fallback and the lead is not lost (Sheet write first, alert
  second; log failures without personal data).

### 5.2 Smart patient intake form (`intake.html`)
- Sent **after** a booking, as a link with a random booking token
  (`intake.html#t=<token>` — token only, never name/phone in the URL).
  Also usable on a tablet at the reception desk.
- Multi-step, conditional questions (show only what applies):
  1. Contact & emergency contact, date of birth.
  2. Reason for visit / chief complaint; pain level 0–10; where it hurts;
     how long.
  3. Medical history checklist: diabetes, high blood pressure, heart
     condition, blood thinners, bleeding disorders, asthma, epilepsy,
     thyroid, hepatitis/HIV (optional), pregnancy/breastfeeding (if
     applicable), recent surgery, others.
  4. Medicines currently taken; allergies (penicillin, local anaesthetic,
     latex, others).
  5. Dental history: last visit, previous treatments, sensitivity,
     grinding, bleeding gums, anxiety level and what helps.
  6. Habits: smoking, tobacco/gutka/paan chewing, alcohol (tobacco chewing
     matters for oral-cancer screening in India).
  7. Consent: accuracy declaration, consent to treatment discussion, data
     consent (DPDP notice), optional WhatsApp reminders opt-in.
- Saves progress only in memory (no `localStorage` for health data); clear
  "Review and submit" step.
- Stored in a separate restricted Sheet tab; staff alert says "Intake received
  for booking <id>" only.
- Paper version (printable page) for walk-ins.

### 5.3 Online booking calendar (`book.html`)
- Steps: service → date (next 30 days, closed days and holidays from
  `site.json` disabled) → free time slots (from Calendar free/busy, slot length
  per service, buffer between patients) → name, phone (Indian mobile
  validation, +91), email (optional), new/existing patient, short note
  (warn: no medical details here) → consent → confirm.
- Server re-checks the slot is still free before creating the event (avoid
  double booking on simultaneous requests).
- On success: Calendar event, Sheet row, WhatsApp alert to staff, WhatsApp
  confirmation to patient (if opted in) with the intake form link and the
  clinic map link. Show "Add to my calendar" (.ics download).
- Cancel / reschedule: by replying on WhatsApp or calling (phase 1); self-service
  link later.
- Emergency notice above the form: "In pain now? Call/WhatsApp <number>."

### 5.4 Logo and mini brand kit
- Deliverables in `assets/brand/`:
  - `logo.svg` (traced from the PNG, cleaned), `logo-transparent.png`,
    `logo-mark.svg` (tooth only, for small sizes), white/one-colour version for
    dark backgrounds.
  - Favicons (`favicon.svg`, `favicon.ico`, 180px Apple touch icon, 192/512px
    manifest icons).
  - Social images: Open Graph image 1200×630, WhatsApp/Google profile picture
    (square), Google Business Profile cover image.
- `brand.html` (not indexed, `noindex`): logo usage (clear space, minimum size,
  do/don't), colour tokens with contrast notes, typography, button/card
  examples, tone of voice (warm, plain, reassuring; no fear-based claims).
- Ask the owner first whether the original logo file (AI/SVG/PDF) exists; trace
  only if it does not.

### 5.5 Local SEO and Google Search Console
- On-page: unique titles and descriptions with locality ("Dentist in
  Alwal, Secunderabad"), one `<h1>`, NAP (name, address, phone) identical on
  every page and on Google Business Profile.
- Structured data: `Dentist` JSON-LD (name, address, `geo` 17.5132213 /
  78.4932839, phone, opening hours, `hasMap`, `sameAs` social links,
  `medicalSpecialty`), `FAQPage` on the patient info page, `BreadcrumbList`
  where useful.
- `sitemap.xml`, `robots.txt`, canonical URLs, fast mobile pages (Core Web
  Vitals).
- Search Console: verify the production domain (DNS) — or, while testing,
  the `vercel.app` URL-prefix property via HTML meta tag; submit sitemap; check
  indexing and mobile usability. Bing Webmaster Tools too (import from Search
  Console).
- Local citations (owner task, same NAP everywhere): Practo, Justdial,
  Sulekha, Lybrate, Apple Business Connect, Bing Places, Facebook, Instagram.
- Later: locality pages for nearby areas and one page per main treatment.

### 5.6 Google Business Profile (mostly owner tasks; checklist in section 9)
- Claim/verify the existing listing; primary category "Dentist", secondary
  e.g. "Cosmetic dentist", "Pediatric dentist", "Orthodontist" (only if true).
- Hours, holiday hours, phone, WhatsApp, website URL, **appointment link →
  `book.html`**, services list with descriptions, attributes (wheelchair
  access, etc.), 10+ real photos (outside, reception, treatment rooms, team).
- Weekly posts (tips, offers allowed by DCI rules), reply to every review.
- Review link (`https://search.google.com/local/writereview?placeid=<PLACE_ID>`)
  used on the site and in the WhatsApp message sent after a visit.

### 5.7 Reminders and recall
- WhatsApp templates (Meta approval needed): booking confirmation,
  reminder 24 h before, "how was your visit? leave a review", 6-month
  check-up recall.
- Daily scheduled job reads tomorrow's Calendar events and the Sheet, sends
  reminders only to patients who opted in, marks them sent.

### 5.8 Privacy and compliance (India)
- **Digital Personal Data Protection Act 2023 (DPDP) and its Rules:** clear
  consent notice before collecting data (what, why, how long, who processes
  it), consent checkbox not pre-ticked, way to withdraw consent and ask for
  deletion, named contact for grievances, collect only what is needed,
  reasonable security, keep data only as long as needed. Health data is
  treated as sensitive. **Owner/legal review needed before launch.**
- **Dental Council of India (DCI) code of ethics on advertising:** keep the
  site factual (qualifications, registration numbers, services, hours,
  fees); avoid claims of superiority, guaranteed results, discounts framed as
  inducements, and check the current rules before publishing patient
  testimonials or before/after photos. **Verify against the current DCI
  regulations before launch.**
- Privacy notice page (`privacy.html`), terms & cancellation policy
  (`terms.html`).
- Technical: HTTPS only; POST only; no personal data in URLs, `localStorage`,
  analytics or logs; Sheet access limited to named staff accounts; service
  account limited to one calendar and one sheet; secrets in Vercel env vars.

### 5.9 Fees and payment (simple for now)
- A "Fees & payment" section on the patient info page: consultation fee
  (`TODO-CLINIC`), "from" prices for common treatments (optional, owner
  decides), written estimate before any treatment, payment methods (UPI,
  cards, cash — `TODO-CLINIC`), staged payments for long treatments
  (implants, braces, root canal + crown), card EMI if available.
- No online payment yet.

## 6. Site map and page content

All pages share: skip-to-content link, header (logo, nav, phone, "Book
appointment"), footer (address, hours, phone, WhatsApp, email, quick links,
privacy/terms, emergency line), sticky mobile bar (Call · WhatsApp · Book).

| Page | Content |
|---|---|
| `index.html` Home | Hero (gentle family care, Book + WhatsApp buttons, trust chips) · emergency strip · 6 featured services · why Tooth Nest (gentle care, sterilisation, digital X-rays, clear estimates, family friendly) · your visit step by step (book → history → exam & X-ray → plan & estimate → treatment → follow-up) · dentists teaser · reviews (static, no auto-rotation) · map + hours + final call to action |
| `services.html` Treatments | One anchored section per service (table below): what it is, who it is for, what happens, visits/time, recovery & aftercare, "Book this" (`book.html?service=<id>` — service id only) |
| `about.html` About | Story & mission · dentist profiles (photo, qualifications, DCI/State Dental Council registration no., languages, interests) · team · sterilisation & infection control (autoclave, sealed pouches, single-use items, surface disinfection) · equipment · clinic photos |
| `patients.html` Patient info | First visit (what to bring, arrive 10 min early) · fees & payment (5.9) · aftercare guides (filling, extraction, root canal, whitening, braces, dentures) · emergencies – what to do now · nervous patients · FAQs (`<details>`) · cancellation policy |
| `book.html` Booking | Section 5.3 |
| `intake.html` Intake | Section 5.2 |
| `contact.html` Contact | Address, lazy-loaded map + plain link, hours, phone, WhatsApp, email, landmarks/parking/directions, building access, call-back form |
| `privacy.html`, `terms.html` | Section 5.8 |
| `brand.html` | Section 5.4 (`noindex`) |
| `404.html` | Friendly message + links to Home, Book, Contact |

**Services** (trim to what the clinic offers — open question 4):

| id | Service | Key points |
|---|---|---|
| `checkup` | Check-up & cleaning (scaling, polishing) | Every 6 months; exam, gum check, oral-cancer screening, X-rays when needed; 30–45 min |
| `fillings` | Tooth-coloured fillings | Composite; one visit; numbness 2–3 h |
| `root-canal` | Root canal treatment | Saves infected tooth; 1–3 visits; crown usually advised after |
| `crowns-bridges` | Crowns & bridges | 2 visits (prep + temporary, then fit) |
| `implants` | Dental implants | Consultation + scan, placement, 3–6 months healing, crown |
| `dentures` | Dentures | Full/partial; several fittings; care instructions |
| `whitening` | Teeth whitening | In-clinic or take-home; temporary sensitivity |
| `veneers` | Veneers & smile design | Porcelain/composite; 2–3 visits |
| `orthodontics` | Braces & clear aligners | 6–24 months; retainers after |
| `gum` | Gum treatment | Bleeding gums, deep cleaning, maintenance |
| `kids` | Children's dentistry | First visit by age 1; fluoride, sealants |
| `extractions` | Extractions & wisdom teeth | Aftercare: gauze, no rinsing/straws/smoking 24 h, soft food |
| `emergency` | Emergency care | Pain, swelling, broken/knocked-out tooth; same-day slots; first aid until you arrive |

## 7. Design direction

- **Feel:** calm, clean, warm, reassuring; generous white space; rounded shapes
  echoing the tooth and nest; inline SVG icons (no emoji); no generic gradients.
- **Logo:** use `assets/brand/logo.svg` (full colour, transparent),
  `logo-white.svg` (dark backgrounds) and `logo-mark.svg` (tooth only, small
  sizes). Traced from the owner's PNG, now kept as
  `assets/brand/source/logo-original.png` (white box, sticker outline — do not
  use on the site). Raster versions: re-run `node tools/render-brand.cjs`.
  Brand kit page: `/brand.html` (`noindex`).
- **Photos** (owner-uploaded to the Google listing; downloaded 2026-10-29 at
  1600 px; 4 of the 10 on the listing — the rest could not be fetched
  automatically):

  | File | Shows | Use / caveat |
  |---|---|---|
  | `clinic/treatment-room.jpg` (1600×1200) | Dental chair, LED lamp, monitor, instrument tray | Good for "modern equipment", but the chair is **still in protective plastic wrap** (taken before opening) — replace with a new photo before launch |
  | `clinic/reception.jpg` (1600×1200) | Reception desk, waiting chairs, plant | Usable for About/Contact; a little bare |
  | `clinic/storefront.jpg` (1600×1600) | Signboard with logo, Dr. K. Ramya, phone, timings; services poster | Great for Contact ("find us") — motorbikes in front; crop to the signboard + entrance |
  | `clinic/storefront-opening-day.jpg` (1031×1086) | Storefront decorated with marigold garlands on opening day | Nice for the About story; a person is visible — crop or ask permission |

  Convert to WebP/AVIF at the sizes used during the build. Ask the owner for
  new photos: treatment room ready for use, Dr. K. Ramya portrait, team,
  sterilisation area, reception with patients' consent, exterior without bikes.
- **Signboard style:** the real sign uses navy bold capitals for the name and
  a red accent for the dentist's name. The website follows the logo greens
  instead; navy can be an optional dark accent if the owner wants the site to
  match the sign.
- **Colours** (sampled from the logo; contrast against white):

  | Token | Value | Use | Contrast |
  |---|---|---|---|
  | `--brand` | `#2CB27F` | Logo green: decorative fills, icons, large shapes | 2.7:1 — not for text or white-text buttons |
  | `--brand-strong` | `#1A7A56` | Buttons, links, accents | 5.3:1 ✔ |
  | `--brand-deep` | `#176B4C` | Hover / pressed | 6.5:1 ✔ |
  | `--nest` | `#84888B` | Borders, decorative lines | 3.6:1 (not body text) |
  | `--ink` | `#2E3338` | Body text | 12.8:1 ✔ |
  | `--ink-soft` | `#4A4F54` | Secondary text | 8.3:1 ✔ |
  | `--leaf` | ~`#8DC63F` → `#3DAA48` | Small highlights only | decorative |
  | `--surface` | `#FFFFFF` / `#F3FAF6` | Page / alternate sections | — |

  Dark text `#1F2A2E` on `--brand` = 5.45:1 if a green surface with text is needed.
- **Type (decided):** headings **Figtree** 600/700, body **Noto Sans** 400/600
  (ui-ux-pro-max "Medical Clean" pairing; Noto has Telugu/Devanagari siblings).
  Self-hosted variable woff2, Latin subset only (`assets/fonts/`, OFL licences
  alongside) — no Google Fonts request. ₹ falls back to the system font (the
  latin-ext file was 168 KB just for that). Body 17px, line-height 1.6.
- **Style:** flat/soft cards, subtle shadow, 16px radius. **No neumorphism**
  (low contrast).
- **Motion:** minimal; respect `prefers-reduced-motion`.
- **Breakpoints:** mobile-first; test 375 / 768 / 1280 px. Most visitors in
  India will be on mid-range Android phones on mobile data — keep pages light.

## 8. Quality bar (definition of done)

- Semantic HTML, one `<h1>`, landmarks, skip link, visible focus.
- WCAG 2.2 AA: contrast, 44×44 px targets, labelled controls, errors next to
  fields, alt text, keyboard-only works, 200% zoom works.
- SEO per 5.5; Lighthouse mobile ≥ 90 in all four categories.
- Budgets: CSS < 50 KB, JS < 30 KB per page, images sized + lazy-loaded (WebP/AVIF).
- No console errors. No patient data in URLs, storage, analytics or logs.
- Functions: validate every field server-side, rate-limit, never log personal
  data, handle Google/WhatsApp failures without losing the lead.
- Tests (section 8.1) pass; `browser-qa` at 3 breakpoints on the Vercel preview;
  `/ponytail-review` before each push.

### 8.1 Testing
- `tests/smoke.mjs` (Playwright is pre-installed in cloud sessions — do **not**
  run `playwright install`): every page 200, one `<h1>`, no console errors, nav
  links resolve, booking and intake flows with invalid and valid input
  (API calls stubbed).
- Unit checks (Node `node:test`, no extra deps) for slot generation (hours,
  holidays, buffers, time zone **Asia/Kolkata**), Indian phone validation, and
  server-side validation of each function.
- Run against `python3 -m http.server` / `vercel dev` locally and the Vercel
  preview (`*.vercel.app` and `google.com` are in the session's network
  allowlist).

## 9. Accounts and setup the owner must do

The clinic must own every account (not a personal or developer account).

- [ ] Clinic Google account (e.g. Gmail or Google Workspace) — owns Calendar,
      Sheet, Search Console, Business Profile
- [ ] Google Cloud project (free) with Calendar + Sheets APIs and a service
      account (Claude can guide step by step)
- [ ] Meta Business account + WhatsApp Business Platform number, business
      verification, message templates approved. Decide: separate number for
      the API, or Meta's "coexistence" option to keep using the same number in
      the WhatsApp Business app (check current availability)
- [ ] Staff WhatsApp number(s) that receive alerts
- [ ] Confirm who manages the Google Business Profile (it already has an owner); add the website URL and appointment link once live
- [ ] Domain name (e.g. `toothnest.in` / `.com`) — needed for Search Console
      domain property and a professional email
- [ ] Cloudflare account (free) for Turnstile spam protection
- [ ] Clinic details from open questions (section 11)

## 10. Progress

### Phase 0 — Setup ✅
- [x] Install Ponytail, curated ECC and ui-ux-pro-max skills (see `.claude/skills/`, licences in `.claude/licenses/`)
- [x] Fix GitHub push access; push branch `claude/clever-ride-mri50y`
- [x] Add logo `assets/images/logo.png`
- [x] Connect Vercel; allow `*.vercel.app` in the session network
- [x] Write this plan and `CLAUDE.md`
- [x] Feature list agreed and planned (India, Google Calendar, WhatsApp)

### Phase 1 — Brand kit and foundation (waits for "go")
- [x] `.vercelignore` (hides `.claude/`, `CLAUDE.md`, `PLAN.md`, `tests/`, `tools/`)
- [x] Brand kit (5.4): `assets/brand/` SVG logos (full, white, mark), transparent PNGs, favicons (`/favicon.ico`, `/favicon.svg`, apple-touch, 192/512 maskable), OG image, GBP cover, square profile picture; `brand.html`
- [x] Design tokens + fonts in `assets/css/styles.css`
- [x] `assets/data/site.json` (contacts, address, geo, hours, holidays; services added in Phase 4 when slot lengths are known)
- [x] Header, footer, mobile nav, sticky Call · WhatsApp · Book bar — canonical markup lives in `brand.html`; copy it exactly into every page
- [x] Icon sprite `assets/icons.svg` (Lucide ISC + Simple Icons CC0 WhatsApp), `<use href="/assets/icons.svg#i-NAME">`
- [x] Open-now chip (`assets/js/hours.js`, IST-aware) with tests `node --test tests/*.test.mjs` (7 passing)
- [x] QA of `brand.html` at 375/768/1280: no overflow, no console errors, axe-core WCAG 2.2 AA clean

### Phase 2 — Content pages
- [ ] Home · Services · About · Patient info (incl. fees & payment) · Contact
- [ ] Privacy · Terms · 404

### Phase 3 — Lead capture and alerts
- [ ] Call-back form → `/api/lead` → Sheet row
- [ ] WhatsApp Cloud API alert to staff (needs section 9 accounts)
- [ ] Turnstile + honeypot + rate limit
- [ ] Analytics events (call, WhatsApp, form, booking)

### Phase 4 — Booking calendar
- [ ] Slot logic from `site.json` + Calendar free/busy (with unit tests)
- [ ] `book.html` multi-step UI
- [ ] `/api/slots`, `/api/book` (re-check slot, create event, Sheet, alerts, .ics)
- [ ] Patient WhatsApp confirmation template

### Phase 5 — Smart intake form
- [ ] `intake.html` multi-step conditional form + printable version
- [ ] `/api/intake` → restricted Sheet tab + staff alert

### Phase 6 — Local SEO, Search Console, Google Business Profile
- [ ] JSON-LD, meta/OG, `sitemap.xml`, `robots.txt`
- [ ] Search Console + Bing verification, sitemap submitted
- [ ] GBP optimised (5.6 checklist), appointment link → `book.html`, review link on site
- [ ] Citation list for owner (Practo, Justdial, etc.)

### Phase 7 — Reminders, recall, reviews
- [ ] Daily job: 24 h reminders, review request after visit, 6-month recall

### Phase 8 — Launch
- [ ] Replace all `TODO-CLINIC` placeholders (`grep -rn TODO-CLINIC`)
- [ ] Legal review of privacy/terms (DPDP) and DCI advertising rules
- [ ] Full QA (section 8) on the preview; owner sign-off
- [ ] Production host + domain decided; merge to the default branch; HTTPS; Search Console on the domain

## 11. Open questions for the owner

Until answered, use placeholders written as `TODO-CLINIC: …`.

1. Confirm the address and hours in section 2 (evening closing **8:30 PM or
   9 PM?**); which of the two numbers (97047 37577 / 70130 01802) is for
   calls and which for WhatsApp; email; nearby landmarks; holidays.
2. Dr. K. Ramya: qualifications (e.g. BDS/MDS + speciality), State Dental
   Council registration number, photo, languages spoken; any other dentists
   or staff to show.
3. Which services the clinic actually offers (trim section 6 table); typical
   appointment length per service.
4. Show prices? Consultation fee? Payment methods accepted (UPI, cards, cash)?
   Card EMI?
5. Who receives WhatsApp alerts (numbers), and expected reply time.
6. Separate WhatsApp number for the API, or coexistence with the current one?
7. Original logo file (AI/SVG/PDF) available? The other 6 photos from the
   Google listing (or originals from the phone), and new photos listed in
   section 7.
8. Languages: English only at launch, Telugu/Hindi later?
9. Who has owner access to the Google Business Profile (listing shows an owner
   account); the other 14 reviews if wanted (copy from the GBP dashboard).
10. Domain name and production host.
11. Social media accounts (Instagram, Facebook, YouTube).

## 12. Session log

- **2026-10-29 (session 1)** — Planning only. Installed skills (Ponytail, 7 ECC
  skills, ui-ux-pro-max), fixed GitHub push access, added logo, connected Vercel,
  agreed static HTML/CSS/JS front end. Owner gave the feature list; added
  reminders/recall, reviews, click-to-chat, DPDP/DCI compliance, lead log,
  analytics, editable site data, emergency path and spam protection. Chose
  Google Calendar + Google Sheet + WhatsApp Cloud API behind Vercel functions.
  Read address, phone, hours, rating and Place ID from the public Maps listing
  (Alwal, Secunderabad) after google.com was allowed. Dentist: Dr. K. Ramya.
  Owner confirmed the Maps photos are theirs; saved 4 of 10 to
  `assets/images/clinic/` (rest not reachable without a browser login).
  Photos revealed a second phone number, the "Cosmetic Dental Surgeon" title,
  the services poster, and an evening-hours mismatch (sign 9 PM vs Google
  8:30 PM). Saved 5 Google reviews to `assets/data/reviews.json` at the owner's
  request. Nothing built — waiting
  for "go".
- **2026-10-29 (session 1, later)** — Owner said "go" for Phase 1. Traced the
  logo to SVG (vtracer, per-colour layers, sticker outline removed) and made
  the brand kit; chose Figtree + Noto Sans (self-hosted); wrote `styles.css`,
  `main.js`, `hours.js` (+ tests), `site.json`, icon sprite, manifest,
  `.vercelignore`, and `brand.html` with the shared header/footer/action bar.
  Conventions: root-absolute URLs (`/assets/...`), `.html` links (no
  cleanUrls config), `<html class="js">` set inline so the mobile nav works
  without JS. Next: Phase 2 pages — ask the owner before starting.
