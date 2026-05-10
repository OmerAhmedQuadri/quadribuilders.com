import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, BedDouble, Maximize } from 'lucide-react';
import api from '../lib/api.js';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import Badge from '../components/ui/Badge.jsx';
import Loader from '../components/ui/Loader.jsx';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';

const FILTERS = [
  { label: 'All',         value: '' },
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial',  value: 'commercial' },
  { label: 'Contract',    value: 'contract' },
  { label: 'Listed',      value: 'listed' },
];

export default function Projects() {
  const [filter, setFilter] = useState('');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', filter],
    queryFn: () => {
      const params = filter === 'listed' ? '?listed=true' : filter ? `?type=${filter}` : '';
      return api.get(`/projects${params}`).then((r) => r.data);
    },
  });

  return (
    <PageWrapper>
      <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-12">
          <p className="section-label mb-4">Our Work</p>
          <h1 className="section-title mb-8">Projects</h1>
          {/* Filter bar */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-5 py-2 text-xs tracking-wider uppercase font-medium border transition-all duration-200 ${
                  filter === value
                    ? 'bg-accent text-[#0a0a0a] border-accent'
                    : 'border-border text-[var(--color-text-secondary)] hover:border-accent hover:text-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader size="lg" /></div>
        ) : projects.length === 0 ? (
          <p className="text-[var(--color-text-secondary)] py-20 text-center">No projects found.</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {projects.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/projects/${project.slug}`} className="group block bg-[#0a0a0a]">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={project.images?.[0] || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80'}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge status={project.status} />
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-display text-lg font-semibold group-hover:text-accent transition-colors">{project.title}</h3>
                        {project.price && <span className="text-accent text-sm font-medium whitespace-nowrap">{project.price}</span>}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                        <span className="flex items-center gap-1"><MapPin size={10} />{project.location}</span>
                        {project.area && <span className="flex items-center gap-1"><Maximize size={10} />{project.area}</span>}
                        {project.bedrooms && <span className="flex items-center gap-1"><BedDouble size={10} />{project.bedrooms} BHK</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </PageWrapper>
  );
}
