import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import WishlistPage from './pages/WishlistPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import InvoicePage from './pages/InvoicePage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import { WishlistProvider } from './context/WishlistContext';

function AppContent() {
  const location = useLocation();
  const isProductDetailPage = location.pathname.startsWith('/product/');
  const isSearchPage = location.pathname === '/search';
  const isInvoicePage = location.pathname.includes('/invoice');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {!isProductDetailPage && !isSearchPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/order/:id/invoice" element={<InvoicePage />} />
        </Routes>
      </main>
      {!isInvoicePage && !isSearchPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <WishlistProvider>
      <Router>
        <AppContent />
      </Router>
    </WishlistProvider>
  );
}

export default App;
