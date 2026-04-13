import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Container } from '../components/ui/Layout';

type Tab = 'categories' | 'businesses';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('categories');

  return (
    <div className="min-h-screen bg-emerald-900">
      <Container className="py-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-white mb-6">
          Welcome, {user?.username ?? 'there'}!
        </h1>

        {/* Tab menu */}
        <div className="flex border-b border-emerald-700 mb-6">
          {(['categories', 'businesses'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors focus:outline-none ${
                activeTab === tab
                  ? 'border-b-2 border-white text-white'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl p-6 shadow min-h-40" />
      </Container>
    </div>
  );
}
