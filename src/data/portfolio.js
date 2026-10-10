export const skills = [
  { title: 'Languages', items: ['Python', 'C', 'Core Java', 'JavaScript', 'TypeScript'] },
  { title: 'Frontend & APIs', items: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'FastAPI', 'REST APIs'] },
  { title: 'Data & Cloud', items: ['PostgreSQL', 'MongoDB', 'Firebase', 'Prisma ORM', 'Databricks', 'AWS', 'Docker'] },
  { title: 'Core CS & AI', items: ['DSA', 'OOP', 'Operating Systems', 'LLMs', 'Agentic AI', 'Prompt Engineering', 'CI/CD'] },
]

export const projects = [
  {
    number: '01',
    category: 'APIs · FULL STACK',
    title: 'All India Villages API',
    description: 'A searchable API platform for Indian villages, built around a normalized database and fast location lookup.',
    details: ['457K+ village records', 'API-key authentication', 'PostgreSQL + Prisma'],
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'React'],
    link: '',
    featured: true,
    accent: 'violet',
  },
  {
    number: '02',
    category: 'AI · HEALTHCARE',
    title: 'AI Health Diagnostics',
    description: 'A full-stack health analytics platform combining multiple machine-learning models with an OCR pipeline and monitoring dashboard.',
    details: ['3-model pipeline', '~95% OCR accuracy', '5-tab dashboard'],
    stack: ['Python', 'Flask', 'PyPDF2', 'Pandas', 'Plotly'],
    link: '',
    featured: true,
    accent: 'pink',
  },
  {
    number: '03',
    category: 'FULL STACK · CIVIC TECH',
    title: 'Smart Waste Management',
    description: 'A real-time role-based platform for coordinating waste-management operations and improving reporting workflows.',
    details: ['Role-based access', 'Realtime updates', 'Operations dashboard'],
    stack: ['React', 'Firebase', 'Node.js'],
    link: '',
    featured: false,
    accent: 'green',
  },
  {
    number: '04',
    category: 'AI AGENTS · HACKATHON',
    title: 'Merchant Agent OS',
    description: 'A multi-service marketplace where autonomous agents discover, evaluate, and pay for services with human-in-the-loop approval.',
    details: ['5-service architecture', 'Budget management', 'Spend approval flow'],
    stack: ['React', 'TypeScript', 'Node.js', 'Hono', 'Algorand'],
    link: '',
    featured: true,
    accent: 'blue',
  },
  {
    number: '05',
    category: 'DATA · AI',
    title: 'CampusMind',
    description: 'A smart campus assistant using a medallion data architecture and natural-language Q&A grounded in curated data.',
    details: ['12+ REST endpoints', 'Bronze / Silver / Gold', '10+ passing tests'],
    stack: ['React', 'TypeScript', 'Databricks', 'Genie AI'],
    link: '',
    featured: false,
    accent: 'orange',
  },
  {
    number: '06',
    category: 'RESPONSIBLE GENAI',
    title: 'CareerCompass AI',
    description: 'A career navigator that maps transferable skills into a practical, constraint-aware 90-day learning plan.',
    details: ['Skill mapping', 'Personalized roadmap', 'Responsible GenAI'],
    stack: ['AWS PartyRock', 'Generative AI'],
    link: '',
    featured: false,
    accent: 'pink',
  },
]

export const experience = [
  {
    date: 'MAY 2026 — AUG 2026',
    role: 'Open Source Software Engineer',
    company: 'GirlScript Summer of Code · Remote',
    description: 'Contributed across 11 open-source projects, collaborated with maintainers through code review, and worked through unfamiliar codebases to resolve issues.',
    points: ['191 merged pull requests', 'Ranked #132 globally (Top 1%, as listed on resume)', 'Elite and Power Contributor badges'],
  },
  {
    date: 'NOV 2024 — JAN 2025',
    role: 'Software Engineering Intern — AI/ML',
    company: 'Infosys Springboard · Remote',
    description: 'Worked on an agentic AI pipeline for clinical diagnostics, REST APIs, and an OCR workflow in an Agile/Scrum environment.',
    points: ['3-model agentic AI pipeline using Python and Flask', 'OCR pipeline reported at ~95% accuracy', 'Participated in code reviews and design discussions'],
  },
]

export const achievements = [
  { value: '191', label: 'Merged PRs', note: 'GSSoC 2026' },
  { value: '11', label: 'Open-source projects', note: 'Cross-project contributions' },
  { value: '100+', label: 'LeetCode problems', note: 'DSA practice' },
  { value: '8.98', label: 'CGPA / 10', note: 'B.E. AI & ML' },
]