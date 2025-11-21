function TreeCard({ tree, onAdd }) {
  return (
    <div className="group bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden bg-emerald-50">
        {tree.image_url ? (
          <img src={tree.image_url} alt={tree.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-emerald-700">🎄</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-emerald-900">{tree.name}</h3>
            <p className="text-sm text-emerald-700/80">{tree.size} • ~{tree.height_ft} ft</p>
          </div>
          <p className="font-bold text-emerald-800">${tree.price.toFixed(2)}</p>
        </div>
        {tree.description && (
          <p className="text-sm text-emerald-700/80 mt-2 line-clamp-2">{tree.description}</p>
        )}
        <button
          onClick={() => onAdd(tree)}
          className="w-full mt-3 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default TreeCard
