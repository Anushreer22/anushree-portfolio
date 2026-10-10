import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Github, Linkedin, Mail, MapPin,
  Download, Sparkles, Code2, Terminal, Braces, Send, Check, Copy, ExternalLink,
  BriefcaseBusiness, GraduationCap, GitPullRequest, Menu, Heart
} from 'lucide-react'
import Navbar from './components/Navbar'
import SectionHeading from './components/SectionHeading'
import ProjectCard from './components/ProjectCard'
import ContactForm from './components/ContactForm'
import { skills, projects as defaultProjects, experience, achievements } from './data/portfolio'
import { fetchProjects } from './services/api'

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

function Reveal({ children, className = '' }) {
  return <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }}>{children}</motion.div>
}

function App() {
  const [filter, setFilter] = useState('All')
  const [copied, setCopied] = useState(false)
  const [projectsList, setProjectsList] = useState(defaultProjects)

  useEffect(() => {
    // Optional integration: fetch projects dynamically if enabled via environment flag
    if (import.meta.env.VITE_USE_PROJECTS_API === 'true') {
      fetchProjects().then((apiProjects) => {
        if (apiProjects && Array.isArray(apiProjects) && apiProjects.length > 0) {
          setProjectsList(apiProjects)
        }
      })
    }
  }, [])

  const categories = ['All', 'Full Stack', 'AI / ML', 'AI Agents']
  const filteredProjects = projectsList.filter(p => {
    if (filter === 'All') return true
    if (filter === 'Full Stack') return /FULL STACK|APIs/.test(p.category)
    if (filter === 'AI / ML') return /AI · HEALTHCARE|DATA · AI|GENAI/.test(p.category)
    return /AI AGENTS/.test(p.category)
  })

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('anushreer695@gmail.com')
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = 'mailto:anushreer695@gmail.com'
    }
  }

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <Navbar />
      <main>
        <section className="hero shell" id="home">
          <div className="hero-copy">
            <motion.div className="availability" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}>
              <span className="status-dot" /> OPEN TO INTERNSHIP OPPORTUNITIES
            </motion.div>
            <motion.p className="hero-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }}>HEY, I'M ANUSHREE <span>✳</span></motion.p>
            <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .65 }}>
              I build things<br />for the <span className="gradient-text">real world.</span>
            </motion.h1>
            <motion.p className="hero-description" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .42 }}>
              AI & ML engineering student, full-stack developer, and open-source contributor. I turn complex problems into useful, thoughtful digital experiences.
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }}>
              <a className="button button-primary" href="#work">Explore my work <ArrowUpRight size={17} /></a>
              <a className="button button-quiet" href="/Anushree_Resume.pdf" target="_blank" rel="noreferrer"><Download size={16} /> View resume</a>
            </motion.div>
            <motion.div className="hero-socials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }}>
              <a href="https://github.com/Anushreer22" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
              <a href="https://linkedin.com/in/anushree-r-a05467374" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
              <a href="mailto:anushreer695@gmail.com" aria-label="Email"><Mail size={17} /></a>
              <span className="social-divider" /><span className="hero-location"><MapPin size={14} /> Bengaluru, India</span>
            </motion.div>
          </div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .25, duration: .8 }}>
            <div className="visual-grid" />
            <div className="visual-glow" />
            <div className="portrait-frame">
              <img src="/Anushree_Profile_Picture.png" alt="Portrait of Anushree" />
              <div className="portrait-shade" />
              <div className="portrait-label"><span className="label-dot" /> BUILDING WITH INTENTION</div>
            </div>
            <div className="floating-card code-float"><span className="float-icon"><Code2 size={16} /></span><span><b>Code with purpose</b><small>Design · Build · Improve</small></span></div>
            <div className="floating-card open-source-float"><span className="float-icon purple"><GitPullRequest size={17} /></span><span><b>191 merged PRs</b><small>Open-source contributor</small></span></div>
            <div className="orbit-ring ring-a" /><div className="orbit-ring ring-b" />
            <span className="visual-index">01 — PORTFOLIO / 2026</span>
          </motion.div>
          <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
        </section>

        <section className="ticker" aria-label="Areas of focus">
          <div className="ticker-track">{['FULL-STACK DEVELOPMENT', 'AI & AGENTIC SYSTEMS', 'OPEN SOURCE', 'PRODUCT THINKING', 'FULL-STACK DEVELOPMENT', 'AI & AGENTIC SYSTEMS', 'OPEN SOURCE', 'PRODUCT THINKING'].map((t, i) => <span key={`${t}-${i}`}>{t}<i>✳</i></span>)}</div>
        </section>

        <section className="section shell about-section" id="about">
          <Reveal><SectionHeading eyebrow="A LITTLE ABOUT ME" title={<>Curious mind.<br /><span className="muted-heading">Builder's mindset.</span></>} description="I enjoy the space where engineering, AI, and real-world problems meet." number="01" /></Reveal>
          <div className="about-grid">
            <Reveal className="about-story">
              <p className="lead-copy">I'm an AI & ML engineering student at <strong>NMIT, Bengaluru</strong>, graduating in 2028. I like taking ideas from a rough sketch to something people can actually use.</p>
              <p>From building full-stack platforms and AI-powered workflows to contributing to open-source projects, I learn by shipping, testing, and improving. I care about clean code, thoughtful user experiences, and technology that solves a real problem.</p>
              <p>Currently sharpening my foundations in data structures, algorithms, system design, and scalable application development.</p>
              <a className="text-link" href="#contact">Have a project in mind? <ArrowUpRight size={16} /></a>
            </Reveal>
            <Reveal className="about-side">
              <div className="about-note"><Sparkles size={19} /><div><b>What drives me</b><p>Turning “what if?” into a working prototype — and then making it better.</p></div></div>
              <div className="mini-stats">{achievements.map(a => <div className="mini-stat" key={a.label}><strong>{a.value}</strong><span>{a.label}</span><small>{a.note}</small></div>)}</div>
            </Reveal>
          </div>
        </section>

        <section className="section shell work-section" id="work">
          <Reveal><SectionHeading eyebrow="SELECTED PROJECTS" title={<>Less talking.<br /><span className="muted-heading">More building.</span></>} description="A selection of projects across full-stack engineering, AI, data, and agentic systems." number="02" /></Reveal>
          <div className="filter-row" role="group" aria-label="Filter projects">{categories.map(c => <button key={c} className={filter === c ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter(c)}>{c}</button>)}<span className="filter-count">{filteredProjects.length.toString().padStart(2, '0')} PROJECTS</span></div>
          <motion.div className="projects-grid" layout>{filteredProjects.map(project => <motion.div key={project.number} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}><ProjectCard project={project} /></motion.div>)}</motion.div>
          <p className="project-footnote"><span className="footnote-dot" /> Project links are intentionally left for you to add before publishing.</p>
        </section>

        <section className="section experience-section" id="experience">
          <div className="shell">
            <Reveal><SectionHeading eyebrow="WHERE I'VE GROWN" title={<>Experience that<br /><span className="muted-heading">keeps me learning.</span></>} description="Learning in public, collaborating with teams, and getting better with every build." number="03" /></Reveal>
            <div className="experience-layout">
              <div className="experience-intro"><div className="experience-icon"><BriefcaseBusiness size={23} /></div><p>Good engineering is more than writing code. It's asking better questions, collaborating clearly, and owning the details.</p><div className="experience-side-label">EXPERIENCE / 2024—2026</div></div>
              <div className="timeline">{experience.map((e, i) => <Reveal key={e.role} className="timeline-item"><div className="timeline-marker">{i === 0 ? <GitPullRequest size={16} /> : <BriefcaseBusiness size={16} />}</div><div className="timeline-date">{e.date}</div><h3>{e.role}</h3><div className="timeline-company">{e.company}</div><p>{e.description}</p><ul>{e.points.map(p => <li key={p}>{p}</li>)}</ul></Reveal>)}</div>
            </div>
          </div>
        </section>

        <section className="section shell skills-section" id="skills">
          <Reveal><SectionHeading eyebrow="MY TOOLKIT" title={<>Tools are tools.<br /><span className="muted-heading">Ideas are the point.</span></>} description="The technologies I use to explore ideas and build reliable products." number="04" /></Reveal>
          <div className="skills-grid">{skills.map((s, i) => <Reveal key={s.title} className="skill-card"><div className="skill-card-head"><span className="skill-icon">{[<Braces size={18} />, <Code2 size={18} />, <Terminal size={18} />, <Sparkles size={18} />][i]}</span><span className="skill-index">0{i + 1}</span></div><h3>{s.title}</h3><div className="skill-tags">{s.items.map(item => <span key={item}>{item}</span>)}</div></Reveal>)}</div>
        </section>

        <section className="section shell beyond-section">
          <Reveal><div className="beyond-card"><div className="beyond-glow" /><div className="beyond-copy"><span className="eyebrow"><span className="eyebrow-dot" /> OUTSIDE THE EDITOR</span><h2>Always learning.<br /><span className="gradient-text">Always curious.</span></h2><p>Solving DSA problems, exploring new ideas in AI, and collaborating with builders who care about making useful things.</p></div><div className="beyond-badges"><span><GraduationCap size={16} /> AI & ML @ NMIT</span><span><GitPullRequest size={16} /> Open source</span><span><Code2 size={16} /> 100+ LeetCode</span></div></div></Reveal>
        </section>

        <section className="section shell contact-section" id="contact">
          <Reveal><SectionHeading eyebrow="HAVE SOMETHING IN MIND?" title={<>Let's make<br /><span className="gradient-text">it happen.</span></>} description="Open to internship opportunities, meaningful collaborations, and interesting problems." number="05" /></Reveal>
          <div className="contact-grid">
            <Reveal className="contact-copy"><p>The best things often start with a conversation. If you're building something interesting or think we'd work well together, my inbox is open.</p><button className="email-copy" onClick={copyEmail}><span className="email-icon"><Mail size={18} /></span><span><small>DROP ME A LINE</small><b>anushreer695@gmail.com</b></span><span className="copy-icon">{copied ? <Check size={17} /> : <Copy size={17} />}</span></button><div className="contact-socials"><a href="https://github.com/Anushreer22" target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={14} /></a><a href="https://linkedin.com/in/anushree-r-a05467374" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={14} /></a></div></Reveal>
            <Reveal>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="footer shell"><a className="brand footer-brand" href="#home"><span className="brand-mark">A<span>.</span></span><span className="brand-name">ANUSHREE R<span className="brand-sub"> / DEVELOPER</span></span></a><span className="footer-note">DESIGNED WITH INTENTION. BUILT WITH CURIOSITY.</span><a className="back-top" href="#home">BACK TO TOP ↑</a><span className="footer-copy">© {new Date().getFullYear()} ANUSHREE R <Heart size={12} /></span></footer>
    </div>
  )
}

export default App