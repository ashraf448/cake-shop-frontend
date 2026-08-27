
import { useEffect, useState, useRef } from "react";
import { productsAPI } from "../api/index.js";

// ─── Category Modal ────────────────────────────────────────────────────────────
function CategoryModal({ categories, onClose, onAdd, onDelete }) {
  const [newCat, setNewCat] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    const val = newCat.trim().toLowerCase();
    if (!val || categories.includes(val)) return;
    setAdding(true);
    await onAdd(val);
    setNewCat("");
    setAdding(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div className="card" style={{ width: 'min(420px, 92vw)', padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>
            🗂 Manage Categories
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "var(--muted)",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <input
            className="form-input"
            placeholder="e.g. furniture"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={adding || !newCat.trim()}
          >
            {adding ? "..." : "+ Add"}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {categories.length === 0 && (
            <p
              style={{
                color: "var(--muted)",
                fontSize: 13,
                textAlign: "center",
                padding: 20,
              }}
            >
              No categories yet.
            </p>
          )}
          {categories.map((cat) => (
            <div
              key={cat}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: "var(--bg)",
                borderRadius: 8,
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ textTransform: "capitalize", fontSize: 14 }}>
                {getCategoryEmoji(cat)} {cat}
              </span>
              <button
                onClick={() => onDelete(cat)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--danger)",
                  fontSize: 16,
                }}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Image Uploader ────────────────────────────────────────────────────────────
function ImageUploader({ files, onChange }) {
  const inputRef = useRef();
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  const handleChange = (e) => onChange(Array.from(e.target.files));

  const removeImage = (idx) =>
    onChange(Array.from(files).filter((_, i) => i !== idx));

  return (
    <div>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}
      >
        {previews.map((src, i) => (
          <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
            <img
              src={src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid var(--border)",
              }}
            />
            {i === 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: 2,
                  background: "#0f0f1a",
                  color: "#fff",
                  fontSize: 9,
                  padding: "1px 5px",
                  borderRadius: 4,
                }}
              >
                Main
              </span>
            )}
            <button
              onClick={() => removeImage(i)}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 18,
                height: 18,
                cursor: "pointer",
                fontSize: 11,
                lineHeight: "18px",
                textAlign: "center",
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          style={{
            width: 80,
            height: 80,
            border: "2px dashed var(--border)",
            borderRadius: 8,
            background: "var(--bg)",
            cursor: "pointer",
            fontSize: 22,
            color: "var(--muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <p style={{ fontSize: 11, color: "var(--muted)" }}>
        الصورة الأولى هي الرئيسية · لغاية 10 صور · 5MB لكل صورة
      </p>
    </div>
  );
}

// ─── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    title: product.title || "",
    category: product.category || "",
    price: product.price || "",
    discount: product.discount || 0,
    stock: product.stock || "",
    description: product.description || "",
  });
  const [newImages, setNewImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const existingImages = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const handleSave = async () => {
    setSaving(true);
    await onSave(product._id, form, newImages);
    setSaving(false);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="card"
        style={{
          width: 'min(520px, 92vw)',
          padding: 24,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>✏️ Edit Product</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "var(--muted)",
            }}
          >
            ✕
          </button>
        </div>
        <div
          className="grid-2" style={{ gap: 12,
            marginBottom: 16 }}
        >
          <div className="form-group" style={{ gridColumn: "1/-1" }}>
            <label className="form-label">Title</label>
            <input
              className="form-input"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Price (EGP)</label>
            <input
              className="form-input"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Discount %</label>
            <input
              className="form-input"
              type="number"
              value={form.discount}
              onChange={(e) =>
                setForm((p) => ({ ...p, discount: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Stock Qty</label>
            <input
              className="form-input"
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm((p) => ({ ...p, stock: e.target.value }))
              }
            />
          </div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}>
            <label className="form-label">Description</label>
            <input
              className="form-input"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>
        </div>
        {existingImages.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Current Images</label>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 6,
              }}
            >
              {existingImages.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={src}
                    alt=""
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                    }}
                  />
                  {i === 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: 2,
                        background: "#0f0f1a",
                        color: "#fff",
                        fontSize: 9,
                        padding: "1px 4px",
                        borderRadius: 4,
                      }}
                    >
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="form-label">Replace Images (اختياري)</label>
          <ImageUploader files={newImages} onChange={setNewImages} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const EMOJI_MAP = {
  electronics: "⌚",
  shoes: "👟",
  clothing: "👕",
  accessories: "🕶️",
  furniture: "🛋️",
  books: "📚",
  sports: "⚽",
  beauty: "💄",
  toys: "🧸",
  food: "🍕",
  phones: "📱",
  computers: "💻",
};
const getCategoryEmoji = (cat) => EMOJI_MAP[cat?.toLowerCase()] || "📦";
const stockBadge = (s) =>
  s === 0
    ? { cls: "badge-out", label: "Out of Stock" }
    : s <= 5
      ? { cls: "badge-low", label: "Low Stock" }
      : { cls: "badge-instock", label: "In Stock" };

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
    description: "",
  });

  const [extraCategories, setExtraCategories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("extra_categories") || "[]");
    } catch {
      return [];
    }
  });
  const allCategories = [...new Set([...categories, ...extraCategories])];
  const saveExtraCategories = (cats) => {
    setExtraCategories(cats);
    localStorage.setItem("extra_categories", JSON.stringify(cats));
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        productsAPI.getAll({ limit: 50 }),
        productsAPI.getCategories(),
      ]);
      setProducts(prodsRes.data.products || []);
      setCategories(catsRes.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddCategory = (cat) => {
    if (!allCategories.includes(cat))
      saveExtraCategories([...extraCategories, cat]);
  };
  const handleDeleteCategory = (cat) => {
    if (products.some((p) => p.category === cat)) {
      alert(`Cannot delete "${cat}" — it has products.`);
      return;
    }
    saveExtraCategories(extraCategories.filter((c) => c !== cat));
  };

  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      imageFiles.forEach((f) => fd.append("images", f));
      const { data } = await productsAPI.create(fd);
      setProducts((prev) => [data.product, ...prev]);
      if (form.category && !categories.includes(form.category))
        setCategories((prev) => [...prev, form.category]);
    } catch (err) {
      console.error(err);
    }
    setShowForm(false);
    setForm({
      title: "",
      category: "",
      price: "",
      discount: "",
      stock: "",
      description: "",
    });
    setImageFiles([]);
    setSaving(false);
  };

  const handleEdit = async (id, data, newImgs) => {
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v));
      newImgs.forEach((f) => fd.append("images", f));
      const res = await productsAPI.update(id, fd);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? res.data.product : p)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(id);
    } catch {}
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };
  const handleToggleFeatured = async (p) => {
    try {
      await productsAPI.toggleFeatured(p._id, !p.isFeatured);
      setProducts((prev) =>
        prev.map((pr) =>
          pr._id === p._id ? { ...pr, isFeatured: !p.isFeatured } : pr,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Products</h2>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>
            {products.length} products · {allCategories.length} categories
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-outline"
            onClick={() => setShowCatModal(true)}
          >
            🗂 Categories
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm((s) => !s)}
          >
            {showForm ? "✕ Close" : "+ Add Product"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <span className="card-title">Add New Product</span>
          </div>
          <form onSubmit={handleSave}>
            <div
              className="grid-3" style={{ gap: 12,
                marginBottom: 12 }}
            >
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Smart Watch Pro"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  required
                >
                  <option value="">Select category...</option>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {getCategoryEmoji(c)} {c}
                    </option>
                  ))}
                </select>
                <p
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}
                >
                  مش موجودة؟{" "}
                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      cursor: "pointer",
                      fontSize: 11,
                      padding: 0,
                    }}
                    onClick={() => setShowCatModal(true)}
                  >
                    Add category →
                  </button>
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Price (EGP) *</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="499"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Discount %</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, discount: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Qty *</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="50"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, stock: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Brief description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Product Images</label>
                <ImageUploader files={imageFiles} onChange={setImageFiles} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "💾 Save Product"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}
      >
        {["all", ...allCategories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="btn btn-sm"
            style={{
              background: category === c ? "#0f0f1a" : "#fff",
              color: category === c ? "#fff" : "var(--muted)",
              border: `1px solid ${category === c ? "#0f0f1a" : "var(--border)"}`,
              textTransform: "capitalize",
            }}
          >
            {c === "all"
              ? `All (${products.length})`
              : `${getCategoryEmoji(c)} ${c} (${products.filter((p) => p.category === c).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}
        >
          Loading products...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
          <p>No products in this category yet.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            onClick={() => setShowForm(true)}
          >
            + Add First Product
          </button>
        </div>
      ) : (
        <div
          className="grid-3" style={{ gap: 14 }}
        >
          {filtered.map((p) => {
            const sb = stockBadge(p.stock);
            const final = p.price - (p.price * (p.discount || 0)) / 100;
            const allImgs = p.images?.length
              ? p.images
              : p.image
                ? [p.image]
                : [];
            return (
              <div
                key={p._id}
                className="card"
                style={{ padding: 0, overflow: "hidden" }}
              >
                <div
                  style={{
                    height: 100,
                    background: "var(--bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    position: "relative",
                  }}
                >
                  {allImgs[0] ? (
                    <img
                      src={allImgs[0]}
                      alt={p.title}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    getCategoryEmoji(p.category)
                  )}
                  {allImgs.length > 1 && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 6,
                        right: 6,
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 10,
                      }}
                    >
                      📷 {allImgs.length}
                    </span>
                  )}
                </div>
                {allImgs.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      padding: "6px 8px",
                      background: "var(--bg)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {allImgs.slice(0, 5).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        style={{
                          width: 28,
                          height: 28,
                          objectFit: "cover",
                          borderRadius: 4,
                          border:
                            i === 0
                              ? "2px solid #0f0f1a"
                              : "1px solid var(--border)",
                        }}
                      />
                    ))}
                    {allImgs.length > 5 && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          alignSelf: "center",
                        }}
                      >
                        +{allImgs.length - 5}
                      </span>
                    )}
                  </div>
                )}
                <div style={{ padding: "12px 14px" }}>
                  <div
                    style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      textTransform: "capitalize",
                      marginBottom: 8,
                    }}
                  >
                    {p.category}
                    {p.discount > 0 && (
                      <span style={{ color: "var(--danger)" }}>
                        {" "}
                        · -{p.discount}%
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        EGP {final.toFixed(0)}
                      </span>
                      {p.discount > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            textDecoration: "line-through",
                            marginLeft: 6,
                          }}
                        >
                          EGP {p.price}
                        </span>
                      )}
                    </div>
                    <span className={`badge ${sb.cls}`}>{sb.label}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      marginBottom: 10,
                    }}
                  >
                    Stock: <strong>{p.stock}</strong> units
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-sm btn-outline"
                      style={{ flex: 1 }}
                      onClick={() => setEditProduct(p)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: p.isFeatured ? "#f0c040" : "var(--bg)",
                        border: "1px solid var(--border)",
                      }}
                      onClick={() => handleToggleFeatured(p)}
                    >
                      ⭐
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCatModal && (
        <CategoryModal
          categories={allCategories}
          onClose={() => setShowCatModal(false)}
          onAdd={handleAddCategory}
          onDelete={handleDeleteCategory}
        />
      )}
      {editProduct && (
        <EditModal
          product={editProduct}
          categories={allCategories}
          onClose={() => setEditProduct(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}
