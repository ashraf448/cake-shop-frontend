

import { useEffect, useState } from 'react'
import { authAPI } from '../api/index.js'

const PERMISSIONS = {
  admin: [
    'View Orders', 'Manage Orders', 'Create Products', 'Edit Products',
    'Delete Products', 'View Analytics', 'Manage Users', 'Assign Roles',
    'View Payments', 'Approve Payments', 'Manage Custom Orders', 'Manage Reviews',
  ],
  user: ['View Orders', 'Track Orders', 'Submit Reviews'],
}

const ROLE_CONFIG = {
  admin: { color:'#1a73e8', bg:'#e6f0ff', icon:'👔', label:'Admin' },
  user:  { color:'#2d9b6f', bg:'#e6f5ee', icon:'👤', label:'User'  },
}

const ALL_PERMS = [...new Set([...PERMISSIONS.admin, ...PERMISSIONS.user])]

export default function RBAC() {
  const [users,       setUsers]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [updating,    setUpdating]    = useState(null)
  const [search,      setSearch]      = useState('')
  const [filterRole,  setFilterRole]  = useState('all')
  const [activeTab,   setActiveTab]   = useState('users') // 'users' | 'matrix'

  useEffect(() => {
    authAPI.getUsers()
      .then(r => setUsers(r.data.users || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId)
    try {
      await authAPI.updateRole(userId, newRole)
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null) }
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const adminCount = users.filter(u => u.role === 'admin').length
  const userCount  = users.filter(u => u.role === 'user').length

  // ── Filtered users ─────────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const matchRole   = filterRole === 'all' || u.role === filterRole
    const matchSearch = !search || u.userName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:18, fontWeight:600 }}>Roles & Permissions</h2>
        <p style={{ color:'var(--muted)', fontSize:13 }}>Manage user roles and access control.</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Total Users',  value:users.length,  icon:'👥', color:'#1a73e8', bg:'#e6f0ff' },
          { label:'Admins',       value:adminCount,    icon:'👔', color:'#7b3fd4', bg:'#f0e6ff' },
          { label:'Regular Users',value:userCount,     icon:'👤', color:'#2d9b6f', bg:'#e6f5ee' },
          { label:'Roles',        value:2,             icon:'🔑', color:'#e63946', bg:'#fde8e8' },
        ].map(s => (
          <div className="metric-card" key={s.label}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <div>
                <div className="metric-label">{s.label}</div>
                <div className="metric-value">{loading ? '...' : s.value}</div>
              </div>
              <div style={{ width:40, height:40, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {[['users','👥 Users & Roles'],['matrix','🔐 Permission Matrix'],['security','🛡️ API Security']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="btn btn-sm"
            style={{ background:activeTab===tab?'#0f0f1a':'#fff', color:activeTab===tab?'#fff':'var(--muted)', border:`1px solid ${activeTab===tab?'#0f0f1a':'var(--border)'}` }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Users ── */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Users & Role Assignment</span>
            <div style={{ display:'flex', gap:8 }}>
              <input className="form-input" placeholder="Search users..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ fontSize:12, padding:'4px 10px', width:180 }} />
              {['all','admin','user'].map(r => (
                <button key={r} onClick={() => setFilterRole(r)} className="btn btn-sm"
                  style={{ background:filterRole===r?'#0f0f1a':'#fff', color:filterRole===r?'#fff':'var(--muted)', border:`1px solid ${filterRole===r?'#0f0f1a':'var(--border)'}`, textTransform:'capitalize' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>Loading users...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>No users found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr><th>User</th><th>Email</th><th>Phone</th><th>Current Role</th><th>Joined</th><th>Change Role</th></tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const cfg = ROLE_CONFIG[u.role] || ROLE_CONFIG.user
                  return (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>
                            {cfg.icon}
                          </div>
                          <span style={{ fontWeight:500, fontSize:13 }}>{u.userName}</span>
                        </div>
                      </td>
                      <td style={{ fontSize:12, color:'var(--muted)' }}>{u.email}</td>
                      <td style={{ fontSize:12, color:'var(--muted)' }}>{u.phone || '—'}</td>
                      <td>
                        <span className="badge" style={{ background:cfg.bg, color:cfg.color, textTransform:'capitalize' }}>
                          {cfg.icon} {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize:12, color:'var(--muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-EG', { day:'numeric', month:'short', year:'numeric' })}
                      </td>
                      <td>
                        <select
                          value={u.role}
                          disabled={updating === u._id}
                          onChange={e => handleRoleChange(u._id, e.target.value)}
                          style={{ fontSize:11, padding:'4px 8px', border:'1px solid var(--border)', borderRadius:6, background:'var(--card)', color:'var(--text)', cursor:'pointer' }}
                        >
                          <option value="user">👤 User</option>
                          <option value="admin">👔 Admin</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Tab: Permission Matrix ── */}
      {activeTab === 'matrix' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:14 }}>
          {/* Roles */}
          <div className="card">
            <div className="card-header"><span className="card-title">Roles</span></div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
                <div key={role} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', border:'1px solid var(--border)', borderRadius:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:20 }}>{cfg.icon}</span>
                    <div>
                      <p style={{ fontWeight:600, fontSize:13 }}>{cfg.label}</p>
                      <p style={{ fontSize:11, color:'var(--muted)' }}>{PERMISSIONS[role].length} permissions</p>
                    </div>
                  </div>
                  <span className="badge" style={{ background:cfg.bg, color:cfg.color }}>
                    {role === 'admin' ? adminCount : userCount} users
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Matrix */}
          <div className="card">
            <div className="card-header"><span className="card-title">Permission Matrix</span></div>
            <table className="table">
              <thead>
                <tr>
                  <th>Permission</th>
                  {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
                    <th key={role}>{cfg.icon} {cfg.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_PERMS.map(perm => (
                  <tr key={perm}>
                    <td style={{ fontWeight:500, fontSize:12 }}>{perm}</td>
                    {Object.keys(ROLE_CONFIG).map(role => (
                      <td key={role}>
                        <span style={{
                          display:'inline-flex', alignItems:'center', justifyContent:'center',
                          width:22, height:22, borderRadius:6, fontSize:13,
                          background: PERMISSIONS[role].includes(perm) ? '#e6f5ee' : '#f5f5f5',
                          color: PERMISSIONS[role].includes(perm) ? 'var(--success)' : 'var(--muted)',
                        }}>
                          {PERMISSIONS[role].includes(perm) ? '✓' : '—'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: API Security ── */}
      {activeTab === 'security' && (
        <div className="card">
          <div className="card-header"><span className="card-title">API Security & Validation</span></div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { icon:'🔒', label:'JWT Authentication', val:'HS256 · 7 day expiry',   sub:'bcrypt 12 rounds' },
              { icon:'🚦', label:'Rate Limiting',       val:'200 req / 15 min',       sub:'Auth: 20 req / 15 min' },
              { icon:'🛡️', label:'Helmet.js',           val:'Secure HTTP headers',    sub:'XSS, CORS, CSP' },
              { icon:'✅', label:'Input Validation',    val:'express-validator',      sub:'All routes validated' },
              { icon:'🔑', label:'Admin Routes',        val:'JWT + role check',       sub:'403 on non-admin' },
              { icon:'🌐', label:'CORS',                val:'Whitelist only',         sub:'CLIENT_URL env var' },
            ].map(s => (
              <div key={s.label} style={{ padding:'14px 16px', border:'1px solid var(--border)', borderRadius:10 }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginBottom:2 }}>{s.label}</div>
                <div style={{ fontSize:13, fontWeight:600 }}>{s.val}</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
