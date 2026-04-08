import { Link } from 'react-router-dom';
import type { Business } from '../services/api.ts';


const CATEGORY_STYLES: Record<Business['category'], string> = {
  'zero-waste':    'bg-green-100 text-green-800',
  'repair-cafe':   'bg-blue-100 text-blue-800',
  'food-producer': 'bg-amber-100 text-amber-800',
  'eco-services':  'bg-purple-100 text-purple-800',
};

const CATEGORY_LABELS: Record<Business['category'], string> = {
  'zero-waste':    'Zero Waste',
  'repair-cafe':   'Repair Café',
  'food-producer': 'Food Producer',
  'eco-services':  'Eco Services',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-500">{rating.toFixed(1)}</span>
    </div>
  );
}


interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Hero image */}
      <div className="h-40 overflow-hidden bg-gray-100">
        <img
          src={business.imageUrl}
          alt={business.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Category badge */}
        <span
          className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[business.category]}`}
        >
          {CATEGORY_LABELS[business.category]}
        </span>

        {/* Name */}
        <h2 className="text-base font-semibold text-gray-900 leading-snug">
          {business.name}
        </h2>

        {/* Description — clamped to 2 lines */}
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
          {business.description}
        </p>

        {/* Star rating */}
        <StarRating rating={business.averageRating} />

        {/* CTA */}
        <Link
          to={`/directory/${business.id}`}
          className="mt-2 inline-block rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
