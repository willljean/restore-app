import React from 'react'
import { Link } from 'react-router-dom'

export default function Logo({ className = 'h-8' }) {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Restore home">
      <img src="/logo.svg" alt="Restore logo" className={className} />
    </Link>
  )
}
