import { useMemo } from 'react'

function Header({ cartCount, onOpenCart, onSeed }) {
  const countLabel = useMemo(() => {
    if (!cartCount) return 'Cart'
    return `Cart (${cartCount})`
  }, [cartCount])

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-emerald-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎄</span>
          <div>
            <h1 className="text-xl font-extrabold text-emerald-900 leading-tight">Evergreen Co.</h1>
            <p className="text-xs text-emerald-700/80 -mt-0.5">Fresh Christmas Trees</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSeed}
            className="hidden sm:inline-flex text-xs px-3 py-2 rounded-md border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            Load Demo Trees
          </button>
          <button
            onClick={onOpenCart}
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
          >
            {countLabel}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
