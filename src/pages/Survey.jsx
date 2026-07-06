import React, { useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'

const MATCH_OPTIONS = ['Yes, exactly', 'Mostly yes', 'Not really', 'Not at all']
const FIT_OPTIONS = ['Yes', 'Somewhat', 'No']
const REPEAT_OPTIONS = ['Definitely would', 'Probably would', 'Not sure', 'Probably would not', 'Definitely would not']

function StarRating({ value, onChange, label }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="p-0.5"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={(hovered || value) >= n ? '#00B569' : 'none'}
            stroke={(hovered || value) >= n ? '#00B569' : '#000000'}
            strokeOpacity={(hovered || value) >= n ? 1 : 0.3}
            strokeWidth="1.5"
          >
            <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-xs text-black">Poor — Excellent</span>
    </div>
  )
}

function ScaleRating({ value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          onClick={() => onChange(n)}
          className={`w-10 h-10 rounded-full border text-sm font-semibold transition-colors ${
            value === n ? 'bg-leaf border-leaf text-white' : 'border-border text-black hover:border-black'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-3 border rounded-card px-4 py-3 cursor-pointer transition-colors ${
            value === opt ? 'border-leaf bg-leaf-50' : 'border-border hover:border-black'
          }`}
        >
          <span className={`rounded-full border-2 flex items-center justify-center shrink-0 ${value === opt ? 'border-leaf' : 'border-black'}`} style={{ width: 18, height: 18 }}>
            {value === opt && <span className="w-2.5 h-2.5 rounded-full bg-leaf" />}
          </span>
          <span className="text-sm text-black">{opt}</span>
          <input type="radio" name={name} className="sr-only" checked={value === opt} onChange={() => onChange(opt)} />
        </label>
      ))}
    </div>
  )
}

export default function Survey() {
  const location = useLocation()
  const order = location.state
  const [submitted, setSubmitted] = useState(false)

  const [itemRatings, setItemRatings] = useState({})
  const [matched, setMatched] = useState('')
  const [satisfaction, setSatisfaction] = useState(0)
  const [fitHelpful, setFitHelpful] = useState('')
  const [wouldReturn, setWouldReturn] = useState('')
  const [comment, setComment] = useState('')

  if (!order) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container-page py-20 max-w-md text-center purchase-panel survey-page">
        <div className="w-20 h-20 mx-auto rounded-full bg-leaf flex items-center justify-center mb-6">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-medium text-navy mb-2">Thank you!</h1>
        <p className="text-black mb-8">Your feedback helps us keep quality high and give clothes another chance.</p>
        <Link to="/shop" className="inline-block bg-leaf hover:bg-leaf-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container-page py-12 max-w-xl purchase-panel survey-page">
      <h1 className="text-2xl sm:text-3xl font-medium text-navy mb-2">How did your Restore find turn out?</h1>
      <p className="text-black mb-8">Your feedback helps us make every future find easier to shop with confidence.</p>

      <form onSubmit={handleSubmit} className="space-y-9">
        <div>
          <p className="font-semibold text-navy mb-1">1. How would you rate the quality of your item?</p>
          <p className="text-black text-sm mb-4">Rate each piece from your order.</p>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border border-border rounded-card p-3">
                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg bg-surface shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-navy text-sm mb-1.5">{item.name}</p>
                  <StarRating
                    label={`Quality rating for ${item.name}`}
                    value={itemRatings[item.id] || 0}
                    onChange={(v) => setItemRatings((r) => ({ ...r, [item.id]: v }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-navy mb-3">2. Did the item match its photos and description?</p>
          <RadioGroup name="matched" options={MATCH_OPTIONS} value={matched} onChange={setMatched} />
        </div>

        <div>
          <p className="font-semibold text-navy mb-3">3. How satisfied are you with your purchase?</p>
          <ScaleRating label="Satisfaction" value={satisfaction} onChange={setSatisfaction} />
          <div className="flex justify-between text-xs text-black mt-1.5 max-w-[220px]">
            <span>Not satisfied</span>
            <span>Very satisfied</span>
          </div>
        </div>

        <div>
          <p className="font-semibold text-navy mb-3">4. Did the sizing and fit information help you make your choice?</p>
          <RadioGroup name="fitHelpful" options={FIT_OPTIONS} value={fitHelpful} onChange={setFitHelpful} />
        </div>

        <div>
          <p className="font-semibold text-navy mb-3">5. Would you shop with Restore again?</p>
          <RadioGroup name="wouldReturn" options={REPEAT_OPTIONS} value={wouldReturn} onChange={setWouldReturn} />
        </div>

        <div>
          <label className="block">
            <span className="font-semibold text-navy mb-2 block">6. Anything you would like us to know?</span>
            <span className="text-black text-sm mb-3 block">Optional</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Tell us more about your experience..."
              className="w-full px-3.5 py-3 rounded-lg border border-border bg-white text-navy placeholder:text-black focus:outline-none focus-visible:outline-2 focus-visible:outline-leaf"
            />
          </label>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="bg-leaf hover:bg-leaf-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
          >
            Submit Feedback
          </button>
          <Link to="/shop" className="text-black hover:text-navy text-sm font-medium">
            Skip for now
          </Link>
        </div>
      </form>
    </div>
  )
}
