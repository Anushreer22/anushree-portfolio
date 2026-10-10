import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'

export default function ProjectCard({ project }) {
  return (
    <article className={`project-card accent-${project.accent} ${project.featured ? 'project-featured' : ''}`}>
      <div className="project-card-top">
        <span className="project-number">{project.number} / 06</span>
        <span className="project-category">{project.category}</span>
      </div>
      <div className="project-art" aria-hidden="true">
        <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
        <div className="art-core"><span>{project.title.split(' ').map(w => w[0]).join('').slice(0, 3)}</span></div>
        <div className="art-spark spark-one" /><div className="art-spark spark-two" /><div className="art-spark spark-three" />
        <span className="art-caption">SELECTED WORK / {project.number}</span>
      </div>
      <div className="project-body">
        <h3>{project.title}<ArrowUpRight size={18} /></h3>
        <p>{project.description}</p>
        <div className="project-details">{project.details.map(item => <span key={item}>{item}</span>)}</div>
        <div className="tag-list">{project.stack.map(item => <span key={item}>{item}</span>)}</div>
        <div className="project-actions">
          {project.link
            ? <a href={project.link} target="_blank" rel="noreferrer"><Github size={15} /> View code <ExternalLink size={13} /></a>
            : <span className="link-placeholder"><Github size={15} /> Add GitHub URL</span>}
        </div>
      </div>
    </article>
  )
}