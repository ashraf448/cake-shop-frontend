import { useEffect, useState } from 'react'
import { authAPI } from '../api/index.js'

const MOCK_USERS = [
  { _id:'1', userName:'Admin User',   email:'admin@example.com',  phone:'01012345678', role:'admin', createdAt:'2026-01-01', gender:'male' },
  { _id:'2', userName:'Ahmed Ali',    email:'ahmed@example.com',  phone:'01099887766', role:'user',  createdAt:'2026-03-15', gender:'male', blocked:false },
  { _id:'3', userName:'Sara Hassan',  email:'sara@example.com',   phone:'01155443322', role:'user',  createdAt:'2026-04-02', gender:'female', blocked:false },
  { _id:'4', userName:'Mohamed Nour', email:'m.nour@example.com', phone:'01012121212', role:'user',  createdAt:'2026-04-18', gender:'male', blocked:false },
  { _id:'5', userName:'Omar Samy',    email:'omar@example.com',   phone:'01234567890', role:'user',  createdAt:'2026-05-01', gender:'male', blocked:true },
  { _id:'6', userName:'Layla Khaled', email:'layla@example.com',  phone:'01098765432', role:'user',  createdAt:'2026-05-10', gender:'female', blocked:false },
]

const COLORS = ['#1a73e8','#7b3fd4','#2d9b6f','#e63946','#c97b0e','#0891b2']

export default function Users() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    authAPI.getUsers()
      .then(r => setUsers(r.data.users || []))
      .catch(() => setUsers(MOCK_USERS))
      .finally(() => setLoading(false))
  }, [])

  const toggleBlock = (id) => {
    setUsers(prev => prev.map(u => u._id === id ? { ...u, blocked: !u.blocked } : u))
  }

  const filtered = users.filter(u => {
    const matchSearch = u.userName?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase())
    if (filter === 'admins')  return matchSearch && u.role === 'admin'
    if (filter === 'blocked') return matchSearch && u.blocked
    return matchSearch
  })

  const total   = users.length
  const admins  = users.filter(u => u.role === 'admin').length
  const blocked = users.filter(u => u.blocked).length

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:18, fontWeight:600 }}>Users</h2>
        <p style={{ color:'var(--muted)', fontSize:13 }}>Manage customer accounts and access.</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        <div className="metric-card">
          <div className="metric-label">Total Users</div>
          <div className="metric-value">{total.toLocaleString()}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Admins</div>
          <div className="metric-value" style={{ color:'var(--purple)' }}>{admins}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Blocked</div>
          <div className="metric-value" style={{ color:'var(--danger)' }}>{blocked}</div>
        </div>
      </div>

      {/* Filters + search */}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14, gap:12, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:8 }}>
          {['all','admins','blocked'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="btn btn-sm"
              style={{
                background: filter===f ? '#0f0f1a' : '#fff',
                color: filter===f ? '#fff' : 'var(--muted)',
                border:`1px solid ${filter===f ? '#0f0f1a' : 'var(--border)'}`,
                textTransform:'capitalize',
              }}>
              {f === 'all' ? `All (${total})` : f === 'admins' ? `Admins (${admins})` : `Blocked (${blocked})`}
            </button>
          ))}
        </div>
        <input className="form-input" style={{ width:220 }}
          placeholder="Search name or email..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>Loading users...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Phone</th><th>Gender</th>
                <th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar" style={{
                        background: COLORS[i % COLORS.length] + '20',
                        color: COLORS[i % COLORS.length]
                      }}>
                        {u.userName?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight:500 }}>{u.userName}</span>
                    </div>
                  </td>
                  <td style={{ color:'var(--muted)' }}>{u.email}</td>
                  <td style={{ color:'var(--muted)' }}>{u.phone || '—'}</td>
                  <td style={{ textTransform:'capitalize', color:'var(--muted)' }}>{u.gender || '—'}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.blocked ? 'badge-blocked' : 'badge-active'}`}>
                      {u.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td style={{ color:'var(--muted)', fontSize:12 }}>
                    {new Date(u.createdAt).toLocaleDateString('en-EG',{month:'short',year:'numeric'})}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-sm btn-outline">✏️</button>
                      <button
                        className={`btn btn-sm ${u.blocked ? 'btn-success' : 'btn-danger'}`}
                        onClick={() => toggleBlock(u._id)}>
                        {u.blocked ? '🔓 Unblock' : '🚫 Block'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>
                  No users found
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
