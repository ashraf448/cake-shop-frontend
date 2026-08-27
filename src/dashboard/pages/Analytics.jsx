

import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { ordersAPI, productsAPI, customOrdersAPI } from '../api/index.js'

const COLORS = ['#1a73e8','#7b3fd4','#2d9b6f','#e63946','#f0c040','#0891b2']

// السنوات المتاحة للفلتر
const currentYear = new Date().getFullYear()
const YEARS = [currentYear, currentYear - 1, currentYear - 2]

export default function Analytics() {
  const [orders,       setOrders]       = useState([])
  const [customOrders, setCustomOrders] = useState([])
  const [products,     setProducts]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  useEffect(() => {
    Promise.all([
      ordersAPI.getAll({ limit:1000 }),
      productsAPI.getAll({ limit:1000 }),
      customOrdersAPI.getAll({ limit:1000 }),
    ]).then(([ord, prod, custom]) => {
      setOrders(ord.data.orders || [])
      setProducts(prod.data.products || [])
      setCustomOrders(custom.data.orders || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  // ── فلتر بالسنة (من 1/1 للسنة المختارة) ────────────────────────────────────
  const yearStart = new Date(`${selectedYear}-01-01T00:00:00.000Z`)
  const yearEnd   = new Date(`${selectedYear}-12-31T23:59:59.999Z`)

  const yearOrders = orders.filter(o => {
    const d = new Date(o.createdAt)
    return d >= yearStart && d <= yearEnd
  })
  const yearCustom = customOrders.filter(o => {
    const d = new Date(o.createdAt)
    return d >= yearStart && d <= yearEnd
  })

  // ── Monthly revenue (12 شهر للسنة المختارة) ──────────────────────────────
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const monthly = MONTHS.map((month, i) => {
    const rev = yearOrders
      .filter(o => o.isPaid && new Date(o.createdAt).getMonth() === i)
      .reduce((s, o) => s + (o.total||0), 0)
    const cRev = yearCustom
      .filter(o => o.isPaid && new Date(o.paidAt||o.createdAt).getMonth() === i)
      .reduce((s, o) => s + (o.quotedPrice||0), 0)
    return { month, revenue: rev + cRev }
  })

  // ── Weekly orders (آخر 7 أيام) ───────────────────────────────────────────
  const weeklyOrders = (() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d  = new Date(); d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      const label = d.toLocaleDateString('en-EG', { weekday:'short' })
      const count = orders.filter(o=>o.createdAt?.startsWith(ds)).length
                  + customOrders.filter(o=>o.createdAt?.startsWith(ds)).length
      days.push({ day:label, orders:count })
    }
    return days
  })()

  // ── Payment methods ──────────────────────────────────────────────────────
  const instapay  = yearOrders.filter(o=>o.paymentMethod==='instapay').length + yearCustom.filter(o=>o.isPaid).length
  const vodafone  = yearOrders.filter(o=>o.paymentMethod==='vodafone').length
  const totalPay  = instapay + vodafone || 1
  const payMethods = [
    { name:'Instapay',      value:Math.round((instapay/totalPay)*100) },
    { name:'Vodafone Cash', value:Math.round((vodafone/totalPay)*100) },
  ]

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const paidOrders   = yearOrders.filter(o=>o.isPaid)
  const paidCustom   = yearCustom.filter(o=>o.isPaid)
  const totalPaidRev = paidOrders.reduce((s,o)=>s+(o.total||0),0) + paidCustom.reduce((s,o)=>s+(o.quotedPrice||0),0)
  const totalPaidCnt = paidOrders.length + paidCustom.length
  const avgOrder     = totalPaidCnt ? Math.round(totalPaidRev/totalPaidCnt) : 0
  const cancelRate   = yearOrders.length ? ((yearOrders.filter(o=>o.status==='Cancelled').length/yearOrders.length)*100).toFixed(1) : 0

  const kpis = [
    { label:'Avg. Order Value',       value:loading?'...':`EGP ${avgOrder.toLocaleString()}` },
    { label:'Total Paid Orders',      value:loading?'...':totalPaidCnt },
    { label:'Total Revenue',          value:loading?'...':`EGP ${totalPaidRev.toLocaleString()}` },
    { label:'Cancellation Rate',      value:loading?'...':`${cancelRate}%` },
  ]

  // ── TOP CUSTOMERS ─────────────────────────────────────────────────────────
  // اجمع الأوردرات العادية والـ custom معاً
  const customerMap = {}

  yearOrders.filter(o => o.isPaid).forEach(o => {
    const uid   = o.user?._id || o.user || o.shippingAddress?.name
    const name  = o.shippingAddress?.name || 'Unknown'
    const phone = o.shippingAddress?.phone || '—'
    if (!customerMap[uid]) customerMap[uid] = { name, phone, orders:0, revenue:0 }
    customerMap[uid].orders  += 1
    customerMap[uid].revenue += o.total || 0
  })

  yearCustom.filter(o => o.isPaid).forEach(o => {
    const uid   = o.user?._id || o.user
    const name  = o.user?.userName || o.phone || 'Unknown'
    const phone = o.phone || '—'
    if (!customerMap[uid]) customerMap[uid] = { name, phone, orders:0, revenue:0 }
    customerMap[uid].orders  += 1
    customerMap[uid].revenue += o.quotedPrice || 0
  })

  const topByOrders  = Object.values(customerMap).sort((a,b) => b.orders  - a.orders).slice(0, 10)
  const topByRevenue = Object.values(customerMap).sort((a,b) => b.revenue - a.revenue).slice(0, 10)

  // ── Order type breakdown ─────────────────────────────────────────────────
  const orderTypes = [
    { name:'Regular', value:yearOrders.length,  color:'#1a73e8' },
    { name:'Custom',  value:yearCustom.length,  color:'#ec4899' },
  ]

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:600 }}>Analytics</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>Sales performance from Jan 1, {selectedYear}</p>
        </div>
        {/* Year filter */}
        <div style={{ display:'flex', gap:8 }}>
          {YEARS.map(y => (
            <button key={y} onClick={() => setSelectedYear(y)} className="btn btn-sm"
              style={{ background:selectedYear===y?'#0f0f1a':'#fff', color:selectedYear===y?'#fff':'var(--muted)', border:`1px solid ${selectedYear===y?'#0f0f1a':'var(--border)'}` }}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ gap:14, marginBottom:20 }}>
        {kpis.map(k=>(
          <div className="metric-card" key={k.label}>
            <div className="metric-label">{k.label}</div>
            <div className="metric-value">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid-2" style={{ gap:14, marginBottom:20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Monthly Revenue {selectedYear}</span>
            <span style={{ fontSize:11, color:'var(--muted)' }}>Jan 1 → Dec 31</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="month" tick={{fontSize:11}}/>
              <YAxis tick={{fontSize:11}} tickFormatter={v=>v>=1000?`${Math.round(v/1000)}k`:v}/>
              <Tooltip formatter={v=>[`EGP ${v.toLocaleString()}`,'Revenue']}/>
              <Line type="monotone" dataKey="revenue" stroke="#e63946" strokeWidth={2} dot={{r:3}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Order Types {selectedYear}</span></div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <ResponsiveContainer width={160} height={180}>
              <PieChart>
                <Pie data={orderTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                  {orderTypes.map((o,i) => <Cell key={i} fill={o.color}/>)}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {orderTypes.map(o=>(
                <div key={o.name} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13 }}>
                  <span style={{ width:12, height:12, borderRadius:3, background:o.color, display:'inline-block' }}/>
                  <span>{o.name}</span>
                  <span style={{ fontWeight:600 }}>{o.value}</span>
                </div>
              ))}
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>
                Total: {yearOrders.length + yearCustom.length} orders
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid-2" style={{ gap:14, marginBottom:20 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Weekly Orders (Last 7 Days)</span></div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="day" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/>
              <Tooltip/><Bar dataKey="orders" fill="#1a73e8" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Payment Methods {selectedYear}</span></div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={payMethods} cx="50%" cy="50%" outerRadius={65} dataKey="value"
                label={({name,value})=>`${name} ${value}%`}>
                <Cell fill="#0f0f1a"/><Cell fill="#e63946"/>
              </Pie>
              <Tooltip formatter={v=>[`${v}%`]}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── TOP CUSTOMERS ── */}
      <div className="grid-2" style={{ gap:14, marginBottom:20 }}>

        {/* Top by orders count */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🏆 Top Customers by Orders — {selectedYear}</span>
          </div>
          {topByOrders.length === 0 ? (
            <div style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>No data for {selectedYear}</div>
          ) : (
            <div className="table-wrap">
<table className="table">
              <thead><tr><th>#</th><th>Customer</th><th>Phone</th><th>Orders</th><th>Revenue</th></tr></thead>
              <tbody>
                {topByOrders.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ fontWeight:700, color: i===0?'#f0c040':i===1?'#aaa':i===2?'#cd7f32':'var(--muted)', fontSize:14 }}>
                        {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
                      </span>
                    </td>
                    <td style={{ fontWeight:500 }}>{c.name}</td>
                    <td style={{ color:'var(--muted)', fontSize:12 }}>{c.phone}</td>
                    <td>
                      <span style={{ background:'#e6f0ff', color:'#1a73e8', padding:'2px 8px', borderRadius:20, fontSize:12, fontWeight:600 }}>
                        {c.orders}
                      </span>
                    </td>
                    <td style={{ fontWeight:500 }}>EGP {c.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
</div>
          )}
        </div>

        {/* Top by revenue */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">💰 Top Customers by Revenue — {selectedYear}</span>
          </div>
          {topByRevenue.length === 0 ? (
            <div style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>No data for {selectedYear}</div>
          ) : (
            <div className="table-wrap">
<table className="table">
              <thead><tr><th>#</th><th>Customer</th><th>Phone</th><th>Revenue</th><th>Orders</th></tr></thead>
              <tbody>
                {topByRevenue.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ fontWeight:700, color: i===0?'#f0c040':i===1?'#aaa':i===2?'#cd7f32':'var(--muted)', fontSize:14 }}>
                        {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
                      </span>
                    </td>
                    <td style={{ fontWeight:500 }}>{c.name}</td>
                    <td style={{ color:'var(--muted)', fontSize:12 }}>{c.phone}</td>
                    <td>
                      <span style={{ fontWeight:700, color:'var(--success)' }}>EGP {c.revenue.toLocaleString()}</span>
                    </td>
                    <td style={{ color:'var(--muted)' }}>{c.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
</div>
          )}
        </div>
      </div>

      {/* Custom orders summary */}
      <div className="card">
        <div className="card-header"><span className="card-title">🎂 Custom Orders Summary — {selectedYear}</span></div>
        <div className="grid-7" style={{ gap:8, padding:'12px 0' }}>
          {['Pending','Quoted','Accepted','Paid','Preparing','Delivered','Cancelled'].map(s=>(
            <div key={s} style={{ textAlign:'center', padding:'12px 8px', background:'var(--bg)', borderRadius:10 }}>
              <p style={{ fontSize:10, color:'var(--muted)', marginBottom:4 }}>{s}</p>
              <p style={{ fontSize:20, fontWeight:700 }}>{yearCustom.filter(o=>o.status===s).length}</p>
            </div>
          ))}
        </div>
        <div style={{ paddingTop:12, borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', fontSize:13 }}>
          <span style={{ color:'var(--muted)' }}>Total Custom Revenue {selectedYear}</span>
          <span style={{ fontWeight:600 }}>EGP {yearCustom.filter(o=>o.isPaid).reduce((s,o)=>s+(o.quotedPrice||0),0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
