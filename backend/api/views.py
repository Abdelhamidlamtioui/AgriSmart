"""
AgroSmart API - Views
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum, Count, Avg, F, Q
from django.db.models.functions import TruncMonth, ExtractMonth
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import timedelta
from .models import Region, Category, Product, Client, Order, OrderItem
from .serializers import (
    RegionSerializer, CategorySerializer, ProductSerializer, ProductListSerializer,
    ClientSerializer, OrderSerializer, OrderCreateSerializer, OrderListSerializer,
    UserSerializer
)
from .ai_service import get_ai_suggestions, get_chat_response


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    permission_classes = [AllowAny]
    filterset_fields = ['category', 'season_recommendation', 'is_active']
    search_fields = ['name', 'composition', 'description']
    ordering_fields = ['name', 'unit_price', 'stock_quantity', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.select_related('region').all()
    serializer_class = ClientSerializer
    permission_classes = [AllowAny]
    search_fields = ['full_name', 'company', 'phone', 'email']
    filterset_fields = ['region']


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related('client', 'client__region', 'created_by').prefetch_related('items', 'items__product').order_by('-created_at')
    permission_classes = [AllowAny]
    filterset_fields = ['status', 'client']
    search_fields = ['reference', 'client__full_name']
    ordering_fields = ['created_at', 'total_amount', 'status']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user)


@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_kpis(request):
    """KPIs principaux du dashboard."""
    now = timezone.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    prev_month_start = (month_start - timedelta(days=1)).replace(day=1)

    # Current month stats
    current_orders = Order.objects.filter(created_at__gte=month_start).exclude(status='annulee')
    prev_orders = Order.objects.filter(created_at__gte=prev_month_start, created_at__lt=month_start).exclude(status='annulee')

    current_revenue = current_orders.aggregate(total=Sum('total_amount'))['total'] or 0
    prev_revenue = prev_orders.aggregate(total=Sum('total_amount'))['total'] or 0
    revenue_change = ((float(current_revenue) - float(prev_revenue)) / float(prev_revenue) * 100) if prev_revenue else 0

    current_count = current_orders.count()
    prev_count = prev_orders.count()
    orders_change = ((current_count - prev_count) / prev_count * 100) if prev_count else 0

    total_products = Product.objects.filter(is_active=True).count()
    low_stock = Product.objects.filter(is_active=True, stock_quantity__lte=F('min_stock_alert')).count()
    total_clients = Client.objects.count()

    # Recent orders
    recent_orders = OrderListSerializer(
        Order.objects.select_related('client', 'client__region').order_by('-created_at')[:5],
        many=True
    ).data

    return Response({
        'revenue': {'value': float(current_revenue), 'change': round(revenue_change, 1), 'label': 'Chiffre d\'affaires'},
        'orders': {'value': current_count, 'change': round(orders_change, 1), 'label': 'Commandes du mois'},
        'products': {'value': total_products, 'low_stock': low_stock, 'label': 'Produits actifs'},
        'clients': {'value': total_clients, 'label': 'Clients'},
        'recent_orders': recent_orders,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def sales_trends(request):
    """Tendances de ventes pour les graphiques Recharts."""
    # Monthly sales (last 12 months)
    twelve_months_ago = timezone.now() - timedelta(days=365)
    monthly = (
        Order.objects.filter(created_at__gte=twelve_months_ago)
        .exclude(status='annulee')
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(revenue=Sum('total_amount'), count=Count('id'))
        .order_by('month')
    )
    monthly_data = [{'month': m['month'].strftime('%Y-%m'), 'revenue': float(m['revenue'] or 0), 'orders': m['count']} for m in monthly]

    # Sales by category
    by_category = (
        OrderItem.objects.filter(order__created_at__gte=twelve_months_ago)
        .exclude(order__status='annulee')
        .values(name=F('product__category__name'))
        .annotate(total=Sum('subtotal'), count=Count('id'))
        .order_by('-total')
    )
    category_data = [{'name': c['name'], 'value': float(c['total'] or 0), 'count': c['count']} for c in by_category]

    # Sales by region
    by_region = (
        Order.objects.filter(created_at__gte=twelve_months_ago)
        .exclude(status='annulee')
        .values(name=F('client__region__name'))
        .annotate(total=Sum('total_amount'), count=Count('id'))
        .order_by('-total')
    )
    region_data = [{'name': r['name'] or 'Non spécifié', 'value': float(r['total'] or 0), 'count': r['count']} for r in by_region]

    # Top products
    top_products = (
        OrderItem.objects.filter(order__created_at__gte=twelve_months_ago)
        .exclude(order__status='annulee')
        .values(name=F('product__name'))
        .annotate(total=Sum('subtotal'), qty=Sum('quantity'))
        .order_by('-total')[:10]
    )
    top_data = [{'name': p['name'], 'revenue': float(p['total'] or 0), 'quantity': p['qty']} for p in top_products]

    return Response({
        'monthly': monthly_data,
        'by_category': category_data,
        'by_region': region_data,
        'top_products': top_data,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def ai_suggest(request):
    """Suggestions IA de produits complementaires."""
    products = request.data.get('products', [])
    region = request.data.get('region', None)
    season = request.data.get('season', None)
    result = get_ai_suggestions(products, region, season)
    return Response(result)


@api_view(['POST'])
@permission_classes([AllowAny])
def ai_chat(request):
    """Chat IA conversationnel."""
    message = request.data.get('message', '')
    context = request.data.get('context', None)
    if not message:
        return Response({'error': 'Message requis'}, status=400)
    result = get_chat_response(message, context)
    return Response(result)


@api_view(['GET'])
@permission_classes([AllowAny])
def current_user(request):
    """Retourne l'utilisateur connecte."""
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    return Response({'id': None, 'username': 'demo', 'first_name': 'Commercial', 'last_name': 'Demo'})


class UserManagementViewSet(viewsets.ModelViewSet):
    """CRUD des utilisateurs - Admin seulement."""
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        # Only staff/superusers can manage users
        if not (request.user.is_staff or request.user.is_superuser):
            self.permission_denied(request, message='Accès réservé aux administrateurs.')
    pagination_class = None

    def create(self, request, *args, **kwargs):
        data = request.data
        if User.objects.filter(username=data.get('username')).exists():
            return Response({'error': 'Cet utilisateur existe deja'}, status=400)
        user = User.objects.create_user(
            username=data['username'],
            password=data.get('password', 'agrosmart2024'),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            email=data.get('email', ''),
            is_staff=data.get('is_staff', False),
        )
        return Response(UserSerializer(user).data, status=201)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.is_superuser:
            return Response({'error': 'Impossible de supprimer un superadmin'}, status=400)
        user.delete()
        return Response(status=204)
