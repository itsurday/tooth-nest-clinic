# Tooth Nest Dental Clinic website

Website for a dental clinic in Alwal, Secunderabad (Hyderabad), India: static pages (plain HTML, CSS,
vanilla JS, no build step) plus a few Vercel serverless functions for booking
(Google Calendar), lead log (Google Sheets) and WhatsApp alerts. Deployed on
Vercel: https://tooth-nest-clinic.vercel.app/

**Start every session by reading `PLAN.md`.** It holds the decisions, page
specs, design tokens, progress checklist, open questions and session log.
Continue from the first unchecked item in its Progress section, and update
`PLAN.md` (checkboxes + session log) in the same commit as the work.

Rules:
- Build only phases the owner has said "go" for (see top of `PLAN.md`); ask before starting the next phase.
- Work in Ponytail mode: smallest complete change, no framework or dependency
  unless `PLAN.md` says so.
- Never put patient data in URLs, browser storage, analytics or logs.
- Unknown clinic details are placeholders marked `TODO-CLINIC: …`.
- Run `/ponytail-review` and the checks in `PLAN.md` section 8 before pushing.
