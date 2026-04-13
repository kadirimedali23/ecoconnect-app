import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { Container } from '../components/ui/Layout';
import {
  getCategories,
  putCategory,
  deleteCategory,
  getBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  type Category,
  type Business,
  type BusinessPayload,
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
          {activeTab === 'businesses' && <BusinessesTab />}
        </div>
      </Container>
    </div>
  );
}

const EMPTY_FORM: BusinessPayload = {
  name: '',
  categoryId: '',
  description: '',
  street: '',
  city: '',
  postcode: '',
  country: '',
  email: '',
  phone: '',
  website: '',
  imageUrl: '',
  tags: [],
};

const REQUIRED_FIELDS: (keyof BusinessPayload)[] = ['name', 'description', 'city'];

function validateBusiness(form: BusinessPayload): Partial<Record<keyof BusinessPayload, string>> {
  const errors: Partial<Record<keyof BusinessPayload, string>> = {};
  for (const field of REQUIRED_FIELDS) {
    const value = form[field];
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors[field] = 'This field is required.';
    }
  }
  return errors;
}

function BusinessesTab() {
  const { data, loading, error } = useFetch<Business[]>(getBusinesses);
  const { data: categories } = useFetch<Category[]>(getCategories);
  const [businesses, setBusinesses] = useState<Business[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BusinessPayload>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BusinessPayload, string>>>({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const list = businesses ?? data ?? [];
  const categoryMap = Object.fromEntries((categories ?? []).map((c) => [c.id, c.name]));

  function updateField(field: keyof BusinessPayload, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSaveError('');
    setEditingId(null);
    setAdding(true);
  }

  function openEdit(business: Business) {
    setForm({
      name: business.name,
      categoryId: business.categoryId,
      description: business.description,
      street: business.street,
      city: business.city,
      postcode: business.postcode,
      country: business.country,
      email: business.email,
      phone: business.phone,
      website: business.website,
      imageUrl: business.imageUrl,
      tags: business.tags ?? [],
    });
    setFormErrors({});
    setSaveError('');
    setAdding(false);
    setEditingId(business.id);
  }

  function cancelForm() {
    setAdding(false);
    setEditingId(null);
    setFormErrors({});
    setSaveError('');
  }

  async function handleAdd() {
    const errors = validateBusiness(form);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSaving(true);
    setSaveError('');
    try {
      const created = await createBusiness(form);
      setBusinesses([...list, created]);
      cancelForm();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    const errors = validateBusiness(form);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSaving(true);
    setSaveError('');
    try {
      const updated = await updateBusiness(id, form);
      setBusinesses(list.map((b) => (b.id === id ? updated : b)));
      cancelForm();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this business?')) return;
    setDeletingId(id);
    setDeleteError('');
    try {
      await deleteBusiness(id);
      setBusinesses(list.filter((b) => b.id !== id));
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading businesses…</p>;
  if (error)   return <p className="text-sm text-red-500">Failed to load businesses.</p>;

  const isFormOpen = adding || editingId !== null;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Businesses</h2>
        {!isFormOpen && (
          <button
            onClick={openAdd}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {/* Add / Edit form */}
      {isFormOpen && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            {adding ? 'New Business' : 'Edit Business'}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                { field: 'name',     label: 'Name *',    type: 'text' },
                { field: 'city',     label: 'City *',    type: 'text' },
                { field: 'street',   label: 'Street',    type: 'text' },
                { field: 'postcode', label: 'Postcode',  type: 'text' },
                { field: 'country',  label: 'Country',   type: 'text' },
                { field: 'email',    label: 'Email',     type: 'email' },
                { field: 'phone',    label: 'Phone',     type: 'tel' },
                { field: 'website',  label: 'Website',   type: 'url' },
                { field: 'imageUrl', label: 'Image URL', type: 'url' },
              ] as { field: keyof BusinessPayload; label: string; type: string }[]
            ).map(({ field, label, type }) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">{label}</label>
                <input
                  type={type}
                  value={form[field] as string}
                  onChange={(e) => updateField(field, e.target.value)}
                  className={`rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 ${
                    formErrors[field]
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                  }`}
                />
                {formErrors[field] && (
                  <span className="text-xs text-red-500">{formErrors[field]}</span>
                )}
              </div>
            ))}

            {/* Category select */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => updateField('categoryId', e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select a category…</option>
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Description — full width */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-medium text-gray-600">Description *</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={`rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 ${
                  formErrors.description
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                }`}
              />
              {formErrors.description && (
                <span className="text-xs text-red-500">{formErrors.description}</span>
              )}
            </div>
          </div>

          {saveError && <p className="mt-3 text-xs text-red-500">{saveError}</p>}

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => (adding ? handleAdd() : handleUpdate(editingId!))}
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={cancelForm}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteError && <p className="mb-3 text-xs text-red-500">{deleteError}</p>}

      {/* Business list */}
      {list.length === 0 ? (
        <p className="text-sm text-gray-400">No businesses yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {list.map((biz) => (
            <li key={biz.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{biz.name}</p>
                <p className="text-xs text-gray-500">
                  Location: {biz.city}
                  {categoryMap[biz.categoryId] && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                      {categoryMap[biz.categoryId]}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(biz)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(biz.id)}
                  disabled={deletingId === biz.id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {deletingId === biz.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoriesTab() {
  const { data, loading, error } = useFetch<Category[]>(getCategories);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const list = categories ?? data ?? [];

  async function handleAdd() {
    if (!newName.trim()) { setAddError('Name is required.'); return; }
    setSaving(true);
    setAddError('');
    try {
      const result = await putCategory(newName.trim());
      setCategories([...list, { id: result.id, name: newName.trim() }]);
      setNewName('');
      setAdding(false);
    } catch (e) {
      setAddError(e instanceof Error ? e.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSave(id: string) {
    if (!editName.trim()) { setEditError('Name is required.'); return; }
    setSaving(true);
    setEditError('');
    try {
      await putCategory(editName.trim(), id);
      setCategories(list.map((c) => (c.id === id ? { ...c, name: editName.trim() } : c)));
      setEditingId(null);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setDeletingId(id);
    setDeleteError('');
    try {
      await deleteCategory(id);
      setCategories(list.filter((c) => c.id !== id));
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading categories…</p>;
  if (error)   return <p className="text-sm text-red-500">Failed to load categories.</p>;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
        <button
          onClick={() => { setAdding(true); setNewName(''); setAddError(''); }}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Add row */}
      {adding && (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setAddError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Category name"
              className={`flex-1 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 ${
                addError
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
              }`}
            />
            <button
              onClick={handleAdd}
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => { setAdding(false); setAddError(''); }}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
          {addError && <p className="mt-1 text-xs text-red-500">{addError}</p>}
        </div>
      )}

      {deleteError && (
        <p className="mb-3 text-xs text-red-500">{deleteError}</p>
      )}

      {/* Category list */}
      {list.length === 0 ? (
        <p className="text-sm text-gray-400">No categories yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {list.map((cat) => (
            <li key={cat.id} className="py-3">
              {editingId === cat.id ? (
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={(e) => { setEditName(e.target.value); setEditError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleEditSave(cat.id)}
                      className={`flex-1 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 ${
                        editError
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                          : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                      }`}
                    />
                    <button
                      onClick={() => handleEditSave(cat.id)}
                      disabled={saving}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setEditError(''); }}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {editError && <p className="mt-1 text-xs text-red-500">{editError}</p>}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditError(''); }}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={deletingId === cat.id}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {deletingId === cat.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
