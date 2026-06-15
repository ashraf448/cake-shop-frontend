
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../zustand/AuthSlice'
import '../dashboard.css'

const navItems = [
  { group: 'Overview', items: [
    { to: '/admin',               icon: '⊞', label: 'Dashboard',      end: true },
    { to: '/admin/analytics',     icon: '📊', label: 'Analytics' },
  ]},
  { group: 'Management', items: [
    { to: '/admin/orders',        icon: '🛒', label: 'Orders' },
  //  { to: '/admin/orders/edit',        icon: '🛒', label: 'ُُEditOrder' },
    { to: '/admin/products',      icon: '📦', label: 'Products' },
    { to: '/admin/stock',         icon: '🗃️', label: 'Stock' },
    { to: '/admin/custom-orders', icon: '🎂', label: 'Custom Orders' },
    { to: '/admin/reviews',       icon: '⭐', label: 'Reviews' },
  ]},
  { group: 'Content', items: [
    { to: '/admin/hero',          icon: '🖼️', label: 'Hero Settings' },
    { to: '/admin/offer-settings',icon: '🔥', label: 'Offer Settings' },
  ]},
  { group: 'Access', items: [
    { to: '/admin/users',         icon: '👥', label: 'Users' },
    { to: '/admin/rbac',          icon: '🛡️', label: 'Roles & Perms' },
    { to: '/admin/notifications', icon: '🔔', label: 'Notifications' },
  ]},
]

export default function AdminLayout() {
  const navigate    = useNavigate()
  const currentUser = useAuth((s) => s.currentUser)
  const logout      = useAuth((s) => s.logoutHandler)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="admin-root" style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width:220, flexShrink:0, background:'#0f0f1a', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, background:'#e63946', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>⚡</div>
          <span style={{ color:'#fff', fontSize:15, fontWeight:600 }}>ShopAdmin</span>
        </div>

        <nav style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {navItems.map(({ group, items }) => (
            <div key={group}>
              <div style={{ padding:'10px 16px 4px', fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:'.08em', textTransform:'uppercase' }}>
                {group}
              </div>
              {items.map(({ to, icon, label, end }) => (
                <NavLink key={to} to={to} end={end}
                  style={({ isActive }) => ({
                    display:'flex', alignItems:'center', gap:10,
                    padding:'8px 16px', fontSize:13, textDecoration:'none',
                    color: isActive ? '#fff' : 'rgba(255,255,255,.55)',
                    borderLeft: isActive ? '2px solid #e63946' : '2px solid transparent',
                    background: isActive ? 'rgba(255,255,255,.07)' : 'transparent',
                    transition:'all .15s',
                  })}>
                  <span style={{ fontSize:15 }}>{icon}</span>
                  <span style={{ flex:1 }}>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding:12, borderTop:'1px solid rgba(255,255,255,.08)' }}>
          <NavLink to="/"
            style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 8px', borderRadius:8, color:'rgba(255,255,255,.4)', fontSize:12, textDecoration:'none', marginBottom:10 }}>
            ← Back to Store
          </NavLink>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#e63946', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#fff', fontWeight:600, flexShrink:0 }}>
              {currentUser?.userName?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:500, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {currentUser?.userName || 'Admin'}
              </div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>Admin</div>
            </div>
            <button onClick={handleLogout}
              style={{ background:'none', border:'none', color:'rgba(255,255,255,.4)', cursor:'pointer', fontSize:16, padding:4 }}
              title="Logout">⬡</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <header style={{ height:52, flexShrink:0, background:'#fff', borderBottom:'1px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', padding:'0 24px', gap:12 }}>
          <div style={{ flex:1 }} />
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:20, background:'#e6f5ee', fontSize:12, color:'#2d9b6f' }}>
            ● API Online
          </div>
          <div style={{ fontSize:12, color:'#999' }}>
            {new Date().toLocaleDateString('en-EG', { weekday:'short', day:'numeric', month:'short' })}
          </div>
        </header>
        <main style={{ flex:1, overflowY:'auto', padding:24, background:'var(--bg)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}