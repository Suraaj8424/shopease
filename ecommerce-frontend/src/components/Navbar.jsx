import { Link, useNavigate } from 'react-router-dom';
import { useAuth }           from '../context/AuthContext';
import { toast }             from 'react-toastify';

const Navbar = () => {
  const { user, logout, isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow">

      {/* ✅ Updated ShopEase brand */}
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
        <span style={{ fontSize: '1.5rem' }}>🛒</span>
        <div>
          <span className="fw-bold fs-5">ShopEase</span>
          <span
            className="d-none d-md-inline text-secondary ms-1"
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
          >
            E-Commerce Platform
          </span>
        </div>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          {isLoggedIn() && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">🛍️ Cart</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/orders">📦 My Orders</Link>
              </li>
            </>
          )}
          {isAdmin() && (
            <li className="nav-item">
              <Link className="nav-link text-warning fw-bold" to="/admin">
                ⚙️ Admin
              </Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav">
          {isLoggedIn() ? (
            <li className="nav-item dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                👤 {user?.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <span className="dropdown-item-text text-muted small">
                    {user?.email}
                  </span>
                </li>
                <li>
                  <span className="dropdown-item-text text-muted small">
                    Role: <strong>{user?.role}</strong>
                  </span>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="btn btn-outline-light me-2" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary" to="/register">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;