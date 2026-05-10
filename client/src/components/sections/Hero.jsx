import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import AnimatedText from '../ui/AnimatedText.jsx';

export default function Hero({ config }) {
  const hero = config?.hero || {};
  const bgImage = hero.backgroundImage || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]" />
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-30 bg-grain" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-4xl">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] mb-8">
            <AnimatedText text={hero.headline || "Building Your Tomorrow"} delay={0.1} />
          </h1>

          <motion.p
            className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-xl mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          >
            <Link to={hero.ctaLink || '/projects'} className="btn-primary">
              {hero.ctaText || 'View Our Projects'}
              <ArrowRight size={16} />
            </Link>
            <Link to="/contact?type=callback" className="btn-outline">
              <Phone size={16} />
              Request Callback
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
