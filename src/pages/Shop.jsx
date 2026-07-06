import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products, PRICE_RANGES } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'

const PAGE_SIZE = 12

const emptyFilters = {
  categories: [],
  sizes: [],
  colours: [],
  conditions: [],
  brands: [],
  materials: [],
  priceRanges: [],
  newArrivals: false,
  onSale: false,
  query: '',
}

function matches(product, filters, excludeKey) {
  const f = filters
  if (excludeKey !== 'categories' && f.categories.length && !f.categories.includes(product.category)) return false
  if (excludeKey !== 'sizes' && f.sizes.length && !f.sizes.includes(product.size)) return false
  if (excludeKey !== 'colours' && f.colours.length && !f.colours.includes(product.colour)) return false
  if (excludeKey !== 'conditions' && f.conditions.length && !f.conditions.includes(product.condition)) return false
  if (excludeKey !== 'brands' && f.brands.length && !f.brands.includes(product.brand)) return false
  if (excludeKey !== 'materials' && f.materials.length && !f.materials.includes(product.material)) return false
  if (excludeKey !== 'price' && f.priceRanges.length) {
    const inRange = f.priceRanges.some((id) => {
      const range = PRICE_RANGES.find((r) => r.id === id)
      return range && product.price >= range.min && product.price <= range.max
    })
    if (!inRange) return false
  }
  if (excludeKey !== 'newArrivals' && f.newArrivals && !product.isNewArrival) return false
  if (excludeKey !== 'onSale' && f.onSale && !product.isOnSale) return false
  if (f.query) {
    const q = f.query.toLowerCase()
    const haystack = `${product.name} ${product.brand} ${product.category} ${product.material} ${product.colour}`.toLowerCase()
    if (!haystack.includes(q)) return false
  }
  return true
}

function countBy(list, filters, excludeKey, getKey) {
  const counted = list.filter((p) => matches(p, filters, excludeKey))
  const counts = {}
  for (const p of counted) {
    const key = getKey(p)
    counts[key] = (counts[key] || 0) + 1
  }
  return counts
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(emptyFilters)
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  // Keep filters synchronized with navigation and repeated header searches.
  useEffect(() => {
    const category = searchParams.get('category')
    const isNew = searchParams.get('new')
    const priceRange = searchParams.get('price')
    const q = searchParams.get('q')
    setFilters((f) => ({
      ...f,
      categories: category ? [category] : [],
      newArrivals: Boolean(isNew),
      priceRanges: priceRange ? [priceRange] : [],
      query: q || '',
    }))
    setPage(1)
  }, [searchParams])

  const toggleValue = (key, value) => {
    setPage(1)
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }))
  }

  const setFilter = (key, value) => {
    setPage(1)
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const clearAll = () => {
    setPage(1)
    setFilters(emptyFilters)
    setSearchParams({})
  }

  const removeChip = (key, value) => {
    setPage(1)
    if (Array.isArray(filters[key])) {
      toggleValue(key, value)
    } else {
      setFilters((f) => ({ ...f, [key]: false }))
    }
  }

  const filteredProducts = useMemo(() => products.filter((p) => matches(p, filters)), [filters])

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0))
    return list
  }, [filteredProducts, sort])

  const counts = useMemo(
    () => ({
      category: countBy(products, filters, 'categories', (p) => p.category),
      condition: countBy(products, filters, 'conditions', (p) => p.condition),
      brand: countBy(products, filters, 'brands', (p) => p.brand),
      material: countBy(products, filters, 'materials', (p) => p.material),
      price: (() => {
        const inScope = products.filter((p) => matches(p, filters, 'price'))
        const result = {}
        for (const range of PRICE_RANGES) {
          result[range.id] = inScope.filter((p) => p.price >= range.min && p.price <= range.max).length
        }
        return result
      })(),
    }),
    [filters]
  )

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE))
  const pageItems = sortedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeChips = [
    ...filters.categories.map((v) => ({ key: 'categories', value: v, label: v })),
    ...filters.sizes.map((v) => ({ key: 'sizes', value: v, label: `Size: ${v}` })),
    ...filters.colours.map((v) => ({ key: 'colours', value: v, label: v })),
    ...filters.conditions.map((v) => ({ key: 'conditions', value: v, label: v })),
    ...filters.brands.map((v) => ({ key: 'brands', value: v, label: v })),
    ...filters.materials.map((v) => ({ key: 'materials', value: v, label: v })),
    ...filters.priceRanges.map((id) => ({
      key: 'priceRanges',
      value: id,
      label: PRICE_RANGES.find((r) => r.id === id)?.label || id,
    })),
    ...(filters.newArrivals ? [{ key: 'newArrivals', value: null, label: 'New Arrivals' }] : []),
    ...(filters.onSale ? [{ key: 'onSale', value: null, label: 'On Sale' }] : []),
  ]

  return (
    <div className="container-page shop-page">
      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* Mobile filter toggle */}
        <MobileFilters
          filters={filters}
          toggleValue={toggleValue}
          setFilter={setFilter}
          counts={counts}
          onClearAll={clearAll}
        />

        <FilterSidebar
          filters={filters}
          toggleValue={toggleValue}
          setFilter={setFilter}
          counts={counts}
          onClearAll={clearAll}
          className="hidden lg:block"
        />

        <div className="shop-results">
          <div className="shop-heading">
            <div><h1>SHOP</h1><p>{sortedProducts.length} results found</p></div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span />
            <label className="shop-sort flex items-center gap-2 text-sm">
              <span>⇅ Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 text-navy bg-white focus:outline-none focus-visible:outline-2 focus-visible:outline-leaf"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {activeChips.map((chip) => (
                <button
                  key={`${chip.key}-${chip.value}`}
                  onClick={() => removeChip(chip.key, chip.value)}
                  className="flex items-center gap-1.5 bg-leaf-50 text-leaf-700 text-sm font-medium pl-3 pr-2 py-1.5 rounded-full hover:bg-leaf-100 transition-colors"
                >
                  {chip.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              ))}
              <button onClick={clearAll} className="text-sm font-medium text-black hover:text-navy underline ml-1">
                Clear all filters
              </button>
            </div>
          )}

          {pageItems.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-card">
              <p className="text-navy font-semibold mb-1">No pieces match those filters yet.</p>
              <p className="text-black text-sm mb-4">Try removing a filter or two to see more finds.</p>
              <button onClick={clearAll} className="text-leaf font-semibold hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="shop-product-grid">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} showQuickAdd />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-navy disabled:text-leaf-700"
                aria-label="Previous page"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-current={page === n ? 'page' : undefined}
                  className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                    page === n ? 'bg-leaf text-white' : 'text-navy hover:bg-surface'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-navy disabled:text-leaf-700"
                aria-label="Next page"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}

function MobileFilters({ filters, toggleValue, setFilter, counts, onClearAll }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-border rounded-full px-4 py-2.5 text-navy font-medium text-sm"
      >
        <img src="/icon-filter.png" alt="" className="filter-icon" />
        Filter your search
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-[85%] max-w-sm h-full overflow-y-auto p-6 ml-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface"
              aria-label="Close filters"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <FilterSidebar
              filters={filters}
              toggleValue={toggleValue}
              setFilter={setFilter}
              counts={counts}
              onClearAll={onClearAll}
              className="mt-8"
            />
            <button
              onClick={() => setOpen(false)}
              className="w-full mt-6 bg-leaf text-white font-semibold py-3 rounded-full"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
