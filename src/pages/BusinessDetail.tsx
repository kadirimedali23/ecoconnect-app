import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import {
  getBusiness,
  getReviews,
  postReview,
  type Business,
  type Review,
} from '../services/api';
import { Container } from '../components/ui/Layout';

// ── Helpers ───────────────────────────────────────────────────────────────────

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-lg';
  return (
    <span className={`flex items-center gap-0.5 ${sizeClass}`} aria-label={`${rating} out of 5`}>
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

// ── Review card ───────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-gray-800">{review.username}</span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      <StarRating rating={review.rating} size="sm" />
      {review.comment && (
        <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
      )}
    </div>
  );
}

// ── Review form ───────────────────────────────────────────────────────────────

function ReviewForm({ businessId, onSubmitted }: { businessId: string; onSubmitted: () => void }) {
  const [rating, setRating]     = useState(5);
  const [comment, setComment]   = useState('');
  const [hover, setHover]       = useState(0);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await postReview({ businessId, rating, comment });
      setComment('');
      setRating(5);
      onSubmitted();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Leave a review</h3>

      {/* Star picker */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const val = i + 1;
          return (
            <button
              key={val}
              type="button"
              onClick={() => setRating(val)}
              onMouseEnter={() => setHover(val)}
              onMouseLeave={() => setHover(0)}
              className="text-2xl leading-none transition-colors"
              aria-label={`Rate ${val} star${val > 1 ? 's' : ''}`}
            >
              <span className={(hover || rating) >= val ? 'text-amber-400' : 'text-gray-300'}>★</span>
            </button>
          );
        })}
        <span className="ml-2 text-sm text-gray-500">{rating} / 5</span>
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)..."
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
      />

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const businessFetcher = useCallback(() => getBusiness(id!), [id]);
  const { data: business, loading, error } = useFetch<Business>(businessFetcher);

  const [reviewTick, setReviewTick] = useState(0);
  const reviewsFetcher = useCallback(
    () => getReviews(id!),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, reviewTick],
  );
  const { data: reviews, loading: revLoading } = useFetch<Review[]>(reviewsFetcher);

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
              <img src={business.imageUrl} alt={business.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-300 text-6xl">🌿</div>
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
                  <StarRating rating={business.rating} size="lg" />
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
                  <span key={tag} className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs text-emerald-700">
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
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors break-all">
                    {business.website}
                  </a>
                </InfoRow>
              )}
            </div>

            {/* Reviews — list always visible; form only when logged in */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Reviews{' '}
                {reviews && reviews.length > 0 && (
                  <span className="text-gray-400 font-normal text-sm">({reviews.length})</span>
                )}
              </h2>

              {revLoading ? (
                <p className="text-sm text-gray-400 animate-pulse">Loading reviews…</p>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
              )}

              {user && (
                <ReviewForm
                  businessId={business.id}
                  onSubmitted={() => setReviewTick((t) => t + 1)}
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
