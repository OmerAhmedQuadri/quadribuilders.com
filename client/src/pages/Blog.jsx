import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Tag } from 'lucide-react';
import api from '../lib/api.js';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import ScrollReveal, { StaggerContainer } from '../components/ui/ScrollReveal.jsx';
import Loader from '../components/ui/Loader.jsx';
import { formatDate } from '../lib/utils.js';

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog'],
    queryFn: () => api.get('/blog').then((r) => r.data),
  });

  return (
    <PageWrapper>
      <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-12">
          <p className="section-label mb-4">Insights</p>
          <h1 className="section-title">Blog & News</h1>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader size="lg" /></div>
        ) : posts.length === 0 ? (
          <p className="text-[var(--color-text-secondary)] py-20 text-center">No posts published yet. Check back soon.</p>
        ) : (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {posts.map((post) => (
              <ScrollReveal key={post._id}>
                <Link to={`/blog/${post.slug}`} className="group block bg-[#0a0a0a]">
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] mb-3">
                      <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(post.publishedAt)}</span>
                      {post.tags?.[0] && <span className="flex items-center gap-1 text-accent"><Tag size={11} />{post.tags[0]}</span>}
                    </div>
                    <h2 className="font-display text-xl font-semibold mb-2 group-hover:text-accent transition-colors">{post.title}</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </StaggerContainer>
        )}
      </div>
    </PageWrapper>
  );
}
