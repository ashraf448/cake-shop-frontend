import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'

export default function Login() {
  const [email, setEmail]    = useState('admin@gmail.com')
const [password, setPassword] = useState('Admin@123')
  const { login, loading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0f0f1a'
    }}>
      <div style={{ width: 'min(380px, 92vw)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, background: '#e63946', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, margin: '0 auto 12px'
          }}>⚡</div>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 600 }}>ShopAdmin</h1>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginTop: 4 }}>
            Admin Dashboard — Sign in to continue
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#1a1a2e', borderRadius: 16, padding: 32,
          border: '1px solid rgba(255,255,255,.08)'
        }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: '#fde8e8', color: '#d94040', padding: '10px 14px',
                borderRadius: 8, fontSize: 13, marginBottom: 16
              }}>{error}</div>
            )}

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ color: 'rgba(255,255,255,.5)' }}>
                Email Address
              </label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', color: '#fff' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ color: 'rgba(255,255,255,.5)' }}>
                Password
              </label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', color: '#fff' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: 14 }}
            >
              {loading ? 'Signing in...' : '🔐 Sign In as Admin'}
            </button>
          </form>

          <div style={{
            marginTop: 20, padding: 12, background: 'rgba(255,255,255,.04)',
            borderRadius: 8, fontSize: 12, color: 'rgba(255,255,255,.35)',
            textAlign: 'center'
          }}>
            Demo: admin@example.com / admin123
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,.2)' }}>
          🔒 Admin access only — unauthorized access is prohibited
        </p>
      </div>
    </div>
  )
}
