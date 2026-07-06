import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import CheckoutSteps from '../components/CheckoutSteps.jsx'

const PROVINCES = ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Nova Scotia', 'New Brunswick', 'Saskatchewan']

const DELIVERY_METHODS = [
  { id: 'standard', label: 'Standard Shipping', detail: '3–7 business days', price: 7.99 },
  { id: 'expedited', label: 'Expedited Shipping', detail: '1–3 business days', price: 8.99 },
  { id: 'pickup', label: 'Local Pickup', detail: 'Pick up in Ottawa', price: 0 },
]

const TAX_RATE = 0.13
const FREE_SHIPPING_THRESHOLD = 75

function inputClass() {
  return 'w-full h-11 px-3.5 rounded-lg border border-border bg-white text-navy placeholder:text-black focus:outline-none focus-visible:outline-2 focus-visible:outline-leaf'
}

function isValidCardNumber(value) {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  let doubleDigit = false
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (doubleDigit) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    doubleDigit = !doubleDigit
  }
  return sum % 10 === 0
}

function isValidExpiry(value) {
  const match = value.trim().match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2}|\d{4})$/)
  if (!match) return false
  const month = Number(match[1])
  const enteredYear = Number(match[2])
  const year = match[2].length === 2 ? 2000 + enteredYear : enteredYear
  const now = new Date()
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(2)

  const [shipping, setShipping] = useState({
    fullName: '',
    email: '',
    address: '',
    apt: '',
    city: '',
    province: 'Ontario',
    postalCode: '',
    phone: '',
    deliveryMethod: 'standard',
  })

  const [payment, setPayment] = useState({
    method: 'card',
    cardNumber: '',
    expiry: '',
    cvc: '',
    nameOnCard: '',
    billingSame: true,
  })

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center purchase-panel purchase-empty">
        <p className="text-navy font-semibold text-lg mb-4">My Bag is empty.</p>
        <Link to="/shop" className="text-leaf font-semibold hover:underline">
          Shop New Arrivals
        </Link>
      </div>
    )
  }

  const chosenMethod = DELIVERY_METHODS.find((m) => m.id === shipping.deliveryMethod)
  const isFreeShipping = chosenMethod.id === 'pickup' || (
    chosenMethod.id === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD
  )
  const shippingCost = isFreeShipping ? 0 : chosenMethod.price
  const tax = subtotal * TAX_RATE
  const total = subtotal + shippingCost + tax

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShipping((s) => ({ ...s, [name]: value }))
  }

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPayment((p) => ({ ...p, [name]: value }))
  }

  const handlePlaceOrder = () => {
    const orderNumber = `RS${Math.floor(10000000 + Math.random() * 89999999)}`
    const snapshot = {
      orderNumber,
      firstName: shipping.fullName.trim().split(' ')[0] || 'there',
      email: shipping.email,
      items: items.map((i) => ({ id: i.id, name: i.name, image: i.image, size: i.size, condition: i.condition, price: i.price, quantity: i.quantity })),
      subtotal,
      shippingCost,
      tax,
      total,
      deliveryMethod: chosenMethod.label,
      address: shipping,
      cardLast4: payment.cardNumber.replace(/\s/g, '').slice(-4) || '0000',
    }
    clearCart()
    navigate('/confirmation', { state: snapshot })
  }

  return (
    <div className="container-page py-10 max-w-3xl purchase-panel checkout-page">
      <CheckoutSteps currentStep={step} onStepClick={(n) => setStep(n)} />

      {step === 2 && (
        <DeliveryStep
          shipping={shipping}
          subtotal={subtotal}
          onChange={handleShippingChange}
          setShipping={setShipping}
          onBack={() => navigate('/cart')}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <PaymentStep
          payment={payment}
          onChange={handlePaymentChange}
          setPayment={setPayment}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <ReviewStep
          items={items}
          shipping={shipping}
          payment={payment}
          subtotal={subtotal}
          shippingCost={shippingCost}
          tax={tax}
          total={total}
          deliveryLabel={chosenMethod.label}
          onBack={() => setStep(3)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}
    </div>
  )
}

function DeliveryStep({ shipping, subtotal, onChange, setShipping, onBack, onNext }) {
  const canContinue = shipping.fullName && shipping.email && shipping.address && shipping.city && shipping.postalCode && shipping.phone

  return (
    <div>
      <h1 className="text-2xl font-medium text-navy mb-1">Shipping Information</h1>
      <p className="text-black mb-6">Where should we deliver your order?</p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (canContinue) onNext()
        }}
        className="space-y-4"
      >
        <Field label="Full Name" required>
          <input required name="fullName" value={shipping.fullName} onChange={onChange} className={inputClass()} placeholder="Jordan Lee" />
        </Field>
        <Field label="Email" required>
          <input required type="email" name="email" value={shipping.email} onChange={onChange} className={inputClass()} placeholder="you@email.com" />
        </Field>
        <Field label="Address" required>
          <input required name="address" value={shipping.address} onChange={onChange} className={inputClass()} placeholder="123 Bank Street" />
        </Field>
        <Field label="Apartment, suite, etc. (optional)">
          <input name="apt" value={shipping.apt} onChange={onChange} className={inputClass()} placeholder="Apt 502" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" required>
            <input required name="city" value={shipping.city} onChange={onChange} className={inputClass()} placeholder="Ottawa" />
          </Field>
          <Field label="Province" required>
            <select name="province" value={shipping.province} onChange={onChange} className={inputClass()}>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Postal Code" required>
            <input required name="postalCode" value={shipping.postalCode} onChange={onChange} className={inputClass()} placeholder="K1S 3Y7" />
          </Field>
          <Field label="Phone Number" required>
            <input required type="tel" name="phone" value={shipping.phone} onChange={onChange} className={inputClass()} placeholder="(613) 555-1234" />
          </Field>
        </div>

        <fieldset className="pt-2">
          <legend className="font-semibold text-navy mb-3">Delivery Method</legend>
          <div className="space-y-3">
            {DELIVERY_METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex items-center justify-between border rounded-card px-4 py-3.5 cursor-pointer transition-colors ${
                  shipping.deliveryMethod === m.id ? 'border-leaf bg-leaf-50' : 'border-border hover:border-black'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      shipping.deliveryMethod === m.id ? 'border-leaf' : 'border-black'
                    }`}
                  >
                    {shipping.deliveryMethod === m.id && <span className="w-2.5 h-2.5 rounded-full bg-leaf" />}
                  </span>
                  <span>
                    <span className="block font-semibold text-navy text-sm">{m.label}</span>
                    <span className="block text-black text-xs">{m.detail}</span>
                  </span>
                </span>
                <span className="font-semibold text-navy text-sm">
                  {m.id === 'pickup' || (m.id === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD)
                    ? 'FREE'
                    : `$${m.price.toFixed(2)}`}
                </span>
                <input
                  type="radio"
                  name="deliveryMethod"
                  className="sr-only"
                  checked={shipping.deliveryMethod === m.id}
                  onChange={() => setShipping((s) => ({ ...s, deliveryMethod: m.id }))}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!canContinue}
            className="w-full bg-leaf hover:bg-leaf-700 disabled:bg-leaf-700 text-white font-medium py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            Continue to Payment
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button type="button" onClick={onBack} className="w-full text-center text-black hover:text-navy text-sm mt-3">
            ← Back to My Bag
          </button>
        </div>
      </form>
    </div>
  )
}

function PaymentStep({ payment, onChange, setPayment, onBack, onNext }) {
  const [attempted, setAttempted] = useState(false)
  const isCard = payment.method === 'card'
  const cardErrors = {
    cardNumber: isValidCardNumber(payment.cardNumber) ? '' : 'Enter a valid card number.',
    expiry: isValidExpiry(payment.expiry) ? '' : 'Enter a valid future expiry date in MM / YY format.',
    cvc: /^\d{3,4}$/.test(payment.cvc.trim()) ? '' : 'Enter a valid 3 or 4 digit CVC.',
    nameOnCard: /^[\p{L}][\p{L}\s.'-]{1,}$/u.test(payment.nameOnCard.trim()) ? '' : 'Enter the name shown on the card.',
  }
  const canContinue = !isCard || Object.values(cardErrors).every((error) => !error)

  return (
    <div>
      <h1 className="text-2xl font-medium text-navy mb-1">Payment Method</h1>
      <p className="text-black mb-6">All transactions are secure and encrypted.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setAttempted(true)
          if (canContinue) onNext()
        }}
        className="space-y-3"
      >
        <label
          className={`block border rounded-card px-4 py-4 cursor-pointer transition-colors ${
            isCard ? 'border-leaf bg-leaf-50' : 'border-border hover:border-black'
          }`}
        >
          <span className="flex items-center gap-3">
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isCard ? 'border-leaf' : 'border-black'}`}>
              {isCard && <span className="w-2.5 h-2.5 rounded-full bg-leaf" />}
            </span>
            <span className="font-semibold text-navy text-sm">Credit or Debit Card</span>
            <input
              type="radio"
              name="method"
              className="sr-only"
              checked={isCard}
              onChange={() => setPayment((p) => ({ ...p, method: 'card' }))}
            />
          </span>

          {isCard && (
            <div className="mt-4 space-y-4 pl-8">
              <Field label="Card Number" required error={attempted ? cardErrors.cardNumber : ''}>
                <input
                  required
                  name="cardNumber"
                  value={payment.cardNumber}
                  onChange={onChange}
                  className={inputClass()}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  aria-invalid={attempted && Boolean(cardErrors.cardNumber)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry Date" required error={attempted ? cardErrors.expiry : ''}>
                  <input required name="expiry" value={payment.expiry} onChange={onChange} className={inputClass()} placeholder="MM / YY" autoComplete="cc-exp" inputMode="numeric" aria-invalid={attempted && Boolean(cardErrors.expiry)} />
                </Field>
                <Field label="CVC" required error={attempted ? cardErrors.cvc : ''}>
                  <input required name="cvc" value={payment.cvc} onChange={onChange} className={inputClass()} placeholder="123" autoComplete="cc-csc" inputMode="numeric" maxLength={4} aria-invalid={attempted && Boolean(cardErrors.cvc)} />
                </Field>
              </div>
              <Field label="Name on Card" required error={attempted ? cardErrors.nameOnCard : ''}>
                <input required name="nameOnCard" value={payment.nameOnCard} onChange={onChange} className={inputClass()} placeholder="Jordan Lee" autoComplete="cc-name" aria-invalid={attempted && Boolean(cardErrors.nameOnCard)} />
              </Field>
            </div>
          )}
        </label>

        {['paypal', 'applepay'].map((m) => (
          <label
            key={m}
            className={`flex items-center gap-3 border rounded-card px-4 py-4 cursor-pointer transition-colors ${
              payment.method === m ? 'border-leaf bg-leaf-50' : 'border-border hover:border-black'
            }`}
          >
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment.method === m ? 'border-leaf' : 'border-black'}`}>
              {payment.method === m && <span className="w-2.5 h-2.5 rounded-full bg-leaf" />}
            </span>
            <span className="font-semibold text-navy text-sm">{m === 'paypal' ? 'PayPal' : 'Apple Pay'}</span>
            <input
              type="radio"
              name="method"
              className="sr-only"
              checked={payment.method === m}
              onChange={() => setPayment((p) => ({ ...p, method: m }))}
            />
          </label>
        ))}

        <fieldset className="pt-3">
          <legend className="font-semibold text-navy mb-3 text-sm">Billing Address</legend>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-black">
              <input
                type="radio"
                name="billing"
                checked={payment.billingSame}
                onChange={() => setPayment((p) => ({ ...p, billingSame: true }))}
              />
              Same as shipping address
            </label>
            <label className="flex items-center gap-2 text-sm text-black">
              <input
                type="radio"
                name="billing"
                checked={!payment.billingSame}
                onChange={() => setPayment((p) => ({ ...p, billingSame: false }))}
              />
              Use a different billing address
            </label>
          </div>
        </fieldset>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-leaf hover:bg-leaf-700 disabled:bg-leaf-700 text-white font-medium py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            Continue to Review
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button type="button" onClick={onBack} className="w-full text-center text-black hover:text-navy text-sm mt-3">
            ← Back to Shipping
          </button>
        </div>
      </form>
    </div>
  )
}

function ReviewStep({ items, shipping, payment, subtotal, shippingCost, tax, total, deliveryLabel, onBack, onPlaceOrder }) {
  return (
    <div>
      <h1 className="text-2xl font-medium text-navy mb-1">Review Your Order</h1>
      <p className="text-black mb-6">Please review your order details before placing it.</p>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center border border-border rounded-card p-3">
            <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded-lg bg-surface" />
            <div className="flex-1">
              <p className="font-semibold text-navy text-sm">{item.name}</p>
              <p className="text-black text-xs">Size {item.size} · {item.condition} · Qty {item.quantity}</p>
            </div>
            <p className="font-semibold text-navy text-sm">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="border border-border rounded-card p-4">
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold text-navy text-sm">Shipping Address</p>
            <button onClick={onBack} className="text-leaf text-xs font-semibold hover:underline">Edit</button>
          </div>
          <p className="text-black text-sm">{shipping.fullName}</p>
          <p className="text-black text-sm">
            {shipping.address}{shipping.apt ? `, ${shipping.apt}` : ''}
          </p>
          <p className="text-black text-sm">{shipping.city}, {shipping.province} {shipping.postalCode}</p>
          <p className="text-black text-sm">{shipping.phone}</p>
        </div>
        <div className="border border-border rounded-card p-4">
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold text-navy text-sm">Delivery Method</p>
          </div>
          <p className="text-black text-sm">{deliveryLabel}</p>
          <p className="font-semibold text-navy text-sm mt-3">Payment Method</p>
          <p className="text-black text-sm">
            {payment.method === 'card'
              ? `Card ending in ${payment.cardNumber.replace(/\s/g, '').slice(-4) || '0000'}`
              : payment.method === 'paypal'
              ? 'PayPal'
              : 'Apple Pay'}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2 mb-6">
        <div className="flex justify-between text-black text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-black text-sm">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-black text-sm">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-navy font-semibold text-lg pt-2 border-t border-border">
          <span>Total</span>
          <span>${total.toFixed(2)} CAD</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        className="w-full bg-leaf hover:bg-leaf-700 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        Place Order
      </button>
      <button onClick={onBack} className="w-full text-center text-black hover:text-navy text-sm mt-3">
        ← Back to Payment
      </button>
    </div>
  )
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-black mb-1.5">
        {label} {required && <span className="text-leaf">*</span>}
      </span>
      {children}
      {error && <span className="block mt-1.5 text-sm text-black" role="alert">Error: {error}</span>}
    </label>
  )
}
