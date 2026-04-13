import { Link } from 'react-router-dom';
import type { Business } from '../services/api';

function StarRating({ rating, reviewCount }: { rating: number | undefined; reviewCount?: number }) {
  const value = rating ?? 0;
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < Math.round(value) ? 'text-amber-400' : 'text-gray-300'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-500">{value.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-400">({reviewCount})</span>
      )}
    </div>
  );
}

interface BusinessCardProps {
  business: Business;
  categoryName?: string;
}

export default function BusinessCard({ business, categoryName }: BusinessCardProps) {
  const addressParts = [business.street, business.city, business.postcode, business.country].filter(Boolean);

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Hero image */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={business.imageUrl}
          alt={business.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {business.featured && (
          <span className="absolute top-2 left-2 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
            Featured
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Category badge */}
        {categoryName && (
          <span className="self-start rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            {categoryName}
          </span>
        )}

        {/* Name */}
        <h2 className="text-base font-semibold text-gray-900 leading-snug">
          {business.name}
        </h2>

        {/* Description — clamped to 2 lines */}
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
          {business.description}
        </p>

        {/* Address */}
        <p className="text-xs text-gray-400">{addressParts.join(', ')}</p>

        {/* Tags */}
        {business.tags && business.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {business.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Star rating */}
        <StarRating rating={business.rating} reviewCount={business.reviewCount} />

        {/* CTA */}
        <Link
          to={`/businesses/${business.id}`}
          className="mt-2 inline-block rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
