import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Layout';
import { Heading, Text } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { useState, type FormEvent } from 'react';
import { login } from '../services/authService';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/businesses');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-slate-50 flex-1">
      <Container className="max-w-md">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
          <Heading level={2} className="mb-2 text-center">Login to your account</Heading>
          <Text className="text-center mb-8">Join the EcoConnect community today.</Text>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
             {error && <p className="error">{error}</p>}
            <Button variant="success" className="w-full mb-2">
              {loading ? 'Logging in…' : 'Login'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
