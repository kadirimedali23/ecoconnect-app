import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/ui/Navbar.tsx';
import { Footer } from './components/ui/Footer.tsx';
import Home from './pages/Home';
import './App.css';
import BusinessDirectory from './pages/BusinessDirectory.tsx';
import Register from './pages/Register.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';
import Login from './pages/Login.tsx';

export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<BusinessDirectory />} />
          <Route path="/directory/:id" element={<></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
