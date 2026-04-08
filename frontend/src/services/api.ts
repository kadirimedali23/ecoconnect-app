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