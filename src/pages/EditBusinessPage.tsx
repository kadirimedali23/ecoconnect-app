import { useState, useEffect, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getBusiness, putBusiness, getCategories, type Business, type Category } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { Container } from '../components/ui/Layout';

// This is only reachable by logged-in users via <ProtectedRoute> in App.tsx.

export default function EditBusinessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // useCallback stabilises the fetcher so useFetch doesn't loop on re-renders.

  const businessFetcher = useCallback(() => getBusiness(id!), [id]);
  const { data: business, loading, error } = useFetch<Business>(businessFetcher);
  const { data: categories } = useFetch<Category[]>(getCategories);

  const [form, setForm] = useState({
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
    featured: false,
    tags: [] as string[],
    rating: undefined as number | undefined,
    reviewCount: undefined as number | undefined,
  });
  const [tagInput, setTagInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  // This one populates the form once business data arrives from the API.

  useEffect(() => {
    if (!business) return;
    setForm({
      name: business.name,
      categoryId: business.categoryId ?? '',
      description: business.description ?? '',
      street: business.street ?? '',
      city: business.city ?? '',
      postcode: business.postcode ?? '',
      country: business.country ?? '',
      email: business.email ?? '',
      phone: business.phone ?? '',
      website: business.website ?? '',
      imageUrl: business.imageUrl ?? '',
      featured: business.featured ?? false,
      tags: business.tags ?? [],
      rating: business.rating,
      reviewCount: business.reviewCount,
    });
  }, [business]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !form.tags.includes(tag)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameError('');
    setApiError('');

    if (!form.name.trim()) {
      setNameError('Business name is required.');
      return;
    }

    // This passes original id and createdAt so the API updates the record rather than creating one.

    setSaving(true);
    try {
      await putBusiness(form, business!.id, business!.createdAt);
      navigate(`/businesses/${business!.id}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to save business.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-900 flex items-center justify-center">
        <p className="text-emerald-200 text-sm animate-pulse">Loading…</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center gap-4">
        <p className="text-white text-lg">{error ?? 'Business not found.'}</p>
        <Link to="/businesses" className="text-sm text-emerald-300 underline">
          Back to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-900">
      <Container className="py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-6">Edit Business</h1>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white shadow-lg p-6 sm:p-8 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="">Select a category…</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Address */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Address</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={form.street}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <input
                type="text"
                name="postcode"
                placeholder="Postcode"
                value={form.postcode}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </fieldset>

          {/* Contact */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Contact</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <input
                type="url"
                name="website"
                placeholder="Website URL"
                value={form.website}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:col-span-2"
              />
              <input
                type="url"
                name="imageUrl"
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:col-span-2"
              />
            </div>
          </fieldset>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-gray-400 font-normal">(press Enter to add)</span>
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="e.g. organic, vegan, local…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {form.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-green-100 border border-green-200 px-3 py-0.5 text-xs font-medium text-green-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-green-600 hover:text-green-900 leading-none"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            Featured business
          </label>

          {/* API error */}
          {apiError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {apiError}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/businesses/${business.id}`)}
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}
