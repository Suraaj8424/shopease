import { useState, useEffect }  from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById }       from '../api/productApi';
import { addToCart }            from '../api/cartApi';
import { useAuth }              from '../context/AuthContext';
import LoadingSpinner           from '../components/LoadingSpinner';
import { toast }                from 'react-toastify';

const ProductDetailPage = () => {
  const { id }                  = useParams();
  const [product, setProduct]   = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const { isLoggedIn }          = useAuth();
  const navigate                = useNavigate();

  useEffect(() => {
    getProductById(id)
      .then(res => setProduct(res.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart({ productId: product.id, quantity });
      toast.success(`${product.name} added to cart! 🛒`);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading product..." />;

  if (!product) return (
    <div className="container py-5 text-center">
      <span style={{ fontSize: '4rem' }}>😕</span>
      <h4 className="mt-3">Product not found</h4>
      <button className="btn btn-primary mt-3"
              onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );

  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="row g-5">
        {/* Image */}
        <div className="col-md-5">
          <img
            src={product.imageUrl ||
              'https://placehold.co/500x400?text=ShopEase'}
            alt={product.name}
            className="img-fluid rounded-4 shadow"
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Details */}
        <div className="col-md-7">
          <span className="badge bg-secondary mb-2 fs-6">
            {product.category || 'General'}
          </span>
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted fs-6 lh-lg">{product.description}</p>

          <h3 className="text-success fw-bold my-3">
            ₹{Number(product.price).toLocaleString()}
          </h3>

          <p className={`fw-semibold ${
            product.stock > 0 ? 'text-success' : 'text-danger'}`}>
            {product.stock > 0
              ? `✅ ${product.stock} items in stock`
              : '❌ Out of stock'}
          </p>

          <hr />

          {product.stock > 0 && (
            <div className="d-flex align-items-center gap-3 mt-3">
              <div className="input-group shadow-sm"
                   style={{ width: '140px' }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >−</button>
                <input
                  type="number"
                  className="form-control text-center fw-bold"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setQuantity(q => Math.min(product.stock, q + 1))}
                >+</button>
              </div>

              <button
                className="btn btn-primary btn-lg flex-grow-1 shadow"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding
                  ? <><span className="spinner-border
                               spinner-border-sm me-2" />Adding...</>
                  : '🛒 Add to Cart'}
              </button>
            </div>
          )}

          <div className="mt-4 p-3 bg-light rounded-3">
            <small className="text-muted">
              🚚 Free delivery &nbsp;|&nbsp;
              🔄 Easy returns &nbsp;|&nbsp;
              🛡️ Secure checkout
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;