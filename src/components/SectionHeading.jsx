export default function SectionHeading({ eyebrow, title, description, number }) {
  return (
    <div className="section-heading">
      <div className="section-heading-top">
        <span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span>
        {number && <span className="section-number">{number}</span>}
      </div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}