import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { useSiteConfig } from '../../hooks/useSiteConfig.js';

const navLinks = [
  { to: '/',         label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/services', label: 'Services' },
  { to: '/about',    label: 'About' },
  { to: '/blog',     label: 'Blog' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const { config }                    = useSiteConfig();
  const location                      = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const phone = config?.phone?.[0];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src="/logo.png" alt={config?.companyName || 'QuadriBuilders'} className="h-8 md:h-10 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `text-sm font-medium tracking-wide transition-colors duration-200 ${
                      isActive ? 'text-accent' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-accent transition-colors">
                  <Phone size={14} />
                  <span>{phone}</span>
                </a>
              )}
              <Link to="/contact" className="btn-primary text-xs py-2.5 px-5">
                Get in Touch
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden text-[var(--color-text-primary)] p-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-[#0a0a0a] pt-16 flex flex-col"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex flex-col gap-2 px-6 py-8">
              {navLinks.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `block font-display text-4xl font-semibold py-2 transition-colors ${
                        isActive ? 'text-accent' : 'text-[var(--color-text-primary)]'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="px-6 mt-auto pb-12">
              <Link to="/contact" className="btn-primary w-full justify-center">Get in Touch</Link>
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-2 mt-4 text-[var(--color-text-secondary)]">
                  <Phone size={14} />
                  {phone}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
