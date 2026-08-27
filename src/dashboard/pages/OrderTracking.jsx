

import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ordersAPI } from '../api/index.js'

const STEPS = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Delivered']

// ─── Delivery Confirmation Modal ───────────────────────────────────────────────
function DeliveryModal({ onConfirm, onClose, loading }) {
  const fileRef = useRef()
  const [receivedBy, setReceivedBy] = useState('')
  const [note,       setNote]       = useState('')
  const [preview,    setPreview]    = useState('')

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div className="card" style={{ width:'min(460px, 92vw)', padding:28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <h3 style={{ fontSize:16, fontWeight:700 }}>🎉 Confirm Delivery</h3>
            <p style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>أدخل تفاصيل التوصيل قبل التأكيد</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'var(--muted)' }}>✕</button>
        </div>

        <div className="form-group" style={{ marginBottom:14 }}>
          <label className="form-label">Received By (اختياري)</label>
          <input className="form-input" placeholder="اسم المستلم" value={receivedBy} onChange={e => setReceivedBy(e.target.value)} />
        </div>

        <div className="form-group" style={{ marginBottom:14 }}>
          <label className="form-label">Delivery Note (اختياري)</label>
          <textarea className="form-input" placeholder="e.g. Delivered in good condition..."
            rows={3} style={{ resize:'none' }} value={note} onChange={e => setNote(e.target.value)} />
        </div>

        <div className="form-group" style={{ marginBottom:20 }}>
          <label className="form-label">صورة إثبات التوصيل (اختياري)</label>
          <div onClick={() => fileRef.current.click()}
            style={{ border:'2px dashed var(--border)', borderRadius:10, padding:16, textAlign:'center', cursor:'pointer', background:'var(--bg)', minHeight:80, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {preview
              ? <img src={preview} alt="proof" style={{ maxHeight:120, borderRadius:8, objectFit:'contain' }} />
              : <div><div style={{ fontSize:28, marginBottom:4 }}>📷</div><p style={{ fontSize:12, color:'var(--muted)' }}>Click to upload photo</p></div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => { const f = e.target.files[0]; if (f) setPreview(URL.createObjectURL(f)) }} />
          {preview && (
            <button type="button" onClick={() => setPreview('')}
              style={{ fontSize:11, color:'var(--danger)', background:'none', border:'none', cursor:'pointer', marginTop:4 }}>
              Remove image
            </button>
          )}
        </div>

        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-outline" style={{ flex:1 }} onClick={onClose} disabled={loading}>Cancel</button>
          <button disabled={loading}
            style={{ flex:2, background:'var(--success)', color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontWeight:600 }}
            onClick={() => onConfirm({ receivedBy, note })}>
            {loading ? 'Confirming...' : '✓ Confirm Delivery'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function OrderTracking() {
  const { id }         = useParams()
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()

  const [order,    setOrder]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [updating, setUpdating] = useState(false)
  const [approvingPayment,  setApprovingPayment]  = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)

  // جيب الأوردر
  useEffect(() => {
    ordersAPI.getOne(id)
      .then(r => setOrder(r.data.order))
      .catch(err => { console.error(err); setOrder(null) })
      .finally(() => setLoading(false))
  }, [id])

  // لو جاي من Orders page بـ ?confirm=delivery افتح الـ modal تلقائياً
  useEffect(() => {
    if (searchParams.get('confirm') === 'delivery' && order) {
      setShowDeliveryModal(true)
    }
  }, [order, searchParams])

  // ── تغيير الـ status عادي ───────────────────────────────────────────────────
  const handleStatus = async (status) => {
    if (status === 'Delivered') { setShowDeliveryModal(true); return }
    setUpdating(true)
    try {
      await ordersAPI.updateStatus(order._id, status)
      setOrder(prev => ({ ...prev, status }))
    } catch (err) { console.error(err) }
    finally { setUpdating(false) }
  }

  // ── تأكيد الـ delivery من الـ modal ─────────────────────────────────────────
  const handleConfirmDelivery = async ({ receivedBy, note }) => {
    setUpdating(true)
    try {
      const fullNote = [note, receivedBy ? `Received by: ${receivedBy}` : '']
        .filter(Boolean).join(' · ') || 'Order delivered successfully'

      await ordersAPI.updateStatus(order._id, 'Delivered', fullNote)
      setOrder(prev => ({ ...prev, status: 'Delivered', deliveryNote: note, deliveryReceivedBy: receivedBy }))
      setShowDeliveryModal(false)
    } catch (err) { console.error(err) }
    finally { setUpdating(false) }
  }

  // ── Approve/Reject payment ──────────────────────────────────────────────────
  const handleApprovePayment = async (approved) => {
    setApprovingPayment(true)
    try {
      const newStatus = approved ? 'Confirmed' : 'Cancelled'
      await ordersAPI.updateStatus(order._id, newStatus)
      setOrder(prev => ({ ...prev, isPaid: approved, status: newStatus }))
    } catch (err) { console.error(err) }
    finally { setApprovingPayment(false) }
  }

  // ── Loading / not found ─────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ padding:40, textAlign:'center', color:'var(--muted)' }}>
      <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>Loading order...
    </div>
  )

  if (!order) return (
    <div style={{ padding:40, textAlign:'center', color:'var(--muted)' }}>
      <div style={{ fontSize:32, marginBottom:12 }}>❌</div>
      Order not found.<br />
      <button className="btn btn-outline btn-sm" style={{ marginTop:12 }} onClick={() => navigate('/orders')}>← Back to Orders</button>
    </div>
  )

  const isCancelled = order.status === 'Cancelled'
  const isDelivered = order.status === 'Delivered'
  const currentStep = isCancelled ? -1 : STEPS.indexOf(order.status)

  return (
    <div>
      {/* Delivery Modal */}
      {showDeliveryModal && (
        <DeliveryModal
          loading={updating}
          onClose={() => setShowDeliveryModal(false)}
          onConfirm={handleConfirmDelivery}
        />
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/orders')}>← Back</button>
        <div>
          <h2 style={{ fontSize:18, fontWeight:600 }}>Order #{order._id?.slice(-6).toUpperCase()}</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-EG', { day:'numeric', month:'long', year:'numeric' })}
          </p>
        </div>
        <div style={{ marginLeft:'auto' }}>
          <span className={`badge badge-${order.status?.toLowerCase()}`} style={{ fontSize:13, padding:'4px 12px' }}>{order.status}</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid-4" style={{ gap:12, marginBottom:18 }}>
        {[
          { label:'Customer', value: order.shippingAddress?.name },
          { label:'Phone',    value: order.shippingAddress?.phone },
          { label:'Payment',  value: `${order.paymentMethod} · ${order.isPaid ? '✅ Paid' : '❌ Unpaid'}` },
          { label:'Total',    value: `EGP ${order.total?.toLocaleString()}` },
        ].map(b => (
          <div key={b.label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px' }}>
            <div style={{ fontSize:11, color:'var(--muted)', marginBottom:4, textTransform:'uppercase', letterSpacing:'.05em' }}>{b.label}</div>
            <div style={{ fontSize:13, fontWeight:500 }}>{b.value}</div>
          </div>
        ))}
      </div>

      {/*  تعديل تاريخ التسليم */}
<div className="card" style={{ marginBottom:18 }}>
  <div className="card-header"><span className="card-title">📅 Expected Delivery</span></div>
  <div style={{ display:'flex', gap:12, alignItems:'center', padding:'8px 0' }}>
    <input type="date" className="form-input"
      defaultValue={order.expectedDelivery ? new Date(order.expectedDelivery).toISOString().split('T')[0] : ''}
      onChange={async (e) => {
        await ordersAPI.updateDeliveryDate(order._id, e.target.value)
        setOrder(prev => ({ ...prev, expectedDelivery: e.target.value }))
        toast?.success('Delivery date updated')
      }}
    />
  </div>
</div>

      {/* Delivered banner */}
      {isDelivered && (
        <div style={{ background:'#e6f5ee', border:'1px solid var(--success)', borderRadius:12, padding:'16px 20px', marginBottom:18, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:28 }}>🎉</span>
          <div>
            <p style={{ fontWeight:600, color:'var(--success)', fontSize:14 }}>Order Delivered Successfully</p>
            {order.deliveryReceivedBy && <p style={{ fontSize:12, color:'var(--muted)' }}>Received by: {order.deliveryReceivedBy}</p>}
            {order.deliveryNote       && <p style={{ fontSize:12, color:'var(--muted)' }}>Note: {order.deliveryNote}</p>}
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="card" style={{ marginBottom:18 }}>
        <div className="card-header"><span className="card-title">Order Lifecycle</span></div>

        {isCancelled ? (
          <div style={{ padding:'20px 0', textAlign:'center', color:'var(--danger)', fontWeight:600 }}>✕ This order has been cancelled</div>
        ) : (
          <div style={{ display:'flex', alignItems:'center', margin:'16px 0' }}>
            {STEPS.map((step, i) => {
              const done    = i < currentStep || isDelivered
              const current = i === currentStep && !isDelivered
              return (
                <div key={step} style={{ flex:1, textAlign:'center', position:'relative' }}>
                  {i < STEPS.length - 1 && (
                    <div style={{ position:'absolute', top:16, left:'50%', width:'100%', height:2, background: done ? 'var(--success)' : 'var(--border)', zIndex:0 }} />
                  )}
                  <div style={{
                    width:32, height:32, borderRadius:'50%', margin:'0 auto 8px',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    position:'relative', zIndex:1, fontSize:13, fontWeight:600,
                    background: done ? 'var(--success)' : current ? '#e6f0ff' : 'var(--card)',
                    color:      done ? '#fff'            : current ? 'var(--info)' : 'var(--muted)',
                    border:     `2px solid ${done ? 'var(--success)' : current ? 'var(--info)' : 'var(--border)'}`,
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize:11, fontWeight: current ? 600 : 400, color: done ? 'var(--success)' : current ? 'var(--info)' : 'var(--muted)' }}>
                    {step}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Status buttons */}
        {!isDelivered && !isCancelled && (
          <div style={{ display:'flex', gap:8, paddingTop:16, borderTop:'1px solid var(--border)', flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'var(--muted)', alignSelf:'center' }}>Update status:</span>
            {STEPS.filter((_, i) => i > currentStep).map(s => (
              <button key={s} disabled={updating} className="btn btn-sm"
                style={s === 'Delivered'
                  ? { background:'var(--success)', color:'#fff', border:'none' }
                  : { background:'var(--info)', color:'#fff', border:'none' }}
                onClick={() => handleStatus(s)}>
                {s === 'Delivered' ? '🎉 Mark as Delivered' : `→ Mark as ${s}`}
              </button>
            ))}
            <button className="btn btn-sm btn-danger" disabled={updating} onClick={() => handleStatus('Cancelled')}>✕ Cancel Order</button>
          </div>
        )}
      </div>

      {/* Items + Payment */}
      <div className="grid-2" style={{ gap:14 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Order Items ({order.items?.length})</span></div>
          <div className="table-wrap">
<table className="table">
            <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              {order.items?.map((item, i) => {
                const d = item.price - (item.price * (item.discount||0)) / 100
                return (
                  <tr key={i}>
                    <td style={{ fontWeight:500 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        {(item.image || item.product?.image) && <img src={item.image || item.product?.image} alt="" style={{ width:32, height:32, borderRadius:6, objectFit:'cover' }} />}
                        {item.title || item.product?.title}
                      </div>
                    </td>
                    <td>{item.qty}</td>
                    <td>EGP {d.toFixed(0)}</td>
                    <td>EGP {(d * item.qty).toFixed(0)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
</div>
          <div style={{ paddingTop:10, marginTop:6, borderTop:'1px solid var(--border)', fontSize:13 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}><span style={{ color:'var(--muted)' }}>Subtotal</span><span>EGP {order.subtotal?.toLocaleString()}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}><span style={{ color:'var(--muted)' }}>Shipping</span><span>EGP {order.shipping}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:600 }}><span>Total</span><span>EGP {order.total?.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Payment & Shipping</span></div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, color:'var(--muted)', marginBottom:6 }}>📍 Shipping Address</div>
            <div style={{ fontSize:13, fontWeight:500 }}>{order.shippingAddress?.name}</div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>{order.shippingAddress?.phone}</div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>{order.shippingAddress?.address}</div>
          </div>
          <div>
            <div style={{ fontSize:12, color:'var(--muted)', marginBottom:8 }}>💳 Payment Proof</div>
            {order.paymentProof ? (
              <div>
                <img src={order.paymentProof} alt="proof" style={{ width:'100%', borderRadius:8, border:'1px solid var(--border)', marginBottom:10 }} onError={e => e.target.style.display='none'} />
                {!order.isPaid ? (
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn btn-sm" style={{ flex:1, background:'var(--success)', color:'#fff', border:'none' }} disabled={approvingPayment} onClick={() => handleApprovePayment(true)}>✓ Approve</button>
                    <button className="btn btn-sm btn-danger" disabled={approvingPayment} onClick={() => handleApprovePayment(false)}>✕ Reject</button>
                  </div>
                ) : (
                  <div style={{ background:'#e6f5ee', borderRadius:8, padding:'10px 14px', fontSize:13, color:'var(--success)', textAlign:'center' }}>
                    ✅ Payment verified · {order.paymentMethod}
                    {order.paidAt && <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>{new Date(order.paidAt).toLocaleString('en-EG')}</div>}
                  </div>
                )}
              </div>
            ) : order.isPaid ? (
              <div style={{ background:'#e6f5ee', borderRadius:8, padding:'12px 16px', fontSize:13, color:'var(--success)', textAlign:'center' }}>✅ Payment verified · {order.paymentMethod}</div>
            ) : (
              <div style={{ background:'#fde8e8', borderRadius:8, padding:'12px 16px', fontSize:13, color:'var(--danger)', textAlign:'center' }}>⏳ Awaiting payment proof from customer</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
