import React from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'

export default function Confirmation() {
  const location = useLocation()
  const order = location.state

  if (!order) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="container-page py-14 max-w-xl purchase-panel confirmation-page">
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto rounded-full bg-leaf-50 flex items-center justify-center mb-6">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00B569" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-3xl font-medium text-navy mb-2">Thank you, {order.firstName}!</h1>
        <p className="text-black">Your order has been placed.</p>
        <p className="text-navy font-semibold mt-3">Order #{order.orderNumber}</p>
        <p className="text-black text-sm mt-1">A confirmation email has been sent to {order.email || 'your inbox'}.</p>
      </div>

      <div className="confirmation-content-grid">
      <div className="rounded-card border border-border p-5 confirmation-summary">
        <h2 className="font-medium text-navy mb-3 text-sm">Order Summary</h2>
        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg bg-surface" />
              <div className="flex-1">
                <p className="font-medium text-navy text-sm">{item.name}</p>
                <p className="text-black text-xs">Size {item.size} · Qty {item.quantity}</p>
              </div>
              <p className="font-semibold text-navy text-sm">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-black">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black">
            <span>Shipping</span>
            <span>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-semibold text-navy text-base pt-1">
            <span>Total</span>
            <span>${order.total.toFixed(2)} CAD</span>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border p-5 confirmation-feedback">
        <p className="font-semibold text-navy mb-1">We'd love your feedback!</p>
        <p className="text-black text-sm mb-4">Let us know about your experience and the quality of your items.</p>
        <div className="flex items-center gap-4 confirmation-feedback-actions">
          <Link
            to="/survey"
            state={order}
            className="bg-leaf hover:bg-leaf-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Take Survey (2 mins)
          </Link>
          <Link to="/shop" className="text-black hover:text-navy text-sm font-medium">
            Maybe later
          </Link>
        </div>
      </div>
      </div>

      <div className="text-center">
        <Link
          to="/shop"
          className="inline-block bg-navy hover:bg-navy-900 text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
