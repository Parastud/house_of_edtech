// ─── Raw API shapes ───────────────────────────────────────────────────────────

// /api/v1/public/randomproducts  → treated as courses
export interface RawProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// /api/v1/public/randomusers → treated as instructors
export interface RawUser {
  id: number;
  login: {
    uuid: string;
    username: string;
  };
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  location: {
    city: string;
    country: string;
  };
  nat: string;
}

export interface ApiListResponse<T> {
  statusCode: number;
  data: {
    data: T[];
    page: number;
    limit: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    serialNumberStartFrom: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    totalItems: number;
  };
  message: string;
  success: boolean;
}

// ─── App domain models (merged/normalized) ────────────────────────────────────

export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  location: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  category: string;
  brand: string;        // used as "publisher / platform"
  thumbnailUrl: string;
  images: string[];
  instructor: Instructor;
  // Derived / local state
  isBookmarked: boolean;
  isEnrolled: boolean;
}

export interface CourseFilters {
  search: string;
  category: string | null;
}

export interface CoursesState {
  items: Course[];
  page: number;
  hasNextPage: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  error: string | null;
  filters: CourseFilters;
  lastFetchedAt: number | null;
}