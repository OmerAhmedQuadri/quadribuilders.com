import PageWrapper from '../components/layout/PageWrapper.jsx';
import Hero from '../components/sections/Hero.jsx';
import Stats from '../components/sections/Stats.jsx';
import ServicesGrid from '../components/sections/ServicesGrid.jsx';
import FeaturedProjects from '../components/sections/FeaturedProjects.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import CTABanner from '../components/sections/CTABanner.jsx';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';
import { useSiteConfig } from '../hooks/useSiteConfig.js';

function WhyUs() {
  const points = [
    { value: '15+', label: 'Years', body: "Deep roots in Hyderabad's construction landscape, with relationships and knowledge no new entrant can replicate." },
    { value: '100%', label: 'Transparency', body: 'Every rupee, every milestone, every decision is documented and shared with you in real time.' },
    { value: 'Zero', label: 'Compromises', body: 'We use Grade-A materials and follow IS code specifications on every project — residential or commercial.' },
  ];
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal className="mb-16">
        <p className="section-label mb-4">Why QuadriBuilders</p>
        <h2 className="section-title max-w-lg">The Standard Others Are Measured Against</h2>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-12">
        {points.map(({ value, label, body }, i) => (
          <ScrollReveal key={label} delay={i * 0.1}>
            <div className="border-l-2 border-accent pl-6">
              <div className="font-display text-6xl font-semibold text-accent leading-none mb-1">{value}</div>
              <div className="text-xs tracking-widest uppercase text-[var(--color-text-secondary)] mb-4">{label}</div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{body}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { config } = useSiteConfig();
  return (
    <PageWrapper>
      <Hero config={config} />
      <Stats stats={config?.stats} />
      <ServicesGrid />
      <FeaturedProjects />
      <WhyUs />
      <Testimonials />
      <CTABanner />
    </PageWrapper>
  );
}
