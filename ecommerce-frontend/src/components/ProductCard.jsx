import { useNavigate } from 'react-router-dom';
import { addToCart }   from '../api/cartApi';
import { useAuth }     from '../context/AuthContext';
import { toast }       from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate   = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleAddToCart = async (e) => {
    e.stopPropagation();    // prevent navigating to detail page
    if (!isLoggedIn()) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div
      className="card h-100 shadow-sm border-0"
      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
      onClick={() => navigate(`/products/${product.id}`)}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <img
        src={product.imageUrl ||
          'https://placehold.co/300x200?text=ShopEase'}
        className="card-img-top"
        alt={product.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary mb-2 align-self-start">
          {product.category || 'General'}
        </span>
        <h6 className="card-title fw-bold">{product.name}</h6>
        <p className="card-text text-muted small flex-grow-1">
          {product.description?.substring(0, 80)}
          {product.description?.length > 80 ? '...' : ''}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="fw-bold text-success fs-5">
            ₹{Number(product.price).toLocaleString()}
          </span>
          <span className={`badge ${product.stock > 0
            ? 'bg-success' : 'bg-danger'}`}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </span>
        </div>
        <button
          className="btn btn-primary mt-3 w-100"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;