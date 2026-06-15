import { useEffect, useState } from 'react'
import api from '../api/index.js'

export default function OfferSettings() {
  const [settings, setSettings] = useState({
    discount:      20,
    durationHours: 24,
    label:         'Offer Of The Day',
    isActive:      true,
  })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  useEffect(() => {
    api.get('/offer-settings')
      .then(r => {
        const s = r.data.settings || {}
        setSettings({
          discount:      s.discount      ?? 20,
          durationHours: s.durationHours ?? 24,
          label:         s.label         || 'Offer Of The Day',
          isActive:      s.isActive      !== false,
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (resetTimer = false) => {
    setSaving(true)
    try {
      await api.patch('/offer-settings', { ...settings, resetTimer })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>Loading...</div>
  )

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:600 }}>🔥 Offer Settings</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>Control the homepage offer section.</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-outline btn-sm" onClick={() => handleSave(true)} disabled={saving}>
            ↺ Reset Timer
          </button>
          <button className="btn btn-primary" onClick={() => handleSave(false)} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save'}
          </button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

        {/* Settings */}
        <div className="card">
          <div className="card-header"><span className="card-title">Offer Configuration</span></div>

          <div className="form-group" style={{ marginBottom:14 }}>
            <label className="form-label">Offer Label</label>
            <input className="form-input" value={settings.label}
              onChange={e => setSettings(p => ({ ...p, label: e.target.value }))}
              placeholder="Offer Of The Day" />
          </div>

          <div className="form-group" style={{ marginBottom:14 }}>
            <label className="form-label">Discount % (يظهر في البانر)</label>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <input className="form-input" type="range" min={1} max={90}
                value={settings.discount}
                onChange={e => setSettings(p => ({ ...p, discount: Number(e.target.value) }))}
                style={{ flex:1 }} />
              <span style={{ fontWeight:700, fontSize:20, color:'var(--danger)', minWidth:50 }}>
                {settings.discount}%
              </span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom:14 }}>
            <label className="form-label">Timer Duration (بالساعات)</label>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <input className="form-input" type="number" min={1} max={168}
                value={settings.durationHours}
                onChange={e => setSettings(p => ({ ...p, durationHours: Number(e.target.value) }))}
                style={{ width:100 }} />
              <span style={{ fontSize:13, color:'var(--muted)' }}>
                = {settings.durationHours >= 24
                  ? `${Math.floor(settings.durationHours/24)} day${Math.floor(settings.durationHours/24)>1?'s':''} ${settings.durationHours%24>0?`${settings.durationHours%24}h`:''}`
                  : `${settings.durationHours} hours`}
              </span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom:14 }}>
            <label className="form-label">Status</label>
            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <button className="btn btn-sm" onClick={() => setSettings(p => ({ ...p, isActive: true }))}
                style={{ background: settings.isActive ? 'var(--success)' : 'var(--bg)', color: settings.isActive ? '#fff' : 'var(--muted)', border:'1px solid var(--border)' }}>
                ✅ Active
              </button>
              <button className="btn btn-sm" onClick={() => setSettings(p => ({ ...p, isActive: false }))}
                style={{ background: !settings.isActive ? 'var(--danger)' : 'var(--bg)', color: !settings.isActive ? '#fff' : 'var(--muted)', border:'1px solid var(--border)' }}>
                ❌ Disabled
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="card">
          <div className="card-header"><span className="card-title">Preview</span></div>
          <div style={{ background:'linear-gradient(135deg,#54844D,#496D72)', borderRadius:12, padding:24, color:'#fff', position:'relative' }}>
            <div style={{ position:'absolute', top:12, right:12, background:'#fee2e2', color:'#dc2626', fontSize:11, padding:'3px 10px', borderRadius:12, fontWeight:600 }}>
              {settings.discount}% OFF
            </div>
            <p style={{ fontSize:20, fontWeight:700, marginBottom:6 }}>🔥 {settings.label}</p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.75)', marginBottom:12 }}>
              {settings.discount}% Discount On Discounted Products
            </p>
            <div style={{ fontSize:18, fontWeight:700, letterSpacing:3, marginBottom:16 }}>
              {String(settings.durationHours).padStart(2,'0')}:00:00
            </div>
            <span style={{ background:'#D0BFA5', color:'#333', padding:'6px 18px', borderRadius:20, fontSize:12 }}>
              Shop Now
            </span>
            <div style={{ marginTop:12, fontSize:12, color:'rgba(255,255,255,.6)' }}>
              Status: {settings.isActive ? '✅ Active' : '❌ Disabled'}
            </div>
          </div>

          <div style={{ marginTop:16, padding:12, background:'var(--bg)', borderRadius:8, fontSize:12, color:'var(--muted)' }}>
            <p>💡 <strong>Reset Timer</strong> — بيبدأ العداد من الأول بالمدة الجديدة</p>
            <p style={{ marginTop:4 }}>💡 <strong>Save</strong> — بيحفظ الإعدادات بدون ما يأثر على العداد الحالي</p>
          </div>
        </div>
      </div>
    </div>
  )
}