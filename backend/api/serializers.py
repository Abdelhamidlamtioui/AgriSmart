"""
AgroSmart API - Serializers
Sérialiseurs DRF pour les modèles AgroSmart.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Region, Category, Product, Client, Order, OrderItem


class RegionSerializer(serializers.ModelSerializer):
    client_count = serializers.SerializerMethodField()

    class Meta:
        model = Region
        fields = ['id', 'name', 'code', 'client_count']

    def get_client_count(self, obj):
        return obj.clients.count()


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'category_name', 'description',
            'composition', 'unit_price', 'unit', 'stock_quantity',
            'min_stock_alert', 'season_recommendation', 'is_active',
            'is_low_stock', 'created_at'
        ]


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer léger pour les listes."""
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'category_name', 'composition', 'unit_price', 'unit', 'stock_quantity', 'season_recommendation']


class ClientSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True)
    order_count = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = [
            'id', 'full_name', 'company', 'phone', 'email',
            'region', 'region_name', 'address', 'order_count', 'created_at'
        ]

    def get_order_count(self, obj):
        return obj.orders.count()


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_composition = serializers.CharField(source='product.composition', read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_composition',
            'quantity', 'unit_price', 'subtotal'
        ]
        read_only_fields = ['subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source='client.full_name', read_only=True)
    client_region = serializers.CharField(source='client.region.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'reference', 'client', 'client_name', 'client_region',
            'created_by', 'created_by_name', 'status', 'status_display',
            'total_amount', 'notes', 'delivery_date', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['reference', 'total_amount', 'created_by']


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création de commandes avec items."""
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['client', 'notes', 'delivery_date', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        order.update_total()
        return order


class OrderListSerializer(serializers.ModelSerializer):
    """Serializer léger pour les listes de commandes."""
    client_name = serializers.CharField(source='client.full_name', read_only=True)
    client_region = serializers.CharField(source='client.region.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'reference', 'client_name', 'client_region',
            'status', 'status_display', 'total_amount',
            'item_count', 'created_at'
        ]

    def get_item_count(self, obj):
        return obj.items.count()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_superuser']
