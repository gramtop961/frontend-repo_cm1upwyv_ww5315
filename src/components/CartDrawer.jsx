import { useMemo } from 'react'

function CartDrawer({ open, items, onClose, onCheckout, onRemove }) {
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-emerald-700 hover:underline">Close</button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-160px)]">
          {items.length === 0 ? (
            <p className="text-emerald-700/80">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex gap-3 items-center">
                <div className="w-16 h-16 rounded bg-emerald-50 overflow-hidden">
                  {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-emerald-700/80">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => onRemove(item._id)} className="text-xs text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <button onClick={onCheckout} className="w-full px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Checkout</button>
        </div>
      </aside>
    </div>
  )
}

export default CartDrawer
