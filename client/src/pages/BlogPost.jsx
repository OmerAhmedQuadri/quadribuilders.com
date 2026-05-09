import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ArrowLeft } from 'lucide-react';
import api from '../lib/api.js';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import { PageLoader } from '../components/ui/Loader.jsx';
import { formatDate } from '../lib/utils.js';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.get(`/blog/${slug}`).then((r) => r.data),
  });

  if (isLoading) return <PageLoader />;
  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-[var(--color-text-secondary)] mb-4">Post not found.</p>
        <Link to="/blog" className="btn-outline">Back to Blog</Link>
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <div className="pt-28 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-accent transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="w-full h-72 object-cover mb-8" />
        )}
        <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] mb-6">
          <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(post.publishedAt)}</span>
          <span>By {post.author}</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold mb-8">{post.title}</h1>
        <div
          className="prose prose-invert prose-sm max-w-none text-[var(--color-text-secondary)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </PageWrapper>
  );
}
