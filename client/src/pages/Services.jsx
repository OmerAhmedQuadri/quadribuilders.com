import { Link } from 'react-router-dom';
import { Building2, Search, HardHat, Wrench } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';
import CTABanner from '../components/sections/CTABanner.jsx';

const services = [
  {
    id: 'listed-properties',
    icon: Building2,
    title: 'Listed Properties',
    description: 'Explore our portfolio of premium residential and commercial properties available for purchase. Each listing includes detailed specifications, pricing, and direct contact with our sales team.',
    points: ['Ready-to-move and under-construction options', 'Transparent pricing with no hidden charges', 'Site visits arranged within 24 hours', 'Home loan assistance available'],
    cta: { label: 'View Listed Properties', to: '/projects?listed=true' },
    formType: 'listed-property',
  },
  {
    id: 'off-market',
    icon: Search,
    title: 'Off-Market Enquiries',
    description: 'Not finding what you need in our listed portfolio? Submit your requirements confidentially and we\'ll match you with exclusive, non-listed opportunities from our network.',
    points: ['Curated to your specific requirements', 'Confidential handling of all enquiries', 'Access to pre-launch pricing', 'Dedicated relationship manager assigned'],
    cta: { label: 'Submit Off-Market Enquiry', to: '/contact?type=unlisted-property' },
    formType: 'unlisted-property',
  },
  {
    id: 'contract-development',
    icon: HardHat,
    title: 'Contract Development',
    description: 'End-to-end construction and development services for corporates, institutions, and large-scale investors. We manage everything from acquisition to handover.',
    points: ['Full project lifecycle management', 'Dedicated project manager and site engineer', 'Regular milestone reporting', 'ISO-certified quality processes'],
    cta: { label: 'Discuss Your Project', to: '/contact?type=contract' },
    formType: 'contract',
  },
  {
    id: 'general-construction',
    icon: Wrench,
    title: 'General Construction',
    description: 'Residential and commercial construction projects of any scale. Whether it\'s a custom home or a multi-storey building, we bring the same rigour to every project.',
    points: ['Turnkey construction solutions', 'BOQ-based transparent costing', 'Experienced in-house workforce', 'Post-completion warranty support'],
    cta: { label: 'Get a Quote', to: '/contact?type=enquiry' },
    formType: 'enquiry',
  },
];

export default function Services() {
  return (
    <PageWrapper>
      <div className="pt-36 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="section-label mb-4">Services</p>
          <h1 className="section-title mb-4">What We Build</h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-xl leading-relaxed">
            From individual homes to corporate campuses — every project built to the same standard.
          </p>
        </ScrollReveal>
      </div>

      {services.map(({ id, icon: Icon, title, description, points, cta }, i) => (
        <section
          key={id}
          id={id}
          className={`py-20 border-t border-border ${i % 2 === 1 ? 'bg-surface' : ''}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid md:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <ScrollReveal>
                <div className="w-12 h-12 border border-accent flex items-center justify-center text-accent mb-6">
                  <Icon size={22} />
                </div>
                <h2 className="font-display text-4xl font-semibold mb-4">{title}</h2>
                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">{description}</p>
                <ul className="space-y-2 mb-8">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                      <span className="w-1 h-1 bg-accent flex-shrink-0 rounded-full" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link to={cta.to} className="btn-primary">{cta.label}</Link>
              </ScrollReveal>
              <ScrollReveal delay={0.15} className="border border-border p-px">
                <div className="aspect-[4/3] bg-[#0a0a0a] flex items-center justify-center">
                  <Icon size={64} className="text-border" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      ))}

      <CTABanner />
    </PageWrapper>
  );
}
