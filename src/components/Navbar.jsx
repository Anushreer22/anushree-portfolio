import { useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const links = [
  ['About', '#about'],
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Skills', '#skills'],
  ['Contact', '#contact'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav-wrap">
      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="Anushree home">
          <span className="brand-mark">A<span>.</span></span>
          <span className="brand-name">ANUSHREE R<span className="brand-sub"> / DEVELOPER</span></span>
        </a>
        <div className="nav-links">
          {links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </div>
        <a className="nav-cta" href="#contact">Let's talk <ArrowUpRight size={15} /></a>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>
      {open && <div className="mobile-menu">{links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a href="#contact" onClick={() => setOpen(false)}>Let's talk ↗</a></div>}
    </header>
  )
}