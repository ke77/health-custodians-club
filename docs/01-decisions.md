# 01. Decisions

Source: planning document updated after the meeting of 15 October 2026 (Kelvin Kobby and Amponsah Felix).
Status legend: **Agreed** (recorded in the meeting summary), **Discussed** (covered, not formally recorded), **Proposed** (our suggestion, not yet discussed), **Open** (undecided).
Build rule: Agreed and Discussed items are built as written. Proposed items are built as written unless told otherwise. Open items use the stated default and are flagged to Kelvin in the task report.

## A. Scope and process

| ID | Decision | Status |
|----|----------|--------|
| D01 | Two phases. Phase 1 is an MVP released before school resumes on 26 Oct 2026. Secondary features move to Phase 2, tested step by step. | Agreed |
| D02 | Audiences: prospective members, potential advisers, partners, sponsors, health professionals, and club executives. | Agreed |
| D03 | Site does not call the club student-founded or tied to one campus. No fees shown. No invented content. | Proposed |
| D04 | Planning document shared via Google Drive for the club to review and update. | Agreed |

## B. Pages and structure

| ID | Decision | Status |
|----|----------|--------|
| D10 | Sitemap: Home, About, Programs, Membership (with Apply inside), Contact, Blog, Partners, FAQ, Privacy Policy, Terms of Service, 404. Admin login added later. | Agreed (core), FAQ placement see O06 |
| D11 | Blog page shows "Coming soon" until the dashboard editor exists. The club says the blog is very important (announcements, training sessions, outreach activities). | Agreed |
| D12 | Standalone, editable Partners page for future sponsors and partners. No partners confirmed yet, so no invented logos or names. | Agreed |
| D13 | Executives and Board of Advisors sit under the About page. | Agreed |
| D14 | Each executive shown with picture, name and role, prominently (recognition, motivation, CV building, credibility). Club submits the final position list. | Agreed |
| D15 | Regional representatives shown alongside executives, each with name and region. | Agreed |
| D16 | Board of Advisors on About, roles first, profiles when confirmed. Senior health professionals or doctors may be appointed as figureheads. Editable from dashboard (Phase 2). | Agreed / Discussed |
| D17 | About holds overview, vision, mission, leadership, regional presence. Contact details and form live on the Contact page only. | Discussed |
| D18 | Minimal map of Ghana's 16 regions on About, with a list beside it (list only on phones). Kelvin designs it. | Discussed |
| D19 | Admin login button: left out for now. Added at the far right of the menu once the dashboard is finished. | Proposed |
| D20 | Second hero button "Apply to join" leads to the application form, as do other Apply buttons and the closing "Ready to become a custodian?" prompt. | Discussed |
| D21 | Hero image chosen by the club (microscope for research, or later a group photo in club shirts). Pexels/Unsplash as stopgap. Other photos not yet decided. | Discussed |
| D22 | FAQs consolidated on one page with dropdown answers. The club drafts the questions (may use AI to generate likely ones). | Discussed |
| D23 | Membership journey drawn as a horizontal ladder diagram: Apply, admin review, admission notification, two-year cohort, certificate, alumni. | Discussed |
| D24 | Contact page: short pitches for advisers, partners, sponsors, alumni and aspiring members. Form: name, email, interest category, message. Sends an email notification and a dashboard update. Shows active phone, WhatsApp, email and social handles. | Discussed |
| D25 | Privacy Policy and Terms of Service pages linked from footer. Club supplies the content. | Proposed |

## C. Membership and application

| ID | Decision | Status |
|----|----------|--------|
| D30 | Minimum level: Level 200 and above, tertiary students. Stated on the Membership page. Health professionals excluded in Phase 1. | Agreed |
| D31 | Minimum CGPA 2.8 for all applicants, stated explicitly on the site. | Agreed |
| D32 | Eligible programmes: Medicine, Nursing, Midwifery, Pharmacy, Physician Assistantship, Medical Laboratory Science, Public Health, Nutrition and Dietetics, Physiotherapy, Radiography and Medical Imaging, Dentistry, Optometry, Biomedical Science, Clinical Psychology. General Psychology excluded. | Discussed |
| D33 | Optional skills section: graphic design, content creation, video editing, social media management. | Agreed |
| D34 | No student ID upload. Applicants type their ID number. Admins cross-check IDs with regional representatives. Reasons: free-tier storage and server costs, and uploads may deter applicants. | Agreed |
| D35 | No social media links in the form. | Discussed |
| D36 | Three short answers of 150 to 200 words: motivation, a health gap seen in the community, skills brought. | Discussed |
| D37 | Automatic confirmation email to the applicant (received and accepted for review, with next steps) and a notification to the club. | Agreed |
| D38 | Application deadline and open/closed switch editable from the dashboard. When closed, the page offers a waiting list. | Agreed |
| D39 | One application per email per cohort. Reference number format HCC-YYYY-XXXX (e.g. HCC-2026-0001). | Proposed |
| D40 | Cohort model: graduation every two years with an official certificate. Alumni welcome to keep supporting activities. | Agreed |

## D. Programmes

| ID | Decision | Status |
|----|----------|--------|
| D50 | Training is entirely virtual with shared slides, Saturdays. Regional in-person meetings follow as the club grows. Assignments kept light. | Discussed |
| D51 | Courses run one to three months, with reading materials and assessments, structured with mentors and AI help. A lawyer develops the programme structure and content. | Discussed |
| D52 | Outreach aims: sensitization and clean-up outreaches roughly every two months across the 16 regions through university representatives. | Discussed |

## E. Dashboard

| ID | Decision | Status |
|----|----------|--------|
| D60 | Phase 1 dashboard: secure email sign-in, only approved admin emails, add/remove admins, applications (search, filter, read, status, private notes, CSV export), deadline and open/closed switch, cohort label. | Agreed |
| D61 | Phase 2: blog editor (installable as a phone web app), leadership and Board editing, partners editing, FAQ editing, site settings, status-change emails, enquiries inbox. | Agreed / Proposed |
| D62 | Executive and Board updates become editable from the dashboard in Phase 2. | Discussed |

## F. Open items and the default to build with

| ID | Open question | Default while open |
|----|---------------|--------------------|
| O01 | **Interviews.** Summary says agreed from now; detailed notes say excluded for the current cohort. | Assume no interview for the current cohort. Journey diagram omits the interview step. Keep an `interview` value in the status enum and a `lib/config` flag `interviewStepEnabled = false`. |
| O02 | **Student ID.** Upload excluded, but the action list still mentions image compression for ID uploads. Is any copy needed later (e.g. shortlisted only)? | Typed ID number only. No upload, no storage bucket, no compression work in Phase 1. |
| O03 | **Postgraduates.** Not discussed. | Level options 200 to 600. No postgraduate option. |
| O04 | **CWA threshold.** KNUST uses CWA, not CGPA. Threshold TBC. | Form has CGPA (required, minimum 2.80) and CWA (optional, no threshold enforced). Show a flag in the dashboard when CWA is given. Raise with Kelvin before launch: a student with only a CWA cannot currently pass the CGPA field. |
| O05 | **Short answer length.** 150 to 200 (was 150 to 250). | 150 to 200 words, with a live word counter. |
| O06 | **FAQ placement.** Own page or on Membership? Home preview? | Standalone `/faq`. Home shows a short preview of 3 or 4 questions linking to `/faq`. Membership links to `/faq`. |
| O07 | **Cost question in FAQ.** | Leave the cost question out. |
| O08 | **Course titles and schedule.** Pending lawyer and club. | Programs page lists training areas only, no course titles, no schedule. Label as "details announced with the first cohort". |
| O09 | **Next steps after applying.** | Show a short confirmation page with the reference number and draft next-steps copy from `docs/04-application-form.md`. Mark the copy as draft in the report. |
| O10 | **Status emails (accepted/rejected).** | Phase 1: confirmation email and admin notification only. The club writes to applicants personally. Automatic status emails in Phase 2. |
| O11 | **Location on Contact.** | Show no physical location. |
| O12 | **Interim content changes before Phase 2 editors.** | Store people, FAQs, partners and settings in database tables from the start, seeded from `supabase/seed.sql`. Until editors exist, changes are made in the Supabase table editor. Document this in the README. |
| O13 | **Which editable items are Phase 1 vs Phase 2.** | Phase 1: applications and application window only. Everything else Phase 2. |
| O14 | **Media team on About.** | Leave out. |
| O15 | **Interest in executive or regional head roles in the form.** The draft form asks it. Club has not confirmed. | Keep the question, optional. |
| O16 | **Gender field options.** Planning document says male or female. Earlier draft allowed "prefer not to say". | Male, female, prefer not to say; optional. Confirm with the club. |

## G. Contradictions already resolved by the defaults above

- Interviews: summary vs detailed notes (O01).
- Student ID upload vs image compression task (O02).
- Short answers 150 to 250 vs 150 to 200 (O05).
- FAQ spread across sections vs one consolidated page (O06).
- Contact page location: mentioned in the meeting, removed from planned content (O11).
