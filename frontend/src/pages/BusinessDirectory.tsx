import { useCallback, useMemo, useState } from "react";
import { useFetch } from "../hooks/useFetch.ts";
import { getBusinesses, type Business } from "../services/api";
import BusinessCard from "../components/BusinessCard";
import { Container } from "../components/ui/Layout";

type Category = Business["category"] | "all";
type SortKey = "name-asc" | "name-desc" | "rating-desc" | "newest";

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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState<SortKey>("name-asc");

  const fetcher = useCallback(() => getBusinesses(), []);
  const { data: businesses, loading, error } = useFetch<Business[]>(fetcher);

  const filteredAndSorted = useMemo<Business[]>(() => {
    if (!businesses) return [];

    const needle = query.toLowerCase().trim();

    const searched = needle
      ? businesses.filter(
          (b) =>
            b.name.toLowerCase().includes(needle) ||
            b.description.toLowerCase().includes(needle),
        )
      : businesses;

    const filtered =
      category === "all"
        ? searched
        : searched.filter((b) => b.category === category);

    return filtered.slice().sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rating-desc":
          return b.averageRating - a.averageRating;
        case "newest":
          return b.createdAt.localeCompare(a.createdAt);
        default:
          return 0;
      }
    });
  }, [businesses, query, category, sort]);

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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          aria-label="Search businesses"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
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
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
          aria-label="Sort businesses"
        >
          <option value="name-asc">A → Z</option>
          <option value="name-desc">Z → A</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {!loading && !error && (
        <p className="mb-4 text-sm text-gray-500">
          {filteredAndSorted.length === 0
            ? "No businesses match your search."
            : `Showing ${filteredAndSorted.length} business${filteredAndSorted.length === 1 ? "" : "es"}`}
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <strong>Failed to load businesses.</strong> {error}
          <br />
          Please try refreshing the page or check back later.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
          : filteredAndSorted.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
      </div>

      {!loading && !error && filteredAndSorted.length === 0 && (
        <div className="mt-12 text-center text-gray-400">
          <p className="text-4xl">🌱</p>
          <p className="mt-2 text-sm">
            No results found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </Container>
  );
}
