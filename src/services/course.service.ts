import { API_ENDPOINTS } from '@/src/constants/api.constants';
import { ApiListResponse, RawProduct, RawUser } from '@/src/types';
import api from './api';

export interface FetchCoursesParams {
  page?: number;
  limit?: number;
}

export const fetchProductsService = async (
  params: FetchCoursesParams = {},
): Promise<ApiListResponse<RawProduct>> => {
  const response = await api.get<ApiListResponse<RawProduct>>(
    API_ENDPOINTS.RANDOM_PRODUCTS,
    { params: { page: params.page ?? 1, limit: params.limit ?? 10 } },
  );
  return response.data;
};

export const fetchInstructorsService = async (
  params: FetchCoursesParams = {},
): Promise<ApiListResponse<RawUser>> => {
  const response = await api.get<ApiListResponse<RawUser>>(
    API_ENDPOINTS.RANDOM_USERS,
    { params: { page: params.page ?? 1, limit: params.limit ?? 10 } },
  );
  return response.data;
};