import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

const categories = [
  { name: 'Tops', icon: '/category-tops.png' },
  { name: 'Bottoms', icon: '/category-bottoms.png' },
  { name: 'Dresses', icon: '/category-dresses.png' },
  { name: 'Jackets', icon: '/category-jackets.png' },
  { name: 'Shoes', icon: '/category-shoes.png' },
  { name: 'Accessories', icon: '/category-accessories.png' },
]

export default function Home() {
  const arrivals = products.filter((product) => product.isNewArrival)
  const arrivalsRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const updateScrollButtons = () => {
    const rail = arrivalsRef.current
    if (!rail) return
    setCanScrollLeft(rail.scrollLeft > 4)
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4)
  }
  useEffect(() => {
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [])
  const scrollArrivals = (direction) => {
    arrivalsRef.current?.scrollBy({ left: direction * Math.min(arrivalsRef.current.clientWidth * 0.8, 900), behavior: 'smooth' })
  }

  return (
    <div className="home-page">
      <section className="new-hero">
        <div className="new-hero__copy">
          <h1 aria-label="Recycle. Rewear. Restore.">
            <span><em>RE</em>CYCLE</span>
            <span><em>RE</em>WEAR</span>
            <span><em>RE</em>STORE</span>
          </h1>
        </div>
        <img
          src="/restore-hero.png"
          alt="A curated rack of secondhand clothing"
        />
      </section>

      <section className="arrival-showcase" id="new-arrivals">
        <Link to="/shop?new=1" className="arrival-title">
          <span className="down-chevron" />
          <h2>NEW ARRIVALS</h2>
          <span className="down-chevron" />
        </Link>
        <div className="arrival-rail-wrap">
          {canScrollLeft && <button type="button" className="arrival-scroll arrival-scroll--left" onClick={() => scrollArrivals(-1)} aria-label="Scroll new arrivals left">‹</button>}
          <div className="arrival-cards" ref={arrivalsRef} onScroll={updateScrollButtons}>
            {arrivals.map((product) => <ProductCard key={product.id} product={product} hideQuickAdd />)}
          </div>
          {canScrollRight && <button type="button" className="arrival-scroll arrival-scroll--right" onClick={() => scrollArrivals(1)} aria-label="Scroll new arrivals right">›</button>}
        </div>
      </section>

      <section className="category-showcase">
        <div className="category-title">
          <span className="down-chevron" />
          <h2>SHOP BY CATEGORY</h2>
          <span className="down-chevron" />
        </div>
        <div className="home-link-grid container-page">
          {categories.map((category) => (
            <Link key={category.name} to={`/shop?category=${category.name}`}>
              <img src={category.icon} alt="" />
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
