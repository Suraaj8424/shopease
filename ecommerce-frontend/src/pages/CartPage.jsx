import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart } from '../api/cartApi';
import { placeOrder }          from '../api/orderApi';
import LoadingSpinner          from '../components/LoadingSpinner';
import { toast }               from 'react-toastify';

const CartPage = () => {
  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const navigate              = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleUpdateQty = async (itemId, qty) => {
    if (qty < 1) return;
    try {
      await updateCartItem(itemId, qty);
      fetchCart();
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
      fetchCart();
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const res = await placeOrder();
      toast.success(`🎉 Order #${res.data.id} placed successfully!`);
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.subtotal), 0
  );

  if (loading) return <LoadingSpinner message="Loading cart..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">🛍️ My Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <span style={{ fontSize: '5rem' }}>🛒</span>
          <h4 className="text-muted mt-3">Your cart is empty</h4>
          <p className="text-muted">
            Add items to your cart to get started
          </p>
          <button
            className="btn btn-primary btn-lg mt-2"
            onClick={() => navigate('/')}
          >
            🛍️ Start Shopping
          </button>
        </div>
      ) : (
        <div className="row g-4">

          {/* Cart Items */}
          <div className="col-lg-8">
            {cart.map(item => (
              <div key={item.id} className="card mb-3 shadow-sm border-0">
                <div className="card-body">
                  <div className="row align-items-center g-2">
                    <div className="col-md-5">
                      <h6 className="fw-bold mb-1">{item.productName}</h6>
                      <p className="text-muted mb-0 small">
                        ₹{Number(item.productPrice).toLocaleString()} each
                      </p>
                    </div>
                    <div className="col-md-3">
                      <div className="input-group input-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            handleUpdateQty(item.id, item.quantity - 1)}
                        >−</button>
                        <input
                          type="text"
                          className="form-control text-center fw-bold"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            handleUpdateQty(item.id, item.quantity + 1)}
                        >+</button>
                      </div>
                    </div>
                    <div className="col-md-3 text-end">
                      <p className="fw-bold text-success mb-0">
                        ₹{Number(item.subtotal).toLocaleString()}
                      </p>
                    </div>
                    <div className="col-md-1 text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemove(item.id)}
                        title="Remove item"
                      >🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 sticky-top"
                 style={{ top: '80px' }}>
              <div className="card-header bg-dark text-white fw-bold">
                📋 Order Summary
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({cart.length})</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span className="text-success fw-bold">Included</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between
                                fw-bold fs-5 mb-3">
                  <span>Total</span>
                  <span className="text-success">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                <button
                  className="btn btn-success w-100 btn-lg shadow"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing
                    ? <><span className="spinner-border
                                 spinner-border-sm me-2" />
                        Placing Order...</>
                    : '✅ Place Order'}
                </button>
                <button
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => navigate('/')}
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;