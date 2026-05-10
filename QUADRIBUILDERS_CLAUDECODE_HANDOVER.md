# QuadriBuilders.com — Claude Code Handover Document
> Complete specification for building the QuadriBuilders construction company website.
> Hand this entire file to Claude Code as the first message.

## ⚠️ ABSOLUTE RULES — READ FIRST, NEVER BREAK

1. **pnpm ONLY, everywhere.** Use `pnpm` for every single install, script, and workspace command across client, server, and root. Never use `npm` or `yarn` — not even once, not even for a single package.
   - Scaffold client with: `pnpm create vite@latest client -- --template react`
   - Install packages with: `pnpm add <package>` (inside workspace) or `pnpm --filter client add <package>`
   - Run scripts with: `pnpm run <script>` or `pnpm --filter <workspace> <script>`

2. **NO git commands, ever.** Do not run `git init`, `git add`, `git commit`, `git push`, or any git command at any point. Do not create `.git` folders, do not stage files, do not make commits. The user manages all version control manually.

---

## 0. WHO YOU ARE BUILDING FOR

**Company:** QuadriBuilders  
**Domain:** quadribuilders.com  
**Industry:** Construction & Real Estate Development  
**Services:**
- Listed property sales
- Non-listed / off-market property enquiries
- Contract-based development (B2B)
- General construction projects

**Goal of the website:** Generate leads. Every page should funnel visitors toward a form submission — callback request, enquiry, or property interest.

---

## 1. TECH STACK (NON-NEGOTIABLE)

### Monorepo Structure
```
quadribuilders/
├── client/        # React app (Vite)
├── server/         # Express API
├── shared/          # Shared types/constants
├── package.json     # Root pnpm workspace
└── pnpm-workspace.yaml
```

### Client
- **React 18** + **Vite**
- **pnpm** (no npm, no yarn — ever)
- **Framer Motion** — page transitions, scroll animations, hero effects
- **Tailwind CSS v3** — utility styling
- **React Router v6** — client-side routing
- **React Hook Form + Zod** — form validation
- **Axios** — API calls to server
- **@tanstack/react-query** — server state, caching
- **Lucide React** — icons

### Server
- **Node.js + Express**
- **MongoDB + Mongoose** — all data storage
- **Nodemailer** — email notifications (SMTP, configurable)
- **Zod** — request validation
- **cors, helmet, express-rate-limit** — security
- **dotenv** — environment config
- **Morgan** — request logging

### CMS Strategy
No external CMS. All editable content lives in **MongoDB** and is managed via a **built-in `/admin` panel** (React, password-protected, no third-party dependency). This means:
- Zero monthly cost
- Full control
- Works in India without restrictions
- One codebase

### Hosting
- **Single VPS** — Express serves both the API and the built client as static files
- **No Vercel** — client is NOT deployed separately
- **VPS / PM2** for Express server (which also serves the client build)
- **MongoDB Atlas** (free 512MB tier) or self-hosted MongoDB on VPS

---

## 2. ENVIRONMENT VARIABLES

### server/.env
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/quadribuilders

# Email (SMTP — use Gmail App Password or any SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
EMAIL_TO=leads@quadribuilders.com
EMAIL_FROM="QuadriBuilders Website <no-reply@quadribuilders.com>"

# Admin Panel Auth
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_here

# CORS
ALLOWED_ORIGINS=https://quadribuilders.com,http://localhost:5173
```

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
VITE_SITE_NAME=QuadriBuilders
```
> In production the client is same-origin as the API, so `VITE_API_URL` becomes `/api`.
> The axios instance should fall back to `/api` when the env var is not set.

---

## 3. FOLDER STRUCTURE (COMPLETE)

```
quadribuilders/
├── pnpm-workspace.yaml
├── package.json                  # root scripts: dev, build, lint
│
├── client/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx               # Router setup + page transitions
│   │   ├── index.css             # CSS variables, Tailwind base
│   │   │
│   │   ├── config/
│   │   │   └── site.js           # fallback static config (loaded if API fails)
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── PageWrapper.jsx   # Framer Motion page transition wrapper
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── AnimatedText.jsx  # letter-by-letter or word reveal
│   │   │   │   ├── ScrollReveal.jsx  # Framer Motion scroll wrapper
│   │   │   │   └── Loader.jsx
│   │   │   ├── forms/
│   │   │   │   ├── CallbackForm.jsx
│   │   │   │   ├── EnquiryForm.jsx
│   │   │   │   ├── ListedPropertyForm.jsx
│   │   │   │   ├── UnlistedPropertyForm.jsx
│   │   │   │   └── ContractForm.jsx
│   │   │   └── sections/
│   │   │       ├── Hero.jsx
│   │   │       ├── Stats.jsx
│   │   │       ├── FeaturedProjects.jsx
│   │   │       ├── ServicesGrid.jsx
│   │   │       ├── Testimonials.jsx
│   │   │       └── CTABanner.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Projects.jsx          # filterable portfolio
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogPost.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── Dashboard.jsx     # leads overview
│   │   │       ├── EditSiteConfig.jsx
│   │   │       ├── ManageProjects.jsx
│   │   │       ├── ManageBlog.jsx
│   │   │       ├── ManageTeam.jsx
│   │   │       ├── ManageTestimonials.jsx
│   │   │       └── LeadsInbox.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSiteConfig.js      # fetches /api/config
│   │   │   └── useLeadSubmit.js
│   │   │
│   │   └── lib/
│   │       ├── api.js                # axios instance
│   │       └── utils.js
│   │
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── public/                       # ← built client lands here (git-ignored)
│   │   └── index.html                #   generated by `pnpm build`, served by Express
│   ├── src/
│   │   ├── index.js                  # Express app entry
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── models/
│   │   │   ├── SiteConfig.model.js
│   │   │   ├── Project.model.js
│   │   │   ├── Lead.model.js
│   │   │   ├── BlogPost.model.js
│   │   │   ├── TeamMember.model.js
│   │   │   └── Testimonial.model.js
│   │   ├── routes/
│   │   │   ├── config.routes.js      # GET /api/config (public)
│   │   │   ├── leads.routes.js       # POST /api/leads (public)
│   │   │   ├── projects.routes.js    # GET public, CRUD admin
│   │   │   ├── blog.routes.js
│   │   │   ├── team.routes.js
│   │   │   ├── testimonials.routes.js
│   │   │   └── admin.routes.js       # POST /api/admin/login
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT verify
│   │   │   └── validate.middleware.js
│   │   ├── services/
│   │   │   └── email.service.js      # Nodemailer logic
│   │   └── seed/
│   │       └── seed.js               # seeds default SiteConfig + sample data
│   └── package.json
│
└── shared/
    └── types.js                      # shared Zod schemas (optional)
```

---

## 4. MONGODB MODELS (COMPLETE SCHEMA)

### SiteConfig (singleton — only one document ever)
```js
{
  // Company Info
  companyName: String,
  tagline: String,
  description: String,        // used in meta tags
  phone: [String],            // array — can have multiple numbers
  email: [String],
  address: String,
  mapEmbedUrl: String,

  // Social Links
  social: {
    instagram: String,
    linkedin: String,
    facebook: String,
    twitter: String,
    youtube: String,
  },

  // Hero Section
  hero: {
    headline: String,         // e.g. "Building Tomorrow's Landmarks"
    subheadline: String,
    ctaText: String,
    ctaLink: String,
    backgroundImage: String,  // URL
  },

  // Stats Bar
  stats: [{ label: String, value: String }],
  // e.g. [{ label: "Projects Completed", value: "120+" }]

  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    ogImage: String,
  },

  // Admin
  updatedAt: Date,
}
```

### Project
```js
{
  title: String,
  slug: String,               // auto-generated from title
  type: {
    type: String,
    enum: ['residential', 'commercial', 'contract', 'mixed-use']
  },
  status: {
    type: String,
    enum: ['completed', 'ongoing', 'upcoming']
  },
  isListed: Boolean,          // available for sale/enquiry?
  price: String,              // optional, e.g. "₹1.2 Cr onwards"
  location: String,
  area: String,               // e.g. "2400 sq ft"
  bedrooms: Number,           // optional
  description: String,
  shortDescription: String,
  images: [String],           // array of image URLs
  features: [String],
  isFeatured: Boolean,
  order: Number,              // for manual sorting
  createdAt: Date,
}
```

### Lead
```js
{
  type: {
    type: String,
    enum: ['callback', 'enquiry', 'listed-property', 'unlisted-property', 'contract']
  },
  name: String,
  phone: String,
  email: String,
  message: String,

  // For callback
  preferredTime: String,

  // For listed/unlisted property
  projectId: ObjectId,        // ref to Project (if listed)
  propertyDescription: String, // if unlisted
  budget: String,
  location: String,           // desired location

  // For contract
  companyName: String,
  projectScope: String,
  timeline: String,

  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'closed'],
    default: 'new'
  },
  notes: String,              // admin can add notes
  emailSent: Boolean,
  createdAt: Date,
}
```

### BlogPost
```js
{
  title: String,
  slug: String,
  excerpt: String,
  content: String,            // HTML or Markdown
  coverImage: String,
  author: String,
  tags: [String],
  isPublished: Boolean,
  publishedAt: Date,
  createdAt: Date,
}
```

### TeamMember
```js
{
  name: String,
  role: String,
  bio: String,
  photo: String,
  order: Number,
  linkedin: String,
}
```

### Testimonial
```js
{
  name: String,
  role: String,               // e.g. "Homeowner, Banjara Hills"
  quote: String,
  photo: String,
  rating: Number,             // 1–5
  projectId: ObjectId,        // optional ref
  isVisible: Boolean,
  order: Number,
}
```

---

## 5. API ROUTES

### Public Routes
```
GET  /api/config                        → Full SiteConfig
GET  /api/projects                      → All published projects (filter: ?type=residential&status=completed&featured=true)
GET  /api/projects/:slug                → Single project
GET  /api/blog                          → Published posts (?tag=xyz)
GET  /api/blog/:slug                    → Single post
GET  /api/team                          → All team members
GET  /api/testimonials                  → Visible testimonials

POST /api/leads                         → Submit any lead form (type in body)
```

### Admin Routes (JWT protected)
```
POST /api/admin/login                   → Returns JWT token

GET  /api/admin/leads                   → All leads (filter: ?type=callback&status=new)
PUT  /api/admin/leads/:id               → Update lead status/notes

PUT  /api/admin/config                  → Update SiteConfig

GET/POST/PUT/DELETE /api/admin/projects
GET/POST/PUT/DELETE /api/admin/blog
GET/POST/PUT/DELETE /api/admin/team
GET/POST/PUT/DELETE /api/admin/testimonials
```

---

## 6. PAGES & SECTIONS SPEC

### Home Page
1. **Navbar** — Logo left, links center, "Get in Touch" CTA button right. Transparent on hero, solid on scroll.
2. **Hero** — Full viewport. Bold headline (animated word-by-word reveal with Framer Motion). Background: dark architectural image with grain overlay. Two CTAs: "View Projects" + "Request Callback"
3. **Stats Bar** — Horizontal strip: Projects Completed / Years of Experience / Cities / Clients. Counter animation on scroll-enter.
4. **Services Grid** — 4 cards: Listed Properties / Off-Market / Contract Development / General Construction. Each with icon, title, short description, hover animation.
5. **Featured Projects** — 3–4 cards from `isFeatured: true` projects. Filter tabs: All / Residential / Commercial.
6. **Why QuadriBuilders** — 3-column asymmetric layout. Bold numbers + short statements.
7. **Testimonials** — Horizontal scroll carousel, Framer Motion drag.
8. **CTA Banner** — Full-width dark section. "Ready to Build?" + form trigger button.
9. **Footer** — Links, contact info (from SiteConfig), social icons.

### Projects Page
- Filter bar: All / Residential / Commercial / Contract / Listed Only
- Masonry or grid layout
- Each card: image, title, location, status badge, price (if listed), "View Details" →

### Project Detail Page
- Image gallery (Framer Motion lightbox)
- Full description, features list
- Enquiry form sidebar (pre-filled with project name)

### Services Page
- One section per service with full description
- Each ends with relevant form CTA

### Blog Page
- Grid of posts with cover image, tag, excerpt
- Individual post page with full content

### About Page
- Company story
- Team grid (from TeamMember collection)
- Values / philosophy section

### Contact Page
- Form type selector: Callback / Enquiry / Listed Property / Unlisted Property / Contract
- Form fields change based on type selection (conditional rendering)
- Contact info pulled from SiteConfig

### Admin Panel (`/admin`)
- Login page (JWT, stored in localStorage)
- Sidebar navigation
- Dashboard: lead counts by type/status, recent submissions
- Edit Site Config: all fields in a form, save button
- Projects: table + add/edit modal with image upload
- Blog: rich text editor (use `@uiw/react-md-editor`)
- Team / Testimonials: simple CRUD tables
- Leads Inbox: table, click to expand, update status, add notes

---

## 7. DESIGN SYSTEM

### Aesthetic Direction
**Bold & Modern Architectural**
- Sharp edges, strong grid, high contrast
- Feels like a premium architecture firm, not a generic contractor

### Colors (CSS Variables)
```css
:root {
  --color-bg: #0a0a0a;           /* near black */
  --color-surface: #111111;      /* card/panel bg */
  --color-border: #222222;
  --color-text-primary: #f5f5f0; /* warm white */
  --color-text-secondary: #888880;
  --color-accent: #ffbd59;       /* architectural gold */
  --color-accent-hover: #ffd080;
  --color-danger: #E53E3E;
  --color-success: #38A169;
}
```

### Typography
```css
/* Display: Cormorant Garamond — editorial, architectural gravitas */
/* Body: DM Sans — clean, modern, readable */

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

--font-display: 'Cormorant Garamond', serif;
--font-body: 'DM Sans', sans-serif;
```

### Framer Motion Patterns
```js
// Page transition wrapper
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10 }
}

// Scroll reveal (use with whileInView)
const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

// Stagger container
const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } }
}

// Hero headline word-by-word
// Split headline string into words, map each to a motion.span with delay
```

### Tailwind Config Additions
```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      accent: '#ffbd59',
      surface: '#111111',
    },
    fontFamily: {
      display: ['Cormorant Garamond', 'serif'],
      body: ['DM Sans', 'sans-serif'],
    },
  }
}
```

---

## 8. LEAD FORM BEHAVIOR

When any form is submitted:
1. POST to `/api/leads` with `type` field + all form data
2. Backend validates with Zod
3. Backend saves Lead to MongoDB
4. Backend sends email via Nodemailer to `EMAIL_TO` with all lead details formatted nicely
5. Frontend shows success state (Framer Motion checkmark animation)
6. Lead appears in Admin → Leads Inbox with status `new`

### Email Template (plain text is fine, or HTML)
```
New Lead — QuadriBuilders
Type: Callback Request
Name: Rahul Sharma
Phone: +91 98765 43210
Preferred Time: Evening
Submitted: 10 May 2025, 4:32 PM
```

---

## 9. IMAGE HANDLING

For MVP, images are stored as **URLs** (external hosting or Cloudinary free tier).

Add to `.env`:
```env
# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

In admin panel, image fields accept either:
- A URL pasted manually (simplest)
- File upload → uploaded to Cloudinary → URL stored in MongoDB

---

## 10. BUILD & RUN COMMANDS

```bash
# Root package.json scripts
"dev":   "concurrently \"pnpm --filter client dev\" \"pnpm --filter server dev\"",
"build": "pnpm --filter client build",   # outputs directly to server/public/
"seed":  "pnpm --filter server seed",
"start": "pnpm --filter server start"     # prod: node src/index.js via PM2

# Setup
pnpm install          # installs all workspaces
pnpm run seed         # seeds MongoDB with default SiteConfig + sample data
pnpm run dev          # starts Vite dev server (5173) + Express API (5000)

# Production
pnpm run build        # compiles client → server/public/
pnpm run start        # Express serves API on /api/* AND static client on /*
```

### vite.config.js — outDir
```js
export default defineConfig({
  build: {
    outDir: '../server/public',
    emptyOutDir: true,
  },
})
```

### Express static serving (server/src/index.js)
```js
// After all /api routes — order matters
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
```

### .gitignore additions
```
server/public/
```

---

## 11. SEED DATA (Default SiteConfig)

The seed script should create this document in MongoDB on first run:

```json
{
  "companyName": "QuadriBuilders",
  "tagline": "Engineering Excellence. Architectural Vision.",
  "description": "QuadriBuilders is a premium construction and real estate development company delivering landmark residential and commercial projects.",
  "phone": ["+91 98765 43210"],
  "email": ["info@quadribuilders.com", "leads@quadribuilders.com"],
  "address": "QuadriBuilders HQ, Hyderabad, Telangana, India",
  "hero": {
    "headline": "Building Tomorrow's Landmarks",
    "subheadline": "Premium construction and real estate development across Hyderabad",
    "ctaText": "View Our Projects",
    "ctaLink": "/projects"
  },
  "stats": [
    { "label": "Projects Completed", "value": "120+" },
    { "label": "Years of Experience", "value": "15+" },
    { "label": "Cities", "value": "4" },
    { "label": "Happy Clients", "value": "300+" }
  ]
}
```

---

## 12. DEPLOYMENT

### Single VPS — Express serves everything
Frontend and server are deployed together. No Vercel. No separate client hosting.

```bash
# On VPS
git clone your-repo
cd quadribuilders

# Install all workspaces
pnpm install

# Build client → outputs to server/public/
pnpm run build

# Seed database (first deploy only)
pnpm run seed

# Start Express (serves API + static client)
pm2 start server/src/index.js --name quadribuilders
pm2 save
```

```
# nginx — proxy all traffic to Express on port 5000
# Express handles:
#   /api/*  → API routes
#   /*      → serves server/public/index.html (SPA catch-all)
#
# SSL via certbot
```

### Re-deploy after client changes
```bash
pnpm run build    # rebuilds client into server/public/
pm2 restart quadribuilders
```

---

## 13. INSTRUCTIONS FOR CLAUDE CODE

Build this project in this exact order:

1. **Monorepo setup** — pnpm workspaces, root package.json, concurrently dev script
2. **Backend foundation** — Express app, MongoDB connection, env config, middleware; wire up `express.static('../public')` + SPA catch-all from the start (behind all `/api` routes)
3. **All Mongoose models** — as specified in Section 4
4. **Seed script** — default SiteConfig + 3 sample projects + 2 testimonials
5. **All API routes** — public first, then admin with JWT middleware
6. **Email service** — Nodemailer with formatted HTML email template
7. **Frontend setup** — Vite + React + Tailwind + Framer Motion + React Router
8. **Design system** — CSS variables, fonts, Tailwind config, base components
9. **Layout components** — Navbar (transparent→solid on scroll), Footer
10. **Page components** — Home first (all sections), then Projects, Contact, About, Services, Blog
11. **Forms** — all 5 form types with validation and API integration
12. **Admin panel** — Login → Dashboard → all CRUD pages
13. **Polish** — Framer Motion page transitions, scroll animations, mobile responsive

**Design rules to follow:**
- Dark theme only (`#0a0a0a` background)
- Font: Cormorant Garamond for headings, DM Sans for body
- Accent color: `#ffbd59` (gold) for CTAs, highlights, borders
- NO purple gradients, NO Inter font, NO generic layouts
- Every section should feel architectural — bold type, strong grid, intentional whitespace
- Framer Motion on: page load hero, scroll reveals, counter animations, form success states, project card hovers
- All text content (phone, email, hero copy, stats) must come from the SiteConfig API call — never hardcoded in components

---

*End of handover document. This file contains everything needed to build quadribuilders.com from scratch.*
