import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Layout';
import { Heading, Text } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { useState, type FormEvent } from 'react';
import { register } from '../services/authService';

export default function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      await register(email, password);
      navigate('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-slate-50 flex-1">
      <Container className="max-w-md">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
          <Heading level={2} className="mb-2 text-center">Create an account</Heading>
          <Text className="text-center mb-8">Join the EcoConnect community today.</Text>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                onChange={e => setEmail(e.target.value)}
                value={email}
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
                value={password}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Repeat Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={e => setRepeatPassword(e.target.value)}
                value={repeatPassword}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
             {error && <p className="error">{error}</p>}
            <Button variant="success" className="w-full mb-2">
              {loading ? 'Creating account…' : 'Register'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
