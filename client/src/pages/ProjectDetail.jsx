import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Maximize, BedDouble, CheckCircle2, ArrowLeft, X } from 'lucide-react';
import api from '../lib/api.js';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import Badge from '../components/ui/Badge.jsx';
import { PageLoader } from '../components/ui/Loader.jsx';
import EnquiryForm from '../components/forms/EnquiryForm.jsx';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [lightbox, setLightbox] = useState(null);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.get(`/projects/${slug}`).then((r) => r.data),
  });

  if (isLoading) return <PageLoader />;
  if (!project) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-[var(--color-text-secondary)] mb-4">Project not found.</p>
        <Link to="/projects" className="btn-outline">Back to Projects</Link>
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-accent transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Projects
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              {(project.images || []).slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setLightbox(img)} className={`overflow-hidden ${i === 0 ? 'col-span-2 h-72' : 'h-48'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge status={project.status} />
              <span className="text-xs text-[var(--color-text-secondary)] tracking-widest uppercase">{project.type}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">{project.title}</h1>

            <div className="flex flex-wrap gap-5 text-sm text-[var(--color-text-secondary)] mb-8">
              {project.location && <span className="flex items-center gap-1.5"><MapPin size={14} />{project.location}</span>}
              {project.area && <span className="flex items-center gap-1.5"><Maximize size={14} />{project.area}</span>}
              {project.bedrooms && <span className="flex items-center gap-1.5"><BedDouble size={14} />{project.bedrooms} BHK</span>}
              {project.price && <span className="text-accent font-semibold">{project.price}</span>}
            </div>

            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">{project.description}</p>

            {project.features?.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-semibold mb-4">Features & Amenities</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar form */}
          <div>
            <div className="bg-surface border border-border p-6 sticky top-24">
              <h3 className="font-display text-xl font-semibold mb-1">Enquire About This Project</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mb-6">Our team will get back to you within 24 hours.</p>
              <EnquiryForm projectId={project._id} projectTitle={project.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X size={24} />
            </button>
            <motion.img
              src={lightbox}
              alt=""
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
