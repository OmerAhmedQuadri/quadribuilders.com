import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import api from '../../lib/api.js';
import Badge from '../ui/Badge.jsx';
import ScrollReveal from '../ui/ScrollReveal.jsx';
import Loader from '../ui/Loader.jsx';

const FILTERS = ['All', 'Residential', 'Commercial'];

export default function FeaturedProjects() {
  const [filter, setFilter] = useState('All');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => api.get('/projects?featured=true').then((r) => r.data),
  });

  const filtered = filter === 'All'
    ? projects
    : projects.filter((p) => p.type === filter.toLowerCase());

  return (
    <section className="py-24 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-label mb-4">Portfolio</p>
              <h2 className="section-title">Featured Projects</h2>
            </div>
            {/* Filter tabs */}
            <div className="flex gap-1 bg-[#0a0a0a] border border-border p-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-xs tracking-wider uppercase font-medium transition-all duration-200 ${
                    filter === f
                      ? 'bg-accent text-[#0a0a0a]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader size="lg" /></div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link to={`/projects/${project.slug}`} className="group block bg-[#0a0a0a] overflow-hidden">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.images?.[0] || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80'}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge status={project.status} />
                        {project.isListed && <Badge status="listed" className="bg-accent/10 text-accent border-accent/20">Listed</Badge>}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-xl font-semibold mb-1 group-hover:text-accent transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                            <MapPin size={11} />
                            {project.location}
                          </div>
                        </div>
                        {project.price && (
                          <span className="text-accent text-sm font-medium whitespace-nowrap">{project.price}</span>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-[var(--color-text-secondary)] line-clamp-2">
                        {project.shortDescription}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-accent text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <ScrollReveal className="mt-10 text-center">
          <Link to="/projects" className="btn-outline">View All Projects</Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
