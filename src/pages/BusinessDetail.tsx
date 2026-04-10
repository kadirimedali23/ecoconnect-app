import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getBusiness, type Business } from '../services/api';
import { Container } from '../components/ui/Layout';

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-2xl" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </span>
  );
}

function InfoRow({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm text-gray-700">
      <span className="mt-0.5 text-base">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();

  const fetcher = useCallback(() => getBusiness(id!), [id]);
  const { data: business, loading, error } = useFetch<Business>(fetcher);

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

  const addressParts = [business.street, business.city, business.postcode, business.country].filter(Boolean);

  return (
    <div className="min-h-screen bg-emerald-900">
      <Container className="py-8 max-w-4xl">
        {/* Back link */}
        <Link
          to="/businesses"
          className="mb-6 inline-flex items-center gap-1 text-sm text-emerald-300 hover:text-white transition-colors"
        >
          ← Back to Directory
        </Link>

        <div className="rounded-2xl overflow-hidden bg-white shadow-lg">
          {/* Hero image */}
          <div className="relative h-56 sm:h-72 bg-gray-100">
            {business.imageUrl ? (
              <img
                src={business.imageUrl}
                alt={business.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-300 text-6xl">
                🌿
              </div>
            )}
            {business.featured && (
              <span className="absolute top-3 left-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-900">
                Featured
              </span>
            )}
          </div>

          {/* Main content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              {business.categoryId && (
                <span className="inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800">
                  {business.categoryId}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{business.name}</h1>

              {business.rating !== undefined && (
                <div className="flex items-center gap-2">
                  <StarRating rating={business.rating} />
                  <span className="text-gray-700 font-medium">{business.rating.toFixed(1)}</span>
                  {business.reviewCount !== undefined && (
                    <span className="text-sm text-gray-400">
                      ({business.reviewCount} review{business.reviewCount !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            {business.description && (
              <p className="text-gray-600 leading-relaxed">{business.description}</p>
            )}

            {/* Tags */}
            {business.tags && business.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {business.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs text-emerald-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Contact & location */}
            <div className="grid sm:grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4">
              {addressParts.length > 0 && (
                <InfoRow icon="📍">{addressParts.join(', ')}</InfoRow>
              )}
              {business.phone && (
                <InfoRow icon="📞">
                  <a href={`tel:${business.phone}`} className="hover:text-green-600 transition-colors">
                    {business.phone}
                  </a>
                </InfoRow>
              )}
              {business.email && (
                <InfoRow icon="✉️">
                  <a href={`mailto:${business.email}`} className="hover:text-green-600 transition-colors">
                    {business.email}
                  </a>
                </InfoRow>
              )}
              {business.website && (
                <InfoRow icon="🌐">
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-600 transition-colors break-all"
                  >
                    {business.website}
                  </a>
                </InfoRow>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
