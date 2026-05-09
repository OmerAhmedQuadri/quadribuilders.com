import { Link } from 'react-router-dom';
import { Building2, Search, HardHat, Wrench, ArrowRight } from 'lucide-react';
import ScrollReveal, { StaggerContainer } from '../ui/ScrollReveal.jsx';

const services = [
  {
    icon: Building2,
    title: 'Listed Properties',
    slug: 'listed-properties',
    description: 'Browse our curated portfolio of available residential and commercial properties ready for purchase.',
  },
  {
    icon: Search,
    title: 'Off-Market Enquiries',
    slug: 'off-market',
    description: 'Access exclusive, non-listed properties through our network. Submit your requirements confidentially.',
  },
  {
    icon: HardHat,
    title: 'Contract Development',
    slug: 'contract-development',
    description: 'End-to-end B2B construction services for corporates and institutions. From design to delivery.',
  },
  {
    icon: Wrench,
    title: 'General Construction',
    slug: 'general-construction',
    description: 'Residential and commercial construction projects built to the highest standards of quality.',
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal className="mb-16">
        <p className="section-label mb-4">What We Do</p>
        <h2 className="section-title max-w-xl">
          Comprehensive Construction Services
        </h2>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {services.map(({ icon: Icon, title, slug, description }) => (
          <Link
            key={slug}
            to={`/services#${slug}`}
            className="group bg-[#0a0a0a] p-8 hover:bg-surface transition-colors duration-300 flex flex-col"
          >
            <div className="mb-6 w-10 h-10 border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-colors duration-300">
              <Icon size={18} />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">{title}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1">{description}</p>
            <div className="mt-6 flex items-center gap-2 text-accent text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Learn more <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </StaggerContainer>
    </section>
  );
}
