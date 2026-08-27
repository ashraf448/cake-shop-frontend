import { useEffect, useState } from 'react'
import  api  from '../api/index.js'

const STATUS_STEPS = ['Pending', 'Quoted', 'Accepted', 'Paid', 'Preparing', 'Delivered']

const STATUS_COLOR = {
  Pending:   'badge-pending',
  Quoted:    'badge-confirmed',
  Accepted:  'badge-preparing',
  Paid:      'badge-paid',
  Preparing: 'badge-shipped',
  Delivered: 'badge-delivered',
  Cancelled: 'badge-cancelled',
}

// ─── Quote Modal ───────────────────────────────────────────────────────────────
function QuoteModal({ order, onClose, onSave }) {
  const [price,    setPrice]    = useState(order.quotedPrice || '')
  const [note,     setNote]     = useState(order.adminNote  || '')
  const [saving,   setSaving]   = useState(false)

  const handleSave = async () => {
    if (!price || price <= 0) { alert('Enter a valid price'); return }
    setSaving(true)
    await onSave(order._id, price, note)
    setSaving(false)
    onClose()
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div className="card" style={{ width:'min(440px, 92vw)', padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontSize:16, fontWeight:600 }}>💰 Set Price Quote</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:'var(--muted)' }}>✕</button>
        </div>

        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:12, color:'var(--muted)', marginBottom:6 }}>Customer: <strong>{order.user?.userName}</strong></p>
          <p style={{ fontSize:12, color:'var(--muted)', marginBottom:12 }}>Description: {order.description?.slice(0, 100)}...</p>
        </div>

        <div className="form-group" style={{ marginBottom:12 }}>
          <label className="form-label">Price (EGP) *</label>
          <input className="form-input" type="number" placeholder="e.g. 850"
            value={price} onChange={e => setPrice(e.target.value)} min="1" />
        </div>

        <div className="form-group" style={{ marginBottom:20 }}>
          <label className="form-label">Note to Customer (optional)</label>
          <textarea className="form-input" rows={3} placeholder="e.g. Includes delivery, ready in 3 days..."
            value={note} onChange={e => setNote(e.target.value)} style={{ resize:'none' }} />
        </div>

        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '💾 Send Quote'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ order, onClose, onStatusChange }) {

  const [updating, setUpdating] = useState(false);

  const [preview, setPreview] = useState("");

  const [status, setStatus] = useState(order.status);

  const ALL_STATUS = [
    'Pending',
    'Quoted',
    'Accepted',
    'Paid',
    'Preparing',
    'Delivered',
    'Cancelled',
  ];

  const handleStatus = async () => {

    setUpdating(true);

    await onStatusChange(order._id, status);

    setUpdating(false);
  };

  return (
    <>
      {/* IMAGE PREVIEW */}
      {preview && (
        <div
          onClick={() => setPreview("")}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            padding: 20,
            cursor: 'zoom-out',
          }}
        >
          <img
            src={preview}
            alt="preview"
            style={{
              maxWidth: '95%',
              maxHeight: '95%',
              borderRadius: 16,
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* MAIN MODAL */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >

        <div
          className="card"
          style={{
            width: 'min(650px, 92vw)',
            padding: 24,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >

          {/* HEADER */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>
              Order #{order._id.slice(-6).toUpperCase()}
            </h3>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                color: 'var(--muted)',
              }}
            >
              ✕
            </button>
          </div>

          {/* ORDER IMAGE */}
          {order.image && (
            <div style={{ marginBottom: 16 }}>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  marginBottom: 8,
                }}
              >
                Cake Reference
              </p>

              <img
                src={order.image}
                alt="Cake reference"
                onClick={() => setPreview(order.image)}
                style={{
                  width: '100%',
                  maxHeight: 240,
                  objectFit: 'cover',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  cursor: 'zoom-in',
                }}
              />
            </div>
          )}

          {/* DETAILS */}
          <div
            className="grid-2" style={{ gap: 12,
              marginBottom: 16 }}
          >

            {[
              { label: 'Customer', value: order.user?.userName },
              { label: 'Email', value: order.user?.email },
              { label: 'Phone', value: order.phone },
              { label: 'Address', value: order.address },
              { label: 'Size', value: order.size || '—' },
              { label: 'Flavor', value: order.flavor || '—' },
              { label: 'Layers', value: order.layers },
              {
                label: 'Delivery Date',
                value: order.deliveryDate
                  ? new Date(order.deliveryDate).toLocaleDateString('en-EG')
                  : '—',
              },

              {
                label: 'Payment Method',
                value: order.paymentMethod || '—',
              },

              {
                label: 'Received',
                value: order.received ? '✅ Yes' : '❌ No',
              },
            ].map((b) => (
              <div
                key={b.label}
                style={{
                  background: 'var(--bg)',
                  borderRadius: 8,
                  padding: '10px 12px',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: 'var(--muted)',
                    marginBottom: 2,
                  }}
                >
                  {b.label}
                </p>

                <p style={{ fontSize: 13, fontWeight: 500 }}>
                  {b.value}
                </p>
              </div>
            ))}

            {/* DESCRIPTION */}
            <div
              style={{
                gridColumn: '1/-1',
                background: 'var(--bg)',
                borderRadius: 8,
                padding: '10px 12px',
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: 'var(--muted)',
                  marginBottom: 2,
                }}
              >
                Description
              </p>

              <p style={{ fontSize: 13 }}>
                {order.description}
              </p>
            </div>
          </div>

          {/* PAYMENT PROOF */}
          {order.paymentProof && (
            <div style={{ marginBottom: 16 }}>

              <p
                style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  marginBottom: 8,
                }}
              >
                Payment Proof
              </p>

              <img
                src={order.paymentProof}
                alt="Payment proof"
                onClick={() => setPreview(order.paymentProof)}
                style={{
                  width: '100%',
                  maxHeight: 220,
                  objectFit: 'cover',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  cursor: 'zoom-in',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  marginTop: 8,
                  fontSize: 12,
                  color: order.isPaid
                    ? 'var(--success)'
                    : 'var(--danger)',
                }}
              >
                {order.isPaid
                  ? '✅ Payment Verified'
                  : '⏳ Awaiting Verification'}
              </div>
            </div>
          )}

          {/* STATUS UPDATE */}
          <div
            style={{
              paddingTop: 16,
              borderTop: '1px solid var(--border)',
            }}
          >

            <p
              style={{
                fontSize: 13,
                marginBottom: 10,
                fontWeight: 500,
              }}
            >
              Update Status
            </p>

            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-input"
                style={{
                  minWidth: 180,
                }}
              >
                {ALL_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-primary"
                disabled={updating}
                onClick={handleStatus}
              >
                {updating
                  ? 'Saving...'
                  : '💾 Save Status'}
              </button>

              <span
                className={`badge ${
                  STATUS_COLOR[status] || ''
                }`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CustomOrders() {
  const [orders,      setOrders]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('All')
  const [quoteOrder,  setQuoteOrder]  = useState(null)
  const [detailOrder, setDetailOrder] = useState(null)

  const STATUSES = ['All', 'Pending', 'Quoted', 'Accepted', 'Paid', 'Preparing', 'Delivered', 'Cancelled']

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = { limit: 50 }
      if (filter !== 'All') params.status = filter
      const { data } = await api.get('/custom-orders/admin/all', { params })
      setOrders(data.orders || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [filter])

  const handleSaveQuote = async (id, price, note) => {
    try {
      const { data } = await api.patch(`/custom-orders/admin/${id}/quote`, {
        quotedPrice: Number(price), adminNote: note
      })
      setOrders(prev => prev.map(o => o._id === id ? data.order : o))
    } catch (err) { console.error(err) }
  }

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.patch(`/custom-orders/admin/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? data.order : o))
      setDetailOrder(prev => prev?._id === id ? data.order : prev)
    } catch (err) { console.error(err) }
  }

  const pendingCount = orders.filter(o => o.status === 'Pending').length
  const paidCount    = orders.filter(o => o.isPaid).length

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:600 }}>Custom Cake Orders</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>
            {orders.length} orders · {pendingCount} need pricing · {paidCount} paid
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} className="btn btn-sm"
            style={{ background:filter===s?'#0f0f1a':'#fff', color:filter===s?'#fff':'var(--muted)', border:`1px solid ${filter===s?'#0f0f1a':'var(--border)'}` }}>
            {s}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>Loading...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>No orders found.</div>
        ) : (
          <div className="table-wrap">
<table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Customer</th><th>Description</th>
                <th>Size</th><th>Quote</th><th>Payment</th>
                <th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td style={{ fontWeight:500 }}>#{o._id.slice(-6).toUpperCase()}</td>
                  <td>
                    <div style={{ fontWeight:500 }}>{o.user?.userName}</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>{o.phone}</div>
                  </td>
                  <td style={{ maxWidth:160 }}>
                    <p style={{ fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {o.description}
                    </p>
                  </td>
                  <td style={{ fontSize:12 }}>{o.size || '—'}</td>
                  <td style={{ fontWeight:500 }}>
                    {o.quotedPrice ? `EGP ${o.quotedPrice.toLocaleString()}` : <span style={{ color:'var(--muted)' }}>—</span>}
                  </td>
                  <td>
                    <span className={`badge ${o.isPaid ? 'badge-paid' : 'badge-unpaid'}`}>
                      {o.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_COLOR[o.status] || ''}`}>{o.status}</span>
                  </td>
                  <td style={{ fontSize:12, color:'var(--muted)' }}>
                    {new Date(o.createdAt).toLocaleDateString('en-EG', { day:'numeric', month:'short' })}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-sm btn-outline" onClick={() => setDetailOrder(o)}>👁</button>
                      {o.status === 'Pending' && (
                        <button className="btn btn-sm btn-primary" onClick={() => setQuoteOrder(o)}>
                          💰 Quote
                        </button>
                      )}
                      {o.status === 'Quoted' && (
                        <button className="btn btn-sm btn-outline" onClick={() => setQuoteOrder(o)}>
                          ✏️ Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        )}
      </div>

      {quoteOrder && (
        <QuoteModal order={quoteOrder} onClose={() => setQuoteOrder(null)} onSave={handleSaveQuote} />
      )}
      {detailOrder && (
        <DetailModal order={detailOrder} onClose={() => setDetailOrder(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  )
}
