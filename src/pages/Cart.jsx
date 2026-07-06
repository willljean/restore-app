import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const FREE_SHIPPING_THRESHOLD = 75

export default function Cart() {
  const { items, removeItem, subtotal } = useCart()
  const navigate = useNavigate()
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center purchase-panel purchase-empty">
        <div className="w-16 h-16 mx-auto rounded-full bg-surface flex items-center justify-center mb-5 text-black">
          <img src="/icon-bag.png" alt="" className="bag-icon bag-icon--large" />
        </div>
        <h1 className="text-2xl font-medium text-navy mb-2">My Bag is empty</h1>
        <p className="text-black mb-6">Find your next favourite piece.</p>
        <Link to="/shop" className="inline-block bg-leaf hover:bg-leaf-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors">
          Shop New Arrivals
        </Link>
      </div>
    )
  }

  return (
    <div className="container-page py-10 max-w-4xl purchase-panel purchase-cart">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-medium text-navy">My Bag</h1>
        <Link to="/shop" className="text-leaf font-semibold hover:underline text-sm">
          Continue Shopping
        </Link>
      </div>

      {subtotal < FREE_SHIPPING_THRESHOLD ? (
        <div className="rounded-card border border-border bg-surface p-4 mb-6">
          <p className="text-sm text-black mb-2">
            You're <span className="font-semibold text-leaf">${remaining.toFixed(2)}</span> away from free shipping.
          </p>
          <div className="h-2 rounded-full bg-white overflow-hidden">
            <div className="h-full bg-leaf rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <div className="rounded-card border border-leaf-100 bg-leaf-50 p-4 mb-6 flex items-center gap-2 text-leaf-700 text-sm font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          You've unlocked free shipping!
        </div>
      )}

      <div className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 py-5">
            <Link to={`/product/${item.id}`} className="w-24 h-28 rounded-lg overflow-hidden bg-surface shrink-0 border border-border">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-1">
                <Link to={`/product/${item.id}`} className="font-semibold text-navy hover:text-leaf">
                  {item.name}
                </Link>
                <p className="text-black text-sm mt-0.5">
                  Size {item.size} · {item.condition}
                </p>
                <p className="text-black text-sm">{item.brand}</p>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <p className="font-semibold text-navy">${(item.price * item.quantity).toFixed(2)}</p>
                <span className="text-xs text-leaf-700">One of a kind</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-black hover:text-leaf-700 underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full sm:w-80">
          <div className="flex justify-between text-black mb-2">
            <span>Subtotal</span>
            <span className="font-semibold text-navy">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black mb-4">
            <span>Shipping</span>
            <span className="font-semibold text-navy">{subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : 'Calculated at next step'}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-leaf hover:bg-leaf-700 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
