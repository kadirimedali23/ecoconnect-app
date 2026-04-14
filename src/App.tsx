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
import BusinessDetail from './pages/BusinessDetail.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AddBusinessPage from './pages/AddBusinessPage.tsx';
import EditBusinessPage from './pages/EditBusinessPage.tsx';

// Here it redirects unauthenticated users to /login, this is also used to wrap protected routes below.

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
        
        {/* AuthProvider wraps everything so every page can access user state via useAuth(). */}
    
    <AuthProvider>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/businesses" element={<BusinessDirectory />} />
          <Route path="/businesses/:id" element={<BusinessDetail />} />
          {/* Dashboard, add, and edit require login then ProtectedRoute handles the redirect. */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add-business" element={<ProtectedRoute><AddBusinessPage /></ProtectedRoute>} />
          <Route path="/edit-business/:id" element={<ProtectedRoute><EditBusinessPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
