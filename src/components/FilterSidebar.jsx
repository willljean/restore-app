import React, { useState } from 'react'
import { CATEGORIES, SIZES, CONDITIONS, COLOURS, BRANDS, MATERIALS, PRICE_RANGES } from '../data/products.js'

function FilterSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border py-4 first:pt-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-navy font-semibold text-sm mb-3"
      >
        {title}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && children}
    </div>
  )
}

function Checkbox({ checked, onChange, label, count }) {
  return (
    <label className="flex items-center justify-between gap-2 py-1.5 cursor-pointer group">
      <span className="flex items-center gap-2.5">
        <span
          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
            checked ? 'bg-leaf border-leaf' : 'border-black group-hover:border-black'
          }`}
        >
          {checked && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </span>
        <span className="text-sm text-black group-hover:text-navy">{label}</span>
      </span>
      {typeof count === 'number' && <span className="text-xs text-black">{count}</span>}
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    </label>
  )
}

export default function FilterSidebar({ filters, toggleValue, setFilter, counts, onClearAll, className = '' }) {
  return (
    <div className={`filter-panel ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="flex items-center gap-2 font-medium text-navy">
          <img src="/icon-filter.png" alt="" className="filter-icon filter-icon--light" />
          Filter your search
        </h2>
        <button onClick={onClearAll} className="filter-clear text-sm font-medium text-leaf hover:underline">
          Clear all
        </button>
      </div>

      <FilterSection title="Category">
        <div>
          {CATEGORIES.map((cat) => (
            <Checkbox
              key={cat}
              label={cat}
              checked={filters.categories.includes(cat)}
              onChange={() => toggleValue('categories', cat)}
              count={counts.category[cat] || 0}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const active = filters.sizes.includes(size)
            return (
              <button
                key={size}
                onClick={() => toggleValue('sizes', size)}
                aria-pressed={active}
                className={`min-w-[42px] h-9 px-2 rounded-full border text-sm font-medium transition-colors ${
                  active
                    ? 'bg-leaf border-leaf text-white'
                    : 'border-border text-black hover:border-black'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </FilterSection>

      <FilterSection title="Colour">
        <div className="flex flex-wrap gap-2.5">
          {COLOURS.map((c) => {
            const active = filters.colours.includes(c.name)
            return (
              <button
                key={c.name}
                onClick={() => toggleValue('colours', c.name)}
                aria-pressed={active}
                aria-label={c.name}
                title={c.name}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform ${
                  active ? 'border-leaf scale-110' : 'border-transparent'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full border border-black"
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            )
          })}
        </div>
      </FilterSection>

      <FilterSection title="Condition">
        <div>
          {CONDITIONS.map((cond) => (
            <Checkbox
              key={cond}
              label={cond}
              checked={filters.conditions.includes(cond)}
              onChange={() => toggleValue('conditions', cond)}
              count={counts.condition[cond] || 0}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand" defaultOpen={false}>
        <div className="max-h-40 overflow-y-auto thin-scroll pr-1">
          {BRANDS.map((brand) => (
            <Checkbox
              key={brand}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => toggleValue('brands', brand)}
              count={counts.brand[brand] || 0}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Material" defaultOpen={false}>
        <div className="max-h-40 overflow-y-auto thin-scroll pr-1">
          {MATERIALS.map((mat) => (
            <Checkbox
              key={mat}
              label={mat}
              checked={filters.materials.includes(mat)}
              onChange={() => toggleValue('materials', mat)}
              count={counts.material[mat] || 0}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div>
          {PRICE_RANGES.map((range) => (
            <Checkbox
              key={range.id}
              label={range.label}
              checked={filters.priceRanges.includes(range.id)}
              onChange={() => toggleValue('priceRanges', range.id)}
              count={counts.price[range.id] || 0}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="New Arrivals">
        <Checkbox
          label="New this week"
          checked={filters.newArrivals}
          onChange={() => setFilter('newArrivals', !filters.newArrivals)}
        />
      </FilterSection>

      <FilterSection title="On Sale">
        <Checkbox
          label="Sale items"
          checked={filters.onSale}
          onChange={() => setFilter('onSale', !filters.onSale)}
        />
      </FilterSection>
    </div>
  )
}
