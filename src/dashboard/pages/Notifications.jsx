

import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/index.js'

const TYPE_STYLES = {
  danger:  { bg:'#fde8e8', color:'var(--danger)',  dot:'#d94040' },
  info:    { bg:'#e6f0ff', color:'var(--info)',    dot:'#1a73e8' },
  success: { bg:'#e6f5ee', color:'var(--success)', dot:'#2d9b6f' },
  warning: { bg:'#fff8e6', color:'var(--warning)', dot:'#f0c040' },
}

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins} minute${mins>1?'s':''} ago`
  if (hours < 24) return `${hours} hour${hours>1?'s':''} ago`
  if (days < 7)   return `${days} day${days>1?'s':''} ago`
  return new Date(date).toLocaleDateString('en-EG', { day:'numeric', month:'short' })
}

export default function Notifications() {
  const navigate = useNavigate()
  const [notifs,  setNotifs]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifs = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications?limit=50')
      setNotifs(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchNotifs()
    // بولينج كل 30 ثانية
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifs])

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifs(prev => prev.map(n => n._id===id ? { ...n, isRead:true } : n))
      setUnreadCount(prev => Math.max(0, prev-1))
    } catch (err) { console.error(err) }
  }

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/mark-all')
      setNotifs(prev => prev.map(n => ({ ...n, isRead:true })))
      setUnreadCount(0)
    } catch (err) { console.error(err) }
  }

  const dismiss = async (id, e) => {
    e.stopPropagation()
    try {
      await api.delete(`/notifications/${id}`)
      const n = notifs.find(n => n._id === id)
      setNotifs(prev => prev.filter(n => n._id !== id))
      if (n && !n.isRead) setUnreadCount(prev => Math.max(0, prev-1))
    } catch (err) { console.error(err) }
  }

  const clearRead = async () => {
    try {
      await api.delete('/notifications/clear-read')
      setNotifs(prev => prev.filter(n => !n.isRead))
    } catch (err) { console.error(err) }
  }

  const handleClick = (n) => {
    if (!n.isRead) markRead(n._id)
    if (n.link) navigate(n.link)
  }

  const filtered = filter === 'unread' ? notifs.filter(n => !n.isRead) : notifs

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:600 }}>Notifications</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up! ✅'}
          </p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {unreadCount > 0 && (
            <button className="btn btn-outline btn-sm" onClick={markAllRead}>
              ✓ Mark all as read
            </button>
          )}
          <button className="btn btn-outline btn-sm" onClick={clearRead}
            style={{ color:'var(--danger)', borderColor:'var(--danger)' }}>
            🗑 Clear read
          </button>
          <button className="btn btn-outline btn-sm" onClick={fetchNotifs}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {['all','unread'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn btn-sm"
            style={{ background:filter===f?'#0f0f1a':'#fff', color:filter===f?'#fff':'var(--muted)', border:`1px solid ${filter===f?'#0f0f1a':'var(--border)'}`, textTransform:'capitalize' }}>
            {f==='all' ? `All (${notifs.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>Loading notifications...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:48, color:'var(--muted)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔔</div>
            <p>{filter==='unread' ? 'No unread notifications' : 'No notifications yet'}</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {filtered.map(n => {
              const ts = TYPE_STYLES[n.type] || TYPE_STYLES.info
              return (
                <div key={n._id}
                  onClick={() => handleClick(n)}
                  style={{
                    display:'flex', gap:12, padding:'12px 14px',
                    borderRadius:10, alignItems:'flex-start',
                    cursor: n.link ? 'pointer' : 'default',
                    background: !n.isRead ? ts.bg : 'transparent',
                    transition:'background .15s',
                  }}
                >
                  {/* Icon */}
                  <div style={{ width:36, height:36, borderRadius:10, background:ts.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                    {n.icon || '🔔'}
                  </div>

                  {/* Content */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight: !n.isRead ? 600 : 400, color:'var(--text)' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{n.desc}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{timeAgo(n.createdAt)}</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    {!n.isRead && (
                      <div style={{ width:8, height:8, borderRadius:'50%', background:ts.dot }} />
                    )}
                    <button
                      onClick={(e) => dismiss(n._id, e)}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:18, lineHeight:1 }}>
                      ×
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


// أوردر جديد
// payment proof رُفع
// stock منخفض
// يوزر جديد
// أوردر اتكنسل
// custom order جديد