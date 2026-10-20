import type { AccordionItem } from '@/components/ui/accordion'

/*
  the ten FAQs in sort order (docs/02-sitemap-content.md, FAQ).
  all ten render on the homepage FAQ section (there is no separate /faq page).
  interim source until the faqs table exists: the seed file is generated from this list, then the site reads the table.
  answers 1 and 3 carry wording adjusted for D03 and D30, pending club confirmation (O18).
*/
export const faqs: AccordionItem[] = [
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
