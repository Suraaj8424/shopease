import { useState, useEffect }           from 'react';
import { getAllProducts, searchProducts } from '../api/productApi';
import ProductCard                       from '../components/ProductCard';
import LoadingSpinner                    from '../components/LoadingSpinner';
import { toast }                         from 'react-toastify';

const HomePage = () => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [keyword, setKeyword]     = useState('');
  const [page, setPage]           = useState(0);
  const [totalPages, setTotal]    = useState(0);
  const [searching, setSearching] = useState(false);

  const fetchProducts = async (p = 0) => {
    setLoading(true);
    try {
      const res = await getAllProducts(p, 8, 'name');
      setProducts(res.data.content);
      setTotal(res.data.totalPages);
      setPage(p);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) { fetchProducts(0); return; }
    setSearching(true);
    setLoading(true);
    try {
      const res = await searchProducts(keyword, 0, 8);
      setProducts(res.data.content);
      setTotal(res.data.totalPages);
      setPage(0);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setKeyword('');
    setSearching(false);
    fetchProducts(0);
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className="container py-4">

      {/* Hero Banner */}
      <div className="rounded-4 p-5 mb-4 text-center text-white"
           style={{
             background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
             boxShadow: '0 4px 20px rgba(13,110,253,0.3)'
           }}>
        <h1 className="display-5 fw-bold">
          Welcome to ShopEase 🛒
        </h1>
        <p className="lead mb-0">
          Discover amazing products at unbeatable prices
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group input-group-lg shadow-sm">
          <span className="input-group-text bg-white border-end-0">
            🔍
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search products by name or category..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="btn btn-primary px-4" type="submit">
            Search
          </button>
          {searching && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={clearSearch}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </form>

      {/* Section Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">
          {searching ? `Results for "${keyword}"` : '🏷️ All Products'}
        </h5>
        {!loading && (
          <span className="text-muted small">
            {products.length} products found
          </span>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : products.length === 0 ? (
        <div className="text-center py-5">
          <span style={{ fontSize: '4rem' }}>😕</span>
          <h4 className="text-muted mt-3">No products found</h4>
          {searching && (
            <button className="btn btn-link" onClick={clearSearch}>
              ← Back to all products
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-sm-2
                          row-cols-md-3 row-cols-lg-4 g-4">
            {products.map(product => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4 d-flex justify-content-center">
              <ul className="pagination shadow-sm">
                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                  <button className="page-link"
                          onClick={() => fetchProducts(page - 1)}>
                    « Prev
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i}
                      className={`page-item ${page === i ? 'active' : ''}`}>
                    <button className="page-link"
                            onClick={() => fetchProducts(i)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item
                  ${page === totalPages - 1 ? 'disabled' : ''}`}>
                  <button className="page-link"
                          onClick={() => fetchProducts(page + 1)}>
                    Next »
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;