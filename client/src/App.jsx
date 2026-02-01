import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductEdit from './pages/ProductEdit';
import OrderList from './pages/OrderList';
import OrderDetails from './pages/OrderDetails';
import OrderCreate from './pages/OrderCreate';
import CustomerList from './pages/CustomerList';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />

            <Route path="/products" element={
              <Layout>
                <ProductList />
              </Layout>
            } />

            <Route path="/products/new" element={
              <Layout>
                <ProductEdit />
              </Layout>
            } />

            <Route path="/products/:id/edit" element={
              <Layout>
                <ProductEdit />
              </Layout>
            } />

            <Route path="/orders" element={
              <Layout>
                <OrderList />
              </Layout>
            } />

            <Route path="/orders/create" element={
              <Layout>
                <OrderCreate />
              </Layout>
            } />

            <Route path="/orders/:id" element={
              <Layout>
                <OrderDetails />
              </Layout>
            } />

            <Route path="/customers" element={
              <Layout>
                <CustomerList />
              </Layout>
            } />

            <Route path="/settings" element={
              <Layout>
                <Settings />
              </Layout>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
