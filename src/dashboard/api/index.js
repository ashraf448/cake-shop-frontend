import axios from 'axios'

// يستخدم نفس الـ baseURL والـ token بتاع الفرونت
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// نفس الـ token key بتاع الفرونت
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const authAPI = {
  login:      (data)       => api.post('/auth/login', data),
  getMe:      ()           => api.get('/auth/me'),
  getUsers:   ()           => api.get('/auth/users'),
  updateRole: (id, role)   => api.patch(`/auth/users/${id}/role`, { role }),
}

export const productsAPI = {
  getAll:         (params)   => api.get('/products', { params }),
  getOne:         (id)       => api.get(`/products/${id}`),
  getCategories:  ()         => api.get('/products/categories'),
  create:         (data)     => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:         (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:         (id)       => api.delete(`/products/${id}`),
  toggleFeatured: (id, isFeatured) => api.patch(`/products/${id}/featured`, { isFeatured }),
}

export const ordersAPI = {
  getAll:             (params)            => api.get('/orders/admin/all', { params }),
  getOne:             (id)                => api.get(`/orders/${id}`),
  updateStatus:       (id, status, note='') => api.patch(`/orders/admin/${id}/status`, { status, note }),
  updateDeliveryDate: (id, date)          => api.patch(`/orders/admin/${id}/delivery-date`, { expectedDelivery: date }),
  track:              (id)                => api.get(`/orders/${id}/track`),
}

export const customOrdersAPI = {
  getAll:       (params)     => api.get('/custom-orders/admin/all', { params }),
  setQuote:     (id, data)   => api.patch(`/custom-orders/admin/${id}/quote`, data),
  updateStatus: (id, status) => api.patch(`/custom-orders/admin/${id}/status`, { status }),
}

export const reviewsAPI = {
  getAll:  ()   => api.get('/reviews/admin/all'),
  approve: (id) => api.patch(`/reviews/${id}/approve`),
  reject:  (id) => api.patch(`/reviews/${id}/reject`),
  delete:  (id) => api.delete(`/reviews/${id}`),
}

export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
}
