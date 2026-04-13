import { getIdToken } from './authService';

const BASE_URL = import.meta.env.VITE_API_URL;

export interface Business {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  featured?: boolean;
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
  const idToken = await getIdToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
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

export interface Category {
  id: string;
  name: string;
}

export async function getBusinesses(): Promise<Business[]> {
  return request<Business[]>('/businesses');
}

export async function getBusiness(id: string): Promise<Business> {
  return request<Business>(`/businesses/${id}`);
}

export async function getCategories(): Promise<Category[]> {
  return request<Category[]>('/categories');
}

export async function putCategory(
  name: string,
  id?: string,
): Promise<{ message: string; id: string }> {
  const resolvedId = id ?? crypto.randomUUID();
  return request<{ message: string; id: string }>('/categories', {
    method: 'PUT',
    body: JSON.stringify({ id: resolvedId, name }),
  });
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/categories/${id}`, { method: 'DELETE' });
}

export async function getReviews(businessId: string): Promise<Review[]> {
  return request<Review[]>(`/businesses/${businessId}/reviews`);
}

export async function postReview(payload: {
  businessId: string;
  rating: number;
  comment: string;
}): Promise<{ message: string; id: string }> {
  return request(`/reviews`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteReview(id: string, businessId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/reviews/${id}?businessId=${businessId}`, { method: 'DELETE' });
}

export type BusinessPayload = Omit<Business, 'id' | 'rating' | 'reviewCount' | 'featured' | 'createdAt'>;

export async function createBusiness(payload: BusinessPayload): Promise<Business> {
  return request<Business>('/businesses', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateBusiness(id: string, payload: BusinessPayload): Promise<Business> {
  return request<Business>(`/businesses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}