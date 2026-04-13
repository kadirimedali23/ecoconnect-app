import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { Container } from '../components/ui/Layout';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from '../services/api';

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
        <div className="bg-white rounded-2xl p-6 shadow min-h-40">
          {activeTab === 'categories' && <CategoriesTab />}
        </div>
      </Container>
    </div>
  );
}

function CategoriesTab() {
  const { data, loading, error } = useFetch<Category[]>(getCategories);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const list = categories ?? data ?? [];

  async function handleAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const created = await createCategory(newName.trim());
      setCategories([...list, created]);
      setNewName('');
      setAdding(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSave(id: string) {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const updated = await updateCategory(id, editName.trim());
      setCategories(list.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteCategory(id);
    setCategories(list.filter((c) => c.id !== id));
  }

  if (loading) return <p className="text-sm text-gray-500">Loading categories…</p>;
  if (error)   return <p className="text-sm text-red-500">Failed to load categories.</p>;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
        <button
          onClick={() => { setAdding(true); setNewName(''); }}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Add row */}
      {adding && (
        <div className="flex items-center gap-2 mb-3">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Category name"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setAdding(false)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Category list */}
      {list.length === 0 ? (
        <p className="text-sm text-gray-400">No categories yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {list.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between py-3">
              {editingId === cat.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEditSave(cat.id)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    onClick={() => handleEditSave(cat.id)}
                    disabled={saving}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-sm text-gray-800">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
