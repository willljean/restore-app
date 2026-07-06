import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductById, products } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id)
  const { addItem, items } = useCart()

  if (!product) return (
    <div className="container-page py-20 text-center">
      <p className="text-lg mb-4">We couldn't find that item.</p>
      <Link to="/shop" className="text-leaf underline">Return to Shop</Link>
    </div>
  )

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)
  const isInBag = items.some((item) => item.id === product.id)
  const addToBag = () => {
    if (!isInBag) addItem(product)
  }

  return (
    <div className="product-page container-page">
      <button type="button" className="product-back" onClick={() => navigate(-1)}>Back</button>

      <section className="product-layout">
        <div className="product-detail-media">
          {product.isNewArrival && <span className="new-burst product-detail-burst">NEW</span>}
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail-copy">
          <span className="condition-label">{product.condition}</span>
          <h1>{product.name}</h1>
          <p className="product-brand">{product.brand}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>

          <dl className="product-facts">
            <div><dt>Size</dt><dd>{product.size}</dd></div>
            <div><dt>Colour</dt><dd>{product.colour}</dd></div>
            <div><dt>Material</dt><dd>{product.material}</dd></div>
          </dl>

          <p className="product-description">{product.description}</p>
          <div className="product-measurements"><span>Measurements</span>{product.measurements}</div>
          <p className="one-available">Only one available — this piece is one-of-a-kind.</p>

          <button type="button" className="add-bag-button" onClick={addToBag} disabled={isInBag}>
            <img src="/icon-bag.png" alt="" />
            {isInBag ? 'In My Bag' : 'Add to My Bag'}
          </button>
          {isInBag && <Link to="/cart" className="view-bag-link">View My Bag →</Link>}
        </div>
      </section>

      {related.length > 0 && (
        <section className="related-products">
          <h2>You Might Also Like</h2>
          <div className="related-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      )}
    </div>
  )
}
