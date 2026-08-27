import { useEffect, useState } from 'react'
import api from '../api/index.js'

export default function HeroSettings() {
  const [settings, setSettings] = useState({
    title:    '',
    subtitle: '',
    badge:    '',
    btnShop:  '',
    btnLearn: '',
    slides:   [],
  })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  useEffect(() => {
    api.get('/hero')
      .then(r => {
        const s = r.data.settings || {}
        setSettings({
          title:    s.title    || '',
          subtitle: s.subtitle || '',
          badge:    s.badge    || '',
          btnShop:  s.btnShop  || '',
          btnLearn: s.btnLearn || '',
          slides:   s.slides   || [],
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) =>
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSlideChange = (i, field, value) => {
    const slides = [...settings.slides]
    slides[i] = { ...slides[i], [field]: value }
    setSettings(prev => ({ ...prev, slides }))
  }

  const addSlide = () =>
    setSettings(prev => ({ ...prev, slides: [...prev.slides, { title:'', image:'' }] }))

  const removeSlide = (i) =>
    setSettings(prev => ({ ...prev, slides: prev.slides.filter((_, idx) => idx !== i) }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title',    settings.title)
      fd.append('subtitle', settings.subtitle)
      fd.append('badge',    settings.badge)
      fd.append('btnShop',  settings.btnShop)
      fd.append('btnLearn', settings.btnLearn)
      fd.append('slides',   JSON.stringify(
        settings.slides.map(s => ({ title: s.title, image: s.image || '' }))
      ))
      await api.patch('/hero', fd)
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
          <h2 style={{ fontSize:18, fontWeight:600 }}>🖼️ Hero Section Settings</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>Control the homepage hero banner content.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Changes'}
        </button>
      </div>

      <div className="grid-2" style={{ gap:16, marginBottom:16 }}>

        {/* Main text */}
        <div className="card">
          <div className="card-header"><span className="card-title">Main Content</span></div>
          <div className="form-group" style={{ marginBottom:14 }}>
            <label className="form-label">Hero Title</label>
            <input className="form-input" name="title" value={settings.title}
              onChange={handleChange} placeholder="Delicious Cakes For Every Occasion 🎂" />
          </div>
          <div className="form-group" style={{ marginBottom:14 }}>
            <label className="form-label">Subtitle</label>
            <textarea className="form-input" name="subtitle" value={settings.subtitle}
              onChange={handleChange} rows={3} style={{ resize:'none' }}
              placeholder="Freshly baked cakes with premium ingredients..." />
          </div>
          <div className="form-group" style={{ marginBottom:14 }}>
            <label className="form-label">Badge Text (e.g. "20% OFF")</label>
            <input className="form-input" name="badge" value={settings.badge}
              onChange={handleChange} placeholder="20% OFF" />
          </div>
          <div className="grid-2" style={{ gap:10 }}>
            <div className="form-group">
              <label className="form-label">Shop Button Text</label>
              <input className="form-input" name="btnShop" value={settings.btnShop}
                onChange={handleChange} placeholder="Shop Now" />
            </div>
            <div className="form-group">
              <label className="form-label">Secondary Button Text</label>
              <input className="form-input" name="btnLearn" value={settings.btnLearn}
                onChange={handleChange} placeholder="Learn More" />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="card">
          <div className="card-header"><span className="card-title">Preview</span></div>
          <div style={{
            background:'linear-gradient(135deg,#3a2a1a,#6b4c2a)',
            borderRadius:12, padding:24, color:'#fff', position:'relative',
          }}>
            {settings.badge && (
              <span style={{ position:'absolute', top:12, right:12, background:'#e74c3c', color:'#fff', fontSize:11, padding:'3px 10px', borderRadius:12 }}>
                {settings.badge}
              </span>
            )}
            <p style={{ fontSize:18, fontWeight:700, marginBottom:8, lineHeight:1.3 }}>
              {settings.title || 'Hero Title Here'}
            </p>
            <p style={{ fontSize:12, color:'rgba(255,255,255,.7)', marginBottom:16, lineHeight:1.5 }}>
              {settings.subtitle || 'Subtitle text here...'}
            </p>
            <div style={{ display:'flex', gap:8 }}>
              <span style={{ background:'#f5c87a', color:'#3a2a1a', padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:500 }}>
                {settings.btnShop || 'Shop Now'}
              </span>
              <span style={{ border:'1px solid rgba(255,255,255,.4)', color:'#fff', padding:'6px 14px', borderRadius:20, fontSize:12 }}>
                {settings.btnLearn || 'Learn More'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slides */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Slider Slides ({settings.slides.length})</span>
          <button className="btn btn-sm btn-primary" onClick={addSlide}>+ Add Slide</button>
        </div>

        {settings.slides.length === 0 ? (
          <div style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>
            <p>No slides yet. Add your first slide!</p>
          </div>
        ) : (
          <div className="grid-auto-280" style={{ gap:14 }}>
            {settings.slides.map((slide, i) => (
              <div key={i} style={{ border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
                {slide.image ? (
                  <img src={slide.image} alt="" style={{ width:'100%', height:120, objectFit:'cover' }} />
                ) : (
                  <div style={{ height:120, background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>🖼️</div>
                )}
                <div style={{ padding:12 }}>
                  <div className="form-group" style={{ marginBottom:10 }}>
                    <label className="form-label">Slide Title</label>
                    <input className="form-input" value={slide.title}
                      onChange={e => handleSlideChange(i, 'title', e.target.value)}
                      placeholder={`Slide ${i+1} Title`} />
                  </div>
                  <div className="form-group" style={{ marginBottom:10 }}>
                    <label className="form-label">Image URL</label>
                    <input className="form-input" value={slide.image || ''}
                      onChange={e => handleSlideChange(i, 'image', e.target.value)}
                      placeholder="cake-shop-backend-production.up.railway.app/uploads/..." />
                  </div>
                  <button className="btn btn-sm btn-danger" style={{ width:'100%' }}
                    onClick={() => removeSlide(i)}>
                    🗑 Remove Slide
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
