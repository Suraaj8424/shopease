import { useState, useEffect } from 'react';
import {
  getAllProducts, createProduct,
  updateProduct, deleteProduct
} from '../../api/productApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast }      from 'react-toastify';

const EMPTY_FORM = {
  name: '', description: '', price: '',
  stock: '', imageUrl: '', category: ''
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]     = useState('');

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts(0, 100);
      setProducts(res.data.content);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (product) => {
    setForm({
      name:        product.name,
      description: product.description || '',
      price:       product.price,
      stock:       product.stock,
      imageUrl:    product.imageUrl || '',
      category:    product.category || '',
    });
    setEditId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updateProduct(editId, form);
        toast.success('✅ Product updated successfully!');
      } else {
        await createProduct(form);
        toast.success('✅ Product created successfully!');
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(
      `Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('🗑️ Product deleted');
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="container-fluid py-4 px-4">

      {/* Dashboard Header */}
      <div className="d-flex justify-content-between
                      align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0">⚙️ Admin Dashboard</h2>
          <p className="text-muted mb-0 small">
            ShopEase – Product Management
          </p>
        </div>
        <button className="btn btn-primary btn-lg shadow"
                onClick={openCreate}>
          + Add New Product
        </button>
      </div>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body d-flex justify-content-between
                            align-items-center">
              <div>
                <p className="mb-0 small">Total Products</p>
                <h3 className="fw-bold mb-0">{products.length}</h3>
              </div>
              <span style={{ fontSize: '2.5rem' }}>📦</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-success text-white">
            <div className="card-body d-flex justify-content-between
                            align-items-center">
              <div>
                <p className="mb-0 small">In Stock</p>
                <h3 className="fw-bold mb-0">
                  {products.filter(p => p.stock > 0).length}
                </h3>
              </div>
              <span style={{ fontSize: '2.5rem' }}>✅</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-danger text-white">
            <div className="card-body d-flex justify-content-between
                            align-items-center">
              <div>
                <p className="mb-0 small">Out of Stock</p>
                <h3 className="fw-bold mb-0">
                  {products.filter(p => p.stock === 0).length}
                </h3>
              </div>
              <span style={{ fontSize: '2.5rem' }}>❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="card shadow mb-4 border-primary border-2">
          <div className="card-header bg-primary text-white fw-bold fs-6">
            {editId ? '✏️ Edit Product' : '➕ Add New Product'}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Product Name *
                  </label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="e.g. MacBook Pro 14"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    Price (₹) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    placeholder="e.g. 99999"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    Stock *
                  </label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="e.g. 50"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Category
                  </label>
                  <input
                    name="category"
                    className="form-control"
                    placeholder="e.g. Laptops"
                    value={form.category}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Image URL
                  </label>
                  <input
                    name="imageUrl"
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    value={form.imageUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows={3}
                    placeholder="Product description..."
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-4 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={saving}
                >
                  {saving
                    ? <><span className="spinner-border
                                 spinner-border-sm me-2" />
                        Saving...</>
                    : editId ? '💾 Update Product' : '✅ Create Product'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => { setShowForm(false); setEditId(null); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="card shadow border-0">
        <div className="card-header bg-white d-flex
                        justify-content-between align-items-center">
          <strong>All Products ({filtered.length})</strong>
          <input
            type="text"
            className="form-control form-control-sm w-auto"
            placeholder="🔍 Filter by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: '250px' }}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className="text-muted">#{p.id}</td>
                  <td>
                    <img
                      src={p.imageUrl ||
                        'https://placehold.co/50x50?text=SE'}
                      alt={p.name}
                      width={50}
                      height={50}
                      className="rounded"
                      style={{ objectFit: 'cover' }}
                    />
                  </td>
                  <td className="fw-bold">{p.name}</td>
                  <td>
                    <span className="badge bg-secondary">
                      {p.category || '—'}
                    </span>
                  </td>
                  <td className="text-success fw-bold">
                    ₹{Number(p.price).toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${
                      p.stock > 10  ? 'bg-success' :
                      p.stock > 0   ? 'bg-warning text-dark' :
                                      'bg-danger'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(p)}
                    >✏️ Edit</button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.id, p.name)}
                    >🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;