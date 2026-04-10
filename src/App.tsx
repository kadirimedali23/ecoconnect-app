import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/ui/Navbar.tsx';
import { Footer } from './components/ui/Footer.tsx';
import Home from './pages/Home';
import './App.css';
import Register from './pages/Register.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';
import Login from './pages/Login.tsx';
import { useAuth } from './hooks/useAuth.ts';
import BusinessDirectory from './pages/BusinessDirectory.tsx';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/businesses" element={<BusinessDirectory />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
