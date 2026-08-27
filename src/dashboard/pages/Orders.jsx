
import { useEffect, useState } from 'react'
import { ordersAPI } from '../api/index.js'
import { Link, useNavigate } from 'react-router-dom'

const STATUSES = ['All','Pending','Confirmed','Preparing','Shipped','Delivered','Cancelled']

export default function Orders() {
  const [orders,   setOrders]   = useState([])
  const [filter,   setFilter]   = useState('All')
  const [loading,  setLoading]  = useState(true)
  const [updating, setUpdating] = useState(null)
  const [page,     setPage]     = useState(1)
  const [total,    setTotal]    = useState(0)
  const LIMIT = 20

  const fetchOrders = async (p = 1, status = filter) => {
    setLoading(true)
    try {
      const params = { limit: LIMIT, page: p }
      if (status !== 'All') params.status = status
      const r = await ordersAPI.getAll(params)
      setOrders(r.data.orders || [])
      setTotal(r.data.total  || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders(1, filter) }, [filter])

  const navigate = useNavigate()
  const handleStatus = async (id, status) => {
  // لو Delivered → روح لصفحة الـ OrderTracking عشان الأدمن يأكد
  if (status === 'Delivered') {
  navigate(`/orders/${id}?confirm=delivery`)
  return
  }
  setUpdating(id)
  try {
    await ordersAPI.updateStatus(id, status)
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
  } catch (err) {
    console.error(err)
  } finally {
    setUpdating(null)
  }
}
  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:18, fontWeight:600 }}>Orders</h2>
        <p style={{ color:'var(--muted)', fontSize:13 }}>
          {total} total orders · showing page {page} of {totalPages || 1}
        </p>
      </div>

      {/* Status filters */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1) }}
            className="btn btn-sm"
            style={{
              background: filter===s ? '#0f0f1a' : '#fff',
              color:      filter===s ? '#fff'    : 'var(--muted)',
              border:     `1px solid ${filter===s ? '#0f0f1a' : 'var(--border)'}`,
            }}>
            {s}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>No orders found.</div>
        ) : (
          <>
            <div className="table-wrap">
<table className="table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Phone</th>
                  <th>Items</th><th>Total</th><th>Payment</th>
                  <th>Status</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>
                      <Link to={`/orders/${o._id}`}
                        style={{ color:'var(--info)', textDecoration:'none', fontWeight:500 }}>
                        #{o._id?.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td>{o.shippingAddress?.name}</td>
                    <td style={{ color:'var(--muted)' }}>{o.shippingAddress?.phone}</td>
                    <td>{o.items?.length}</td>
                    <td style={{ fontWeight:500 }}>EGP {(o.total||0).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${o.isPaid ? 'badge-paid' : 'badge-unpaid'}`}>
                        {o.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${o.status?.toLowerCase()}`}>{o.status}</span>
                    </td>
                    <td style={{ color:'var(--muted)', fontSize:12 }}>
                      {new Date(o.createdAt).toLocaleDateString('en-EG', { day:'numeric', month:'short' })}
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <Link to={`/admin/orders/${o._id}/edit`}>
                          <button className="btn btn-sm btn-outline">👁</button>
                        </Link>
                        <select
                          value={o.status}
                          disabled={updating === o._id}
                          onChange={e => handleStatus(o._id, e.target.value)}
                          style={{
                            fontSize:11, padding:'4px 6px',
                            border:'1px solid var(--border)', borderRadius:6,
                            background:'var(--card)', color:'var(--text)', cursor:'pointer'
                          }}>
                          {['Pending','Confirmed','Preparing','Shipped','Delivered','Cancelled'].map(s =>
                            <option key={s}>{s}</option>
                          )}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
</div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:8, padding:'16px 0 0' }}>
                <button className="btn btn-sm btn-outline"
                  disabled={page === 1}
                  onClick={() => { setPage(p => p-1); fetchOrders(page-1) }}>
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                  <button key={p}
                    className="btn btn-sm"
                    style={{
                      background: p===page ? '#0f0f1a' : '#fff',
                      color: p===page ? '#fff' : 'var(--muted)',
                      border: `1px solid ${p===page ? '#0f0f1a' : 'var(--border)'}`,
                    }}
                    onClick={() => { setPage(p); fetchOrders(p) }}>
                    {p}
                  </button>
                ))}
                <button className="btn btn-sm btn-outline"
                  disabled={page === totalPages}
                  onClick={() => { setPage(p => p+1); fetchOrders(page+1) }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
