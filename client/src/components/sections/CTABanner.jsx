import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal.jsx';

export default function CTABanner() {
  return (
    <section className="py-24 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-4">Let's Build Together</p>
              <h2 className="section-title">
                Ready to Start Your Project?
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn-primary flex-1 justify-center">
                Get in Touch
                <ArrowRight size={16} />
              </Link>
              <Link to="/projects" className="btn-outline flex-1 justify-center">
                View Portfolio
              </Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-16">
            {[
              { n: '01', title: 'Consultation', body: 'Share your vision. We listen, assess, and advise with no obligation.' },
              { n: '02', title: 'Design & Plan', body: 'Our architects and engineers craft a detailed project plan and timeline.' },
              { n: '03', title: 'Build & Deliver', body: 'We execute to spec, keeping you informed at every milestone.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-5">
                <span className="font-display text-5xl font-semibold text-[var(--color-text-secondary)] opacity-60">{n}</span>
                <div>
                  <h4 className="font-display text-lg font-semibold mb-2">{title}</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
