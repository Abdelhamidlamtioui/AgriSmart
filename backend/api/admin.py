"""AgroSmart API - Admin Configuration"""
from django.contrib import admin
from .models import Region, Category, Product, Client, Order, OrderItem


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['name', 'code']
    search_fields = ['name']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon']
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'unit_price', 'stock_quantity', 'season_recommendation', 'is_active']
    list_filter = ['category', 'season_recommendation', 'is_active']
    search_fields = ['name', 'composition']


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'company', 'phone', 'region', 'created_at']
    list_filter = ['region']
    search_fields = ['full_name', 'company', 'phone']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['reference', 'client', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['reference', 'client__full_name']
    inlines = [OrderItemInline]
    readonly_fields = ['reference', 'total_amount']
