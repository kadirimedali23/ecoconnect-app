import { useAuth } from '../hooks/useAuth';
import { Container } from '../components/ui/Layout';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-emerald-900">
      <Container className="py-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome, {user?.username ?? 'there'}!
        </h1>
      </Container>
    </div>
  );
}
