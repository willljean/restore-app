import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const steps = [
  ['1', 'Tell us what you have', 'Share a quick description of the clothing and accessories you would like to donate.'],
  ['2', 'Choose the handoff', 'We will reply with available local drop-off or pickup details.'],
  ['3', 'Give it another chance', 'Your pieces are reviewed and prepared for their next owner.'],
]

export default function Donate() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="donate-page">
      <section className="donate-banner">
        <span className="down-chevron" />
        <div><h1>DONATE TO RESTORE</h1></div>
        <span className="down-chevron" />
      </section>

      <div className="donate-layout container-page">
        <section className="donate-intro">
          <h2>Give great clothes a second life.</h2>
          <p>Ready to clear some closet space? Tell us what you have and we’ll help your pieces find their next chapter.</p>
          <div className="donate-steps">
            {steps.map(([number, title, copy]) => (
              <div key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></div>
            ))}
          </div>
        </section>

        <section className="donate-card">
          {submitted ? (
            <div className="donate-success">
              <span>✓</span><h2>Thank you!</h2>
              <p>We received your donation request and will be in touch shortly.</p>
              <Link to="/shop">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <h2>Start a donation</h2>
              <p>We’ll use these details only to contact you about your donation.</p>
              <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
                <label><span>Full Name</span><input required name="name" autoComplete="name" /></label>
                <label><span>Email</span><input required type="email" name="email" autoComplete="email" /></label>
                <label><span>Tell us about your items</span><textarea required rows={5} placeholder="e.g. 5 sweaters, 2 pairs of jeans, gently worn" /></label>
                <button type="submit">Submit Donation Request</button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
