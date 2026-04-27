export interface Region {
  id: number; name: string; code: string; client_count: number;
}
export interface Category {
  id: number; name: string; description: string; icon: string; product_count: number;
}
export interface Product {
  id: number; name: string; category: number; category_name: string;
  description: string; composition: string; unit_price: number;
  unit: string; stock_quantity: number; min_stock_alert: number;
  season_recommendation: string; is_active: boolean; is_low_stock: boolean; created_at: string;
}
export interface Client {
  id: number; full_name: string; company: string; phone: string;
  email: string; region: number; region_name: string; address: string;
  order_count: number; created_at: string;
}
export interface OrderItem {
  id?: number; product: number; product_name?: string; product_composition?: string;
  quantity: number; unit_price: number; subtotal: number;
}
export interface Order {
  id: number; reference: string; client: number; client_name: string;
  client_region: string; created_by: number; created_by_name: string;
  status: string; status_display: string; total_amount: number;
  notes: string; delivery_date: string; items: OrderItem[];
  item_count?: number; created_at: string; updated_at: string;
}
export interface KPIs {
  revenue: { value: number; change: number; label: string };
  orders: { value: number; change: number; label: string };
  products: { value: number; low_stock: number; label: string };
  clients: { value: number; label: string };
  recent_orders: Order[];
}
export interface SalesTrends {
  monthly: { month: string; revenue: number; orders: number }[];
  by_category: { name: string; value: number; count: number }[];
  by_region: { name: string; value: number; count: number }[];
  top_products: { name: string; revenue: number; quantity: number }[];
}
export interface ChatMessage {
  id: string; role: 'user' | 'assistant'; content: string; timestamp: Date;
}
