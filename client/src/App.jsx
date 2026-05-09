import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import { PageLoader } from './components/ui/Loader.jsx';

const Home          = lazy(() => import('./pages/Home.jsx'));
const Projects      = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Services      = lazy(() => import('./pages/Services.jsx'));
const Blog          = lazy(() => import('./pages/Blog.jsx'));
const BlogPost      = lazy(() => import('./pages/BlogPost.jsx'));
const About         = lazy(() => import('./pages/About.jsx'));
const Contact       = lazy(() => import('./pages/Contact.jsx'));

const AdminLogin    = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminLayout   = lazy(() => import('./pages/admin/AdminLayout.jsx'));

const PUBLIC_ROUTES = [
  { path: '/',                element: <Home /> },
  { path: '/projects',        element: <Projects /> },
  { path: '/projects/:slug',  element: <ProjectDetail /> },
  { path: '/services',        element: <Services /> },
  { path: '/blog',            element: <Blog /> },
  { path: '/blog/:slug',      element: <BlogPost /> },
  { path: '/about',           element: <About /> },
  { path: '/contact',         element: <Contact /> },
];

export default function App() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');

  return (
    <Suspense fallback={<PageLoader />}>
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {PUBLIC_ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*"     element={<AdminLayout />} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </Suspense>
  );
}
