import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { AuthProvider }    from './context/AuthContext';
import ProtectedRoute      from './components/ProtectedRoute';
import Navbar              from './components/Navbar';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import HomePage            from './pages/HomePage';
import ProductDetailPage   from './pages/ProductDetailPage';
import CartPage            from './pages/CartPage';
import OrderHistoryPage    from './pages/OrderHistoryPage';
import AdminDashboard      from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">

          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-grow-1" style={{ background: '#f8f9fa' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/"             element={<HomePage />} />
              <Route path="/login"        element={<LoginPage />} />
              <Route path="/register"     element={<RegisterPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />

              {/* Protected — logged-in users */}
              <Route path="/cart" element={
                <ProtectedRoute><CartPage /></ProtectedRoute>
              }/>
              <Route path="/orders" element={
                <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
              }/>

              {/* Protected — ADMIN only */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }/>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* ✅ Footer */}
          <footer className="bg-dark text-white py-4 mt-auto">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-4 text-center text-md-start mb-2 mb-md-0">
                  <span className="fw-bold fs-5">🛒 ShopEase</span>
                  <p className="text-secondary mb-0 small">
                    E-Commerce Microservices Platform
                  </p>
                </div>
                <div className="col-md-4 text-center mb-2 mb-md-0">
                  <p className="mb-0 small text-secondary">
                    Built with ☕ Java & ⚛️ React
                  </p>
                  <p className="mb-0 small text-secondary">
                    Spring Boot · Microservices · PostgreSQL
                  </p>
                </div>
                <div className="col-md-4 text-center text-md-end">
                  <a
                    href="https://github.com/YOUR_USERNAME/shopease"
                    className="text-white text-decoration-none small"
                    target="_blank"
                    rel="noreferrer"
                  >
                    📁 GitHub Repository
                  </a>
                  <p className="text-secondary mb-0 small mt-1">
                    © 2025 ShopEase. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>

        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;