
import { useEffect, useState } from 'react'
import { productsAPI } from '../api/index.js'
import api from '../api/index.js'

export default function Stock() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(null)
  const [updateId, setUpdateId] = useState('')
  const [qty,      setQty]      = useState('')
  const [filter,   setFilter]   = useState('all')
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    setLoading(true)
    productsAPI.getAll({ limit:200 })
      .then(r => setProducts(r.data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  // ── Update stock in backend ──────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!updateId || !qty) return
    const product = products.find(p => p._id === updateId)
    if (!product) return

    const newStock = Math.max(0, product.stock + Number(qty))
    setSaving(updateId)
    try {
      const fd = new FormData()
      fd.append('stock', newStock)
      await productsAPI.update(updateId, fd)
      setProducts(prev => prev.map(p => p._id === updateId ? { ...p, stock: newStock } : p))
      setUpdateId(''); setQty('')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(null)
    }
  }

  // ── Inline stock edit ────────────────────────────────────────────────────────
  const handleInlineUpdate = async (id, newStock) => {
    setSaving(id)
    try {
      const fd = new FormData()
      fd.append('stock', Math.max(0, newStock))
      await productsAPI.update(id, fd)
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    } catch (err) { console.error(err) }
    finally { setSaving(null) }
  }

  const stockStatus = (s) => {
    if (s === 0) return { cls:'badge-out',     label:'Out of Stock', color:'var(--danger)' }
    if (s <= 5)  return { cls:'badge-low',     label:'Low Stock',    color:'var(--warning)' }
    return           { cls:'badge-instock', label:'In Stock',     color:'var(--success)' }
  }

  // ── Filter ────────────────────────────────────────────────────────────────────
  const filtered = products.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all'     ? true :
      filter === 'out'     ? p.stock === 0 :
      filter === 'low'     ? p.stock > 0 && p.stock <= 5 :
      filter === 'instock' ? p.stock > 5 : true
    return matchSearch && matchFilter
  })

  const total   = products.length
  const inStock = products.filter(p => p.stock > 5).length
  const low     = products.filter(p => p.stock > 0 && p.stock <= 5).length
  const outOf   = products.filter(p => p.stock === 0).length

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:600 }}>Stock Management</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>Monitor and update inventory levels.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={fetchProducts}>↻ Refresh</button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Total SKUs',     value:total,   color:'var(--text)',    icon:'📦', key:'all' },
          { label:'In Stock',       value:inStock, color:'var(--success)', icon:'✅', key:'instock' },
          { label:'Low Stock (≤5)', value:low,     color:'var(--warning)', icon:'⚠️', key:'low' },
          { label:'Out of Stock',   value:outOf,   color:'var(--danger)',  icon:'❌', key:'out' },
        ].map(k => (
          <div className="metric-card" key={k.label}
            onClick={() => setFilter(k.key)}
            style={{ cursor:'pointer', border: filter===k.key ? `2px solid ${k.color}` : undefined }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div>
                <div className="metric-label">{k.label}</div>
                <div className="metric-value" style={{ color:k.color }}>{loading ? '...' : k.value}</div>
              </div>
              <span style={{ fontSize:24 }}>{k.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick update */}
      <div className="card" style={{ marginBottom:18 }}>
        <div className="card-header"><span className="card-title">Quick Stock Update</span></div>
        <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
          <div className="form-group" style={{ flex:2 }}>
            <label className="form-label">Select Product</label>
            <select className="form-input" value={updateId} onChange={e => setUpdateId(e.target.value)}>
              <option value="">Choose product...</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.title} (current: {p.stock})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ width:130 }}>
            <label className="form-label">Adjust Qty (+/-)</label>
            <input className="form-input" type="number" placeholder="e.g. +50"
              value={qty} onChange={e => setQty(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUpdate()} />
          </div>
          <button className="btn btn-primary" onClick={handleUpdate} disabled={!updateId || !qty || !!saving}
            style={{ marginBottom:1 }}>
            {saving ? 'Saving...' : 'Update Stock'}
          </button>
        </div>
        <p style={{ fontSize:12, color:'var(--muted)', marginTop:8 }}>
          Use positive numbers to add stock, negative to reduce (e.g. +50 or -5).
        </p>
      </div>

      {/* Stock table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Stock Levels</span>
          <div style={{ display:'flex', gap:8 }}>
            <input className="form-input" placeholder="Search products..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ fontSize:12, padding:'4px 10px', width:180 }} />
            {['all','instock','low','out'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className="btn btn-sm"
                style={{ background:filter===f?'#0f0f1a':'#fff', color:filter===f?'#fff':'var(--muted)', border:`1px solid ${filter===f?'#0f0f1a':'var(--border)'}`, textTransform:'capitalize' }}>
                {f === 'all' ? 'All' : f === 'instock' ? 'In Stock' : f === 'low' ? 'Low' : 'Out'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>No products found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Status</th><th>Stock</th><th>Progress</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const ss  = stockStatus(p.stock)
                const max = Math.max(p.stock, 50)
                const pct = Math.round((p.stock / max) * 100)
                return (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        {p.image && <img src={p.image} alt="" style={{ width:32, height:32, borderRadius:6, objectFit:'cover' }} />}
                        <span style={{ fontWeight:500, fontSize:13 }}>{p.title}</span>
                      </div>
                    </td>
                    <td style={{ textTransform:'capitalize', fontSize:12, color:'var(--muted)' }}>{p.category}</td>
                    <td><span className={`badge ${ss.cls}`}>{ss.label}</span></td>
                    <td>
                      <span style={{ fontWeight:600, color:ss.color, fontSize:14 }}>{p.stock}</span>
                      <span style={{ fontSize:11, color:'var(--muted)' }}> units</span>
                    </td>
                    <td style={{ width:120 }}>
                      <div className="progress" style={{ height:6 }}>
                        <div className="progress-fill" style={{
                          width:`${pct}%`,
                          background: p.stock===0 ? 'var(--danger)' : p.stock<=5 ? 'var(--warning)' : 'var(--success)'
                        }} />
                      </div>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                        <button className="btn btn-sm btn-outline"
                          disabled={saving===p._id}
                          onClick={() => handleInlineUpdate(p._id, p.stock + 10)}
                          title="Add 10">+10</button>
                        <button className="btn btn-sm btn-outline"
                          disabled={saving===p._id || p.stock === 0}
                          onClick={() => handleInlineUpdate(p._id, p.stock - 1)}
                          title="Remove 1">-1</button>
                        {saving === p._id && <span style={{ fontSize:11, color:'var(--muted)' }}>...</span>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

