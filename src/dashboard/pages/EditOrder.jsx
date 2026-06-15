import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ordersAPI, productsAPI } from '../api/index.js'

const STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Delivered', 'Cancelled']

const STATUS_META = {
  Pending:   { color: '#f59e0b', bg: '#fef3c7', label: 'Pending' },
  Confirmed: { color: '#3b82f6', bg: '#dbeafe', label: 'Confirmed' },
  Preparing: { color: '#8b5cf6', bg: '#ede9fe', label: 'Preparing' },
  Shipped:   { color: '#06b6d4', bg: '#cffafe', label: 'Shipped' },
  Delivered: { color: '#10b981', bg: '#d1fae5', label: 'Delivered' },
  Cancelled: { color: '#ef4444', bg: '#fee2e2', label: 'Cancelled' },
}

const Field = ({ label, value, mono }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
      {label}
    </span>
    <span style={{ fontSize: 14, color: 'var(--text)', fontFamily: mono ? 'monospace' : 'inherit', fontWeight: 500 }}>
      {value || '—'}
    </span>
  </div>
)

export default function EditOrder() {
  const { id }       = useParams()
  const navigate     = useNavigate()

  const [order,    setOrder]    = useState(null)
  const [status,   setStatus]   = useState('')
  const [note,     setNote]     = useState('')
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState(null)
  const [success,  setSuccess]  = useState(false)

  // product modal
  const [modalProduct,        setModalProduct]        = useState(null)
  const [modalLoading,        setModalLoading]        = useState(false)
  const [modalSelectedImage,  setModalSelectedImage]  = useState(null)

  // lightbox
  const [lightboxSrc, setLightboxSrc] = useState(null)

  /* ── fetch ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await ordersAPI.getOne(id)
        const o   = res.data.order ?? res.data
        setOrder(o)
        setStatus(o.status)
      } catch (e) {
        setError('Failed to load order.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  /* ── save status ── */
  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      await ordersAPI.updateStatus(id, status, note)
      setOrder(prev => ({ ...prev, status }))
      setSuccess(true)
      setNote('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError('Failed to update status.')
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  /* ── open product modal ── */
  const openProductModal = async (productId) => {
    setModalProduct(null)
    setModalSelectedImage(null)
    setModalLoading(true)
    try {
      const res = await productsAPI.getOne(productId)
      const p   = res.data.product ?? res.data
      setModalProduct(p)
      setModalSelectedImage(p.image)
    } catch (e) {
      console.error(e)
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => { setModalProduct(null); setModalLoading(false) }

  /* ── close on Escape ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { closeModal(); setLightboxSrc(null) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--muted)', gap: 10 }}>
      <span style={{ fontSize: 20 }}>⏳</span> Loading order…
    </div>
  )

  if (error && !order) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
      <span style={{ fontSize: 32 }}>⚠️</span>
      <p style={{ color: 'var(--muted)' }}>{error}</p>
      <button className="btn btn-sm btn-outline" onClick={() => navigate('/admin/orders')}>← Back to Orders</button>
    </div>
  )

  const meta    = STATUS_META[order.status] ?? STATUS_META.Pending
  const newMeta = STATUS_META[status]       ?? STATUS_META.Pending
  const changed = status !== order.status

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/admin/orders"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34,
            borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none',
            fontSize: 16, background: 'var(--card)' }}>
          ←
        </Link>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            Order <span style={{ fontFamily: 'monospace', color: 'var(--muted)' }}>#{id?.slice(-6).toUpperCase()}</span>
          </h2>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
            background: meta.bg, color: meta.color }}>
            {meta.label}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Customer & Shipping */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>👤</span> Customer & Shipping
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Full Name"  value={order.shippingAddress?.name} />
              <Field label="Phone"      value={order.shippingAddress?.phone} mono />
              <Field label="City"       value={order.shippingAddress?.city} />
              <Field label="Address"    value={order.shippingAddress?.address} />
            </div>
          </div>

          {/* Order Items */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🛒</span> Items ({order.items?.length || 0})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {order.items?.map((item, i) => {
                const isCustom   = !item.product
                const finalPrice = item.price
                const hasDiscount= item.discount > 0
                const subtotal   = finalPrice * (item.qty || 1)
                const canModal   = !!item.product?._id

                return (
                  <div key={i} style={{
                    borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--bg)', overflow: 'hidden',
                  }}>
                    {/* Top: image + title row */}
                    <div style={{ display: 'flex', gap: 0 }}>

                      {/* Image */}
                      <div style={{ position: 'relative', flexShrink: 0, width: 110 }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          onClick={() => canModal ? openProductModal(item.product._id) : setLightboxSrc(item.image)}
                          style={{
                            width: '100%', height: 110, objectFit: 'cover',
                            cursor: 'zoom-in',
                            display: 'block',
                          }}
                        />
                        {/* type badge */}
                        <div style={{
                          position: 'absolute', top: 6, left: 6,
                          background: isCustom ? 'rgba(139,92,246,.85)' : 'rgba(15,15,26,.75)',
                          color: '#fff', fontSize: 10, fontWeight: 700,
                          padding: '2px 7px', borderRadius: 6,
                        }}>
                          {isCustom ? '🎂 Custom' : '📦 Product'}
                        </div>
                        {canModal && (
                          <div style={{
                            position: 'absolute', bottom: 6, right: 6,
                            background: 'rgba(0,0,0,.55)', color: '#fff',
                            fontSize: 10, padding: '2px 6px', borderRadius: 5,
                          }}>
                            🔍 Details
                          </div>
                        )}
                      </div>

                      {/* Title + price */}
                      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 14, margin: 0, lineHeight: 1.4 }}>{item.title}</p>
                          {item.product?._id && (
                            <p style={{ fontSize: 10, color: 'var(--muted)', margin: '3px 0 0', fontFamily: 'monospace' }}>
                              ID: {item.product._id.slice(-8)}
                            </p>
                          )}
                          {isCustom && (
                            <span style={{ display: 'inline-block', marginTop: 4, fontSize: 10, fontWeight: 600,
                              padding: '2px 8px', borderRadius: 10, background: '#ede9fe', color: '#7c3aed' }}>
                              Custom Order Item
                            </span>
                          )}
                        </div>

                        {/* Subtotal */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20,
                              background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                              Qty: <strong>{item.qty}</strong>
                            </span>
                            {hasDiscount && (
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                                background: '#fee2e2', color: '#ef4444' }}>
                                -{item.discount}%
                              </span>
                            )}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: 800, fontSize: 16, margin: 0, color: '#0f0f1a' }}>
                              EGP {subtotal.toLocaleString()}
                            </p>
                            <p style={{ fontSize: 11, color: 'var(--muted)', margin: '2px 0 0' }}>
                              {item.qty} × EGP {finalPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              {order.discount > 0 && (
                <div style={{ display: 'flex', gap: 32, fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>Discount</span>
                  <span style={{ color: '#ef4444' }}>- EGP {(order.discount || 0).toLocaleString()}</span>
                </div>
              )}
              {order.deliveryFee > 0 && (
                <div style={{ display: 'flex', gap: 32, fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>Delivery Fee</span>
                  <span>EGP {(order.deliveryFee || 0).toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 32, fontSize: 15, fontWeight: 700 }}>
                <span>Total</span>
                <span>EGP {(order.total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>💳</span> Payment
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Method"  value={order.paymentMethod} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Status</span>
                <span style={{ fontSize: 13, fontWeight: 600,
                  color: order.isPaid ? '#10b981' : '#f59e0b' }}>
                  {order.isPaid ? '✅ Paid' : '⏳ Unpaid'}
                </span>
              </div>
            </div>

            {/* Payment proof image */}
            {order.paymentProof && (
              <div style={{ marginTop: 16 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 8 }}>
                  Payment Proof
                </span>
                <a href={order.paymentProof} target="_blank" rel="noreferrer">
                  <img src={order.paymentProof} alt="Payment proof"
                    style={{ maxWidth: 220, borderRadius: 10, border: '1px solid var(--border)', cursor: 'zoom-in' }} />
                </a>
              </div>
            )}
          </div>

          {/* Status History */}
          {order.statusHistory?.length > 0 && (
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📋</span> Status History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {order.statusHistory.map((h, i) => {
                  const hm = STATUS_META[h.status] ?? STATUS_META.Pending
                  return (
                    <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: i < order.statusHistory.length - 1 ? 16 : 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: hm.color, marginTop: 3, flexShrink: 0 }} />
                        {i < order.statusHistory.length - 1 && (
                          <div style={{ width: 2, flex: 1, background: 'var(--border)', margin: '4px 0' }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: hm.color }}>{h.status}</span>
                          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                            {new Date(h.changedAt).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {h.note && <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>{h.note}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column: Update Status ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚙️</span> Update Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {STATUSES.map(s => {
                const m       = STATUS_META[s]
                const active  = status === s
                return (
                  <button key={s} onClick={() => setStatus(s)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                      border: active ? `2px solid ${m.color}` : '1px solid var(--border)',
                      background: active ? m.bg : 'var(--card)',
                      color: active ? m.color : 'var(--text)',
                      fontWeight: active ? 700 : 400, fontSize: 13,
                      transition: 'all .15s',
                    }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                    {s}
                    {active && <span style={{ marginLeft: 'auto', fontSize: 16 }}>✓</span>}
                  </button>
                )
              })}
            </div>

            {/* Note */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 6 }}>
                Note (optional)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note for this status change…"
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text)', fontSize: 13, resize: 'vertical',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Preview badge */}
            {changed && (
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                Change:
                <span style={{ padding: '2px 8px', borderRadius: 12, background: meta.bg, color: meta.color, fontWeight: 600 }}>{order.status}</span>
                →
                <span style={{ padding: '2px 8px', borderRadius: 12, background: newMeta.bg, color: newMeta.color, fontWeight: 600 }}>{status}</span>
              </div>
            )}

            {success && (
              <div style={{ padding: '8px 12px', borderRadius: 8, background: '#d1fae5', color: '#065f46', fontSize: 13, marginBottom: 12 }}>
                ✅ Status updated successfully!
              </div>
            )}

            {error && (
              <div style={{ padding: '8px 12px', borderRadius: 8, background: '#fee2e2', color: '#991b1b', fontSize: 13, marginBottom: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !changed}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 8, border: 'none',
                background: changed ? '#0f0f1a' : 'var(--border)',
                color: changed ? '#fff' : 'var(--muted)',
                fontWeight: 600, fontSize: 14, cursor: changed ? 'pointer' : 'not-allowed',
                transition: 'all .15s',
              }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* Quick Info */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>ℹ️</span> Order Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Order ID"       value={`#${id?.slice(-6).toUpperCase()}`} mono />
              <Field label="Items Count"    value={order.items?.length} />
              <Field label="Order Total"    value={`EGP ${(order.total || 0).toLocaleString()}`} />
              <Field label="Payment"        value={order.isPaid ? 'Paid ✅' : 'Unpaid ⏳'} />
              <Field label="Created At"
                value={new Date(order.createdAt).toLocaleDateString('en-EG', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })} />
              {order.expectedDelivery && (
                <Field label="Expected Delivery"
                  value={new Date(order.expectedDelivery).toLocaleDateString('en-EG', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 1100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'zoom-out' }}>
          <button
            onClick={() => setLightboxSrc(null)}
            style={{ position: 'absolute', top: 16, right: 20, background: 'rgba(255,255,255,.15)',
              border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer',
              borderRadius: '50%', width: 36, height: 36, lineHeight: 1 }}>
            ×
          </button>
          <img
            src={lightboxSrc}
            alt="preview"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12,
              objectFit: 'contain', boxShadow: '0 24px 60px rgba(0,0,0,.5)' }}
          />
        </div>
      )}

      {/* ── Product Modal ── */}
      {(modalLoading || modalProduct) && (
        <div
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--card)', borderRadius: 16, width: '100%', maxWidth: 620,
              maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,.3)' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Product Details</span>
              <button onClick={closeModal}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer',
                  color: 'var(--muted)', lineHeight: 1, padding: '0 4px' }}>×</button>
            </div>

            {modalLoading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 200, color: 'var(--muted)', gap: 10 }}>
                <span style={{ fontSize: 20 }}>⏳</span> Loading product…
              </div>
            )}

            {modalProduct && (() => {
              const p          = modalProduct
              const allImages  = [p.image, ...(p.images || [])].filter(Boolean)
              const finalPrice = p.price - (p.price * (p.discount || 0)) / 100
              const stars      = Math.round(p.averageRating || 0)

              return (
                <div style={{ padding: 20 }}>
                  {/* Main image */}
                  <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 12,
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minHeight: 260 }}>
                    <img src={modalSelectedImage || p.image} alt={p.title}
                      style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }} />
                  </div>

                  {/* Thumbnails */}
                  {allImages.length > 1 && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                      {allImages.map((img, i) => (
                        <img key={i} src={img} alt={`img-${i}`}
                          onClick={() => setModalSelectedImage(img)}
                          style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', cursor: 'pointer',
                            border: modalSelectedImage === img
                              ? '2px solid #0f0f1a'
                              : '2px solid var(--border)',
                            transition: 'border .15s' }} />
                      ))}
                    </div>
                  )}

                  {/* Title + badges */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{p.title}</h3>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace' }}>
                        ID: {p._id}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 12,
                        background: p.isActive ? '#d1fae5' : '#fee2e2',
                        color: p.isActive ? '#065f46' : '#991b1b', fontWeight: 600 }}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {p.isFeatured && (
                        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 12,
                          background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
                    padding: '12px 14px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '.06em' }}>Final Price</p>
                      <p style={{ fontSize: 20, fontWeight: 800, margin: '2px 0 0', color: '#0f0f1a' }}>
                        EGP {finalPrice.toLocaleString()}
                      </p>
                    </div>
                    {p.discount > 0 && (
                      <>
                        <div style={{ width: 1, height: 36, background: 'var(--border)' }} />
                        <div>
                          <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '.06em' }}>Original</p>
                          <p style={{ fontSize: 14, margin: '2px 0 0', color: 'var(--muted)', textDecoration: 'line-through' }}>
                            EGP {p.price.toLocaleString()}
                          </p>
                        </div>
                        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 12,
                          background: '#fee2e2', color: '#ef4444', fontWeight: 700 }}>
                          -{p.discount}%
                        </span>
                      </>
                    )}
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '.06em' }}>Stock</p>
                      <p style={{ fontSize: 15, fontWeight: 700, margin: '2px 0 0',
                        color: p.stock > 10 ? '#10b981' : p.stock > 0 ? '#f59e0b' : '#ef4444' }}>
                        {p.stock} units
                      </p>
                    </div>
                  </div>

                  {/* Meta grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '.06em' }}>Category</p>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: '4px 0 0', textTransform: 'capitalize' }}>{p.category}</p>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '.06em' }}>Rating</p>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: '4px 0 0' }}>
                        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                        <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: 6 }}>
                          {(p.averageRating || 0).toFixed(1)} ({p.numReviews} reviews)
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {p.description && (
                    <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg)',
                      border: '1px solid var(--border)', marginBottom: 16 }}>
                      <p style={{ fontSize: 10, color: 'var(--muted)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Description</p>
                      <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>{p.description}</p>
                    </div>
                  )}

                  <button onClick={closeModal}
                    style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: '1px solid var(--border)',
                      background: 'var(--card)', color: 'var(--text)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                    Close
                  </button>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}