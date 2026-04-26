import { useState, useEffect } from 'react';
import { getMyOrders, processPayment } from '../api/orderApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast }      from 'react-toastify';

const STATUS_COLORS = {
  PENDING:   'warning',
  CONFIRMED: 'primary',
  SHIPPED:   'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

const STATUS_ICONS = {
  PENDING:   '⏳',
  CONFIRMED: '✅',
  SHIPPED:   '🚚',
  DELIVERED: '📦',
  CANCELLED: '❌',
};

const OrderHistoryPage = () => {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleDummyPayment = async (orderId) => {
    setPayingId(orderId);
    try {
      const res = await processPayment({
        orderId,
        cardNumber: '4111111111111111',
        cardHolder: 'ShopEase User',
        expiryDate: '12/26',
        cvv: '123',
      });
      toast.success(res.data.message);
      // Refresh orders after payment
      const updated = await getMyOrders();
      setOrders(updated.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed');
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your orders..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📦 My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <span style={{ fontSize: '5rem' }}>📭</span>
          <h4 className="text-muted mt-3">No orders yet</h4>
          <p className="text-muted">
            Place your first order from the cart
          </p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card mb-4 shadow-sm border-0">

            {/* Order Header */}
            <div className="card-header bg-white d-flex
                            justify-content-between align-items-center
                            flex-wrap gap-2">
              <div>
                <strong className="fs-6">Order #{order.id}</strong>
                <span className="text-muted ms-3 small">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
              <span className={`badge bg-${STATUS_COLORS[order.status]}
                               fs-6 px-3 py-2`}>
                {STATUS_ICONS[order.status]} {order.status}
              </span>
            </div>

            {/* Order Items Table */}
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm table-hover mb-3">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Unit Price</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i}>
                        <td className="fw-semibold">{item.productName}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">
                          ₹{Number(item.price).toLocaleString()}
                        </td>
                        <td className="text-end text-success fw-bold">
                          ₹{Number(item.subtotal).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan="3"
                          className="text-end fw-bold">
                        Order Total
                      </td>
                      <td className="text-end fw-bold text-success fs-6">
                        ₹{Number(order.totalAmount).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pay Now for CONFIRMED orders */}
              {order.status === 'CONFIRMED' && (
                <div className="text-end">
                  <button
                    className="btn btn-success btn-lg shadow"
                    onClick={() => handleDummyPayment(order.id)}
                    disabled={payingId === order.id}
                  >
                    {payingId === order.id
                      ? <><span className="spinner-border
                                   spinner-border-sm me-2" />
                          Processing...</>
                      : '💳 Pay Now'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistoryPage;