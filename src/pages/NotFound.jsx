import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-3xl font-medium text-navy mb-2">Page not found</h1>
      <p className="text-black mb-6">We couldn't find what you were looking for.</p>
      <Link to="/" className="text-leaf font-semibold hover:underline">
        Back to Home
      </Link>
    </div>
  )
}
