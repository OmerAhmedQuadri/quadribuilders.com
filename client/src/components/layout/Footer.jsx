import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { useSiteConfig } from '../../hooks/useSiteConfig.js';

const navLinks = [
  { to: '/projects', label: 'Projects' },
  { to: '/services', label: 'Services' },
  { to: '/about',    label: 'About Us' },
  { to: '/blog',     label: 'Blog' },
  { to: '/contact',  label: 'Contact' },
];

export default function Footer() {
  const { config } = useSiteConfig();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <img src="/logo.png" alt={config?.companyName} className="h-9 w-auto mb-4" />
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
              {config?.tagline || 'Engineering Excellence. Architectural Vision.'}
            </p>
            <div className="flex gap-4 mt-6">
              {config?.social?.instagram && (
                <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-accent transition-colors">
                  <Instagram size={18} />
                </a>
              )}
              {config?.social?.linkedin && (
                <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-accent transition-colors">
                  <Linkedin size={18} />
                </a>
              )}
              {config?.social?.facebook && (
                <a href={config.social.facebook} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-accent transition-colors">
                  <Facebook size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-[var(--color-text-secondary)] mb-5 font-body">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-[var(--color-text-secondary)] hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-[var(--color-text-secondary)] mb-5 font-body">Contact</h4>
            <div className="space-y-3">
              {config?.phone?.map((p) => (
                <a key={p} href={`tel:${p}`} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:text-accent transition-colors">
                  <Phone size={14} className="flex-shrink-0" />
                  {p}
                </a>
              ))}
              {config?.email?.map((e) => (
                <a key={e} href={`mailto:${e}`} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:text-accent transition-colors">
                  <Mail size={14} className="flex-shrink-0" />
                  {e}
                </a>
              ))}
              {config?.address && (
                <div className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                  <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{config.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-text-secondary)]">
            © {new Date().getFullYear()} {config?.companyName || 'QuadriBuilders'}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Hyderabad, Telangana, India
          </p>
        </div>
      </div>
    </footer>
  );
}
