import { motion } from 'framer-motion';

export default function Loader({ size = 'md', className = '' }) {
  const s = size === 'sm' ? 16 : size === 'lg' ? 48 : 32;
  return (
    <motion.div
      className={`inline-block border-2 border-border border-t-accent rounded-full ${className}`}
      style={{ width: s, height: s }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}
