# 02. Sitemap and content

Copy marked **DRAFT** is mine, built from the founding document, and needs the club's approval. Copy marked **CLUB** is theirs to supply: render a graceful placeholder state until it arrives, never lorem ipsum. Everything the club may change later is stored in the database (see `docs/05-data-model.md`).
Status and open items: `docs/01-decisions.md`.

## Sitemap

| Route | Page | Phase | Notes |
|-------|------|-------|-------|
| `/` | Home | 1 | Build first. Needs approval before anything else. |
| `/about` | About | 1 | Story, vision, mission, leadership, Board of Advisors, regional presence |
| `/programs` | Programs | 1 | Light until legal counsel's structure arrives |
| `/membership` | Membership | 1 | Eligibility, journey, cohort model |
| `/membership/apply` | Application form | 1 | See `docs/04-application-form.md` |
| `/membership/apply/success` | Confirmation | 1 | Reference number and next steps |
| `/contact` | Contact | 1 | Pitches, form, club details |
| `/blog` | Blog | 1 ("Coming soon"), 2 (editor) | |
| `/admin/*` | Dashboard | 1 (lean), 2 | No link in the public menu until finished |
| `not-found` | 404 | 1 | Brand voice |

## Global

- **Header**: logo, Home, About, Programs, Membership, Contact, Blog, Partners. On phones the menu opens as a full-screen panel, not a small dropdown. The Admin button is added at the far right only once the dashboard is finished.
- **Footer**: logo, main links, FAQ, Privacy, Terms, contact details and social handles from settings, copyright line. Footer layout follows the screenshots in `reference/footer/`.
- **Per-page**: metadata, Open Graph image (generated with `next/og` in the brand style), `sitemap.xml`, `robots.txt`, favicon set, JSON-LD `Organization`.
- **Announcement banner**: optional, from settings (text, link, on/off). Phase 2 to edit, but render it from the settings row.
- **Logo**: the club has one. Remind Kelvin to add it under `public/brand/`. Until then use a plain text wordmark in Newsreader.

## Home `/`

Sections top to bottom:

1. **Hero.** Header, then a full-width photograph (100vw, about 85vh) with a dark linear-gradient overlay and the text layered on top.
   - Headline: "Most illness starts long before the hospital."
   - Supporting line (DRAFT, club will restructure): "Health Custodians Club trains health students to close the gap between how people live every day and what they know about it."
   - Primary button: "What we do" (scrolls to the next section).
   - Second button: "Apply to join" (to `/membership/apply`).
   - Image: CLUB. Placeholder until supplied: a dark ink background, no stock image.
2. **What HCC does** (`id="what-we-do"`). Three pillars: Training, Research, Sensitization. One sentence each and a link to `/programs`. Do not render as three identical icon cards. Use a typographic list with mono numbering (01, 02, 03) and hairline dividers.
   - DRAFT Training: "Virtual sessions that build communication, leadership, language and research skills beyond the university syllabus."
   - DRAFT Research: "Members find health problems in their own communities and build evidence-based responses."
   - DRAFT Sensitization: "Plain-language health education in schools, marketplaces and rural communities."
3. **Beyond the curriculum.** How HCC builds skills the standard syllabus leaves out. DRAFT: "A health degree teaches you the science. It rarely teaches you how to explain a diagnosis in Twi, lead a team, or design a small study. HCC does."
4. **Where we work.** Schools, marketplaces, rural communities and other underserved settings. One short paragraph with an image if the club supplies one.
5. **Membership preview.** Two-year cohort, official certificate, regional presence, alumni network. Link to `/membership`.
6. **FAQ preview.** 3 or 4 questions as dropdowns, then "More questions" to `/faq`. Placeholders until the club drafts the list.
7. **Closing call to action.** "Ready to become a custodian?" with an Apply button to `/membership/apply`. When applications are closed, the button text changes to "Join the waiting list".

## About `/about`

Section numbering uses the mono label style, e.g. "§ 02 / Mission".

1. **Our story.** CLUB writes the paragraphs; we edit. Until then use this DRAFT built from the founding document. No statistics.
   > Most health problems are not sudden. They begin as small habits no one explained: a teenager who swaps water for sugary drinks, a long workday that ends with a heavy meal at eight, a market trader who coughs through every day. When illness arrives, language gets in the way. Some people treat themselves because the hospital feels out of reach. Others reach the consulting room and cannot describe what is wrong. The knowledge exists. It simply is not reaching the people who need it. Health Custodians Club exists to change that, by training health students to explain, listen and serve.
2. **Vision** (DRAFT, tightened): "To be a leading hub for developing the next generation of health professionals, with practical, leadership, communication, research and interpersonal skills that go beyond the university curriculum, so they can excel in their careers, serve communities well and help improve health outcomes."
3. **Mission** (DRAFT, one short paragraph covering all six): "We help members discover and pursue their aspirations. We work to reduce the burden of disease in Africa through education, outreach and advocacy. We develop disciplined, purpose-driven leaders. We make health information simple enough for anyone to use. We build a culture of research and evidence-based advocacy. And we connect students, professionals and researchers so they can work together."
4. **Executive Committee.** President, Vice President, General Secretary, Financial Secretary, Organizing Secretary, Public Relations Officer (final list from the club). Each person: photo, name, role. Roles are by appointment based on demonstrated commitment. Empty state: "Applications for executive roles open with membership."
5. **Regional representatives.** Alongside the executives: name and region. Empty state: "Regional representatives are being appointed across all 16 regions."
6. **Board of Advisors.** Roles: strategic advice, networking and partnerships, mentoring executives, sponsorship support, continuity and professionalism. Show the roles when no names exist. People later, with photo and short bio.
7. **Regional presence.** Minimal SVG map of Ghana's 16 regions (Ahafo, Ashanti, Bono, Bono East, Central, Eastern, Greater Accra, North East, Northern, Oti, Savannah, Upper East, Upper West, Volta, Western, Western North) with a plain list beside it. Keyboard accessible. Phones show the list only. Single teal highlight, no extra colours. Regions with a representative are highlighted from data.

## Programs `/programs`

Keep it light. No past events, partners, numbers or testimonials. Mark anything not running as "Planned" or "Launching with the first cohort".

- **Training**: delivered virtually in shared-slide sessions on Saturdays. Covers mentorship, professional development, communication, leadership, local languages for health communication, research methods, disease studies, and a specialised legal course on health-system regulations and protocols. Courses run one to three months with reading materials and assessments. Assignments stay light. Regional in-person meetings follow as the club grows. (Course titles and schedule are open: O08.)
- **Research**: members identify community health challenges and build evidence-based responses.
- **Sensitization and outreach**: schools, markets and rural communities, with outreaches aimed at roughly every two months.
- **Language access**: explaining health in local languages to reduce self-medication and help patients describe symptoms accurately.

Layout for presenting virtual training is still being researched by Kelvin. Use a simple sectioned page for now.

## Membership `/membership`

- **Eligibility**: tertiary students with a health-sciences background, Level 200 and above, minimum CGPA 2.8, in one of the eligible programmes (list in `docs/04-application-form.md`). Health professionals are not eligible in Phase 1. State this plainly. No fees.
- **The journey**: horizontal ladder diagram, built in HTML and CSS: Apply, Review, Admission, Two-year cohort, Certificate, Alumni. No interview step (O01). On phones the ladder stacks vertically.
- **Cohort model**: graduation every two years with an official certificate. Alumni are welcome to keep supporting activities.
- **Regional heads explained**: short paragraph on presiding heads in the 16 regions.
- **Apply button**: one clear button to `/membership/apply`.
- **When closed**: short closed message and a link to the waiting-list form.
- **FAQ**: link to `/faq`.

## FAQ `/faq`

One page, dropdown answers (accessible accordion, `<details>` or equivalent with proper semantics). Questions come from the club and live in the `faqs` table with a sort order. Likely topics: who can apply, time commitment, what happens after applying, applying from another region, what alumni do. Leave the cost question out (O07). Until supplied, show 4 neutral placeholders marked clearly as placeholders in the seed file, not in rendered UI copy that looks real.

## Contact `/contact`

- Short pitch for each audience (DRAFT): advisers, partners and sponsors, health professionals, alumni, aspiring members. Two sentences each, no invented claims.
- **Form**: name, email, interest category (adviser, partner or sponsor, health professional, alumni, prospective member, other), message. Saves to `inquiries`, emails the club, appears in the dashboard (inbox in Phase 2).
- **Club details**: active phone numbers, WhatsApp numbers, email addresses, social handles, from settings. No physical location (O11).

## Partners `/partners`

Standalone page, editable in Phase 2. No partners yet, so show a short statement of what partnering with HCC involves and a link to `/contact`. DRAFT: "We are building partnerships with institutions, health professionals and sponsors who want to see health knowledge reach more people. If that sounds like you, we would like to hear from you." No invented names or logos. When `partners` rows exist, render them as a simple name and logo list.

## Blog `/blog`

"Coming soon" notice at launch with a line about what will appear: announcements, training sessions, outreach activities and events. Phase 2: posts from `posts`, written in a standalone editor in the dashboard (installable on a phone as a web app).

## Privacy `/privacy` and Terms `/terms`

Short pages. Club supplies content. Until then render a clear "Being prepared" notice. Reference Ghana's Data Protection Act, 2012 (Act 843) in the privacy copy once supplied.

## 404

DRAFT in brand voice: "This page is not here. Like most health problems, it may have started with a small mistake in the address." Links back to Home and Programs.
