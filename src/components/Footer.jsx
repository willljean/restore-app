import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-page footer-grid">
        <div><Logo className="site-logo" /><p>Recycle. Rewear. Restore.</p></div>
        <div><h3>SHOP</h3><Link to="/#new-arrivals">New Arrivals</Link><Link to="/shop">Shop</Link></div>
        <div><h3>RESTORE</h3><Link to="/about">About</Link><Link to="/donate">Donate</Link></div>
        <div><h3>YOUR ORDER</h3><Link to="/cart">My Bag</Link></div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Restore</div>
    </footer>
  )
}
