import BusinessCard from "../components/BusinessCard";
import { Container } from "../components/ui/Layout";
import type { Business } from "../services/api";


function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-24 rounded-full bg-gray-200" />
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="mt-2 h-9 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

export default function BusinessDirectory() {

  const loading = false;

  const businesses: Business[] = [];


  return (
    <Container className="py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Business Directory</h1>
        <p className="mt-1 text-gray-500">
          Discover eco-friendly businesses across Coventry and Warwickshire.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <input
          type="search"
          placeholder="Search businesses..."
          value=""
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          aria-label="Search businesses"
        />

        <select
          value="all"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          <option value="zero-waste">Zero Waste</option>
          <option value="repair-cafe">Repair Café</option>
          <option value="food-producer">Food Producer</option>
          <option value="eco-services">Eco Services</option>
        </select>

        <select
          value="name-asc"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
          aria-label="Sort businesses"
        >
          <option value="name-asc">A → Z</option>
          <option value="name-desc">Z → A</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
          : businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
      </div>

    </Container>
  );
}
