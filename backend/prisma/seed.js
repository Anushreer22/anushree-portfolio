import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const initialProjects = [
  {
    number: '01',
    slug: 'all-india-villages-api',
    category: 'APIs · FULL STACK',
    title: 'All India Villages API',
    description: 'A searchable API platform for Indian villages, built around a normalized database and fast location lookup.',
    details: ['457K+ village records', 'API-key authentication', 'PostgreSQL + Prisma'],
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'React'],
    githubUrl: null,
    liveDemoUrl: null,
    featured: true,
    published: true,
    accent: 'violet',
  },
  {
    number: '02',
    slug: 'ai-health-diagnostics',
    category: 'AI · HEALTHCARE',
    title: 'AI Health Diagnostics',
    description: 'A full-stack health analytics platform combining multiple machine-learning models with an OCR pipeline and monitoring dashboard.',
    details: ['3-model pipeline', '~95% OCR accuracy', '5-tab dashboard'],
    stack: ['Python', 'Flask', 'PyPDF2', 'Pandas', 'Plotly'],
    githubUrl: null,
    liveDemoUrl: null,
    featured: true,
    published: true,
    accent: 'pink',
  },
  {
    number: '03',
    slug: 'smart-waste-management',
    category: 'FULL STACK · CIVIC TECH',
    title: 'Smart Waste Management',
    description: 'A real-time role-based platform for coordinating waste-management operations and improving reporting workflows.',
    details: ['Role-based access', 'Realtime updates', 'Operations dashboard'],
    stack: ['React', 'Firebase', 'Node.js'],
    githubUrl: null,
    liveDemoUrl: null,
    featured: false,
    published: true,
    accent: 'green',
  },
  {
    number: '04',
    slug: 'merchant-agent-os',
    category: 'AI AGENTS · HACKATHON',
    title: 'Merchant Agent OS',
    description: 'A multi-service marketplace where autonomous agents discover, evaluate, and pay for services with human-in-the-loop approval.',
    details: ['5-service architecture', 'Budget management', 'Spend approval flow'],
    stack: ['React', 'TypeScript', 'Node.js', 'Hono', 'Algorand'],
    githubUrl: null,
    liveDemoUrl: null,
    featured: true,
    published: true,
    accent: 'blue',
  },
  {
    number: '05',
    slug: 'campusmind',
    category: 'DATA · AI',
    title: 'CampusMind',
    description: 'A smart campus assistant using a medallion data architecture and natural-language Q&A grounded in curated data.',
    details: ['12+ REST endpoints', 'Bronze / Silver / Gold', '10+ passing tests'],
    stack: ['React', 'TypeScript', 'Databricks', 'Genie AI'],
    githubUrl: null,
    liveDemoUrl: null,
    featured: false,
    published: true,
    accent: 'orange',
  },
  {
    number: '06',
    slug: 'careercompass-ai',
    category: 'RESPONSIBLE GENAI',
    title: 'CareerCompass AI',
    description: 'A career navigator that maps transferable skills into a practical, constraint-aware 90-day learning plan.',
    details: ['Skill mapping', 'Personalized roadmap', 'Responsible GenAI'],
    stack: ['AWS PartyRock', 'Generative AI'],
    githubUrl: null,
    liveDemoUrl: null,
    featured: false,
    published: true,
    accent: 'pink',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Projects
  for (const projectData of initialProjects) {
    const upserted = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {
        number: projectData.number,
        title: projectData.title,
        category: projectData.category,
        description: projectData.description,
        details: projectData.details,
        stack: projectData.stack,
        githubUrl: projectData.githubUrl,
        liveDemoUrl: projectData.liveDemoUrl,
        featured: projectData.featured,
        published: projectData.published,
        accent: projectData.accent,
      },
      create: projectData,
    });
    console.log(`  ✓ Project seeded: ${upserted.title} (${upserted.slug})`);
  }

  // 2. Seed Initial Admin User if configured
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
  const adminName = process.env.INITIAL_ADMIN_NAME || 'Anushree R';

  if (adminEmail && adminPassword) {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    const admin = await prisma.adminUser.upsert({
      where: { email: adminEmail.toLowerCase().trim() },
      update: {
        name: adminName,
        passwordHash,
      },
      create: {
        email: adminEmail.toLowerCase().trim(),
        name: adminName,
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log(`  ✓ Initial admin account seeded: ${admin.email}`);
  } else {
    console.log('  ℹ No INITIAL_ADMIN_EMAIL/PASSWORD found in environment; skipped admin seeding.');
    console.log('    You can run `npm run admin:create` anytime to create an admin account.');
  }

  console.log('✅ Seed completed successfully.');
}

main()
  .catch((err) => {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

