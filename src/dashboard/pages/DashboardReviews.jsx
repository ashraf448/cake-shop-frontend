import { useEffect, useState } from 'react'
import  api  from '../api/index.js'

export default function DashboardReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')

  useEffect(() => {
    api.get('/reviews/admin/all')
      .then(r => setReviews(r.data.reviews || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/reviews/${id}/${action}`)
      setReviews(prev => prev.map(r =>
        r._id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r
      ))
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return
    try {
      await api.delete(`/reviews/${id}`)
      setReviews(prev => prev.filter(r => r._id !== id))
    } catch (err) { console.error(err) }
  }

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter)
  const pendingCount  = reviews.filter(r => r.status === 'pending').length

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:600 }}>Customer Reviews</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>
            {reviews.length} total · {pendingCount} pending approval
          </p>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {['all','pending','approved','rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn btn-sm"
            style={{ background:filter===f?'#0f0f1a':'#fff', color:filter===f?'#fff':'var(--muted)', border:`1px solid ${filter===f?'#0f0f1a':'var(--border)'}`, textTransform:'capitalize' }}>
            {f} {f==='pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>No reviews found.</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:14 }}>
          {filtered.map(r => (
            <div key={r._id} className="card" style={{ padding:16 }}>
              {/* Status badge */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {r.image && <img src={r.image} alt="" style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', border:'1px solid var(--border)' }} />}
                  <div>
                    <p style={{ fontWeight:600, fontSize:13 }}>{r.name}</p>
                    <p style={{ fontSize:11, color:'var(--muted)' }}>{r.email}</p>
                  </div>
                </div>
                <span className={`badge ${r.status==='approved'?'badge-instock':r.status==='rejected'?'badge-out':'badge-low'}`}>
                  {r.status}
                </span>
              </div>

              {/* Stars */}
              <div style={{ color:'#f0c040', marginBottom:8, fontSize:14 }}>
                {'★'.repeat(r.rating || 5)}{'☆'.repeat(5-(r.rating||5))}
              </div>

              {/* Message */}
              <p style={{ fontSize:13, color:'var(--text)', marginBottom:12, lineHeight:1.5 }}>{r.message}</p>

              {/* Date */}
              <p style={{ fontSize:11, color:'var(--muted)', marginBottom:12 }}>
                {new Date(r.createdAt).toLocaleDateString('en-EG', { day:'numeric', month:'short', year:'numeric' })}
              </p>

              {/* Actions */}
              <div style={{ display:'flex', gap:6 }}>
                {r.status !== 'approved' && (
                  <button className="btn btn-sm" style={{ flex:1, background:'var(--success)', color:'#fff', border:'none' }}
                    onClick={() => handleAction(r._id, 'approve')}>
                    ✓ Approve
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button className="btn btn-sm btn-outline" style={{ flex:1 }}
                    onClick={() => handleAction(r._id, 'reject')}>
                    ✕ Reject
                  </button>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r._id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
