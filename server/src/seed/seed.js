import 'dotenv/config';
import mongoose from 'mongoose';
import SiteConfig  from '../models/SiteConfig.model.js';
import Project     from '../models/Project.model.js';
import Testimonial from '../models/Testimonial.model.js';
import TeamMember  from '../models/TeamMember.model.js';

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // SiteConfig (singleton)
  if (!(await SiteConfig.findOne())) {
    await SiteConfig.create({
      companyName: 'QuadriBuilders',
      tagline: 'Engineering Excellence. Architectural Vision.',
      description: 'QuadriBuilders is a premium construction and real estate development company delivering landmark residential and commercial projects.',
      phone: ['+91 98765 43210'],
      email: ['info@quadribuilders.com', 'leads@quadribuilders.com'],
      address: 'QuadriBuilders HQ, Hyderabad, Telangana, India',
      hero: {
        headline: "Building Tomorrow's Landmarks",
        subheadline: 'Premium construction and real estate development across Hyderabad',
        ctaText: 'View Our Projects',
        ctaLink: '/projects',
        backgroundImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80',
      },
      stats: [
        { label: 'Projects Completed', value: '120+' },
        { label: 'Years of Experience', value: '15+' },
        { label: 'Cities', value: '4' },
        { label: 'Happy Clients', value: '300+' },
      ],
      seo: {
        metaTitle: 'QuadriBuilders — Engineering Excellence. Architectural Vision.',
        metaDescription: 'Premium construction and real estate development in Hyderabad.',
      },
    });
    console.log('✓ SiteConfig created');
  } else {
    console.log('– SiteConfig already exists, skipping');
  }

  // Projects
  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany([
      {
        title: 'Skyline Residences', slug: 'skyline-residences',
        type: 'residential', status: 'completed', isListed: true,
        price: '₹1.2 Cr onwards', location: 'Banjara Hills, Hyderabad',
        area: '2400 sq ft', bedrooms: 3,
        shortDescription: 'Luxury 3BHK apartments with panoramic city views in the heart of Banjara Hills.',
        description: 'Skyline Residences is a 24-storey premium residential tower offering 3 and 4 BHK apartments with world-class amenities including rooftop pool, gym, and concierge services.',
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
        features: ['Rooftop Pool', 'Smart Home', '24/7 Security', 'Club House', 'EV Charging'],
        isFeatured: true, order: 1,
      },
      {
        title: 'Nexus Commercial Hub', slug: 'nexus-commercial-hub',
        type: 'commercial', status: 'ongoing', isListed: false,
        location: 'HITEC City, Hyderabad', area: '85,000 sq ft',
        shortDescription: 'Grade-A commercial complex designed for tech companies and co-working spaces.',
        description: 'Nexus Commercial Hub is a next-generation office complex in HITEC City featuring floor plates of 12,000 sq ft, triple-glazed curtain walls, and LEED Gold certification.',
        images: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
        features: ['LEED Gold', 'Grade-A Specs', 'Fiber Ready', 'Basement Parking', 'DG Backup'],
        isFeatured: true, order: 2,
      },
      {
        title: 'Verdant Villas', slug: 'verdant-villas',
        type: 'residential', status: 'upcoming', isListed: true,
        price: '₹3.5 Cr onwards', location: 'Shamirpet, Hyderabad',
        area: '4200 sq ft', bedrooms: 4,
        shortDescription: 'Exclusive gated villa community surrounded by 40 acres of natural landscape.',
        description: 'Verdant Villas is an ultra-premium gated community of 48 independent villas, each with a private garden, plunge pool, and direct access to a central clubhouse and nature trails.',
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'],
        features: ['Private Pool', 'Smart Home', 'Nature Trails', 'Clubhouse', '3-Car Garage'],
        isFeatured: true, order: 3,
      },
    ]);
    console.log('✓ 3 projects created');
  } else {
    console.log(`– Projects already exist, skipping`);
  }

  // Testimonials
  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany([
      { name: 'Rahul Sharma', role: 'Homeowner, Banjara Hills', quote: 'QuadriBuilders delivered our home 2 months ahead of schedule without compromising on quality. Every detail was exactly as promised. Truly a premium experience.', rating: 5, isVisible: true, order: 1 },
      { name: 'Priya Mehta', role: 'Director, TechVentures Pvt Ltd', quote: 'We contracted QuadriBuilders for our 60,000 sq ft office fit-out. Their project management was flawless and the end result exceeded our expectations.', rating: 5, isVisible: true, order: 2 },
      { name: 'Suresh Reddy', role: 'Investor, Hyderabad', quote: 'I have invested in three QuadriBuilders projects. Their transparency, quality of construction, and on-time delivery make them the most trusted developer in Hyderabad.', rating: 5, isVisible: true, order: 3 },
    ]);
    console.log('✓ 3 testimonials created');
  } else {
    console.log('– Testimonials already exist, skipping');
  }

  // Team
  if ((await TeamMember.countDocuments()) === 0) {
    await TeamMember.insertMany([
      { name: 'Ahmed Quadri', role: 'Founder & Managing Director', bio: '25+ years of experience in construction and real estate development across South India.', order: 1 },
      { name: 'Fatima Quadri', role: 'Director — Design & Architecture', bio: 'IIT-trained architect with a passion for sustainable, human-centric design.', order: 2 },
      { name: 'Vikram Nair', role: 'Chief Projects Officer', bio: 'Led delivery of 80+ high-rise residential and commercial projects on time and within budget.', order: 3 },
    ]);
    console.log('✓ 3 team members created');
  } else {
    console.log('– Team members already exist, skipping');
  }

  await mongoose.disconnect();
  console.log('\nSeed complete.');
  process.exit(0);
};

run().catch((err) => { console.error(err); process.exit(1); });
