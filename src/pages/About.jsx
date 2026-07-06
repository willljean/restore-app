import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="about-page">
      <section className="about-banner">
        <span className="down-chevron" />
        <div><h1>ABOUT RESTORE</h1></div>
        <span className="down-chevron" />
      </section>

      <section className="about-intro container-page">
        <div className="about-statement">
          <h2>Good clothes deserve a second chance.</h2>
        </div>
        <div className="about-copy">
          <p>Restore is a home for donated and secondhand clothing that still has plenty of life left. We inspect every piece by hand, so you can shop with confidence and give a great garment its next chapter.</p>
          <p>We believe better style does not need to mean buying new. A more thoughtful wardrobe can be affordable, expressive, and easier on the planet.</p>
        </div>
      </section>

      <section className="about-impact">
        <div className="container-page about-impact-inner">
          <div><span>12,450+</span><p>items given another life</p></div>
          <div><span>8.2 tons</span><p>of textile waste diverted</p></div>
          <div><span>3,600+</span><p>happy Restore shoppers</p></div>
        </div>
      </section>

      <section className="about-cta container-page">
        <div><h2>Ready to clear some closet space?</h2></div>
        <Link to="/donate">Start a Donation</Link>
      </section>
    </div>
  )
}
