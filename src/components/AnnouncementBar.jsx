import React from 'react'

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="container-page announcement-items">
        <span><img src="/icon-shipping.png" alt="" />Free shipping on orders over $75</span>
        <span><img src="/icon-restore-white.svg" alt="" />Recycle. Rewear. Restore.</span>
        <span><img src="/icon-returns.png" alt="" />Easy returns within 30 days</span>
      </div>
    </div>
  )
}
