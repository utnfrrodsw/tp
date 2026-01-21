import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navigation } from './components/common/Navigation';

// Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Home } from './pages/user/Home';
import { Catalog } from './pages/user/Catalog';
import { AdminDashboard } from './pages/admin/Dashboard';
import UsersManagement from './pages/admin/UsersManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import DiscountsManagement from './pages/admin/DiscountsManagement';

import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/user/OrdersPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import ProfilePage from './pages/user/ProfilePage';
import MyProductsPage from './pages/user/MyProductsPage';

import { AuctionsPage } from './pages/auction/AuctionsPage';
import { AuctionDetailPage } from './pages/auction/AuctionDetailPage';


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNav && <Navigation />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-products" element={<MyProductsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/categories" element={<CategoriesManagement />} />
          <Route path="/admin/discounts" element={<DiscountsManagement />} />
          <Route path="/auctions" element={<AuctionsPage />} />
          <Route path="/auctions/:id" element={<AuctionDetailPage />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" aria-label="notificaciones" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
