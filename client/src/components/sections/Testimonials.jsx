import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import api from '../../lib/api.js';
import ScrollReveal from '../ui/ScrollReveal.jsx';

export default function Testimonials() {
  const constraintsRef = useRef(null);

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials').then((r) => r.data),
  });

  if (!testimonials.length) return null;

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-12">
          <p className="section-label mb-4">Client Stories</p>
          <h2 className="section-title">What Our Clients Say</h2>
        </ScrollReveal>
      </div>

      {/* Draggable carousel */}
      <div ref={constraintsRef} className="overflow-hidden">
        <motion.div
          className="flex gap-6 px-4 sm:px-6 lg:px-8 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <motion.div
              key={`${t._id}-${i}`}
              className="flex-shrink-0 w-80 md:w-96 bg-surface border border-border p-8"
            >
              <Quote size={24} className="text-accent mb-4 opacity-60" />
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-border flex items-center justify-center text-accent font-display text-lg">
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">{t.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating || 5 }).map((_, j) => (
                    <Star key={j} size={10} className="fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
