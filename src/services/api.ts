const BASE_URL = import.meta.env.API_URL;

export interface Business {
  id: string;
  name: string;
  category: 'zero-waste' | 'repair-cafe' | 'food-producer' | 'eco-services';
  description: string;
  address: string;
  city: string;
  website: string;
  imageUrl: string;
  averageRating: number;
  createdAt: string;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (typeof body === 'string') message = body;
      else if (body?.message) message = body.message;
    } catch {
      // Body wasn't JSON — use statusText as-is.
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export async function getBusinesses(filters?: {
  category?: Business['category'];
  city?: string;
  q?: string;
}): Promise<Business[]> {
  const params = new URLSearchParams();

  if (filters?.category) params.set('category', filters.category);
  if (filters?.city)     params.set('city', filters.city);
  if (filters?.q)        params.set('q', filters.q);

  const query = params.toString();
  return request<Business[]>(`/businesses${query ? `?${query}` : ''}`);
}