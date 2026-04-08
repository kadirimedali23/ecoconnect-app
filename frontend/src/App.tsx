import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/ui/Navbar.tsx';
import { Footer } from './components/ui/Footer.tsx';
import Home from './pages/Home';
import './App.css';
import BusinessDirectory from './pages/BusinessDirectory.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<BusinessDirectory />} />
          <Route path="/directory/:id" element={<></>} />
          <Route path="/login" element={<></>} />
          <Route path="/register" element={<></>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
