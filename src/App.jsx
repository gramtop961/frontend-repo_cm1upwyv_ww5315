import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import TreeCard from './components/TreeCard'
import CartDrawer from './components/CartDrawer'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [trees, setTrees] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ size: 'All', query: '' })
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    fetchTrees()
  }, [])

  const fetchTrees = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.size && filter.size !== 'All') params.set('size', filter.size)
      const res = await fetch(`${baseUrl}/api/trees?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load products')
      const data = await res.json()
      setTrees(data.items || [])
    } catch (e) {
      console.error(e)
      setTrees([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (tree) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === tree._id)
      if (existing) {
        return prev.map((i) => i._id === tree._id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...tree, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id))
  }

  const checkout = async () => {
    if (cart.length === 0) return
    try {
      const payload = {
        customer_name: 'Guest',
        email: 'guest@example.com',
        address: '123 Holiday Lane',
        city: 'North Pole',
        zip: '00000',
        items: cart.map((c) => ({ product_id: c._id, name: c.name, quantity: c.quantity, price: c.price })),
        total: cart.reduce((s, i) => s + i.price * i.quantity, 0),
      }
      const res = await fetch(`${baseUrl}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Checkout failed')
      const data = await res.json()
      alert(`Order placed! Total: $${data.total}`)
      setCart([])
      setCartOpen(false)
    } catch (e) {
      alert(e.message)
    }
  }

  const seed = async () => {
    setSeeding(true)
    try {
      await fetch(`${baseUrl}/api/admin/seed`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ overwrite: false }) })
      await fetchTrees()
    } finally {
      setSeeding(false)
    }
  }

  const filtered = useMemo(() => {
    return trees.filter((t) => {
      const matchSize = filter.size === 'All' || t.size === filter.size
      const q = filter.query.trim().toLowerCase()
      const matchQuery = q === '' || t.name.toLowerCase().includes(q) || (t.tags || []).some(tag => tag.toLowerCase().includes(q))
      return matchSize && matchQuery
    })
  }, [trees, filter])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <Header cartCount={cart.reduce((s,i)=>s+i.quantity,0)} onOpenCart={() => setCartOpen(true)} onSeed={seed} />

      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-900">Find your perfect Christmas tree</h2>
            <p className="text-emerald-700/80 mt-2">Freshly cut, delivered to your doorstep</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            <div className="flex-1 flex gap-2">
              <input
                placeholder="Search by name or tag (e.g., fresh, premium)"
                className="flex-1 px-4 py-2 rounded-md border border-emerald-300 bg-white/70"
                value={filter.query}
                onChange={(e) => setFilter(f => ({ ...f, query: e.target.value }))}
              />
              <select
                className="px-3 py-2 rounded-md border border-emerald-300 bg-white/70"
                value={filter.size}
                onChange={(e) => setFilter(f => ({ ...f, size: e.target.value }))}
              >
                {['All','Small','Medium','Large'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button
              onClick={fetchTrees}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Apply
            </button>
            <button
              disabled={seeding}
              onClick={seed}
              className="px-4 py-2 rounded-md border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
            >
              {seeding ? 'Seeding...' : 'Load Demo Trees'}
            </button>
          </div>

          {loading ? (
            <p className="text-center text-emerald-700">Loading trees...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(tree => (
                <TreeCard key={tree._id} tree={tree} onAdd={addToCart} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-emerald-700/80">
                  No trees found. Try seeding demo data.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onCheckout={checkout}
        onRemove={removeFromCart}
      />

      <footer className="border-t border-emerald-200 bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-emerald-800">© {new Date().getFullYear()} Evergreen Co.</p>
          <p className="text-emerald-700/80 text-sm">Free delivery within 10 miles · 7-day freshness guarantee</p>
        </div>
      </footer>
    </div>
  )
}

export default App
ld">Evergreen Co.</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/test" className="hidden sm:inline text-sm text-white/80 hover:text-white">Status</a>
            <button onClick={() => setCartOpen((v)=>!v)} className="relative bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full">
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full grid place-items-center">{cart.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage:'radial-gradient(700px 200px at 50% -10%, rgba(255,255,255,.25), transparent)'}} />
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">Bring home the magic of Christmas</h2>
            <p className="mt-4 text-white/80">Premium, farm‑fresh trees delivered to your door. Hand‑picked varieties, beautiful fragrance, and hassle‑free setup.</p>
            <div className="mt-6 flex gap-3">
              <a href="#shop" className="px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700">Shop Trees</a>
              <button onClick={seed} className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20">Seed Demo Data</button>
            </div>
            {seeded && <p className="mt-2 text-sm text-emerald-200">Demo products added.</p>}
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=80&auto=format&fit=crop" alt="Christmas Trees" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="max-w-6xl mx-auto px-4 pb-24">
        <h3 className="text-2xl font-bold mb-6">Our Trees</h3>
        {loading ? (
          <p className="text-white/80">Loading products...</p>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700/40 rounded p-4">
            <p className="font-semibold">We couldn't load the trees.</p>
            <p className="text-sm text-white/80">Try clicking "Seed Demo Data" above, then refresh.</p>
          </div>
        ) : trees.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded p-4">
            <p className="">No trees available yet. Click "Seed Demo Data" to add some sample products.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trees.map((tree) => (
              <div key={tree.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-black/20">
                  <img src={tree.image} alt={tree.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-lg font-semibold">{tree.name}</h4>
                    <span className="px-2 py-1 rounded bg-white/10 text-sm">{tree.size}</span>
                  </div>
                  {tree.description && <p className="mt-2 text-sm text-white/80 flex-1">{tree.description}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold">${tree.price.toFixed(2)}</span>
                    <button onClick={() => addToCart(tree)} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-60" disabled={!tree.in_stock}>
                      {tree.in_stock ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white text-gray-900 shadow-2xl transform transition-transform duration-300 z-50 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-xl font-bold">Your Cart</h3>
            <button onClick={() => setCartOpen(false)} className="px-3 py-1 rounded bg-gray-100">Close</button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border rounded-lg p-3">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 bg-gray-100 rounded" onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                    <input type="number" min="1" className="w-14 text-center border rounded p-1" value={item.quantity} onChange={(e)=> updateQty(item.id, parseInt(e.target.value || '1', 10))} />
                    <button className="px-2 py-1 bg-gray-100 rounded" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="text-red-600 text-sm" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t space-y-1">
            <div className="flex items-center justify-between text-sm text-gray-700"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between text-sm text-gray-700"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <div className="flex items-center justify-between font-semibold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <button onClick={() => setCheckingOut(true)} disabled={cart.length === 0} className="w-full mt-3 px-4 py-3 rounded bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50">Proceed to Checkout</button>
          </div>
        </div>
      </div>

      {/* Overlay for cart */}
      {cartOpen && <div onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/50 z-40" />}

      {/* Checkout modal */}
      {checkingOut && <CheckoutForm />}

      {/* Order confirmation toast */}
      {orderPlaced && (
        <div className="fixed bottom-4 right-4 z-50 bg-white text-gray-900 shadow-xl rounded-lg px-4 py-3">
          <p className="font-semibold">Order placed!</p>
          <p className="text-sm text-gray-700">Confirmation #{orderPlaced.id.slice(-6)} • ${orderPlaced.total.toFixed(2)}</p>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center text-white/70 text-sm">
          © {new Date().getFullYear()} Evergreen Co. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
