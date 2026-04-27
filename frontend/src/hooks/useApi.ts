import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../lib/axios';
import type { KPIs, SalesTrends, Product, Order, Client, Region, Category } from '../types';

export const useKPIs = () => useQuery<KPIs>({
  queryKey: ['kpis'], queryFn: async () => (await api.get('/dashboard/kpis/')).data,
});

export const useSalesTrends = () => useQuery<SalesTrends>({
  queryKey: ['sales-trends'], queryFn: async () => (await api.get('/dashboard/sales-trends/')).data,
});

export const useProducts = () => useQuery<{ results: Product[] }>({
  queryKey: ['products'], queryFn: async () => (await api.get('/products/?page_size=100')).data,
});

export const useOrders = () => useQuery<{ results: Order[] }>({
  queryKey: ['orders'], queryFn: async () => (await api.get('/orders/?page_size=100&ordering=-created_at')).data,
});

export const useOrder = (id: number) => useQuery<Order>({
  queryKey: ['order', id], queryFn: async () => (await api.get(`/orders/${id}/`)).data, enabled: !!id,
});

export const useClients = () => useQuery<{ results: Client[] }>({
  queryKey: ['clients'], queryFn: async () => (await api.get('/clients/?page_size=100')).data,
});

export const useRegions = () => useQuery<Region[]>({
  queryKey: ['regions'], queryFn: async () => (await api.get('/regions/')).data,
});

export const useCategories = () => useQuery<Category[]>({
  queryKey: ['categories'], queryFn: async () => (await api.get('/categories/')).data,
});

export const useCreateOrder = () => useMutation({
  mutationFn: async (data: { client: number; notes: string; delivery_date: string; items: { product: number; quantity: number; unit_price: number }[] }) =>
    (await api.post('/orders/', data)).data,
});

export const useAISuggest = () => useMutation({
  mutationFn: async (data: { products: string[]; region?: string; season?: string }) =>
    (await api.post('/ai/suggest/', data)).data,
});

export const useAIChat = () => useMutation({
  mutationFn: async (data: { message: string; context?: object }) =>
    (await api.post('/ai/chat/', data)).data,
});

// User Management
export const useUsers = () => useQuery<any[]>({
  queryKey: ['users'], queryFn: async () => (await api.get('/users/')).data,
});

export const useCreateUser = () => useMutation({
  mutationFn: async (data: { username: string; password: string; first_name: string; last_name: string; email: string; is_staff: boolean }) =>
    (await api.post('/users/', data)).data,
});

export const useDeleteUser = () => useMutation({
  mutationFn: async (id: number) => (await api.delete(`/users/${id}/`)).data,
});
