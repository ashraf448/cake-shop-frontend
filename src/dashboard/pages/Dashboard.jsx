

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ordersAPI, productsAPI, customOrdersAPI } from '../api/index.js'

const statusConfig = {
  Pending:{color:'#f0c040'}, Confirmed:{color:'#1a73e8'}, Preparing:{color:'#7b3fd4'},
  Shipped:{color:'#0891b2'}, Delivered:{color:'#2d9b6f'}, Cancelled:{color:'#d94040'},
}

export default function Dashboard() {
  const [orders,       setOrders]       = useState([])
  const [allOrders,    setAllOrders]    = useState([])
  const [customOrders, setCustomOrders] = useState([])
  const [products,     setProducts]     = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    Promise.all([
      ordersAPI.getAll({ limit:5 }),
      ordersAPI.getAll({ limit:1000 }),
      productsAPI.getAll({ limit:1000 }),
      customOrdersAPI.getAll({ limit:1000 }),
    ]).then(([recent, all, prods, custom]) => {
      setOrders(recent.data.orders || [])
      setAllOrders(all.data.orders || [])
      setProducts(prods.data.products || [])
      setCustomOrders(custom.data.orders || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const regularRevenue = allOrders.filter(o=>o.isPaid).reduce((s,o)=>s+(o.total||0),0)
  const customRevenue  = customOrders.filter(o=>o.isPaid).reduce((s,o)=>s+(o.quotedPrice||0),0)
  const totalRevenue   = regularRevenue + customRevenue
  const totalOrders    = allOrders.length + customOrders.length
  const pendingCustom  = customOrders.filter(o=>o.status==='Pending').length
  const pendingPay     = allOrders.filter(o=>!o.isPaid&&o.status!=='Cancelled').length

  const metrics = [
    { label:'Total Revenue',   value:`EGP ${totalRevenue.toLocaleString()}`, icon:'💰', color:'#1a73e8', bg:'#e6f0ff', up:true,  sub:'Regular + Custom' },
    { label:'Total Orders',    value:totalOrders.toLocaleString(),           icon:'🛒', color:'#7b3fd4', bg:'#f0e6ff', up:true,  sub:`${customOrders.length} custom` },
    { label:'Total Products',  value:products.length.toLocaleString(),       icon:'📦', color:'#2d9b6f', bg:'#e6f5ee', up:true,  sub:`${products.filter(p=>p.stock===0).length} out of stock` },
    { label:'Custom Pending',  value:pendingCustom.toLocaleString(),         icon:'🎂', color:'#d94040', bg:'#fde8e8', up:false, sub:'need price quote' },
  ]

  const statusCounts = ['Pending','Confirmed','Preparing','Shipped','Delivered','Cancelled'].map(s=>({
    label:s, color:statusConfig[s]?.color,
    count:allOrders.filter(o=>o.status===s).length,
    pct:allOrders.length?Math.round((allOrders.filter(o=>o.status===s).length/allOrders.length)*100):0,
  }))

  const revenueByDay = (() => {
    const days=[]
    for(let i=6;i>=0;i--){
      const d=new Date(); d.setDate(d.getDate()-i)
      const label=d.toLocaleDateString('en-EG',{day:'numeric',month:'short'})
      const ds=d.toISOString().split('T')[0]
      const rev=allOrders.filter(o=>o.isPaid&&o.createdAt?.startsWith(ds)).reduce((s,o)=>s+(o.total||0),0)
      const cRev=customOrders.filter(o=>o.isPaid&&o.paidAt?.slice(0,10)===ds).reduce((s,o)=>s+(o.quotedPrice||0),0)
      days.push({day:label,revenue:rev+cRev})
    }
    return days
  })()

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:18,fontWeight:600}}>Dashboard</h2>
        <p style={{color:'var(--muted)',fontSize:13}}>Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid-4" style={{ gap:14,marginBottom:20 }}>
        {metrics.map(m=>(
          <div className="metric-card" key={m.label}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
              <div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-value">{loading?'...':m.value}</div>
              </div>
              <div style={{width:40,height:40,borderRadius:10,background:m.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{m.icon}</div>
            </div>
            <div className={`metric-sub ${m.up?'metric-up':'metric-down'}`}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2-1" style={{ gap:14,marginBottom:20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Revenue Overview</span>
            <span style={{fontSize:12,color:'var(--muted)'}}>Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="day" tick={{fontSize:11}}/>
              <YAxis tick={{fontSize:11}} tickFormatter={v=>v>=1000?`${Math.round(v/1000)}k`:v}/>
              <Tooltip formatter={v=>[`EGP ${v.toLocaleString()}`,'Revenue']}/>
              <Bar dataKey="revenue" fill="#0f0f1a" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Orders by Status</span></div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {statusCounts.map(s=>(
              <div key={s.label}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
                  <span style={{color:'var(--muted)'}}>{s.label}</span>
                  <span style={{fontWeight:500}}>{s.count}</span>
                </div>
                <div className="progress"><div className="progress-fill" style={{width:`${s.pct}%`,background:s.color}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom:14}}>
        <div className="card-header">
          <span className="card-title">Recent Orders</span>
          <Link to="/orders" style={{fontSize:12,color:'var(--info)',textDecoration:'none'}}>View all →</Link>
        </div>
        {loading?<div style={{textAlign:'center',padding:24,color:'var(--muted)'}}>Loading...</div>:
        orders.length===0?<div style={{textAlign:'center',padding:32,color:'var(--muted)'}}>No orders yet.</div>:(
          <div className="table-wrap">
<table className="table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o._id}>
                  <td style={{fontWeight:500}}>
                    <Link to={`/orders/${o._id}`} style={{color:'var(--info)',textDecoration:'none'}}>#{o._id?.slice(-6).toUpperCase()}</Link>
                  </td>
                  <td>{o.shippingAddress?.name}</td><td>{o.items?.length}</td>
                  <td>EGP {(o.total||0).toLocaleString()}</td>
                  <td><span className={`badge ${o.isPaid?'badge-paid':'badge-unpaid'}`}>{o.isPaid?'Paid':'Unpaid'}</span></td>
                  <td><span className={`badge badge-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                  <td style={{color:'var(--muted)',fontSize:12}}>{new Date(o.createdAt).toLocaleDateString('en-EG',{day:'numeric',month:'short'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        )}
      </div>

      {pendingCustom>0&&(
        <div className="card">
          <div className="card-header">
            <span className="card-title">🎂 Custom Orders Need Pricing</span>
            <Link to="/custom-orders" style={{fontSize:12,color:'var(--info)',textDecoration:'none'}}>View all →</Link>
          </div>
          <div className="table-wrap">
<table className="table">
            <thead><tr><th>ID</th><th>Customer</th><th>Description</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {customOrders.filter(o=>o.status==='Pending').slice(0,5).map(o=>(
                <tr key={o._id}>
                  <td style={{fontWeight:500}}>#{o._id?.slice(-6).toUpperCase()}</td>
                  <td>{o.user?.userName}</td>
                  <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:12}}>{o.description}</td>
                  <td style={{color:'var(--muted)',fontSize:12}}>{new Date(o.createdAt).toLocaleDateString('en-EG',{day:'numeric',month:'short'})}</td>
                  <td><Link to="/custom-orders" style={{fontSize:11,color:'var(--info)'}}>Set Price →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        </div>
      )}
    </div>
  )
}
