import type { AccordionItem } from '@/components/ui/accordion'

/*
  FAQs (docs/02-sitemap-content.md, FAQ). the full set lives on /membership#faq in two groups;
  the homepage shows five and links there. interim source until the faqs table exists.
  club answers 1 and 3 carry wording adjusted for D03 and D30, pending club confirmation (O18).
  membership answers are DRAFT, built only from agreed facts (D30, D31, D40, D50, D52, O01, O09). no cost question (O07).
*/
export const clubFaqs: AccordionItem[] = [
  {
    question: 'What is the Health Custodians Club?',
    answer:
      'The Health Custodians Club is an organisation that brings together health students, health professionals and health enthusiasts to promote health education, community service and personal development.',
  },
  {
    question: "What is the club's mission?",
    answer:
      'Our mission is to promote healthier communities through health education, preventive healthcare awareness, and the development of responsible future health leaders.',
  },
  {
    question: 'Who can join the club?',
    answer:
      'Membership is open to tertiary students in the health sciences, Level 200 and above. Health professionals and others who care about health education can support the club as mentors, partners and volunteers. Write to us through the contact form to find out how.',
  },
  {
    question: 'What activities does the club organise?',
    answer:
      'Our activities include health awareness campaigns, school and market outreach, community education, workshops, seminars, environmental health initiatives, and skills development.',
  },
  {
    question: 'How does the club benefit communities?',
    answer:
      'We provide accessible health information, promote healthy lifestyles, raise awareness of common diseases, and encourage appropriate healthcare-seeking behaviours.',
  },
  {
    question: 'Does the club provide medical treatment?',
    answer:
      'Our primary focus is health education and awareness. Any screening or clinical activities will involve qualified healthcare professionals and appropriate procedures.',
  },
  {
    question: 'What opportunities do members enjoy?',
    answer:
      'Members can participate in outreach programmes, leadership activities, teamwork, and training in communication, public speaking, research, and digital skills.',
  },
  {
    question: 'How can I participate in club activities?',
    answer:
      'You can join the club, follow our official communication channels, attend announced programmes, and volunteer for community initiatives.',
  },
  {
    question: 'How can I partner with or support the club?',
    answer:
      'We welcome partnerships with healthcare professionals, institutions, organisations, and community leaders through mentorship, volunteering, resources, and sponsorship.',
  },
  {
    question: 'How can I contact the club?',
    answer:
      "Contact us through our website's contact form or official communication channels for enquiries about membership, partnerships, volunteering, and upcoming activities.",
  },
]

export const membershipFaqs: AccordionItem[] = [
  {
    question: 'Who can apply?',
    answer:
      'Tertiary students in the health sciences at Level 200 and above, with a CGPA of at least 2.80 (or a CWA, where your institution uses one), studying one of the programmes listed under Eligibility on this page. Health professionals cannot apply for membership at this stage, but can support the club as mentors and partners.',
  },
  {
    question: 'How much time does membership take?',
    answer:
      'Training runs online on Saturdays, with light assignments between sessions. Outreach happens in the regions, roughly every two months. The application asks how many hours a month you can give, so we can plan around you.',
  },
  {
    question: 'What happens after I apply?',
    answer:
      'You will get an email confirming we have your application, with a reference number. We read every application and check academic details with our regional representatives, then contact you by email.',
  },
  {
    question: 'Is there an interview?',
    answer: 'Not for every cohort. If yours includes one, we will tell you by email after the review.',
  },
  {
    question: 'Can I apply from any region?',
    answer:
      "Yes. Training is online, and every one of Ghana's 16 regions has a regional head, so you can take part wherever you study or live.",
  },
  {
    question: 'What do alumni do?',
    answer:
      'Alumni stay close after graduation. They mentor the next intake, support outreach in the regions and help keep the work going.',
  },
]

const byQuestion = (q: string) => clubFaqs.find((f) => f.question === q) as AccordionItem

// the homepage's five
export const homepageFaqs: AccordionItem[] = [
  byQuestion('What is the Health Custodians Club?'),
  byQuestion('Who can join the club?'),
  byQuestion('What activities does the club organise?'),
  byQuestion('What opportunities do members enjoy?'),
  byQuestion('How can I partner with or support the club?'),
]

// /membership#faq: membership first, then the club questions ("who can apply" replaces "who can join")
export const faqGroups: { label: string; items: AccordionItem[] }[] = [
  { label: 'Membership', items: membershipFaqs },
  { label: 'About the club', items: clubFaqs.filter((f) => f.question !== 'Who can join the club?') },
]
