import { useQuery } from '@tanstack/react-query';
import { Linkedin } from 'lucide-react';
import api from '../lib/api.js';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import ScrollReveal, { StaggerContainer } from '../components/ui/ScrollReveal.jsx';
import CTABanner from '../components/sections/CTABanner.jsx';
import { useSiteConfig } from '../hooks/useSiteConfig.js';

export default function About() {
  const { config } = useSiteConfig();
  const { data: team = [] } = useQuery({
    queryKey: ['team'],
    queryFn: () => api.get('/team').then((r) => r.data),
  });

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="section-label mb-6">Our Story</p>
          <h1 className="section-title max-w-3xl mb-8">
            Building Hyderabad's Skyline for Over 15 Years
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-2xl">
            {config?.description}
          </p>
        </ScrollReveal>
      </section>

      {/* Values */}
      <section className="py-20 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12">
            <p className="section-label mb-4">Our Philosophy</p>
            <h2 className="section-title">What Drives Us</h2>
          </ScrollReveal>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Quality Without Compromise', body: 'Every project uses Grade-A materials sourced from verified vendors. We follow IS standards on all structural work.' },
              { title: 'Client-Centric Approach', body: 'Your vision guides every decision. We maintain complete transparency on budgets, timelines, and challenges.' },
              { title: 'Timely Delivery', body: 'We have delivered 95% of projects on or ahead of schedule — a record we protect fiercely.' },
            ].map(({ title, body }, i) => (
              <ScrollReveal key={title} delay={i * 0.1} className="border-t-2 border-accent pt-6">
                <h3 className="font-display text-xl font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{body}</p>
              </ScrollReveal>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12">
            <p className="section-label mb-4">Leadership</p>
            <h2 className="section-title">The Team Behind the Work</h2>
          </ScrollReveal>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <ScrollReveal key={member._id} className="group">
                <div className="bg-surface border border-border overflow-hidden">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-64 object-cover" />
                  ) : (
                    <div className="w-full h-64 bg-[#0a0a0a] flex items-center justify-center">
                      <span className="font-display text-7xl text-border">{member.name[0]}</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-xl font-semibold">{member.name}</h3>
                        <p className="text-accent text-xs tracking-wider uppercase mt-1">{member.role}</p>
                      </div>
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-accent transition-colors">
                          <Linkedin size={16} />
                        </a>
                      )}
                    </div>
                    {member.bio && <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3">{member.bio}</p>}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </StaggerContainer>
        </section>
      )}

      <CTABanner />
    </PageWrapper>
  );
}
