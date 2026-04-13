import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.ts";
import { getBusinesses, getCategories, type Business, type Category } from "../services/api";
import BusinessCard from "../components/BusinessCard";
import { Container } from "../components/ui/Layout";
import { useAuth } from "../hooks/useAuth";

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
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputQ, setInputQ]       = useState(() => searchParams.get("q") ?? "");
  const [city, setCity]           = useState(() => searchParams.get("city") ?? "");
  const [categoryId, setCategoryId] = useState(() => searchParams.get("category") ?? "all");
  const [sort, setSort]           = useState<SortKey>("name-asc");

  const [debouncedQ, setDebouncedQ]       = useState(inputQ);
  const [debouncedCity, setDebouncedCity] = useState(city);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(inputQ), 400);
    return () => clearTimeout(t);
  }, [inputQ]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedCity(city), 400);
    return () => clearTimeout(t);
  }, [city]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        debouncedQ ? next.set("q", debouncedQ) : next.delete("q");
        categoryId !== "all" ? next.set("category", categoryId) : next.delete("category");
        debouncedCity ? next.set("city", debouncedCity) : next.delete("city");
        return next;
      },
      { replace: true },
    );
  }, [debouncedQ, categoryId, debouncedCity, setSearchParams]);

  const { data: businesses, loading, error } = useFetch<Business[]>(getBusinesses);
  const { data: categories } = useFetch<Category[]>(getCategories);

  const filtered = useMemo<Business[]>(() => {
    if (!businesses) return [];

    const q    = debouncedQ.trim().toLowerCase();
    const city = debouncedCity.trim().toLowerCase();

    return businesses.filter((b) => {
      if (q && !b.name.toLowerCase().includes(q) && !b.description.toLowerCase().includes(q))
        return false;
      if (city && !b.city.toLowerCase().includes(city))
        return false;
      if (categoryId !== "all" && b.categoryId !== categoryId)
        return false;
      return true;
    });
  }, [businesses, debouncedQ, debouncedCity, categoryId]);

  const sorted = useMemo<Business[]>(() => {
    return filtered.slice().sort((a, b) => {
      switch (sort) {
        case "name-asc":    return a.name.localeCompare(b.name);
        case "name-desc":   return b.name.localeCompare(a.name);
        case "rating-desc": return (b.rating ?? 0) - (a.rating ?? 0);
        case "newest":      return b.createdAt.localeCompare(a.createdAt);
        default:            return 0;
      }
    });
  }, [filtered, sort]);

  return (
    <div className="min-h-screen bg-emerald-900">
    <Container className="py-8 max-w-6xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Business Directory</h1>
          <p className="mt-1 text-emerald-200">
            Discover eco-friendly businesses across Coventry and Warwickshire.
          </p>
        </div>
        {user && (
          <Link
            to="/add-business"
            className="shrink-0 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 transition-colors"
          >
            + Add Business
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search businesses..."
          value={inputQ}
          onChange={(e) => setInputQ(e.target.value)}
          className="flex-1 min-w-48 rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 placeholder:text-gray-300 text-gray-100"
          aria-label="Search businesses"
        />

        {/* City */}
        <input
          type="text"
          placeholder="Filter by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="placeholder:text-gray-300 text-gray-100 flex-1 min-w-36 rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          aria-label="Filter by city"
        />

        {/* Category — populated from /categories API */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {(categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          aria-label="Sort businesses"
        >
          <option value="name-asc">A → Z</option>
          <option value="name-desc">Z → A</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Result count */}
      {!loading && !error && (
        <p className="mb-4 text-sm text-emerald-200">
          {sorted.length === 0
            ? "No businesses match your search."
            : `Showing ${sorted.length} business${sorted.length === 1 ? "" : "es"}`}
        </p>
      )}

      {/* Error state */}
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

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
          : sorted.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
      </div>

      {/* Empty state */}
      {!loading && !error && sorted.length === 0 && (
        <div className="mt-12 text-center text-emerald-200">
          <p className="text-4xl">🌱</p>
          <p className="mt-2 text-sm">
            No results found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </Container>
    </div>
  );
}
