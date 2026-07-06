import React from 'react'

const STEPS = ['My Bag', 'Delivery / Pickup', 'Payment', 'Review & Confirm', 'Confirmation']

export default function CheckoutSteps({ currentStep, onStepClick }) {
  return (
    <ol className="flex items-start justify-between max-w-2xl mx-auto mb-10" aria-label="Checkout progress">
      {STEPS.map((label, i) => {
        const stepNum = i + 1
        const isComplete = stepNum < currentStep
        const isCurrent = stepNum === currentStep
        const clickable = isComplete && onStepClick

        return (
          <li key={label} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <span
                className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${
                  stepNum <= currentStep ? 'bg-leaf' : 'bg-border'
                }`}
                aria-hidden="true"
              />
            )}
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(stepNum)}
              aria-current={isCurrent ? 'step' : undefined}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors bg-white ${
                isCurrent
                  ? 'border-leaf bg-leaf text-white'
                  : isComplete
                  ? 'border-leaf text-leaf'
                  : 'border-border text-black'
              } ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {isComplete ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                stepNum
              )}
            </button>
            <span
              className={`mt-2 text-xs font-medium text-center ${
                isCurrent ? 'text-navy' : isComplete ? 'text-leaf' : 'text-black'
              }`}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
