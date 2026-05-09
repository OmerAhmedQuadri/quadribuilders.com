import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function CountUp({ target, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const numeric = parseInt(target.replace(/\D/g, ''), 10) || 0;
  const suffix = target.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!inView || !numeric) return;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * numeric));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, numeric, duration]);

  return <span ref={ref}>{inView ? count : 0}{suffix}</span>;
}

export default function Stats({ stats = [] }) {
  return (
    <section className="border-y border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="py-10 px-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="font-display text-4xl md:text-5xl font-semibold text-accent mb-2">
                <CountUp target={stat.value} />
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] tracking-widest uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
