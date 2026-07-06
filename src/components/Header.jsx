import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useCart } from '../context/CartContext.jsx'
import { products } from '../data/products.js'

const links = [['New Arrivals', '/#new-arrivals'], ['Shop', '/shop'], ['About', '/about'], ['Donate', '/donate']]
const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const saved = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = saved
    }
  }
  return row[b.length]
}

function findSuggestions(query) {
  const needle = normalize(query)
  if (needle.length < 2) return []
  return products.map((product) => {
    const fields = [product.name, product.category, product.brand, product.colour, product.material]
    const score = Math.min(...fields.map((field) => {
      const value = normalize(field)
      if (value.includes(needle)) return value.startsWith(needle) ? 0 : 1
      const distance = Math.min(...field.toLowerCase().split(/\s+/).map((word) => editDistance(needle, normalize(word))))
      return distance <= Math.max(1, Math.floor(needle.length / 3)) ? 2 + distance : 99
    }))
    return { product, score }
  }).filter(({ score }) => score < 99)
    .sort((a, b) => a.score - b.score || a.product.name.localeCompare(b.product.name))
    .slice(0, 5).map(({ product }) => product)
}

export default function Header() {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const suggestions = findSuggestions(query)

  const submitSearch = (event) => {
    event.preventDefault()
    const value = query.trim()
    if (value) {
      setSearchFocused(false)
      navigate(`/shop?q=${encodeURIComponent(value)}`)
    }
  }

  return (
    <header className="site-header">
      <div className="container-page site-header__inner">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>
        <Logo className="site-logo" />
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {links.map(([label, to]) => <NavLink key={label} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}
        </nav>
        <div className="header-tools">
          <form className="header-search" onSubmit={submitSearch} role="search">
            <input
              className="site-search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
              placeholder="Search..."
              aria-label="Search products"
              role="combobox"
              aria-expanded={searchFocused && suggestions.length > 0}
              aria-controls="search-suggestions"
              autoComplete="off"
            />
            <button aria-label="Submit search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
            </button>
            {searchFocused && query.trim().length >= 2 && (
              <div className="search-suggestions" id="search-suggestions" role="listbox">
                {suggestions.length ? suggestions.map((product) => (
                  <button type="button" role="option" key={product.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { setQuery(product.name); setSearchFocused(false); navigate(`/product/${product.id}`) }}>
                    <span>{product.name}</span><small>{product.category} · ${product.price.toFixed(2)}</small>
                  </button>
                )) : <p>No close matches. Press search to view results.</p>}
              </div>
            )}
          </form>
          <Link to="/cart" className="bag-link" aria-label={`My Bag with ${itemCount} items`}>
            <img src="/icon-bag.png" alt="" className="bag-icon" />
            {itemCount > 0 && <span>{itemCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
