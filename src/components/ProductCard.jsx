import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product, showQuickAdd = false, hideQuickAdd = false }) {
  const { addItem, items } = useCart()
  const isInBag = items.some((item) => item.id === product.id)

  const addToBag = () => {
    if (!isInBag) addItem(product)
  }

  return (
    <article className={`product-tile${showQuickAdd ? ' product-tile--shop' : ''}`}>
      <Link to={`/product/${product.id}`} className="product-tile__link">
        <div className="product-tile__image">
          <img src={product.image} alt={product.name} loading="lazy" />
          {product.isNewArrival && <span className="new-burst">NEW</span>}
        </div>
        <div className="product-tile__info">
          <h3>{product.name}</h3>
          <p>{product.brand} · Size {product.size}</p>
          <strong>${product.price.toFixed(2)}</strong>
        </div>
      </Link>
      {showQuickAdd ? (
        <button type="button" className="card-add-button" onClick={addToBag} disabled={isInBag} aria-label={isInBag ? `${product.name} is already in My Bag` : `Add ${product.name} to My Bag`}>
          <img src="/icon-bag.png" alt="" />{isInBag ? 'In My Bag' : 'Add to My Bag'}
        </button>
      ) : !hideQuickAdd ? (
        <button type="button" className="quick-bag" onClick={addToBag} disabled={isInBag} aria-label={isInBag ? `${product.name} is already in My Bag` : `Add ${product.name} to My Bag`}>
          <img src="/icon-bag.png" alt="" className="bag-icon" />
        </button>
      ) : null}
    </article>
  )
}
