import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';
import CallbackForm from '../components/forms/CallbackForm.jsx';
import EnquiryForm from '../components/forms/EnquiryForm.jsx';
import ListedPropertyForm from '../components/forms/ListedPropertyForm.jsx';
import UnlistedPropertyForm from '../components/forms/UnlistedPropertyForm.jsx';
import ContractForm from '../components/forms/ContractForm.jsx';
import { useSiteConfig } from '../hooks/useSiteConfig.js';

const TYPES = [
  { value: 'callback',          label: 'Request Callback' },
  { value: 'enquiry',           label: 'General Enquiry' },
  { value: 'listed-property',   label: 'Listed Property' },
  { value: 'unlisted-property', label: 'Off-Market' },
  { value: 'contract',          label: 'Contract / B2B' },
];

const FORM = {
  'callback':          <CallbackForm />,
  'enquiry':           <EnquiryForm />,
  'listed-property':   <ListedPropertyForm />,
  'unlisted-property': <UnlistedPropertyForm />,
  'contract':          <ContractForm />,
};

export default function Contact() {
  const [params] = useSearchParams();
  const defaultType = params.get('type') || 'callback';
  const [type, setType] = useState(TYPES.find((t) => t.value === defaultType) ? defaultType : 'callback');
  const { config } = useSiteConfig();

  return (
    <PageWrapper>
      <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-12">
          <p className="section-label mb-4">Contact</p>
          <h1 className="section-title mb-4">Get in Touch</h1>
          <p className="text-[var(--color-text-secondary)] max-w-lg">
            Choose the type of enquiry below. We'll route your message to the right person.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form column */}
          <div className="lg:col-span-2">
            {/* Type selector */}
            <div className="flex flex-wrap gap-2 mb-8">
              {TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setType(value)}
                  className={`px-4 py-2 text-xs tracking-wider uppercase font-medium border transition-all duration-200 ${
                    type === value
                      ? 'bg-accent text-[#0a0a0a] border-accent'
                      : 'border-border text-[var(--color-text-secondary)] hover:border-accent hover:text-accent'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Active form */}
            <AnimatePresence mode="wait">
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-surface border border-border p-8"
              >
                <h2 className="font-display text-2xl font-semibold mb-6">
                  {TYPES.find((t) => t.value === type)?.label}
                </h2>
                {FORM[type]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Contact info */}
          <ScrollReveal className="space-y-6">
            <div>
              <h3 className="font-display text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                {config?.phone?.map((p) => (
                  <a key={p} href={`tel:${p}`} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)] hover:text-accent transition-colors">
                    <Phone size={15} className="flex-shrink-0 mt-0.5" />
                    {p}
                  </a>
                ))}
                {config?.email?.map((e) => (
                  <a key={e} href={`mailto:${e}`} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)] hover:text-accent transition-colors">
                    <Mail size={15} className="flex-shrink-0 mt-0.5" />
                    {e}
                  </a>
                ))}
                {config?.address && (
                  <div className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                    <MapPin size={15} className="flex-shrink-0 mt-0.5" />
                    {config.address}
                  </div>
                )}
              </div>
            </div>

            {config?.mapEmbedUrl && (
              <div className="border border-border overflow-hidden h-48">
                <iframe
                  src={config.mapEmbedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office location"
                />
              </div>
            )}

            <div className="border border-border p-5">
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Office hours: Mon–Sat, 9am–6pm IST.<br />
                Site visits by appointment.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageWrapper>
  );
}
