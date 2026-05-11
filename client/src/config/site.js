// Primary source of truth for all site content.
// API config (if set via admin) merges on top of these values.
export const fallbackConfig = {
  companyName: 'Quadri Builders',
  tagline: 'Engineering Excellence. Architectural Vision.',
  description: 'Quadri Builders is a Hyderabad-based construction and real estate development firm with over two decades of experience delivering premium residential and commercial projects across Telangana.',
  phone: ['+91 84668 53364'],
  email: ['info@quadribuilders.com'],
  address: 'Quadri Builders, Hyderabad, Telangana, India',

  hero: {
    headline: 'Building Your Tomorrow',
    subheadline: 'Premium construction and real estate development across Hyderabad',
    ctaText: 'View Our Projects',
    ctaLink: '/projects',
  },

  stats: [
    { label: 'Projects Completed', value: '70+' },
    { label: 'Years of Experience', value: '21+' },
    { label: 'Cities', value: '5+' },
    { label: 'Happy Clients', value: '100+' },
  ],

  whyUs: {
    sectionLabel: 'Why QuadriBuilders',
    title: 'The Standard Others Are Measured Against',
    points: [
      {
        value: '21+',
        label: 'Years',
        body: "Deep roots in Hyderabad's construction landscape, with relationships and knowledge no new entrant can replicate.",
      },
      {
        value: '100%',
        label: 'Transparency',
        body: 'Every rupee, every milestone, every decision is documented and shared with you in real time.',
      },
      {
        value: 'Zero',
        label: 'Compromises',
        body: 'We use Grade-A materials and follow IS code specifications on every project — residential or commercial.',
      },
    ],
  },

  about: {
    heroTitle: "Building Hyderabad's Skyline for Over 21 Years",
    values: [
      {
        title: 'Quality Without Compromise',
        body: 'Every project uses Grade-A materials sourced from verified vendors. We follow IS standards on all structural work.',
      },
      {
        title: 'Client-Centric Approach',
        body: 'Your vision guides every decision. We maintain complete transparency on budgets, timelines, and challenges.',
      },
      {
        title: 'Timely Delivery',
        body: 'We have delivered 95% of projects on or ahead of schedule — a record we protect fiercely.',
      },
    ],
  },

  social: {},
};
